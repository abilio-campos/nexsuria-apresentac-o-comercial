import { PageHeader } from "@/components/page-header";
import { methodology } from "@/lib/nexsuria-data";
import { EditableText, Hideable } from "@/components/editable";
export function Metodologia() {
  return (
    <>
      <PageHeader
        id="metodologia"
        eyebrow="Nossa Metodologia"
        title="Do diagnóstico à evolução contínua"
        description="Um framework claro para transformar estratégia em execução — com o especialista certo em cada etapa e governança do início ao fim."
      />
      <section className="metodologia-page mx-auto max-w-7xl px-4 lg:px-8 py-16">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {methodology.map((m, i) => (
            <Hideable key={m.step} id={`metodologia.${i}`} label={`Etapa: ${m.title}`}>
              <div className="relative rounded-2xl border border-border bg-card p-6 shadow-card-soft">
                <EditableText id={`metodologia.${i}.step`} as="div" className="text-5xl font-semibold font-[family-name:var(--font-display)] text-gradient">
                  {m.step}
                </EditableText>
                <EditableText id={`metodologia.${i}.title`} as="div" className="mt-2 text-lg font-semibold">
                  {m.title}
                </EditableText>
                <EditableText id={`metodologia.${i}.description`} as="p" multiline className="mt-2 text-sm text-muted-foreground">
                  {m.description}
                </EditableText>
                {i < methodology.length - 1 && (
                  <div className="hidden lg:block absolute -right-2 top-1/2 h-px w-4 bg-border" />
                )}
              </div>
            </Hideable>
          ))}
        </div>
      </section>
    </>
  );
}
