import { createFileRoute } from "@tanstack/react-router";
import { Equipe } from "@/pages/equipe";

export const Route = createFileRoute("/equipe")({
  head: () => ({
    meta: [
      { title: "Quem Estará ao seu Lado — Nexsuria" },
      { name: "description", content: "Abilio Alves Campos Junior e Caíque Fussi Campos — a liderança executiva que conduz cada relacionamento Nexsuria." },
      { property: "og:title", content: "Quem Estará ao seu Lado — Nexsuria" },
      { property: "og:description", content: "Experiência executiva e desenvolvimento de negócios." },
    ],
  }),
  component: Equipe,
});

