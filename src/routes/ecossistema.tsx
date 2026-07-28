import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { partners, contactInfo, solutions } from "@/lib/nexsuria-data";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { EditableText, Hideable } from "@/components/editable";
import { Markable } from "@/components/markable";

const solutionSlugForPartner = (partnerName: string) =>
  solutions.find((s) => s.specialist.name === partnerName)?.slug;

export const Route = createFileRoute("/ecossistema")({
  head: () => ({
    meta: [
      { title: "Ecossistema — Nexsuria" },
      { name: "description", content: "10 especialistas em torno da Nexsuria. Exclusividade por especialidade, coordenação estratégica única." },
      { property: "og:title", content: "Ecossistema — Nexsuria" },
      { property: "og:description", content: "Conheça os parceiros do ecossistema Nexsuria." },
    ],
  }),
  component: Ecossistema,
});

function Ecossistema() {
  const [selected, setSelected] = useState<(typeof partners)[number] | null>(null);

  return (
    <>
      <PageHeader
        eyebrow="Ecossistema"
        title="10 especialistas. Uma orquestradora."
        description="Cada parceiro é líder em sua especialidade — e todos operam sob a coordenação estratégica da Nexsuria. Um único relacionamento, uma responsabilidade."
      />

      <section className="mx-auto max-w-7xl px-4 lg:px-8 py-16">
        <div className="relative mx-auto aspect-square w-full max-w-2xl">
          <div className="absolute inset-0 rounded-full border border-border/70" />
          <div className="absolute inset-8 rounded-full border border-dashed border-border/50" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 rounded-full bg-hero-gradient shadow-elegant grid place-items-center text-primary-foreground">
            <div className="text-center">
              <Sparkles className="h-5 w-5 mx-auto" />
              <div className="mt-1 font-semibold font-[family-name:var(--font-display)]">NEXSURIA</div>
              <div className="text-[10px] opacity-80 uppercase tracking-widest">Centro de Inteligência</div>
            </div>
          </div>
          {partners.map((p, i) => {
            const angle = (i / partners.length) * Math.PI * 2 - Math.PI / 2;
            const r = 44;
            const x = 50 + Math.cos(angle) * r;
            const y = 50 + Math.sin(angle) * r;
            const slug = solutionSlugForPartner(p.name);
            const className =
              "absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card px-3 py-2 text-xs md:text-sm font-medium shadow-card-soft hover:shadow-elegant hover:border-primary/40 transition-all";
            return slug ? (
              <Link
                key={p.slug}
                to="/solucoes/$slug"
                params={{ slug }}
                style={{ left: `${x}%`, top: `${y}%` }}
                className={className}
              >
                {p.name}
              </Link>
            ) : (
              <button
                key={p.slug}
                onClick={() => setSelected(p)}
                style={{ left: `${x}%`, top: `${y}%` }}
                className={className}
              >
                {p.name}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 lg:px-8 pb-16">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((p) => {
            const slug = solutionSlugForPartner(p.name);
            const inner = (
              <div className="w-full text-left rounded-2xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-elegant transition-all">
                <div className="flex items-center justify-between">
                  <EditableText id={`ecossistema.${p.slug}.name`} as="h3" className="font-semibold">{p.name}</EditableText>
                  {p.exclusive && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase tracking-widest">Exclusivo</span>
                  )}
                </div>
                <EditableText id={`ecossistema.${p.slug}.specialty`} as="p" multiline className="mt-1 text-sm text-muted-foreground">
                  {p.specialty}
                </EditableText>
              </div>
            );
            return (
              <Markable key={p.slug} id={`mark.parceiro.${p.slug}`} label={`Parceiro: ${p.name}`} page="Ecossistema">
                <Hideable id={`ecossistema.${p.slug}`} label={`Parceiro: ${p.name}`}>
                  {slug ? (
                    <Link to="/solucoes/$slug" params={{ slug }} className="block">
                      {inner}
                    </Link>
                  ) : (
                    <button onClick={() => setSelected(p)} className="block w-full text-left">
                      {inner}
                    </button>
                  )}
                </Hideable>
              </Markable>
            );
          })}
        </div>
      </section>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-[family-name:var(--font-display)]">{selected.name}</DialogTitle>
                <DialogDescription>{selected.specialty}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-foreground/90">{selected.about}</p>
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Principais capacidades</div>
                  <div className="flex flex-wrap gap-2">
                    {selected.capabilities.map((c) => (
                      <span key={c} className="text-xs rounded-full border border-border bg-secondary px-2.5 py-1">{c}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Quando indicar</div>
                  <p className="text-sm text-muted-foreground">{selected.whenToUse}</p>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Benefícios</div>
                  <ul className="grid grid-cols-2 gap-1 text-sm">
                    {selected.benefits.map((b) => <li key={b} className="text-foreground/90">• {b}</li>)}
                  </ul>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button asChild variant="outline">
                    <a href={contactInfo.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}