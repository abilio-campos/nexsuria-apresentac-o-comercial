import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { contactInfo } from "@/lib/nexsuria-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Linkedin, Globe, MessageCircle } from "lucide-react";
import { useState } from "react";
import { EditableText, Hideable } from "@/components/editable";

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

function Contato() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <PageHeader
        id="contato"
        eyebrow="Contato"
        title="Solicite um Diagnóstico Estratégico"
        description="Um único ponto focal, todo o ecossistema Nexsuria trabalhando para o seu resultado."
      />
      <section className="mx-auto max-w-7xl px-4 lg:px-8 py-16 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <Hideable id="contato.form" label="Formulário"><div className="rounded-2xl border border-border bg-card p-8 shadow-card-soft">
          {sent ? (
            <div className="text-center py-10">
              <EditableText id="contato.sent.title" as="h3" className="text-2xl font-semibold block">Recebemos seu contato</EditableText>
              <EditableText id="contato.sent.msg" as="p" multiline className="mt-2 text-muted-foreground">Um executivo da Nexsuria irá responder em breve.</EditableText>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label htmlFor="nome">Nome</Label><Input id="nome" required className="mt-1.5" /></div>
                <div><Label htmlFor="empresa">Empresa</Label><Input id="empresa" required className="mt-1.5" /></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label htmlFor="email">E-mail</Label><Input id="email" type="email" required className="mt-1.5" /></div>
                <div><Label htmlFor="telefone">Telefone</Label><Input id="telefone" className="mt-1.5" /></div>
              </div>
              <div><Label htmlFor="mensagem">Como podemos ajudar?</Label><Textarea id="mensagem" rows={5} className="mt-1.5" /></div>
              <Button type="submit" size="lg" className="bg-accent-gradient text-primary-foreground">
                <EditableText id="contato.form.submit">Solicitar Diagnóstico Estratégico</EditableText>
              </Button>
            </form>
          )}
        </div></Hideable>

        <div className="space-y-4">
          <Hideable id="contato.whatsapp" label="WhatsApp">
            <a href={contactInfo.whatsapp} target="_blank" rel="noreferrer" className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 hover:shadow-elegant transition-shadow">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent-gradient text-primary-foreground"><MessageCircle className="h-5 w-5" /></div>
              <div><EditableText id="contato.whatsapp.title" as="div" className="font-semibold">WhatsApp</EditableText><EditableText id="contato.whatsapp.value" as="div" className="text-sm text-muted-foreground">{contactInfo.whatsappLabel}</EditableText></div>
            </a>
          </Hideable>
          <Hideable id="contato.linkedin" label="LinkedIn">
            <a href={contactInfo.linkedin} target="_blank" rel="noreferrer" className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 hover:shadow-elegant transition-shadow">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent-gradient text-primary-foreground"><Linkedin className="h-5 w-5" /></div>
              <div><EditableText id="contato.linkedin.title" as="div" className="font-semibold">LinkedIn</EditableText><EditableText id="contato.linkedin.value" as="div" className="text-sm text-muted-foreground">Nexsuria</EditableText></div>
            </a>
          </Hideable>
          <Hideable id="contato.email" label="E-mail">
            <a href={`mailto:${contactInfo.email}`} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 hover:shadow-elegant transition-shadow">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent-gradient text-primary-foreground"><Mail className="h-5 w-5" /></div>
              <div><EditableText id="contato.email.title" as="div" className="font-semibold">E-mail</EditableText><EditableText id="contato.email.value" as="div" className="text-sm text-muted-foreground">{contactInfo.email}</EditableText></div>
            </a>
          </Hideable>
          <Hideable id="contato.site" label="Site">
            <a href={contactInfo.site} target="_blank" rel="noreferrer" className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 hover:shadow-elegant transition-shadow">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent-gradient text-primary-foreground"><Globe className="h-5 w-5" /></div>
              <div><EditableText id="contato.site.title" as="div" className="font-semibold">Site</EditableText><EditableText id="contato.site.value" as="div" className="text-sm text-muted-foreground">nexsuria.com</EditableText></div>
            </a>
          </Hideable>
        </div>
      </section>
    </>
  );
}