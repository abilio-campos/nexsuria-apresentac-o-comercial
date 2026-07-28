import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { partners, contactInfo, solutions } from "@/lib/nexsuria-data";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EditableText, Hideable } from "@/components/editable";
import { Markable } from "@/components/markable";
import nexsuriaLogo from "@/assets/nexsuria-logo.png.asset.json";

const clients = [
  { slug: "cliente-1", name: "Cliente A" },
  { slug: "cliente-2", name: "Cliente B" },
  { slug: "cliente-3", name: "Cliente C" },
  { slug: "cliente-4", name: "Cliente D" },
];
const prospects = [
  { slug: "prospect-1", name: "Prospect A" },
  { slug: "prospect-2", name: "Prospect B" },
  { slug: "prospect-3", name: "Prospect C" },
  { slug: "prospect-4", name: "Prospect D" },
];


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
        {(() => {
          // Build node graph: Nexsuria + partners + clients + prospects
          const CENTER = { x: 50, y: 50 };
          const partnerNodes = partners.map((p, i) => {
            const a = (i / partners.length) * Math.PI * 2 - Math.PI / 2;
            return {
              kind: "partner" as const,
              id: `p-${p.slug}`,
              data: p,
              x: 50 + Math.cos(a) * 28,
              y: 50 + Math.sin(a) * 28,
            };
          });
          const arc = (count: number, from: number, to: number, r: number) =>
            Array.from({ length: count }, (_, i) => {
              const t = count === 1 ? 0.5 : i / (count - 1);
              const a = (from + (to - from) * t) * (Math.PI / 180);
              return { x: 50 + Math.cos(a) * r, y: 50 + Math.sin(a) * r };
            });
          const clientPos = arc(clients.length, -170, -10, 46);
          const prospectPos = arc(prospects.length, 10, 170, 46);
          const clientNodes = clients.map((c, i) => ({
            kind: "client" as const,
            id: `c-${c.slug}`,
            data: c,
            x: clientPos[i].x,
            y: clientPos[i].y,
          }));
          const prospectNodes = prospects.map((c, i) => ({
            kind: "prospect" as const,
            id: `pr-${c.slug}`,
            data: c,
            x: prospectPos[i].x,
            y: prospectPos[i].y,
          }));
          const all = [...partnerNodes, ...clientNodes, ...prospectNodes];
          const byId = Object.fromEntries(all.map((n) => [n.id, n]));

          type Edge = [string, string, number?];
          const edges: Edge[] = [];
          // Nexsuria → all
          all.forEach((n) => edges.push([`nex`, n.id, 0.5]));
          // Partner ↔ neighbour partner
          partnerNodes.forEach((p, i) => {
            const next = partnerNodes[(i + 1) % partnerNodes.length];
            edges.push([p.id, next.id, 0.25]);
          });
          // Each client/prospect → 3 nearest partners
          const nearest = (node: { x: number; y: number }, k = 3) =>
            partnerNodes
              .map((p) => ({ id: p.id, d: Math.hypot(p.x - node.x, p.y - node.y) }))
              .sort((a, b) => a.d - b.d)
              .slice(0, k);
          clientNodes.forEach((c) =>
            nearest(c).forEach((p) => edges.push([c.id, p.id, 0.22]))
          );
          prospectNodes.forEach((c) =>
            nearest(c).forEach((p) => edges.push([c.id, p.id, 0.22]))
          );
          // Client ↔ neighbour client, prospect ↔ neighbour prospect
          clientNodes.forEach((c, i) => {
            if (i < clientNodes.length - 1)
              edges.push([c.id, clientNodes[i + 1].id, 0.18]);
          });
          prospectNodes.forEach((c, i) => {
            if (i < prospectNodes.length - 1)
              edges.push([c.id, prospectNodes[i + 1].id, 0.18]);
          });
          // Some client ↔ prospect cross links
          clientNodes.forEach((c, i) => {
            const pr = prospectNodes[prospectNodes.length - 1 - i];
            if (pr) edges.push([c.id, pr.id, 0.14]);
          });

          const nodeStyle = (kind: string) => {
            if (kind === "partner")
              return "border-primary/40 bg-card text-foreground";
            if (kind === "client")
              return "border-emerald-500/50 bg-emerald-500/10 text-foreground";
            return "border-amber-500/50 bg-amber-500/10 text-foreground";
          };

          return (
            <div className="relative mx-auto aspect-square w-full max-w-3xl presenting-fit">
              {/* Neural network edges */}
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full pointer-events-none"
              >
                <defs>
                  <radialGradient id="nex-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="50" cy="50" r="14" fill="url(#nex-glow)" />
                {edges.map(([a, b, op], idx) => {
                  const na = a === "nex" ? CENTER : byId[a];
                  const nb = b === "nex" ? CENTER : byId[b];
                  if (!na || !nb) return null;
                  return (
                    <line
                      key={idx}
                      x1={na.x}
                      y1={na.y}
                      x2={nb.x}
                      y2={nb.y}
                      stroke="var(--primary)"
                      strokeOpacity={op ?? 0.25}
                      strokeWidth={0.15}
                      vectorEffect="non-scaling-stroke"
                    />
                  );
                })}
                {/* Node dots on top of lines for crisp connection points */}
                {all.map((n) => (
                  <circle
                    key={`dot-${n.id}`}
                    cx={n.x}
                    cy={n.y}
                    r={0.6}
                    fill="var(--primary)"
                    opacity={0.6}
                  />
                ))}
              </svg>

              {/* Nexsuria center */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-28 w-28 md:h-32 md:w-32 rounded-full bg-hero-gradient shadow-elegant grid place-items-center text-primary-foreground overflow-hidden ring-4 ring-background">
                <img
                  src={nexsuriaLogo.url}
                  alt="Nexsuria"
                  className="h-full w-full object-contain p-3"
                />
              </div>

              {/* Partner nodes */}
              {partnerNodes.map((n) => {
                const slug = solutionSlugForPartner(n.data.name);
                const className = `absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border px-2.5 py-1.5 text-[11px] md:text-xs font-medium shadow-card-soft hover:shadow-elegant hover:border-primary/60 transition-all ${nodeStyle("partner")}`;
                const style = { left: `${n.x}%`, top: `${n.y}%` };
                return slug ? (
                  <Link
                    key={n.id}
                    to="/solucoes/$slug"
                    params={{ slug }}
                    style={style}
                    className={className}
                  >
                    {n.data.name}
                  </Link>
                ) : (
                  <button
                    key={n.id}
                    onClick={() => setSelected(n.data)}
                    style={style}
                    className={className}
                  >
                    {n.data.name}
                  </button>
                );
              })}

              {/* Client & Prospect nodes */}
              {[...clientNodes, ...prospectNodes].map((n) => (
                <div
                  key={n.id}
                  style={{ left: `${n.x}%`, top: `${n.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-2.5 py-1 text-[10px] md:text-xs font-medium shadow-card-soft ${nodeStyle(n.kind)}`}
                >
                  <EditableText id={`ecossistema.node.${n.id}.name`} as="span">
                    {n.data.name}
                  </EditableText>
                </div>
              ))}
            </div>
          );
        })()}
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

        {/* Clientes */}
        <Hideable id="ecossistema.clientes.section" label="Seção Clientes">
          <div className="mt-10">
            <EditableText id="ecossistema.clientes.title" as="h3" className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
              Clientes
            </EditableText>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {clients.map((c) => (
                <Markable key={c.slug} id={`mark.cliente.${c.slug}`} label={`Cliente: ${c.name}`} page="Ecossistema">
                  <Hideable id={`ecossistema.cliente.${c.slug}`} label={`Cliente: ${c.name}`}>
                    <div className="w-full text-left rounded-2xl border border-emerald-500/40 bg-emerald-500/5 p-5 hover:border-emerald-500/70 hover:shadow-elegant transition-all">
                      <div className="flex items-center justify-between">
                        <EditableText id={`ecossistema.cliente.${c.slug}.name`} as="h3" className="font-semibold">{c.name}</EditableText>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 uppercase tracking-widest">Cliente</span>
                      </div>
                      <EditableText id={`ecossistema.cliente.${c.slug}.note`} as="p" multiline className="mt-1 text-sm text-muted-foreground">
                        Descrição do cliente.
                      </EditableText>
                    </div>
                  </Hideable>
                </Markable>
              ))}
            </div>
          </div>
        </Hideable>

        {/* Prospects */}
        <Hideable id="ecossistema.prospects.section" label="Seção Prospects">
          <div className="mt-8">
            <EditableText id="ecossistema.prospects.title" as="h3" className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
              Prospects
            </EditableText>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {prospects.map((c) => (
              <Markable key={c.slug} id={`mark.prospect.${c.slug}`} label={`Prospect: ${c.name}`} page="Ecossistema">
                <Hideable id={`ecossistema.prospect.${c.slug}`} label={`Prospect: ${c.name}`}>
                  <div className="w-full text-left rounded-2xl border border-amber-500/40 bg-amber-500/5 p-5 hover:border-amber-500/70 hover:shadow-elegant transition-all">
                    <div className="flex items-center justify-between">
                      <EditableText id={`ecossistema.prospect.${c.slug}.name`} as="h3" className="font-semibold">{c.name}</EditableText>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 uppercase tracking-widest">Prospect</span>
                    </div>
                    <EditableText id={`ecossistema.prospect.${c.slug}.note`} as="p" multiline className="mt-1 text-sm text-muted-foreground">
                      Descrição do prospect.
                    </EditableText>
                  </div>
                </Hideable>
              </Markable>
            ))}
          </div>
          </div>
        </Hideable>

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