import { createFileRoute, redirect } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, Eye, EyeOff, RotateCcw, Search } from "lucide-react";
import { useMemo, useState } from "react";
import {
  DEFAULT_NAV,
  getResolvedNav,
  portal,
  useRegisteredTexts,
  usePortalStore,
} from "@/lib/portal-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { resetPortalData } from "@/lib/portal-db.functions";

const PALETTE: { name: string; hex: string }[] = [
  { name: "Azul Nexsuria", hex: "#2279D1" },
  { name: "Azul Profundo", hex: "#0A1F44" },
  { name: "Azul Tecnológico", hex: "#0057FF" },
  { name: "Verde Profundo", hex: "#227981" },
  { name: "Azul Neon", hex: "#3A7BFF" },
  { name: "Ametista", hex: "#9A4EAE" },
  { name: "Violeta Real", hex: "#7A0277" },
  { name: "Roxo Profundo", hex: "#5B3FD1" },
  { name: "Roxo Noturno", hex: "#400080" },
  { name: "Verde Oliva", hex: "#636812" },
  { name: "Verde Sálvia", hex: "#7ABC82" },
  { name: "Verde Musgo", hex: "#686064" },
  { name: "Mandarin", hex: "#FF6030" },
  { name: "Coral", hex: "#F99C92" },
  { name: "Rosa Vivo", hex: "#FF6780" },
  { name: "Cinza Grafite", hex: "#333333" },
  { name: "Quase Preto", hex: "#1A1A1A" },
  { name: "Branco Gelo", hex: "#FFFFF0" },
];

export const Route = createFileRoute("/admin")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/auth", search: { redirect: "/admin" } });
    }
    return { user: data.user };
  },
  head: () => ({
    meta: [
      { title: "Configurar Portal — Nexsuria" },
      { name: "description", content: "Painel de configuração do Portal Executivo: edite textos, oculte botões e reordene as seções." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const store = usePortalStore();
  const registered = useRegisteredTexts();
  const nav = useMemo(() => getResolvedNav(store), [store]);
  const [q, setQ] = useState("");

  const textEntries = useMemo(() => {
    const all = new Map<string, { def: string; value: string }>();
    registered.forEach((def, key) => {
      if (key.startsWith("__hidden__")) return;
      all.set(key, { def, value: store.texts[key] ?? def });
    });
    // include overrides not yet registered (from other pages not visited)
    Object.entries(store.texts).forEach(([key, value]) => {
      if (key.startsWith("__hidden__")) return;
      if (!all.has(key)) all.set(key, { def: value, value });
    });
    const arr = Array.from(all.entries()).map(([key, v]) => ({ key, ...v }));
    arr.sort((a, b) => a.key.localeCompare(b.key));
    if (!q.trim()) return arr;
    const s = q.toLowerCase();
    return arr.filter((e) => e.key.toLowerCase().includes(s) || e.value.toLowerCase().includes(s));
  }, [registered, store.texts, q]);

  const SECTION_LABELS: Record<string, string> = {
    home: "Home",
    "quem-somos": "Quem Somos",
    metodologia: "Metodologia",
    equipe: "Equipe",
    solucoes: "Soluções",
    solucao: "Soluções — Detalhe",
    ecossistema: "Ecossistema",
    ia: "Inteligência Artificial",
    diferenciais: "Diferenciais",
    "casos-de-uso": "Casos de Uso",
    casos: "Casos de Uso",
    percepcoes: "Percepções do Cliente",
    contato: "Contato",
    page: "Cabeçalhos de página",
  };
  const groupedTextEntries = useMemo(() => {
    const groups = new Map<string, typeof textEntries>();
    textEntries.forEach((e) => {
      const prefix = e.key.split(".")[0] || "outros";
      const label = SECTION_LABELS[prefix] ?? prefix;
      if (!groups.has(label)) groups.set(label, [] as any);
      groups.get(label)!.push(e);
    });
    return Array.from(groups.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [textEntries]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 space-y-10">
      <header className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Portal</div>
          <h1 className="mt-1 text-3xl font-semibold font-[family-name:var(--font-display)]">
            Configurar apresentação
          </h1>
          <p className="mt-2 text-muted-foreground max-w-2xl text-sm">
            Controle o que aparece no menu, reordene seções e edite textos. Tudo é salvo neste
            navegador — sem precisar mexer no código.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={store.editMode ? "default" : "outline"}
            onClick={() => portal.toggleEdit()}
          >
            {store.editMode ? "Sair da edição" : "Ativar edição inline"}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (confirm("Restaurar tudo aos padrões? Isso apaga todas as edições salvas na nuvem.")) {
                portal.resetAll();
                resetPortalData().catch(() => {});
              }
            }}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Restaurar padrões
          </Button>
        </div>
      </header>

      {/* Menu */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold">Menu lateral</h2>
            <p className="text-sm text-muted-foreground">
              Renomeie, oculte ou reordene os botões da navegação principal.
            </p>
          </div>
        </div>
        <ul className="divide-y divide-border">
          {nav.map((item, idx) => {
            const isDefaultLabel = item.label === DEFAULT_NAV.find((n) => n.to === item.to)?.label;
            return (
              <li key={item.to} className="py-3 flex items-center gap-3">
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => portal.moveNav(item.to, -1)}
                    disabled={idx === 0}
                    className="p-1 rounded hover:bg-secondary disabled:opacity-30"
                    aria-label="Mover para cima"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => portal.moveNav(item.to, 1)}
                    disabled={idx === nav.length - 1}
                    className="p-1 rounded hover:bg-secondary disabled:opacity-30"
                    aria-label="Mover para baixo"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="flex-1 min-w-0 grid gap-1">
                  <div className="flex items-center gap-2">
                    <code className="text-[10px] text-muted-foreground">{item.to}</code>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">
                      {item.group}
                    </span>
                    {item.hidden && (
                      <span className="text-[10px] text-destructive uppercase tracking-wider">Oculto</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      value={item.label}
                      onChange={(e) => portal.setLabel(item.to, e.target.value)}
                      className="h-8 text-sm"
                    />
                    {!isDefaultLabel && (
                      <button
                        onClick={() =>
                          portal.setLabel(item.to, DEFAULT_NAV.find((n) => n.to === item.to)!.label)
                        }
                        className="text-xs text-muted-foreground hover:text-foreground"
                        title="Restaurar nome"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => portal.toggleHidden(item.to)}
                  className={cn(
                    "shrink-0 inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs",
                    item.hidden
                      ? "border-border text-muted-foreground hover:bg-secondary"
                      : "border-destructive/40 text-destructive hover:bg-destructive/10",
                  )}
                >
                  {item.hidden ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  {item.hidden ? "Mostrar" : "Ocultar"}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Texts */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div>
            <h2 className="font-semibold">Textos das seções</h2>
            <p className="text-sm text-muted-foreground">
              Edite qualquer texto do portal. As alterações aparecem imediatamente.
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Buscar texto…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="h-9 pl-7 w-64"
            />
          </div>
        </div>
        {textEntries.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6">
            Nenhum texto registrado ainda. Navegue pelas páginas para carregar seus textos aqui.
          </p>
        ) : (
          <div className="space-y-6">
            {groupedTextEntries.map(([section, entries]) => (
              <details key={section} open className="rounded-lg border border-border bg-background/40">
                <summary className="cursor-pointer select-none px-4 py-2.5 text-sm font-semibold flex items-center justify-between">
                  <span>{section}</span>
                  <span className="text-[11px] font-normal text-muted-foreground">
                    {entries.length} {entries.length === 1 ? "item" : "itens"}
                  </span>
                </summary>
                <ul className="px-4 pb-4 pt-1 space-y-4">
                  {entries.map(({ key, def, value }) => {
                    const overridden = store.texts[key] !== undefined && store.texts[key] !== def;
                    const long = def.length > 80 || value.length > 80;
                    return (
                      <li key={key} className="grid gap-1">
                        <div className="flex items-center justify-between">
                          <code className="text-[10px] text-muted-foreground truncate">{key}</code>
                          {overridden && (
                            <button
                              onClick={() => portal.resetText(key)}
                              className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                            >
                              <RotateCcw className="h-3 w-3" />
                              Restaurar
                            </button>
                          )}
                        </div>
                        {long ? (
                          <Textarea
                            value={value}
                            onChange={(e) => portal.setText(key, e.target.value)}
                            className="min-h-[80px] text-sm"
                          />
                        ) : (
                          <Input
                            value={value}
                            onChange={(e) => portal.setText(key, e.target.value)}
                            className="text-sm"
                          />
                        )}
                      </li>
                    );
                  })}
                </ul>
              </details>
            ))}
          </div>
        )}
      </section>

      {/* Palette */}
      <section className="rounded-2xl border border-border bg-card p-6 space-y-6">
        <div>
          <h2 className="font-semibold">Cores da apresentação</h2>
          <p className="text-sm text-muted-foreground">
            Escolha a cor dos botões e a cor dos textos a partir da paleta oficial Nexsuria. As
            alterações são aplicadas em todo o portal e ficam salvas neste navegador.
          </p>
        </div>
        <PaletteRow label="Cor dos botões (Primária)" kind="primary" />
        <PaletteRow label="Cor dos textos" kind="foreground" />
      </section>

      {/* Hidden elements */}
      <HiddenElementsPanel />
    </div>
  );
}

function PaletteRow({
  label,
  kind,
}: {
  label: string;
  kind: "primary" | "foreground";
}) {
  const store = usePortalStore();
  const current = store.theme[kind];
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">{label}</div>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={current ?? "#2279D1"}
            onChange={(e) => portal.setThemeColor(kind, e.target.value)}
            className="h-7 w-10 rounded border border-border bg-transparent"
            aria-label={`Cor personalizada — ${label}`}
          />
          <button
            onClick={() => portal.setThemeColor(kind, null)}
            className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            Padrão
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {PALETTE.map((c) => {
          const active = current?.toLowerCase() === c.hex.toLowerCase();
          return (
            <button
              key={c.hex}
              title={`${c.name} · ${c.hex}`}
              onClick={() => portal.setThemeColor(kind, c.hex)}
              className={cn(
                "h-8 w-8 rounded-md border transition-transform hover:scale-110",
                active ? "border-foreground ring-2 ring-offset-2 ring-offset-background ring-foreground" : "border-border",
              )}
              style={{ backgroundColor: c.hex }}
            />
          );
        })}
      </div>
    </div>
  );
}

function HiddenElementsPanel() {
  const store = usePortalStore();
  const hidden = Object.keys(store.texts).filter((k) => k.startsWith("__hidden__") && store.texts[k] === "1");
  if (hidden.length === 0) return null;
  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="font-semibold mb-2">Elementos ocultos</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Botões e cards que você removeu no modo edição. Restaure quando quiser.
      </p>
      <ul className="grid gap-2">
        {hidden.map((k) => (
          <li key={k} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
            <code className="text-xs text-muted-foreground">{k.replace("__hidden__", "")}</code>
            <Button size="sm" variant="ghost" onClick={() => portal.resetText(k)}>
              Restaurar
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}