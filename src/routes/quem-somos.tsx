import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { values, timeline } from "@/lib/nexsuria-data";
import { MapPin } from "lucide-react";
import { EditableText, Hideable, Movable, SectionDivider } from "@/components/editable";

export const Route = createFileRoute("/quem-somos")({
  head: () => ({
    meta: [
      { title: "Quem Somos — Nexsuria" },
      { name: "description", content: "Orquestradora de soluções empresariais em Campinas/SP. Propósito, missão, visão, valores e história da Nexsuria." },
      { property: "og:title", content: "Quem Somos — Nexsuria" },
      { property: "og:description", content: "Centro de Inteligência Empresarial. Conectando pessoas e negócios." },
    ],
  }),
  component: QuemSomos,
});

function QuemSomos() {
  return (
    <>
      <PageHeader
        id="quem-somos"
        eyebrow="Quem Somos"
        title="Orquestradora de Soluções Empresariais"
        description="Nascida em Campinas/SP com a missão de conectar pessoas e negócios, a Nexsuria atua como Centro de Inteligência Empresarial — reunindo os melhores especialistas do mercado sob uma única coordenação estratégica."
      />

      <Movable id="quem-somos.section.pmv" label="Seção Propósito/Missão/Visão" as="section" className="mx-auto max-w-7xl px-4 lg:px-8 py-16 grid gap-6 md:grid-cols-3">
        {[
          { title: "Propósito", text: "Conectar pessoas e negócios para gerar evolução empresarial mensurável." },
          { title: "Missão", text: "Ser o Centro de Inteligência Empresarial que orquestra estratégia, tecnologia e IA para acelerar resultados." },
          { title: "Visão", text: "Ser reconhecida como a orquestradora de referência do Brasil, com o ecossistema mais confiável em cada especialidade." },
        ].map((c, i) => (
          <Hideable key={c.title} id={`quem-somos.pmv.${i}`} label={c.title}>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card-soft">
              <EditableText id={`quem-somos.pmv.${i}.title`} as="div" className="text-xs uppercase tracking-widest text-muted-foreground">{c.title}</EditableText>
              <EditableText id={`quem-somos.pmv.${i}.text`} as="p" multiline className="mt-2 text-foreground/90">{c.text}</EditableText>
            </div>
          </Hideable>
        ))}
      </Movable>

      <SectionDivider id="quem-somos.divider.1" />

      <Movable id="quem-somos.section.valores" label="Seção Valores" as="section" className="bg-secondary/40 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 py-16">
          <Movable id="quem-somos.valores.eyebrow.box" label="Eyebrow: Cultura" inline>
            <EditableText id="quem-somos.valores.eyebrow" as="span" className="text-xs uppercase tracking-widest text-muted-foreground">Cultura</EditableText>
          </Movable>
          <Movable id="quem-somos.valores.title.box" label="Título: Nossos valores">
            <EditableText id="quem-somos.valores.title" as="h2" className="mt-2 block text-3xl md:text-4xl font-semibold font-[family-name:var(--font-display)]">Nossos valores</EditableText>
          </Movable>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v, i) => (
              <Hideable key={v.name} id={`quem-somos.valor.${i}`} label={`Valor: ${v.name}`}>
                <div className="rounded-2xl border border-border bg-card p-6">
                  <EditableText id={`quem-somos.valor.${i}.name`} as="div" className="text-sm font-semibold">{v.name}</EditableText>
                  <EditableText id={`quem-somos.valor.${i}.description`} as="p" multiline className="mt-2 text-sm text-muted-foreground">{v.description}</EditableText>
                </div>
              </Hideable>
            ))}
          </div>
        </div>
      </Movable>

      <SectionDivider id="quem-somos.divider.2" />

      <Movable id="quem-somos.section.mapa" label="Seção Mapa/Linha do tempo" as="section" className="mx-auto max-w-7xl px-4 lg:px-8 py-16">
        <div className="grid md:grid-cols-[1fr_2fr] gap-10">
          <Hideable id="quem-somos.mapa" label="Mapa de atuação">
            <div>
              <EditableText id="quem-somos.mapa.eyebrow" as="span" className="text-xs uppercase tracking-widest text-muted-foreground">Mapa de atuação</EditableText>
              <EditableText id="quem-somos.mapa.title" as="h3" className="mt-2 block text-2xl font-semibold font-[family-name:var(--font-display)]">Base em Campinas, alcance nacional</EditableText>
              <EditableText id="quem-somos.mapa.text" as="p" multiline className="mt-3 text-muted-foreground">
                Sediada em Campinas/SP, a Nexsuria conduz projetos em todo o Brasil por meio do seu ecossistema de especialistas.
              </EditableText>
              <div className="mt-4 inline-flex items-center gap-2 text-sm text-foreground/80">
                <MapPin className="h-4 w-4" /> <EditableText id="quem-somos.mapa.local">Campinas · São Paulo · Brasil</EditableText>
              </div>
            </div>
          </Hideable>
          <div>
            <EditableText id="quem-somos.timeline.eyebrow" as="span" className="text-xs uppercase tracking-widest text-muted-foreground">Linha do tempo</EditableText>
            <ol className="mt-4 relative border-l border-border ml-3 space-y-6">
              {timeline.map((t, i) => (
                <Hideable key={t.title} id={`quem-somos.timeline.${i}`} label={`Marco: ${t.title}`}>
                  <li className="pl-6 relative">
                    <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-accent-gradient" />
                    <EditableText id={`quem-somos.timeline.${i}.year`} as="div" className="text-xs uppercase tracking-widest text-muted-foreground">{t.year}</EditableText>
                    <EditableText id={`quem-somos.timeline.${i}.title`} as="div" className="mt-1 font-semibold">{t.title}</EditableText>
                    <EditableText id={`quem-somos.timeline.${i}.description`} as="p" multiline className="text-sm text-muted-foreground">{t.description}</EditableText>
                  </li>
                </Hideable>
              ))}
            </ol>
          </div>
        </div>
      </Movable>
    </>
  );
}
