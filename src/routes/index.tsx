import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/pages/index";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nexsuria — Portal Executivo Comercial" },
      { name: "description", content: "A Nexsuria não vende software. Entrega evolução empresarial: estratégia, tecnologia, IA e um ecossistema de especialistas." },
      { property: "og:title", content: "Nexsuria — Portal Executivo Comercial" },
      { property: "og:description", content: "Centro de Inteligência Empresarial que conecta estratégia, tecnologia e IA para acelerar resultados." },
    ],
  }),
  component: HomePage,
});

