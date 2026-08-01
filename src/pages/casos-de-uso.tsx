import { PageHeader } from "@/components/page-header";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { EditableText, Hideable } from "@/components/editable";
const segments = ["Todos", "Indústria", "Serviços", "Varejo", "Saúde", "Educação", "Agro"] as const;

const cases = [
  { segment: "Indústria", title: "Revitalização de ERP Protheus em multinacional", impact: "-35% retrabalho · +22% OEE", area: "ERP · Ativos" },
  { segment: "Serviços", title: "BPO de Folha com Smart Check", impact: "100% conformidade eSocial", area: "RH · Compliance" },
  { segment: "Varejo", title: "SFA para força de vendas em 12 estados", impact: "+28% conversão", area: "Comercial · SFA" },
  { segment: "Saúde", title: "Cloud gerenciado e DR para hospital", impact: "Uptime 99,95%", area: "Cloud · Governança" },
  { segment: "Educação", title: "Portal do aluno e financeiro educacional", impact: "-25% inadimplência", area: "Educação" },
  { segment: "Agro", title: "Automação financeira multi-banco", impact: "-60% horas operacionais", area: "Financeiro" },
  { segment: "Indústria", title: "Reforma Tributária — assessment e roadmap", impact: "Risco fiscal -60%", area: "Fiscal" },
  { segment: "Serviços", title: "Agente executivo com IA para C-level", impact: "-80% tempo de análise", area: "IA · BI" },
  { segment: "Varejo", title: "T&E corporativo com política embutida", impact: "-18% custo T&E", area: "Viagens" },
];

export function Casos() {
  const [f, setF] = useState<(typeof segments)[number]>("Todos");
  const filtered = f === "Todos" ? cases : cases.filter((c) => c.segment === f);

  return (
    <>
      <PageHeader id="casos" eyebrow="Casos de Uso" title="Como a Nexsuria aparece na prática." description="Cenários por segmento — mesmo quando o cliente não pode ser nomeado, os desafios, soluções e resultados são reais." />
      <section className="casos-page mx-auto max-w-7xl px-4 lg:px-8 py-10">
        <div className="flex flex-wrap gap-2">
          {segments.map((s) => (
            <button
              key={s}
              onClick={() => setF(s)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm border transition-colors",
                f === s ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground hover:bg-secondary",
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => {
            const i = cases.indexOf(c);
            return (
              <Hideable key={c.title} id={`casos.${i}`} label={`Caso: ${c.title}`}>
                <div className="rounded-2xl border border-border bg-card p-6 hover:shadow-elegant transition-shadow">
                  <EditableText id={`casos.${i}.meta`} as="div" className="text-[10px] uppercase tracking-widest text-muted-foreground">{`${c.segment} · ${c.area}`}</EditableText>
                  <EditableText id={`casos.${i}.title`} as="h3" className="mt-2 block font-semibold leading-tight">{c.title}</EditableText>
                  <EditableText id={`casos.${i}.impact`} as="div" className="mt-4 text-sm text-primary font-medium">{c.impact}</EditableText>
                </div>
              </Hideable>
            );
          })}
        </div>
      </section>
    </>
  );
}
