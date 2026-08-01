import { createFileRoute } from "@tanstack/react-router";
import { Ecossistema } from "@/pages/ecossistema";

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

