import { createFileRoute } from "@tanstack/react-router";
import { IA } from "@/pages/ia";

export const Route = createFileRoute("/ia")({
  head: () => ({
    meta: [
      { title: "Inteligência Artificial — Nexsuria" },
      { name: "description", content: "IA aplicada ao negócio: BI, analytics, agentes inteligentes, machine learning e automação. Uma competência liderada diretamente pela Nexsuria." },
      { property: "og:title", content: "Inteligência Artificial — Nexsuria" },
      { property: "og:description", content: "BI, Analytics, ML e agentes inteligentes com governança." },
    ],
  }),
  component: IA,
});

