import { defineTool } from "@lovable.dev/mcp-js";
import { contactInfo } from "../../nexsuria-data";

export default defineTool({
  name: "get_contact",
  title: "Obter canais de contato",
  description: "Retorna os canais oficiais de contato comercial da Nexsuria.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(contactInfo, null, 2) }],
    structuredContent: { contact: contactInfo },
  }),
});