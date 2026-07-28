import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listSolutions from "./tools/list-solutions";
import getSolution from "./tools/get-solution";
import listPartners from "./tools/list-partners";
import getContact from "./tools/get-contact";

// Direct Supabase host (not the .lovable.cloud proxy) — required by RFC 8414 issuer match.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "nexsuria-portal-mcp",
  title: "Portal Executivo Nexsuria — MCP",
  version: "0.1.0",
  instructions:
    "Ferramentas para consultar o Portal Executivo Comercial da Nexsuria: soluções, ecossistema de parceiros e canais de contato.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listSolutions, getSolution, listPartners, getContact],
});