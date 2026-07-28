import { useEffect, useRef, type ReactNode } from "react";
import { EditableText } from "@/components/editable";
import { portal, usePortalStore } from "@/lib/portal-store";

const SIZE_KEY = "portal.headerSize";
const SIZES: Record<string, { pad: string; title: string; desc: string }> = {
  s: { pad: "px-6 lg:px-10 py-4 md:py-5", title: "text-xl md:text-2xl", desc: "text-xs md:text-sm" },
  m: { pad: "px-6 lg:px-10 py-6 md:py-8", title: "text-2xl md:text-3xl", desc: "text-sm md:text-base" },
  g: { pad: "px-6 lg:px-10 py-8 md:py-12", title: "text-2xl md:text-4xl", desc: "text-sm md:text-base" },
  gg: { pad: "px-6 lg:px-10 py-12 md:py-16", title: "text-3xl md:text-5xl", desc: "text-base md:text-lg" },
};

export function PageHeader({ id, eyebrow, title, description, children }: { id?: string; eyebrow?: string; title: string; description?: string; children?: ReactNode }) {
  const base = id ?? "page";
  const ref = useRef<HTMLElement | null>(null);
  const s = usePortalStore();
  const sizeKey = (s.texts[SIZE_KEY] as keyof typeof SIZES) || "g";
  const size = SIZES[sizeKey] ?? SIZES.g;

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
  }, [sizeKey]);

  return (
    <section ref={ref} className="page-header mx-auto max-w-7xl px-4 lg:px-8 pt-4">
      <div className="relative isolate overflow-hidden rounded-2xl border border-border shadow-elegant">
        <div className="absolute inset-0 -z-10 bg-hero-gradient opacity-95" />
        <div className="absolute inset-0 -z-10 opacity-25 [background:radial-gradient(700px_300px_at_10%_0%,white,transparent),radial-gradient(600px_300px_at_100%_100%,white,transparent)]" />
        {s.editMode && (
          <div className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-full border border-white/25 bg-black/20 px-1.5 py-1 backdrop-blur">
            <span className="px-1 text-[10px] uppercase tracking-widest text-white/70">Faixa</span>
            {(["s", "m", "g", "gg"] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => portal.setText(SIZE_KEY, k)}
                className={`h-6 w-6 rounded-full text-[10px] font-semibold transition ${
                  sizeKey === k ? "bg-white text-primary" : "text-white/80 hover:bg-white/15"
                }`}
                title={`Tamanho ${k.toUpperCase()}`}
              >
                {k.toUpperCase()}
              </button>
            ))}
          </div>
        )}
        <div className={`${size.pad} text-primary-foreground`}>
          {eyebrow && (
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs backdrop-blur">
              <EditableText id={`${base}.eyebrow`}>{eyebrow}</EditableText>
            </div>
          )}
          <EditableText id={`${base}.title`} as="h1" className={`mt-3 block max-w-3xl font-[family-name:var(--font-display)] ${size.title} font-bold tracking-tight leading-tight`}>
            {title}
          </EditableText>
          {description && (
            <EditableText id={`${base}.description`} as="p" multiline className={`mt-2 block max-w-2xl text-white/85 ${size.desc}`}>
              {description}
            </EditableText>
          )}
          {children && <div className="mt-4">{children}</div>}
        </div>
      </div>
    </section>
  );
}
