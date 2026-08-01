import { Link } from "@tanstack/react-router";
import { ArrowRight, Network, Sparkles, Target, BrainCircuit, ShieldCheck, Gauge, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { kpis, solutions, differentials } from "@/lib/nexsuria-data";
import { EditableText, Hideable, Movable, SectionDivider } from "@/components/editable";
export function HomePage() {
  return (
    <>
      {/* Hero */}
      <Movable id="home.section.hero" label="Seção Hero" as="section" className="home-flow relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-hero-gradient opacity-95" />
        <div className="absolute inset-0 -z-10 opacity-30 [background:radial-gradient(1000px_500px_at_20%_0%,white,transparent),radial-gradient(800px_400px_at_80%_100%,white,transparent)]" />
        <div className="mx-auto max-w-7xl px-4 lg:px-8 py-14 md:py-20 text-primary-foreground">
          <Movable id="home.badge.box" label="Badge: Centro de Inteligência" inline>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              <EditableText id="home.badge">Centro de Inteligência Empresarial</EditableText>
            </span>
          </Movable>
          <Movable id="home.title.line1.box" label="Título: linha 1">
            <h1 className="mt-6 max-w-4xl font-[family-name:var(--font-display)] text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight">
              <EditableText id="home.title.line1" as="span">A Nexsuria não vende software.</EditableText>
            </h1>
          </Movable>
          <Movable id="home.title.line2.box" label="Título: linha 2">
            <h2 className="max-w-4xl font-[family-name:var(--font-display)] text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight text-white/85">
              <EditableText id="home.title.line2" as="span">Entregamos evolução empresarial.</EditableText>
            </h2>
          </Movable>
          <Movable id="home.subtitle.box" label="Texto: subtítulo">
            <EditableText id="home.subtitle" as="p" multiline className="mt-6 max-w-2xl text-lg text-white/80">
              {"Conectamos estratégia, tecnologia, Inteligência Artificial, processos e pessoas para acelerar resultados. Um único relacionamento — uma responsabilidade: a nossa."}
            </EditableText>
          </Movable>
          <div className="mt-8 flex flex-wrap gap-3">
            <Hideable id="home.cta.ecossistema" label="Botão Ecossistema">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                <Link to="/ecossistema">Conheça o Ecossistema <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </Hideable>
            <Hideable id="home.cta.solucoes" label="Botão Soluções">
              <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/10 text-primary-foreground hover:bg-white/20">
                <Link to="/solucoes">Nossas Soluções</Link>
              </Button>
            </Hideable>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            {kpis.map((k, i) => (
              <Movable key={k.label} id={`home.kpi.${i}.box`} label={`KPI: ${k.label}`}>
                <Hideable id={`home.kpi.${i}`} label={`KPI: ${k.label}`}>
                  <div className="rounded-xl border border-white/15 bg-white/5 backdrop-blur p-5">
                    <div className="text-3xl md:text-4xl font-semibold font-[family-name:var(--font-display)]">
                      <EditableText id={`home.kpi.${i}.value`} as="span">{k.value}</EditableText>
                      <EditableText id={`home.kpi.${i}.suffix`} as="span" className="text-white/70">{k.suffix}</EditableText>
                    </div>
                    <EditableText id={`home.kpi.${i}.label`} as="div" className="mt-1 text-xs text-white/70 uppercase tracking-widest">
                      {k.label}
                    </EditableText>
                  </div>
                </Hideable>
              </Movable>
            ))}
          </div>
        </div>
      </Movable>

      <SectionDivider id="home.divider.1" />

      {/* Value pillars */}
      <Movable id="home.section.pilares" label="Seção Pilares" as="section" className="home-flow mx-auto max-w-7xl px-4 lg:px-8 py-20">
        <div className="max-w-2xl">
          <Movable id="home.pilares.eyebrow.box" label="Eyebrow: Posicionamento" inline>
            <EditableText id="home.pilares.eyebrow" as="span" className="text-xs uppercase tracking-widest text-muted-foreground">Posicionamento</EditableText>
          </Movable>
          <Movable id="home.pilares.title.box" label="Título: Um portal">
            <EditableText id="home.pilares.title" as="h2" className="mt-2 block text-3xl md:text-4xl font-semibold font-[family-name:var(--font-display)]">Um portal, um ecossistema, um único responsável.</EditableText>
          </Movable>
          <Movable id="home.pilares.text.box" label="Texto: Nexsuria compreende">
            <EditableText id="home.pilares.text" as="p" multiline className="mt-3 text-muted-foreground">A Nexsuria compreende o negócio, desenha a estratégia, seleciona o especialista ideal e coordena toda a execução — do diagnóstico à evolução contínua.</EditableText>
          </Movable>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { icon: Target, title: "Diagnóstico Consultivo", text: "Enxergamos o negócio antes da tecnologia." },
            { icon: Network, title: "Ecossistema Exclusivo", text: "Parceiros líderes por especialidade, sem sobreposição." },
            { icon: BrainCircuit, title: "IA como Competência", text: "A Nexsuria lidera diretamente Inteligência Empresarial e IA." },
            { icon: Gauge, title: "Governança", text: "SLA, indicadores e cadência executiva." },
            { icon: ShieldCheck, title: "Compliance", text: "Segurança jurídica, fiscal e trabalhista." },
            { icon: TrendingUp, title: "Resultado Mensurável", text: "Evolução empresarial que aparece no P&L." },
          ].map(({ icon: Icon, title, text }) => (
            <Movable key={title} id={`home.pilar.${title}.box`} label={`Pilar: ${title}`}>
              <div className="group rounded-2xl border border-border bg-card p-6 shadow-card-soft hover:shadow-elegant transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent-gradient text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold leading-tight">{title}</h3>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{text}</p>
              </div>
            </Movable>

          ))}
        </div>
      </Movable>

      <SectionDivider id="home.divider.2" />

      {/* Solutions preview */}
      <Movable id="home.section.solucoes" label="Seção Soluções" as="section" className="home-flow bg-secondary/40 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 py-20">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <Movable id="home.solucoes.eyebrow.box" label="Eyebrow: Soluções" inline>
                <EditableText id="home.solucoes.eyebrow" as="span" className="text-xs uppercase tracking-widest text-muted-foreground">Soluções</EditableText>
              </Movable>
              <Movable id="home.solucoes.title.box" label="Título: 13 frentes">
                <EditableText id="home.solucoes.title" as="h2" className="mt-2 block text-3xl md:text-4xl font-semibold font-[family-name:var(--font-display)]">13 frentes de evolução empresarial</EditableText>
              </Movable>
            </div>
            <Button asChild variant="ghost"><Link to="/solucoes">Ver todas <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {solutions.slice(0, 6).map((s) => (
              <Movable key={s.slug} id={`home.solucao.${s.slug}.box`} label={`Solução: ${s.title}`}>
                <Link
                  to="/solucoes/$slug"
                  params={{ slug: s.slug }}
                  className="group block rounded-2xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-elegant transition-all"
                >
                  <div className="text-xs text-muted-foreground uppercase tracking-widest">{s.specialist.name}</div>
                  <h3 className="mt-2 text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{s.tagline}</p>
                  <div className="mt-4 flex items-center text-sm text-primary group-hover:translate-x-1 transition-transform">
                    Explorar <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </Link>
              </Movable>
            ))}
          </div>
        </div>
      </Movable>

      <SectionDivider id="home.divider.3" />

      {/* Differentials strip */}
      <Movable id="home.section.diferenciais" label="Seção Diferenciais" as="section" className="home-flow mx-auto max-w-7xl px-4 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <Movable id="home.diff.eyebrow.box" label="Eyebrow: Por que Nexsuria" inline>
              <EditableText id="home.diff.eyebrow" as="span" className="text-xs uppercase tracking-widest text-muted-foreground">Por que Nexsuria</EditableText>
            </Movable>
            <Movable id="home.diff.title.box" label="Título: Diferenciais">
              <EditableText id="home.diff.title" as="h2" className="mt-2 block text-3xl md:text-4xl font-semibold font-[family-name:var(--font-display)]">Diferenciais que fazem projetos entregarem resultado.</EditableText>
            </Movable>
            <Movable id="home.diff.text.box" label="Texto: Consultoria estratégica">
              <EditableText id="home.diff.text" as="p" multiline className="mt-3 text-muted-foreground">Consultoria estratégica, ecossistema curado e governança executiva — três alavancas que separam evolução de mera implantação.</EditableText>
            </Movable>
            <Button asChild className="mt-6" variant="outline">
              <Link to="/diferenciais">Todos os diferenciais</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {differentials.slice(0, 6).map((d) => (
              <Movable key={d.title} id={`home.diff.${d.title}.box`} label={`Diferencial: ${d.title}`}>
                <div className="rounded-xl border border-border bg-card p-4">
                  <div className="text-sm font-semibold">{d.title}</div>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-3">{d.description}</p>
                </div>
              </Movable>
            ))}
          </div>
        </div>
      </Movable>



    </>
  );
}

export function CtaBand() {
  return (
    <section className="mx-auto max-w-7xl px-4 lg:px-8 pb-20">
      <div className="relative overflow-hidden rounded-3xl bg-hero-gradient p-10 md:p-14 text-primary-foreground shadow-elegant">
        <div className="absolute inset-0 opacity-20 [background:radial-gradient(600px_300px_at_100%_0%,white,transparent)]" />
        <div className="relative grid md:grid-cols-[2fr_1fr] gap-8 items-center">
          <div>
            <h3 className="text-2xl md:text-3xl font-semibold font-[family-name:var(--font-display)]">
              Pronto para transformar sua operação?
            </h3>
            <p className="mt-2 text-white/85 max-w-xl">
              Solicite um diagnóstico estratégico. Um único ponto focal, todo o ecossistema Nexsuria trabalhando por você.
            </p>
          </div>
          <div className="flex md:justify-end gap-3">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link to="/contato">Solicitar Diagnóstico</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
