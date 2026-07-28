import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { solutions } from "@/lib/nexsuria-data";
import { ArrowRight, ArrowUp, ArrowDown, EyeOff, Eye } from "lucide-react";
import { EditableText, Hideable } from "@/components/editable";
import { Markable } from "@/components/markable";
import { useOrderedList } from "@/lib/list-order";

export const Route = createFileRoute("/solucoes")({
  head: () => ({
    meta: [
      { title: "Soluções — Nexsuria" },
      { name: "description", content: "13 frentes de evolução empresarial. Cada solução com problema, capacidades, especialista responsável e indicadores." },
      { property: "og:title", content: "Soluções — Nexsuria" },
      { property: "og:description", content: "Explore as soluções do ecossistema Nexsuria." },
    ],
  }),
  component: SolucoesLayout,
});

function SolucoesLayout() {
  const matches = useMatches();
  const isChild = matches.some((m) => m.routeId.startsWith("/solucoes/") && m.routeId !== "/solucoes");
  const list = useOrderedList("solucoes", solutions, (s) => s.slug);
  if (isChild) return <Outlet />;
  const items = list.editMode ? list.all : list.visible;

  return (
    <>
      <PageHeader
        id="solucoes"
        eyebrow="Soluções"
        title="13 frentes para evoluir sua empresa"
        description="Cada solução segue a lógica Problema → O que a Nexsuria entrega → Capacidades → Especialista → Indicadores → Diagnóstico."
      />
      <section className="mx-auto max-w-7xl px-4 lg:px-8 py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s, idx) => {
            const hidden = list.isHidden(s.slug);
            return (
            <Markable key={s.slug} id={`mark.solucao.${s.slug}`} label={`Solução: ${s.title}`} page="Soluções">
            <Hideable id={`solucoes.card.${s.slug}`} label={`Solução: ${s.title}`}>
              <div className={`relative ${hidden ? "opacity-40" : ""}`}>
              {list.editMode && (
                <div className="absolute -top-2 -left-2 z-20 flex items-center gap-1 rounded-md border border-border bg-background/95 backdrop-blur shadow-sm p-0.5">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); list.move(s.slug, -1); }}
                    disabled={idx === 0}
                    className="p-1 rounded hover:bg-secondary disabled:opacity-30"
                    title="Mover para cima"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); list.move(s.slug, 1); }}
                    disabled={idx === items.length - 1}
                    className="p-1 rounded hover:bg-secondary disabled:opacity-30"
                    title="Mover para baixo"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); list.toggleHidden(s.slug); }}
                    className="p-1 rounded hover:bg-secondary"
                    title={hidden ? "Mostrar" : "Ocultar"}
                  >
                    {hidden ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  </button>
                </div>
              )}
              <Link
                to="/solucoes/$slug"
                params={{ slug: s.slug }}
                className="group block rounded-2xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-elegant transition-all"
              >
                <EditableText id={`solucoes.card.${s.slug}.esp`} as="div" className="text-[10px] uppercase tracking-widest text-muted-foreground">{`Especialista · ${s.specialist.name}`}</EditableText>
                <EditableText id={`solucoes.card.${s.slug}.title`} as="h3" className="mt-2 block text-lg font-semibold leading-tight">{s.title}</EditableText>
                <EditableText id={`solucoes.card.${s.slug}.tagline`} as="p" multiline className="mt-2 text-sm text-muted-foreground">{s.tagline}</EditableText>
                <div className="mt-4 flex items-center text-sm text-primary group-hover:translate-x-1 transition-transform">
                  Ver solução <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </Link>
              </div>
            </Hideable>
            </Markable>
            );
          })}
        </div>
      </section>
    </>
  );
}