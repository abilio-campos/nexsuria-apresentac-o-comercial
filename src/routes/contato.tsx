import { createFileRoute } from "@tanstack/react-router";
import { Contato } from "@/pages/contato";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Nexsuria" },
      { name: "description", content: "Solicite um Diagnóstico Estratégico com a Nexsuria. WhatsApp, LinkedIn, e-mail e site." },
      { property: "og:title", content: "Contato — Nexsuria" },
      { property: "og:description", content: "Fale com a Nexsuria e agende um diagnóstico." },
    ],
  }),
  component: Contato,
});

