import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { solutions } from "../../nexsuria-data";

export default defineTool({
  name: "get_solution",
  title: "Detalhar solução",
  description: "Retorna o detalhamento completo de uma solução Nexsuria pelo seu slug.",
  inputSchema: {
    slug: z.string().min(1).describe("Slug da solução, por exemplo 'gestao-sistemica-erp'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slug }) => {
    const solution = solutions.find((s) => s.slug === slug);
    if (!solution) {
      return {
        content: [{ type: "text", text: `Solução não encontrada: ${slug}` }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(solution, null, 2) }],
      structuredContent: { solution },
    };
  },
});