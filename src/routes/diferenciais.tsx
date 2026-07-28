import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { differentials } from "@/lib/nexsuria-data";
import * as Icons from "lucide-react";
import { EditableText, Hideable, Movable } from "@/components/editable";

export const Route = createFileRoute("/diferenciais")({
  head: () => ({
    meta: [
      { title: "Diferenciais — Nexsuria" },
      { name: "description", content: "Diagnóstico consultivo, ecossistema exclusivo, governança e foco em resultado." },
      { property: "og:title", content: "Diferenciais — Nexsuria" },
      { property: "og:description", content: "O que separa evolução de mera implantação." },
    ],
  }),
  component: Diferenciais,
});

function Diferenciais() {
  return (
    <>
      <PageHeader id="diferenciais" eyebrow="Diferenciais" title="O que separa evolução de mera implantação." description="Oito alavancas que estruturam a forma como a Nexsuria conduz projetos e relacionamentos." />
      <Movable id="diferenciais.section.grid" label="Seção Diferenciais" as="section" className="mx-auto max-w-7xl px-4 lg:px-8 py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {differentials.map((d, i) => {
            const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[d.icon] ?? Icons.Sparkles;
            return (
              <Hideable key={d.title} id={`diferenciais.${i}`} label={`Diferencial: ${d.title}`}>
                <div className="rounded-2xl border border-border bg-card p-6">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent-gradient text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <EditableText id={`diferenciais.${i}.title`} as="h3" className="mt-4 block font-semibold">{d.title}</EditableText>
                  <EditableText id={`diferenciais.${i}.description`} as="p" multiline className="mt-1 text-sm text-muted-foreground">{d.description}</EditableText>
                </div>
              </Hideable>
            );
          })}
        </div>
      </Movable>
    </>
  );
}
