import { createFileRoute } from "@tanstack/react-router";
import { Casos } from "@/pages/casos-de-uso";

export const Route = createFileRoute("/casos-de-uso")({
  head: () => ({
    meta: [
      { title: "Casos de Uso — Nexsuria" },
      { name: "description", content: "Cenários reais de aplicação das soluções Nexsuria por segmento: indústria, serviços, varejo, saúde, educação e agro." },
      { property: "og:title", content: "Casos de Uso — Nexsuria" },
      { property: "og:description", content: "Cenários por segmento." },
    ],
  }),
  component: Casos,
});

