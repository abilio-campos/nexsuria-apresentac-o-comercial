import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { solutions } from "../../nexsuria-data";

export default defineTool({
  name: "list_solutions",
  title: "Listar soluções Nexsuria",
  description: "Retorna todas as soluções do portfólio Nexsuria (slug, título, tagline, especialista responsável).",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const rows = solutions.map((s) => ({
      slug: s.slug,
      title: s.title,
      tagline: s.tagline,
      specialist: s.specialist.name,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { solutions: rows },
    };
  },
});