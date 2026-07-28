import type { ReactNode } from "react";
import { EditableText } from "@/components/editable";

export function PageHeader({ id, eyebrow, title, description, children }: { id?: string; eyebrow?: string; title: string; description?: string; children?: ReactNode }) {
  const base = id ?? "page";
  return (
    <section className="relative isolate overflow-hidden border-b border-border">
      <div className="absolute inset-0 -z-10 bg-hero-gradient opacity-95" />
      <div className="absolute inset-0 -z-10 opacity-25 [background:radial-gradient(700px_300px_at_10%_0%,white,transparent),radial-gradient(600px_300px_at_100%_100%,white,transparent)]" />
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8 md:py-12 text-primary-foreground">
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
    </section>
  );
}