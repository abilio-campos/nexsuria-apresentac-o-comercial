import { useEffect, useRef, type ReactNode } from "react";
import { EditableText, Resizable, setActiveTarget, useActiveTarget } from "@/components/editable";
import { portal, usePortalStore } from "@/lib/portal-store";

export function PageHeader({ id, eyebrow, title, description, children }: { id?: string; eyebrow?: string; title: string; description?: string; children?: ReactNode }) {
  const base = id ?? "page";
  const ref = useRef<HTMLElement | null>(null);
  const s = usePortalStore();
  const sizeId = `${base}.header`;
  const size = s.sizes[sizeId];
  const active = useActiveTarget() === `rz:${sizeId}`;

  const bump = (axis: "w" | "h", delta: number) => {
    const el = ref.current?.querySelector<HTMLElement>(".nx-selectable");
    const rect = el?.getBoundingClientRect();
    const current = axis === "w" ? (size?.w ?? rect?.width ?? 800) : (size?.h ?? rect?.height ?? 120);
    const next = Math.max(axis === "w" ? 280 : 72, Math.round(current + delta));
    portal.setSize(sizeId, { w: axis === "w" ? next : size?.w, h: axis === "h" ? next : size?.h });
  };


  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // No documento contínuo existem vários cabeçalhos; apenas o primeiro
    // define a altura de referência, senão o valor fica "brigando" e a
    // rolagem pisca/salta ao trocar de sessão.
    const isPrimary = document.querySelector("section.page-header") === el;
    if (!isPrimary) return;
    const update = () => {
      const h = el.getBoundingClientRect().height;
      document.documentElement.style.setProperty("--presenting-header-h", `${Math.round(h)}px`);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [size?.w, size?.h]);


  return (
    <section ref={ref} className="page-header mx-auto max-w-7xl px-4 lg:px-8 pt-3">
      <Resizable
        id={`${base}.header`}
        axis="both"
        minW={280}
        minH={72}
        className="mx-auto"
      >
        <div className="relative isolate overflow-hidden rounded-2xl border border-border shadow-card-soft h-full">
          <div className="absolute inset-0 -z-10 bg-hero-gradient opacity-95" />
          <div className="absolute inset-0 -z-10 opacity-20 [background:radial-gradient(700px_300px_at_10%_0%,white,transparent),radial-gradient(600px_300px_at_100%_100%,white,transparent)]" />
          <div className="px-6 lg:px-9 py-5 md:py-6 text-primary-foreground h-full">
            {eyebrow && (
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[11px] backdrop-blur">
                <EditableText id={`${base}.eyebrow`}>{eyebrow}</EditableText>
              </div>
            )}
            <EditableText id={`${base}.title`} as="h1" className="mt-2 block max-w-3xl font-[family-name:var(--font-display)] text-xl md:text-3xl font-bold tracking-tight leading-tight">
              {title}
            </EditableText>
            {description && (
              <EditableText id={`${base}.description`} as="p" multiline className="mt-1.5 block max-w-2xl text-white/85 text-xs md:text-sm">
                {description}
              </EditableText>
            )}
            {children && <div className="mt-3">{children}</div>}
          </div>
        </div>
      </Resizable>
    </section>
  );
}
