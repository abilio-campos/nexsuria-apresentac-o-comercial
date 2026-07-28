import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { portal, usePortalStore, type MarkCategory, DEPARTAMENTO_SUGGESTIONS } from "@/lib/portal-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { AlertTriangle, Sparkles, Circle, Copy, Trash2, Check, Plus, Printer } from "lucide-react";

export const Route = createFileRoute("/percepcoes")({
  head: () => ({
    meta: [
      { title: "Percepções do Cliente — Nexsuria" },
      { name: "description", content: "Colete dores e oportunidades identificadas durante a apresentação — via marcações nos itens ou anotações livres." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PercepcoesPage,
});

const CATS: { key: MarkCategory; label: string; className: string }[] = [
  { key: "pain", label: "Dor", className: "border-destructive/50 text-destructive bg-destructive/10" },
  { key: "opportunity", label: "Oportunidade", className: "border-primary/50 text-primary bg-primary/10" },
  { key: "neutral", label: "Observação", className: "border-border text-muted-foreground bg-secondary" },
];

function PercepcoesPage() {
  const s = usePortalStore();
  const [copied, setCopied] = useState(false);

  const grouped = useMemo(() => {
    const entries = Object.entries(s.marks).sort((a, b) => a[1].ts - b[1].ts);
    const byPage = new Map<string, { id: string; mark: (typeof s.marks)[string] }[]>();
    for (const [id, mark] of entries) {
      if (!byPage.has(mark.page)) byPage.set(mark.page, []);
      byPage.get(mark.page)!.push({ id, mark });
    }
    return Array.from(byPage.entries());
  }, [s.marks]);

  const pains = Object.values(s.marks).filter((m) => m.category === "pain");
  const opps = Object.values(s.marks).filter((m) => m.category === "opportunity");
  const total = Object.keys(s.marks).length;

  function buildReport(): string {
    const p = s.perceptions;
    const lines: string[] = [];
    lines.push("PERCEPÇÕES — NEXSURIA");
    lines.push("");
    if (p.company) lines.push(`Empresa: ${p.company}`);
    if (p.contact) lines.push(`Contato: ${p.contact}`);
    lines.push(`Data: ${new Date().toLocaleDateString("pt-BR")}`);
    lines.push("");
    const entries = s.visitEntries.filter(
      (e) => e.departamento || e.responsavel || e.dores || e.oportunidades,
    );
    if (entries.length) {
      lines.push("REGISTRO DA VISITA");
      entries.forEach((e, i) => {
        lines.push(`${i + 1}. Departamento: ${e.departamento || "-"} | Responsável: ${e.responsavel || "-"}`);
        if (e.dores) lines.push(`   Dores: ${e.dores}`);
        if (e.oportunidades) lines.push(`   Oportunidades: ${e.oportunidades}`);
      });
      lines.push("");
    }
    const dor = Object.values(s.marks).filter((m) => m.category === "pain");
    const opo = Object.values(s.marks).filter((m) => m.category === "opportunity");
    const obs = Object.values(s.marks).filter((m) => m.category === "neutral");
    if (dor.length) {
      lines.push("DORES IDENTIFICADAS (marcações da apresentação)");
      dor.forEach((m) => lines.push(`- [${m.page}] ${m.label}${m.note ? ` — ${m.note}` : ""}`));
      lines.push("");
    }
    if (p.painsFree.trim()) {
      lines.push("DORES (livre)");
      lines.push(p.painsFree.trim());
      lines.push("");
    }
    if (opo.length) {
      lines.push("OPORTUNIDADES IDENTIFICADAS (marcações da apresentação)");
      opo.forEach((m) => lines.push(`- [${m.page}] ${m.label}${m.note ? ` — ${m.note}` : ""}`));
      lines.push("");
    }
    if (p.opportunitiesFree.trim()) {
      lines.push("OPORTUNIDADES (livre)");
      lines.push(p.opportunitiesFree.trim());
      lines.push("");
    }
    if (obs.length) {
      lines.push("OBSERVAÇÕES");
      obs.forEach((m) => lines.push(`- [${m.page}] ${m.label}${m.note ? ` — ${m.note}` : ""}`));
      lines.push("");
    }
    if (p.notes.trim()) {
      lines.push("ANOTAÇÕES GERAIS");
      lines.push(p.notes.trim());
    }
    return lines.join("\n");
  }

  async function copyReport() {
    try {
      await navigator.clipboard.writeText(buildReport());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  }

  function esc(v: string): string {
    return (v ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function printAta() {
    const p = s.perceptions;
    const dor = Object.values(s.marks).filter((m) => m.category === "pain");
    const opo = Object.values(s.marks).filter((m) => m.category === "opportunity");
    const obs = Object.values(s.marks).filter((m) => m.category === "neutral");
    const entries = s.visitEntries.filter(
      (e) => e.departamento || e.responsavel || e.dores || e.oportunidades,
    );
    const today = new Date().toLocaleDateString("pt-BR");
    const title = p.company ? `Reunião Nexsuria · ${p.company}` : "Reunião Nexsuria";

    const participantes = [
      "Abilio · Nexsuria",
      p.contact ? `${p.contact}${p.company ? " · " + p.company : ""}` : "",
    ].filter(Boolean);

    const pautaItems = Array.from(new Set(Object.values(s.marks).map((m) => m.page)));
    const pautaHtml = pautaItems.length
      ? pautaItems
          .map(
            (pg, i) =>
              `<li><span class="pauta-num">${i + 1}</span> ${esc(pg)}</li>`,
          )
          .join("")
      : `<li><span class="pauta-num">1</span> Apresentação institucional Nexsuria</li>`;

    const decisoesHtml = entries.length
      ? entries
          .filter((e) => e.oportunidades)
          .map(
            (e) =>
              `<li><span class="decisao-icon">✔</span> <strong>${esc(e.departamento || "Departamento")}:</strong> ${esc(e.oportunidades)}</li>`,
          )
          .join("") ||
        `<li><span class="decisao-icon">✔</span> Registro de oportunidades em andamento</li>`
      : opo.length
        ? opo
            .map(
              (m) =>
                `<li><span class="decisao-icon">✔</span> ${esc(m.label)}${m.note ? " — " + esc(m.note) : ""}</li>`,
            )
            .join("")
        : `<li><span class="decisao-icon">✔</span> Sem decisões registradas</li>`;

    const actionRows: string[] = [];
    let idx = 1;
    entries.forEach((e) => {
      if (e.oportunidades) {
        actionRows.push(
          `<tr><td>${idx++}</td><td>${esc(e.oportunidades)}${e.departamento ? ` <em style="color:#8899BB">(${esc(e.departamento)})</em>` : ""}</td><td><span class="badge-resp">${esc(e.responsavel || "A definir")}</span></td><td><span class="empty">—</span></td></tr>`,
        );
      }
    });
    opo.forEach((m) => {
      actionRows.push(
        `<tr><td>${idx++}</td><td>${esc(m.label)}${m.note ? " — " + esc(m.note) : ""}</td><td><span class="badge-resp">Nexsuria</span></td><td><span class="badge-prazo">${esc(m.page)}</span></td></tr>`,
      );
    });
    if (!actionRows.length) {
      actionRows.push(
        `<tr><td>1</td><td>Nenhuma ação registrada</td><td><span class="empty">—</span></td><td><span class="empty">—</span></td></tr>`,
      );
    }

    const pendenciasList: string[] = [];
    entries.forEach((e) => {
      if (e.dores)
        pendenciasList.push(
          `<li><span class="pendencia-icon">⚠</span> <strong>${esc(e.departamento || "Departamento")}:</strong> ${esc(e.dores)}${e.responsavel ? ` <em style="color:#8899BB">— ${esc(e.responsavel)}</em>` : ""}</li>`,
        );
    });
    dor.forEach((m) =>
      pendenciasList.push(
        `<li><span class="pendencia-icon">⚠</span> [${esc(m.page)}] ${esc(m.label)}${m.note ? " — " + esc(m.note) : ""}</li>`,
      ),
    );
    if (p.painsFree.trim())
      pendenciasList.push(
        `<li><span class="pendencia-icon">⚠</span> ${esc(p.painsFree.trim()).replace(/\n/g, "<br>")}</li>`,
      );

    const obsHtml = obs.length
      ? `<div class="section"><div class="section-title">Observações</div><ul class="pendencias-list">${obs
          .map(
            (m) =>
              `<li><span class="pendencia-icon" style="color:#8899BB">•</span> [${esc(m.page)}] ${esc(m.label)}${m.note ? " — " + esc(m.note) : ""}</li>`,
          )
          .join("")}</ul></div>`
      : "";

    const notesHtml = p.notes.trim()
      ? `<div class="section"><div class="section-title">Anotações Gerais</div><div style="font-size:14px;color:#2D3A52;line-height:1.6;white-space:pre-wrap">${esc(p.notes.trim())}</div></div>`
      : "";

    const html = `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"/><title>Ata — ${esc(title)}</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',Arial,sans-serif;background:#F4F6F9;color:#1A2233;min-height:100vh;padding:32px 16px}
.ata-container{max-width:860px;margin:0 auto;background:#fff;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,.09);overflow:hidden}
.ata-header{background:#0A1628;color:#fff;padding:36px 40px 28px}
.ata-header .label{font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#C9A84C;margin-bottom:8px}
.ata-header h1{font-size:24px;font-weight:700;margin-bottom:20px;line-height:1.3}
.meta-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;margin-top:8px}
.meta-item{display:flex;flex-direction:column;gap:3px}
.meta-item .meta-label{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#8899BB;font-weight:600}
.meta-item .meta-value{font-size:14px;color:#E8EDF5;font-weight:500}
.ata-body{padding:0 40px 40px}
.section{margin-top:36px;border-left:3px solid #C9A84C;padding-left:18px}
.section-title{font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#C9A84C;margin-bottom:14px}
.participants-list{display:flex;flex-wrap:wrap;gap:10px}
.participant-chip{background:#F0F4FA;border:1px solid #D8E2F0;border-radius:20px;padding:6px 14px;font-size:13px;color:#1A2233;font-weight:500}
.pauta-list,.decisoes-list,.pendencias-list{list-style:none}
.pauta-list li{padding:10px 0;border-bottom:1px solid #F0F2F6;font-size:14px;color:#2D3A52;display:flex;align-items:flex-start;gap:10px}
.pauta-list li:last-child{border-bottom:none}
.pauta-num{min-width:24px;height:24px;background:#0A1628;color:#C9A84C;border-radius:50%;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;margin-top:1px}
.decisoes-list li{padding:10px 0;border-bottom:1px dashed #E8ECF4;font-size:14px;color:#1A2233;display:flex;gap:10px;align-items:flex-start}
.decisoes-list li:last-child{border-bottom:none}
.decisao-icon{min-width:20px;color:#27AE60;font-size:16px;margin-top:1px}
.action-table{width:100%;border-collapse:collapse;font-size:13px}
.action-table th{background:#0A1628;color:#C9A84C;text-align:left;padding:10px 14px;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;font-weight:700}
.action-table td{padding:10px 14px;border-bottom:1px solid #F0F2F6;vertical-align:top;color:#2D3A52}
.action-table tr:last-child td{border-bottom:none}
.action-table tr:nth-child(even) td{background:#F8FAFD}
.badge-prazo{display:inline-block;background:#FFF3DC;color:#B07C00;border-radius:4px;padding:2px 8px;font-size:11px;font-weight:600}
.badge-resp{display:inline-block;background:#E8F0FE;color:#1A4099;border-radius:4px;padding:2px 8px;font-size:11px;font-weight:600}
.pendencias-list li{padding:10px 0;border-bottom:1px dashed #E8ECF4;font-size:14px;color:#1A2233;display:flex;gap:10px;align-items:flex-start}
.pendencias-list li:last-child{border-bottom:none}
.pendencia-icon{min-width:20px;color:#E67E22;font-size:16px;margin-top:1px}
.ata-footer{background:#F4F6F9;border-top:1px solid #E0E6EF;padding:20px 40px;display:flex;justify-content:space-between;align-items:center}
.ata-footer .footer-brand{font-size:12px;font-weight:700;color:#0A1628;letter-spacing:1px}
.ata-footer .footer-gen{font-size:11px;color:#8899BB}
.empty{color:#B0BAD0;font-style:italic;font-size:13px}
.btn-print{display:block;margin:28px auto 12px;padding:10px 28px;background:#0A1628;color:#C9A84C;border:none;border-radius:6px;font-size:13px;font-weight:700;letter-spacing:1px;cursor:pointer;text-transform:uppercase}
.btn-print:hover{background:#162040}
@media print{body{background:#fff;padding:0}.ata-container{box-shadow:none;border-radius:0}.btn-print{display:none}}
</style></head><body>
<div class="ata-container">
  <div class="ata-header">
    <div class="label">Nexsuria · Ata de Reunião</div>
    <h1>${esc(title)}</h1>
    <div class="meta-grid">
      <div class="meta-item"><span class="meta-label">Data</span><span class="meta-value">${esc(today)}</span></div>
      <div class="meta-item"><span class="meta-label">Empresa</span><span class="meta-value">${esc(p.company || "Não informado")}</span></div>
      <div class="meta-item"><span class="meta-label">Contato</span><span class="meta-value">${esc(p.contact || "Não informado")}</span></div>
      <div class="meta-item"><span class="meta-label">Elaborada por</span><span class="meta-value">Nexsuria</span></div>
    </div>
  </div>
  <div class="ata-body">
    <div class="section">
      <div class="section-title">Participantes</div>
      <div class="participants-list">
        ${participantes.map((x) => `<span class="participant-chip">${esc(x)}</span>`).join("")}
      </div>
    </div>
    <div class="section">
      <div class="section-title">Pauta</div>
      <ul class="pauta-list">${pautaHtml}</ul>
    </div>
    <div class="section">
      <div class="section-title">Decisões / Oportunidades</div>
      <ul class="decisoes-list">${decisoesHtml}</ul>
    </div>
    <div class="section">
      <div class="section-title">Próximos Passos / Action Items</div>
      <table class="action-table">
        <thead><tr><th>#</th><th>Ação</th><th>Responsável</th><th>Referência</th></tr></thead>
        <tbody>${actionRows.join("")}</tbody>
      </table>
    </div>
    ${
      pendenciasList.length
        ? `<div class="section"><div class="section-title">Dores / Pendências</div><ul class="pendencias-list">${pendenciasList.join("")}</ul></div>`
        : ""
    }
    ${obsHtml}
    ${notesHtml}
  </div>
  <div class="ata-footer">
    <span class="footer-brand">NEXSURIA</span>
    <span class="footer-gen">Gerado automaticamente · ${esc(today)}</span>
  </div>
</div>
<button class="btn-print" onclick="window.print()">Imprimir / Salvar PDF</button>
</body></html>`;

    const w = window.open("", "_blank");
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
  }

  return (
    <>
      <PageHeader
        id="percepcoes"
        eyebrow="Fechamento"
        title="Percepções do Cliente"
        description="Registre dores e oportunidades detectadas durante a apresentação. Marque diretamente nos itens de cada página (botão “Marcar”) ou preencha os campos livres abaixo."
      />

      <section className="percepcoes-page mx-auto max-w-6xl px-4 lg:px-8 py-10 space-y-8">
        {/* Identificação */}
        <div className="rounded-2xl border border-border bg-card p-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Empresa / Prospect</label>
            <Input
              value={s.perceptions.company}
              onChange={(e) => portal.setPerception("company", e.target.value)}
              placeholder="Nome da empresa"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Contato principal</label>
            <Input
              value={s.perceptions.contact}
              onChange={(e) => portal.setPerception("contact", e.target.value)}
              placeholder="Nome · cargo"
              className="mt-1"
            />
          </div>
        </div>

        {/* Resumo */}
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
            <div className="text-xs uppercase tracking-widest text-destructive/80">Dores marcadas</div>
            <div className="mt-1 text-3xl font-semibold text-destructive">{pains.length}</div>
          </div>
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
            <div className="text-xs uppercase tracking-widest text-primary/80">Oportunidades marcadas</div>
            <div className="mt-1 text-3xl font-semibold text-primary">{opps.length}</div>
          </div>
          <div className="rounded-2xl border border-border bg-secondary/40 p-4">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Total de marcações</div>
            <div className="mt-1 text-3xl font-semibold">{total}</div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={copyReport} variant="default">
            {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            {copied ? "Copiado!" : "Copiar relatório"}
          </Button>
          <Button onClick={printAta} variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Imprimir ata
          </Button>
          {total > 0 && (
            <Button
              variant="outline"
              onClick={() => {
                if (confirm("Limpar todas as marcações e anotações desta sessão?")) portal.clearAllMarks();
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar sessão
            </Button>
          )}
        </div>

        {/* Itens marcados */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-semibold">Itens marcados na apresentação</h2>
          <p className="text-sm text-muted-foreground">
            Classifique cada marcação como <span className="text-destructive font-medium">Dor</span>,{" "}
            <span className="text-primary font-medium">Oportunidade</span> ou Observação, e adicione notas rápidas.
          </p>
          {grouped.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-border bg-secondary/30 p-6 text-center text-sm text-muted-foreground">
              Nenhum item marcado ainda. Navegue pela apresentação e clique em{" "}
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-medium">
                <Circle className="h-3 w-3" /> Marcar
              </span>{" "}
              nos cards que fizerem sentido para esta empresa.
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              {grouped.map(([page, items]) => (
                <div key={page}>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">{page}</div>
                  <ul className="space-y-2">
                    {items.map(({ id, mark }) => (
                      <li key={id} className="rounded-xl border border-border bg-secondary/30 p-3">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium">{mark.label}</div>
                          </div>
                          <div className="flex items-center gap-1">
                            {CATS.map((c) => (
                              <button
                                key={c.key}
                                onClick={() => portal.setMarkCategory(id, c.key)}
                                className={cn(
                                  "text-[11px] rounded-full border px-2 py-0.5 transition-colors",
                                  mark.category === c.key ? c.className : "border-border text-muted-foreground hover:bg-secondary",
                                )}
                              >
                                {c.label}
                              </button>
                            ))}
                            <button
                              onClick={() => portal.clearMark(id)}
                              className="ml-1 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                              title="Remover marcação"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        <Input
                          value={mark.note ?? ""}
                          onChange={(e) => portal.setMarkNote(id, e.target.value)}
                          placeholder="Nota rápida (ex.: cliente mencionou impacto R$X, prazo Y…)"
                          className="mt-2 h-8 text-sm"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Registro da visita */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h2 className="font-semibold">Registro da visita</h2>
              <p className="text-sm text-muted-foreground">
                Até 15 linhas por visita. Selecione ou digite o Departamento, Responsável, Dores e Oportunidades. Ficam salvos em memória do navegador (futuramente irão para o banco de dados).
              </p>
            </div>
            <div className="text-xs text-muted-foreground">
              {s.visitEntries.length}/15 linhas
            </div>
          </div>

          <datalist id="dl-departamentos">
            {DEPARTAMENTO_SUGGESTIONS.map((d) => <option key={d} value={d} />)}
          </datalist>
          <datalist id="dl-responsaveis">
            {Array.from(new Set(s.visitEntries.map((e) => e.responsavel).filter(Boolean))).map((v) => (
              <option key={v} value={v} />
            ))}
          </datalist>
          <datalist id="dl-dores">
            {Array.from(new Set(s.visitEntries.map((e) => e.dores).filter(Boolean))).map((v) => (
              <option key={v} value={v} />
            ))}
          </datalist>
          <datalist id="dl-oportunidades">
            {Array.from(new Set(s.visitEntries.map((e) => e.oportunidades).filter(Boolean))).map((v) => (
              <option key={v} value={v} />
            ))}
          </datalist>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-widest text-muted-foreground">
                  <th className="w-8 pb-2">#</th>
                  <th className="pb-2 pr-2">Departamento</th>
                  <th className="pb-2 pr-2">Responsável</th>
                  <th className="pb-2 pr-2">Dores</th>
                  <th className="pb-2 pr-2">Oportunidades</th>
                  <th className="w-10 pb-2"></th>
                </tr>
              </thead>
              <tbody>
                {s.visitEntries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-sm text-muted-foreground">
                      Nenhuma linha ainda. Clique em “Adicionar linha” para começar.
                    </td>
                  </tr>
                ) : (
                  s.visitEntries.map((e, i) => (
                    <tr key={e.id} className="align-top">
                      <td className="py-1 pr-2 text-muted-foreground">{i + 1}</td>
                      <td className="py-1 pr-2">
                        <Input
                          list="dl-departamentos"
                          value={e.departamento}
                          onChange={(ev) => portal.updateVisitEntry(e.id, { departamento: ev.target.value.slice(0, 80) })}
                          placeholder="Selecione ou digite"
                          className="h-9"
                        />
                      </td>
                      <td className="py-1 pr-2">
                        <Input
                          list="dl-responsaveis"
                          value={e.responsavel}
                          onChange={(ev) => portal.updateVisitEntry(e.id, { responsavel: ev.target.value.slice(0, 80) })}
                          placeholder="Nome · cargo"
                          className="h-9"
                        />
                      </td>
                      <td className="py-1 pr-2">
                        <Input
                          list="dl-dores"
                          value={e.dores}
                          onChange={(ev) => portal.updateVisitEntry(e.id, { dores: ev.target.value.slice(0, 240) })}
                          placeholder="Ex.: retrabalho fiscal…"
                          className="h-9"
                        />
                      </td>
                      <td className="py-1 pr-2">
                        <Input
                          list="dl-oportunidades"
                          value={e.oportunidades}
                          onChange={(ev) => portal.updateVisitEntry(e.id, { oportunidades: ev.target.value.slice(0, 240) })}
                          placeholder="Ex.: automação com IA…"
                          className="h-9"
                        />
                      </td>
                      <td className="py-1">
                        <button
                          onClick={() => portal.removeVisitEntry(e.id)}
                          className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                          title="Remover linha"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => portal.addVisitEntry()}
              disabled={s.visitEntries.length >= 15}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar linha
            </Button>
          </div>
        </div>

        {/* Campos livres */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-destructive/30 bg-card p-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-destructive">
              <AlertTriangle className="h-4 w-4" /> Dores (anotação livre)
            </div>
            <Textarea
              value={s.perceptions.painsFree}
              onChange={(e) => portal.setPerception("painsFree", e.target.value)}
              placeholder="Ex.: retrabalho na apuração fiscal, alta rotatividade no RH, ERP defasado…"
              className="mt-3 min-h-[140px]"
            />
          </div>
          <div className="rounded-2xl border border-primary/30 bg-card p-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary">
              <Sparkles className="h-4 w-4" /> Oportunidades (anotação livre)
            </div>
            <Textarea
              value={s.perceptions.opportunitiesFree}
              onChange={(e) => portal.setPerception("opportunitiesFree", e.target.value)}
              placeholder="Ex.: automação com IA no atendimento, BI executivo, revisão fiscal…"
              className="mt-3 min-h-[140px]"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Anotações gerais da reunião</div>
          <Textarea
            value={s.perceptions.notes}
            onChange={(e) => portal.setPerception("notes", e.target.value)}
            placeholder="Contexto, próximos passos combinados, quem participou, prazos…"
            className="mt-3 min-h-[120px]"
          />
        </div>
      </section>
    </>
  );
}