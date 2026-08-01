import { PageHeader } from "@/components/page-header";
import { Linkedin } from "lucide-react";
import { EditableText, Hideable } from "@/components/editable";
export function Equipe() {
  const people = [
    {
      name: "Abilio Alves Campos Junior",
      role: "Fundador e Diretor",
      initials: "AC",
      linkedin: "https://www.linkedin.com/in/abiliocampos/",
      highlights: [
        "Mais de 28 anos de experiência em tecnologia, gestão empresarial e desenvolvimento de negócios",
        "Atuação forte em ERP, transformação digital, expansão comercial e relacionamento executivo",
        "Especialista em diagnóstico de negócios, construção de estratégias e desenvolvimento de parcerias",
        "Responsável pelo relacionamento estratégico da Nexsuria com clientes e parceiros",
      ],
    },
    {
      name: "Caíque Fussi Campos",
      role: "Executivo de Desenvolvimento de Negócios",
      initials: "CF",
      linkedin: "https://www.linkedin.com/in/caiquefussicampos/",
      highlights: [
        "Prospecção consultiva e relacionamento com clientes",
        "Desenvolvimento de novos negócios com perfil analítico",
        "Formação em Engenharia de Produção",
        "Foco em inovação, tecnologia e melhoria contínua",
      ],
    },
  ];
  return (
    <>
      <PageHeader
        id="equipe"
        eyebrow="Quem Estará ao seu Lado"
        title="Experiência executiva, próxima e responsável"
        description="A Nexsuria acredita que resultados consistentes nascem da combinação entre experiência executiva, inovação, tecnologia e relacionamento próximo com cada cliente."
      />
      <section className="equipe-page equipe-combined mx-auto max-w-7xl px-4 lg:px-8 py-10">
        <div className="grid gap-6 md:grid-cols-2">
          {people.map((p, pi) => (
            <Hideable key={p.name} id={`equipe.${pi}`} label={p.name}>
              <div className="h-full rounded-3xl border border-border bg-card p-6 lg:p-8 shadow-card-soft">
                <div className="flex items-center gap-4">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-hero-gradient text-primary-foreground text-lg font-semibold font-[family-name:var(--font-display)]">
                    <EditableText id={`equipe.${pi}.initials`}>{p.initials}</EditableText>
                  </div>
                  <div>
                    <EditableText id={`equipe.${pi}.name`} as="h3" className="text-lg lg:text-xl font-semibold block">{p.name}</EditableText>
                    <EditableText id={`equipe.${pi}.role`} as="div" className="text-sm text-muted-foreground">{p.role}</EditableText>
                  </div>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-foreground/90">
                  {p.highlights.map((h, hi) => (
                    <Hideable key={h} id={`equipe.${pi}.h.${hi}`} label={`Destaque ${hi + 1}`}>
                      <li className="flex gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        <EditableText id={`equipe.${pi}.h.${hi}.text`} as="span" multiline>{h}</EditableText>
                      </li>
                    </Hideable>
                  ))}
                </ul>
                <a href={p.linkedin} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:underline">
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </a>
              </div>
            </Hideable>
          ))}
        </div>

        <Hideable id="equipe.quote" label="Citação">
          <div className="mt-6 rounded-2xl border border-border bg-secondary/40 p-6 lg:p-8">
            <EditableText id="equipe.quote.text" as="p" multiline className="text-base lg:text-lg text-foreground/90">
              {"\"A Nexsuria acredita que resultados consistentes nascem da combinação entre experiência executiva, inovação, tecnologia e relacionamento próximo com cada cliente. Nossa equipe atua como consultora estratégica durante toda a jornada, garantindo que cada projeto gere valor real para o negócio.\""}
            </EditableText>
          </div>
        </Hideable>
      </section>
    </>
  );
}