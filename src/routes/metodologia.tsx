import { createFileRoute } from "@tanstack/react-router";
import { Metodologia } from "@/pages/metodologia";

export const Route = createFileRoute("/metodologia")({
  head: () => ({
    meta: [
      { title: "Nossa Metodologia — Nexsuria" },
      { name: "description", content: "Do diagnóstico à evolução contínua: o framework Nexsuria que garante execução com governança." },
      { property: "og:title", content: "Nossa Metodologia — Nexsuria" },
      { property: "og:description", content: "Diagnóstico, Estratégia, Especialista, Implantação, Governança e Evolução Contínua." },
    ],
  }),
  component: Metodologia,
});

