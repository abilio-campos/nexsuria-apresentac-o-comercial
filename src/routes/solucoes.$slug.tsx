import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { solutions, partners, contactInfo, type Solution } from "@/lib/nexsuria-data";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, AlertTriangle, Sparkles, MessageCircle } from "lucide-react";
import { EditableText, Hideable } from "@/components/editable";

export const Route = createFileRoute("/solucoes/$slug")({
  head: ({ params }) => {
    const s = solutions.find((x) => x.slug === params.slug);
    if (!s) return { meta: [{ title: "Solução não encontrada — Nexsuria" }, { name: "robots", content: "noindex" }] };
    return {
      meta: [
        { title: `${s.title} — Nexsuria` },
        { name: "description", content: s.tagline },
        { property: "og:title", content: `${s.title} — Nexsuria` },
        { property: "og:description", content: s.tagline },
      ],
    };
  },
  loader: ({ params }) => {
    const s = solutions.find((x) => x.slug === params.slug);
    if (!s) throw notFound();
    return { solution: s };
  },
  component: SolucaoDetail,
});

function SolucaoDetail() {
  const { solution: s } = Route.useLoaderData() as { solution: Solution };
  const base = `solucao.${s.slug}`;
  return (
    <>
      <PageHeader id={base} eyebrow={s.specialist.name} title={s.title} description={s.tagline}>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="secondary" size="sm">
            <Link to="/ecossistema">
              <ArrowLeft className="h-4 w-4 mr-1" /> Voltar para Ecossistema
            </Link>
          </Button>
        </div>
      </PageHeader>

      <section className="mx-auto max-w-7xl px-4 lg:px-8 -mt-8">
        <div className="grid grid-cols-3 gap-3 rounded-2xl border border-border bg-card p-4 shadow-elegant">
          {s.indicators.map((ind, i) => (
            <Hideable key={ind.label} id={`${base}.ind.${i}`} label={`Indicador: ${ind.label}`}>
              <div className="text-center p-3">
                <EditableText id={`${base}.ind.${i}.value`} as="div" className="text-2xl md:text-3xl font-semibold text-gradient font-[family-name:var(--font-display)]">{ind.value}</EditableText>
                <EditableText id={`${base}.ind.${i}.label`} as="div" className="text-[11px] uppercase tracking-widest text-muted-foreground mt-1">{ind.label}</EditableText>
              </div>
            </Hideable>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 lg:px-8 py-16 grid gap-8 lg:grid-cols-2">
        <Hideable id={`${base}.desafio`} label="Desafio"><div className="rounded-2xl border border-border bg-card p-6">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
            <AlertTriangle className="h-4 w-4" /> Desafio
          </div>
          <EditableText id={`${base}.desafio.title`} as="h2" className="mt-2 block text-xl font-semibold">O problema que sua empresa enfrenta</EditableText>
          <EditableText id={`${base}.problem`} as="p" multiline className="mt-3 text-muted-foreground">{s.problem}</EditableText>
          <div className="mt-5 grid grid-cols-2 gap-2">
            {s.impacts.map((ip, i) => (
              <Hideable key={ip} id={`${base}.impact.${i}`} label={ip}>
                <div className="rounded-lg border border-border/70 bg-secondary/50 px-3 py-2 text-xs">
                  <EditableText id={`${base}.impact.${i}.t`}>{ip}</EditableText>
                </div>
              </Hideable>
            ))}
          </div>
        </div></Hideable>
        <Hideable id={`${base}.resultado`} label="Resultado"><div className="rounded-2xl border border-border bg-card p-6">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
            <Sparkles className="h-4 w-4" /> Resultado Esperado
          </div>
          <EditableText id={`${base}.resultado.title`} as="h2" className="mt-2 block text-xl font-semibold">O que a Nexsuria entrega</EditableText>
          <EditableText id={`${base}.delivers`} as="p" multiline className="mt-3 text-muted-foreground">{s.delivers}</EditableText>
          <div className="mt-5 flex flex-wrap gap-2">
            {s.benefits.map((b, i) => (
              <Hideable key={b} id={`${base}.benefit.${i}`} label={b}>
                <span className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs text-primary">
                  <EditableText id={`${base}.benefit.${i}.t`}>{b}</EditableText>
                </span>
              </Hideable>
            ))}
          </div>
        </div></Hideable>
      </section>

      <section className="bg-secondary/40 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 py-16">
          <EditableText id={`${base}.cap.eyebrow`} as="span" className="text-xs uppercase tracking-widest text-muted-foreground">Capacidades Disponíveis</EditableText>
          <EditableText id={`${base}.cap.title`} as="h2" className="mt-2 block text-2xl md:text-3xl font-semibold font-[family-name:var(--font-display)]">Como executamos</EditableText>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {s.capabilities.map((c, i) => (
              <Hideable key={c} id={`${base}.cap.${i}`} label={c}>
                <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                  <EditableText id={`${base}.cap.${i}.t`} as="span" multiline className="text-sm">{c}</EditableText>
                </div>
              </Hideable>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 lg:px-8 py-16">
        <Hideable id={`${base}.esp`} label="Especialista">
          <div className="rounded-3xl border border-border bg-card p-8 md:p-10 shadow-card-soft">
            <EditableText id={`${base}.esp.name`} as="h3" className="block text-2xl md:text-3xl font-semibold font-[family-name:var(--font-display)]">{s.specialist.name}</EditableText>
            <EditableText id={`${base}.esp.desc`} as="p" multiline className="mt-3 text-muted-foreground max-w-3xl">{s.specialist.description}</EditableText>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {s.specialist.capabilities.map((c, i) => (
                <Hideable key={c} id={`${base}.esp.cap.${i}`} label={c}>
                  <div className="rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm">
                    <EditableText id={`${base}.esp.cap.${i}.t`}>{c}</EditableText>
                  </div>
                </Hideable>
              ))}
            </div>
            <Hideable id={`${base}.esp.wa`} label="Botão WhatsApp">
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="outline">
                  <a href={contactInfo.whatsapp} target="_blank" rel="noreferrer">
                    <MessageCircle className="h-4 w-4 mr-2" /> Fale no WhatsApp
                  </a>
                </Button>
                <Button asChild variant="ghost">
                  <Link to="/ecossistema">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Voltar para Ecossistema
                  </Link>
                </Button>
              </div>
            </Hideable>
          </div>
        </Hideable>

        <Hideable id={`${base}.todosparceiros`} label="Todos os parceiros">
          <div className="mt-10">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Ecossistema completo</div>
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {partners.map((p) => {
                const active = p.name === s.specialist.name;
                return (
                  <div
                    key={p.slug}
                    className={`rounded-xl border p-3 text-sm ${active ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border bg-card"}`}
                  >
                    {p.name}
                  </div>
                );
              })}
            </div>
          </div>
        </Hideable>
      </section>
    </>
  );
}