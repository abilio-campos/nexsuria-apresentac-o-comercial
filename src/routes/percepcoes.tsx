import { createFileRoute } from "@tanstack/react-router";
import { PercepcoesPage } from "@/pages/percepcoes";

export const Route = createFileRoute("/percepcoes")({
  head: () => ({
    meta: [
      { title: "Percepções do Cliente — Nexsuria" },
      { name: "description", content: "Colete dores e oportunidades identificadas durante a apresentação — via marcações nos itens ou anotações livres." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PercepcoesPage,
});

