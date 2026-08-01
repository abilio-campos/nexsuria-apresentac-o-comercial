import { createFileRoute } from "@tanstack/react-router";
import { Diferenciais } from "@/pages/diferenciais";

export const Route = createFileRoute("/diferenciais")({
  head: () => ({
    meta: [
      { title: "Diferenciais — Nexsuria" },
      { name: "description", content: "Diagnóstico consultivo, ecossistema exclusivo, governança e foco em resultado." },
      { property: "og:title", content: "Diferenciais — Nexsuria" },
      { property: "og:description", content: "O que separa evolução de mera implantação." },
    ],
  }),
  component: Diferenciais,
});

