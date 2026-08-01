import { createFileRoute } from "@tanstack/react-router";
import { SolucoesLayout } from "@/pages/solucoes";

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

