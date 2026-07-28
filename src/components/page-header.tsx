import { useEffect, useRef, type ReactNode } from "react";
import { EditableText, Resizable } from "@/components/editable";
import { usePortalStore } from "@/lib/portal-store";

export function PageHeader({ id, eyebrow, title, description, children }: { id?: string; eyebrow?: string; title: string; description?: string; children?: ReactNode }) {
  const base = id ?? "page";
  const ref = useRef<HTMLElement | null>(null);
  const s = usePortalStore();
  const size = s.sizes[`${base}.header`];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
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
    <section ref={ref} className="page-header mx-auto max-w-7xl px-4 lg:px-8 pt-4">
      <Resizable
        id={`${base}.header`}
        axis="both"
        minW={280}
        minH={80}
        className="mx-auto"
      >
        <div className="relative isolate overflow-hidden rounded-2xl border border-border shadow-elegant h-full">
          <div className="absolute inset-0 -z-10 bg-hero-gradient opacity-95" />
          <div className="absolute inset-0 -z-10 opacity-25 [background:radial-gradient(700px_300px_at_10%_0%,white,transparent),radial-gradient(600px_300px_at_100%_100%,white,transparent)]" />
          <div className="px-6 lg:px-10 py-8 md:py-12 text-primary-foreground h-full">
            {eyebrow && (
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs backdrop-blur">
                <EditableText id={`${base}.eyebrow`}>{eyebrow}</EditableText>
              </div>
            )}
            <EditableText id={`${base}.title`} as="h1" className="mt-3 block max-w-3xl font-[family-name:var(--font-display)] text-2xl md:text-4xl font-bold tracking-tight leading-tight">
              {title}
            </EditableText>
            {description && (
              <EditableText id={`${base}.description`} as="p" multiline className="mt-2 block max-w-2xl text-white/85 text-sm md:text-base">
                {description}
              </EditableText>
            )}
            {children && <div className="mt-4">{children}</div>}
          </div>
        </div>
      </Resizable>
    </section>
  );
}
