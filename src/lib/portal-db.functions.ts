import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type {
  Mark,
  NavCfg,
  Perceptions,
  VisitEntry,
} from "@/lib/portal-store";

const CONFIG_KEY = "config";

function configValue(value: unknown) {
  return JSON.stringify(value);
}

export const loadPortalConfig = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data: settings } = await supabase
      .from("portal_settings")
      .select("value")
      .eq("user_id", userId)
      .eq("key", CONFIG_KEY)
      .maybeSingle();

    const { data: marks } = await supabase
      .from("portal_marks")
      .select("mark_id, label, page, category, note, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    const { data: visits } = await supabase
      .from("portal_visit_entries")
      .select("entry_id, departamento, responsavel, dores, oportunidades, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    const markMap: Record<string, Mark> = {};
    (marks || []).forEach((m) => {
      markMap[m.mark_id] = {
        label: m.label,
        page: m.page,
        category: m.category as Mark["category"],
        note: m.note || undefined,
        ts: new Date(m.created_at).getTime(),
      };
    });

    const visitEntries: VisitEntry[] = (visits || []).map((v) => ({
      id: v.entry_id,
      departamento: v.departamento || "",
      responsavel: v.responsavel || "",
      dores: v.dores || "",
      oportunidades: v.oportunidades || "",
    }));

    const config = (settings?.value || {}) as {
      nav?: NavCfg;
      texts?: Record<string, string>;
      textColors?: Record<string, string>;
      listOrders?: Record<string, string[]>;
      listHidden?: Record<string, string[]>;
      positions?: Record<string, { x: number; y: number }>;
      sizes?: Record<string, { w?: number; h?: number }>;
      theme?: { primary?: string; foreground?: string };
      perceptions?: Perceptions;
    };

    return {
      nav: config.nav,
      texts: config.texts,
      textColors: config.textColors,
      listOrders: config.listOrders,
      listHidden: config.listHidden,
      positions: config.positions,
      sizes: config.sizes,
      theme: config.theme,
      perceptions: config.perceptions,
      marks: markMap,
      visitEntries,
    };
  });

export const savePortalConfig = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: {
    nav?: NavCfg;
    texts?: Record<string, string>;
    textColors?: Record<string, string>;
    listOrders?: Record<string, string[]>;
    listHidden?: Record<string, string[]>;
    positions?: Record<string, { x: number; y: number }>;
    sizes?: Record<string, { w?: number; h?: number }>;
    theme?: { primary?: string; foreground?: string };
    perceptions?: Perceptions;
  }) => data)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const payload = {
      user_id: userId,
      key: CONFIG_KEY,
      value: data,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase
      .from("portal_settings")
      .upsert(payload, { onConflict: "user_id,key" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const savePortalMarks = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: Record<string, Mark>) => data)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const rows = Object.entries(data).map(([mark_id, m]) => ({
      user_id: userId,
      mark_id,
      label: m.label,
      page: m.page,
      category: m.category,
      note: m.note || null,
      created_at: new Date(m.ts).toISOString(),
      updated_at: new Date().toISOString(),
    }));

    if (rows.length > 0) {
      const { error } = await supabase
        .from("portal_marks")
        .upsert(rows, { onConflict: "user_id,mark_id" });
      if (error) throw new Error(error.message);
    }
    const keepIds = rows.map((r) => r.mark_id);
    let del = supabase.from("portal_marks").delete().eq("user_id", userId);
    if (keepIds.length > 0) {
      del = del.not("mark_id", "in", `(${keepIds.map((id) => `"${id}"`).join(",")})`);
    }
    await del;
    return { ok: true };
  });

export const deletePortalMark = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { mark_id: string }) => data)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("portal_marks")
      .delete()
      .eq("user_id", userId)
      .eq("mark_id", data.mark_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });


export const saveVisitEntries = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: VisitEntry[]) => data)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const rows = data.map((v) => ({
      user_id: userId,
      entry_id: v.id,
      departamento: v.departamento || null,
      responsavel: v.responsavel || null,
      dores: v.dores || null,
      oportunidades: v.oportunidades || null,
      updated_at: new Date().toISOString(),
    }));
    await supabase.from("portal_visit_entries").delete().eq("user_id", userId);
    if (rows.length > 0) {
      const { error } = await supabase.from("portal_visit_entries").insert(rows);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const deleteVisitEntry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { entry_id: string }) => data)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("portal_visit_entries")
      .delete()
      .eq("user_id", userId)
      .eq("entry_id", data.entry_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });


export const resetPortalData = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    await supabase.from("portal_settings").delete().eq("user_id", userId).eq("key", CONFIG_KEY);
    await supabase.from("portal_marks").delete().eq("user_id", userId);
    await supabase.from("portal_visit_entries").delete().eq("user_id", userId);
    return { ok: true };
  });
