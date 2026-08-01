import { createFileRoute } from "@tanstack/react-router";
import { QuemSomos } from "@/pages/quem-somos";

export const Route = createFileRoute("/quem-somos")({
  head: () => ({
    meta: [
      { title: "Quem Somos — Nexsuria" },
      { name: "description", content: "Orquestradora de soluções empresariais em Campinas/SP. Propósito, missão, visão, valores e história da Nexsuria." },
      { property: "og:title", content: "Quem Somos — Nexsuria" },
      { property: "og:description", content: "Centro de Inteligência Empresarial. Conectando pessoas e negócios." },
    ],
  }),
  component: QuemSomos,
});

