import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { BrainCircuit, BarChart3, Bot, Cpu, Database, LineChart, Workflow, Zap } from "lucide-react";
import { EditableText, Hideable } from "@/components/editable";
import { Markable } from "@/components/markable";

export const Route = createFileRoute("/ia")({
  head: () => ({
    meta: [
      { title: "Inteligência Artificial — Nexsuria" },
      { name: "description", content: "IA aplicada ao negócio: BI, analytics, agentes inteligentes, machine learning e automação. Uma competência liderada diretamente pela Nexsuria." },
      { property: "og:title", content: "Inteligência Artificial — Nexsuria" },
      { property: "og:description", content: "BI, Analytics, ML e agentes inteligentes com governança." },
    ],
  }),
  component: IA,
});

const capabilities = [
  { icon: BarChart3, title: "Business Intelligence", text: "Power BI, Tableau e dashboards executivos." },
  { icon: LineChart, title: "Analytics", text: "Data platform, KPIs e insights acionáveis." },
  { icon: Cpu, title: "Machine Learning", text: "Modelos preditivos e prescritivos aplicados ao negócio." },
  { icon: Bot, title: "Agentes Inteligentes", text: "Copilots e agentes que atuam nos processos." },
  { icon: Workflow, title: "Automação com IA", text: "RPA inteligente combinado com LLMs." },
  { icon: Database, title: "Data Platform", text: "Integração multi-fonte, governança e qualidade de dados." },
];

function IA() {
  return (
    <>
      <PageHeader
        id="ia"
        eyebrow="Inteligência Artificial"
        title="A IA como competência direta da Nexsuria"
        description="Do dashboard executivo ao agente autônomo: aplicamos IA para acelerar decisões, automatizar operações e criar vantagem competitiva sustentável."
      />

      <section className="ia-unified mx-auto max-w-7xl px-4 lg:px-8 -mt-8 pb-10">
        <Hideable id="ia.dashboard" label="Dashboard executivo">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-elegant">
          <div className="flex items-center justify-between">
            <div>
              <EditableText id="ia.dashboard.eyebrow" as="div" className="text-xs uppercase tracking-widest text-muted-foreground">Nexsuria · Executive AI</EditableText>
              <EditableText id="ia.dashboard.title" as="div" className="text-lg font-semibold">Visão Executiva do Negócio</EditableText>
            </div>
            <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <Zap className="h-3.5 w-3.5 text-primary" /> <EditableText id="ia.dashboard.tag">Tempo real</EditableText>
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            {[
              { l: "Receita YTD", v: "R$ 128M", d: "+12%" },
              { l: "Margem", v: "27,4%", d: "+1,8pp" },
              { l: "Ticket médio", v: "R$ 14,2k", d: "+6%" },
              { l: "Churn", v: "2,3%", d: "-0,7pp" },
            ].map((k, i) => (
              <Hideable key={k.l} id={`ia.kpi.${i}`} label={`KPI: ${k.l}`}>
                <div className="rounded-xl border border-border bg-secondary/40 p-4">
                  <EditableText id={`ia.kpi.${i}.l`} as="div" className="text-xs text-muted-foreground">{k.l}</EditableText>
                  <EditableText id={`ia.kpi.${i}.v`} as="div" className="mt-1 text-2xl font-semibold">{k.v}</EditableText>
                  <EditableText id={`ia.kpi.${i}.d`} as="div" className="text-xs text-primary">{k.d}</EditableText>
                </div>
              </Hideable>
            ))}
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-[2fr_1fr]">
            <div className="rounded-xl border border-border bg-secondary/30 p-4 h-40">
              <EditableText id="ia.chart.title" as="div" className="text-xs text-muted-foreground mb-2">Previsão de Receita (LLM + ML)</EditableText>
              <svg viewBox="0 0 400 140" className="w-full h-[calc(100%-1.5rem)]" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,110 L40,95 L80,100 L120,80 L160,70 L200,58 L240,60 L280,45 L320,35 L360,28 L400,20 L400,140 L0,140 Z" fill="url(#g)" />
                <path d="M0,110 L40,95 L80,100 L120,80 L160,70 L200,58 L240,60 L280,45 L320,35 L360,28 L400,20" stroke="var(--primary)" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <div className="rounded-xl border border-border bg-secondary/30 p-4">
              <EditableText id="ia.agent.title" as="div" className="text-xs text-muted-foreground mb-2">Agente executivo</EditableText>
              <EditableText id="ia.agent.msg" as="p" multiline className="text-sm">Detectei aumento de margem em SP e queda de ticket no RJ. Sugestão: revisar mix de produtos B2B no RJ.</EditableText>
              <EditableText id="ia.agent.note" as="div" className="mt-3 text-[11px] text-muted-foreground">Sugestão gerada por IA · revisar antes de aplicar</EditableText>
            </div>
          </div>
        </div>
        </Hideable>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map(({ icon: Icon, title, text }, i) => (
            <Markable key={title} id={`mark.ia.cap.${i}`} label={`Capacidade IA: ${title}`} page="Inteligência Artificial">
            <Hideable id={`ia.cap.${i}`} label={`Capacidade: ${title}`}>
              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent-gradient text-primary-foreground">
                    <Icon className="h-4 w-4" />
                  </div>
                  <EditableText id={`ia.cap.${i}.title`} as="h3" className="font-semibold text-sm">{title}</EditableText>
                </div>
                <EditableText id={`ia.cap.${i}.text`} as="p" multiline className="mt-2 text-xs text-muted-foreground">{text}</EditableText>
              </div>
            </Hideable>
            </Markable>
          ))}
        </div>

        <Hideable id="ia.lideranca" label="Liderança direta">
          <div className="mt-6 rounded-2xl border border-border bg-secondary/40 p-5 flex flex-col md:flex-row items-start gap-4">
            <BrainCircuit className="h-8 w-8 text-primary shrink-0" />
            <div>
              <EditableText id="ia.lideranca.title" as="h3" className="text-lg font-semibold block">Liderança direta da Nexsuria</EditableText>
              <EditableText id="ia.lideranca.text" as="p" multiline className="mt-1 text-sm text-muted-foreground max-w-3xl">
                Diferente de outras áreas, Inteligência Empresarial e IA é uma competência liderada diretamente pela Nexsuria. Combinamos governança de dados, engenharia analítica, ciência de dados e agentes para gerar decisão e ação.
              </EditableText>
            </div>
          </div>
        </Hideable>
      </section>
    </>
  );
}