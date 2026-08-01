import { useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { usePortalStore, portal } from "@/lib/portal-store";
import {
  loadPortalConfig,
  savePortalConfig,
  savePortalMarks,
  saveVisitEntries,
} from "@/lib/portal-db.functions";

export function PortalSync() {
  const { user, session } = useAuth();
  const store = usePortalStore();
  const loadedRef = useRef(false);

  // Load from DB once when user logs in.
  useEffect(() => {
    if (!user || !session || loadedRef.current) return;
    loadedRef.current = true;
    loadPortalConfig()
      .then((data) => {
        // If DB has any saved data, hydrate it into the store.
        const hasDbData =
          data.nav ||
          Object.keys(data.texts || {}).length > 0 ||
          Object.keys(data.textColors || {}).length > 0 ||
          Object.keys(data.marks || {}).length > 0 ||
          (data.visitEntries || []).length > 0 ||
          data.perceptions;
        if (hasDbData) {
          portal.replaceState({
            nav: data.nav,
            texts: data.texts,
            textColors: data.textColors,
            listOrders: data.listOrders,
            listHidden: data.listHidden,
            positions: data.positions,
            sizes: data.sizes,
            elStyles: data.elStyles,
            spacers: data.spacers,
            theme: data.theme,
            perceptions: data.perceptions,
            marks: data.marks,
            visitEntries: data.visitEntries,
          });
        }
      })
      .catch((err) => console.error("[PortalSync] load failed", err));
  }, [user, session]);

  // Reset load flag when user signs out so next login loads again.
  useEffect(() => {
    if (!user) loadedRef.current = false;
  }, [user]);

  // Debounced save to DB when the user is logged in.
  useEffect(() => {
    if (!user || !session) return;
    const t = setTimeout(() => {
      const {
        editMode: _e,
        ...rest
      } = store;
      void _e;
      savePortalConfig({
        data: {
          nav: rest.nav,
          texts: rest.texts,
          textColors: rest.textColors,
          listOrders: rest.listOrders,
          listHidden: rest.listHidden,
          positions: rest.positions,
          sizes: rest.sizes,
          elStyles: rest.elStyles,
          spacers: rest.spacers,
          theme: rest.theme,
          perceptions: rest.perceptions,
        },
      })
        .then(() => savePortalMarks({ data: rest.marks }))
        .then(() => saveVisitEntries({ data: rest.visitEntries }))
        .catch((err) => console.error("[PortalSync] save failed", err));
    }, 1200);
    return () => clearTimeout(t);
  }, [user, session, store]);

  return null;
}

