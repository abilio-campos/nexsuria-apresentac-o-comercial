import { defineTool } from "@lovable.dev/mcp-js";
import { partners } from "../../nexsuria-data";

export default defineTool({
  name: "list_partners",
  title: "Listar parceiros do ecossistema",
  description: "Retorna o ecossistema de parceiros especialistas da Nexsuria.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(partners, null, 2) }],
    structuredContent: { partners },
  }),
});