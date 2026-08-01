import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import {
  ArrowUp,
  Bold,
  Eye,
  EyeOff,
  Palette,
  RotateCcw,
  Sliders,
  Type as TypeIcon,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { setActiveTarget } from "@/components/editable";
import { portal, usePortalStore, type ElStyle } from "@/lib/portal-store";


/* ------------------------------------------------------------------ *
 * Identificação estável de qualquer elemento dentro de uma sessão.
 * O id é o caminho de índices de filhos a partir do container da sessão
 * (`[data-doc-path]`), então nenhum arquivo de página precisa ser alterado
 * para que o objeto se torne editável.
 * ------------------------------------------------------------------ */

export function elementId(el: HTMLElement): string | null {
  const sec = el.closest<HTMLElement>("[data-doc-path]");
  if (!sec) return null;
  const path: number[] = [];
  let cur: HTMLElement = el;
  while (cur !== sec) {
    const parent: HTMLElement | null = cur.parentElement;
    if (!parent) return null;
    path.unshift(Array.prototype.indexOf.call(parent.children, cur));
    cur = parent;
  }
  return `${sec.dataset.docPath}|${path.join(".")}`;
}

export function resolveElement(id: string): HTMLElement | null {
  const [path, chain] = id.split("|");
  const sec = document.querySelector<HTMLElement>(`[data-doc-path="${path}"]`);
  if (!sec) return null;
  if (!chain) return sec;
  let cur: HTMLElement = sec;
  for (const raw of chain.split(".")) {
    const next = cur.children[Number(raw)] as HTMLElement | undefined;
    if (!next) return null;
    cur = next;
  }
  return cur;
}

/* ---------------------------- seleção ---------------------------- */

let selectedId: string | null = null;
const selListeners = new Set<() => void>();
export function selectElement(id: string | null) {
  selectedId = id;
  selListeners.forEach((l) => l());
}
function useSelectedId() {
  return useSyncExternalStore(
    (cb) => {
      selListeners.add(cb);
      return () => selListeners.delete(cb);
    },
    () => selectedId,
    () => null,
  );
}

/* ------------------------ aplicação de estilos ------------------------ */

const MANAGED = [
  "backgroundColor",
  "color",
  "width",
  "maxWidth",
  "height",
  "minHeight",
  "overflow",
  "borderRadius",
  "padding",
  "fontSize",
  "fontWeight",
  "borderColor",
  "borderWidth",
  "borderStyle",
  "display",
  "opacity",
] as const;

const touched = new Set<HTMLElement>();

function reset(el: HTMLElement) {
  MANAGED.forEach((p) => el.style.removeProperty(camelToKebab(p)));
}
function camelToKebab(s: string) {
  return s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

function applyStyles(styles: Record<string, ElStyle>, editMode: boolean) {
  touched.forEach(reset);
  touched.clear();
  Object.entries(styles).forEach(([id, st]) => {
    const el = resolveElement(id);
    if (!el) return;
    if (st.bg) el.style.setProperty("background-color", st.bg, "important");
    if (st.color) {
      el.style.setProperty("color", st.color, "important");
      el.querySelectorAll<HTMLElement>("*").forEach((child) => {
        child.style.setProperty("color", st.color!, "important");
        touched.add(child);
      });
    }
    if (st.w && st.w >= 120) {
      el.style.setProperty("width", `${st.w}px`, "important");
      el.style.setProperty("max-width", "100%", "important");
    }
    // min-height em vez de height: o bloco cresce se o conteúdo for maior,
    // então nada é cortado ao redimensionar.
    if (st.h) el.style.setProperty("min-height", `${st.h}px`, "important");
    if (st.radius != null) el.style.setProperty("border-radius", `${st.radius}px`, "important");
    if (st.pad != null) el.style.setProperty("padding", `${st.pad}px`, "important");
    if (st.fs) el.style.setProperty("font-size", `${st.fs}px`, "important");
    if (st.bold) el.style.setProperty("font-weight", "700", "important");
    if (st.border || st.borderW != null) {
      el.style.setProperty("border-style", "solid", "important");
      el.style.setProperty("border-width", `${st.borderW ?? 1}px`, "important");
      if (st.border) el.style.setProperty("border-color", st.border, "important");
    }
    if (st.hidden) {
      if (editMode) el.style.setProperty("opacity", "0.25", "important");
      else el.style.setProperty("display", "none", "important");
    }
    touched.add(el);
  });
}

/** Mantém os estilos salvos aplicados no DOM (view e apresentação). */
export function ElementStyleApplier() {
  const s = usePortalStore();
  const key = JSON.stringify(s.elStyles);
  useEffect(() => {
    let raf = 0;
    const run = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => applyStyles(s.elStyles, s.editMode));
    };
    run();
    const mo = new MutationObserver(run);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [key, s.editMode]);
  return null;
}

/* ------------------------------ paleta ------------------------------ */

const BRAND = [
  "#0A1F44", "#0057FF", "#2279D1", "#3A7BFF", "#5BA3E8", "#87CEFA",
  "#227981", "#7ABC82", "#636812", "#9A4EAE", "#5B3FD1", "#7A0277",
  "#FF6030", "#F99C92", "#FF6780", "#F5F7FA", "#E8EEF6", "#FFFFFF",
  "#333333", "#1A1A1A", "transparent",
];

function Swatches({ value, onPick }: { value?: string; onPick: (hex: string | undefined) => void }) {
  return (
    <div className="flex flex-wrap gap-1">
      {BRAND.map((hex) => (
        <button
          key={hex}
          type="button"
          title={hex}
          onClick={() => onPick(hex)}
          className={cn(
            "h-5 w-5 rounded border",
            value === hex ? "border-primary ring-2 ring-primary/40" : "border-border",
            hex === "transparent" && "bg-[linear-gradient(45deg,#ccc_25%,transparent_25%,transparent_75%,#ccc_75%),linear-gradient(45deg,#ccc_25%,transparent_25%,transparent_75%,#ccc_75%)] bg-[length:6px_6px] bg-[position:0_0,3px_3px]",
          )}
          style={hex === "transparent" ? undefined : { backgroundColor: hex }}
        />
      ))}
      <label className="h-5 w-5 rounded border border-border overflow-hidden cursor-pointer" title="Cor livre">
        <input
          type="color"
          value={value && value.startsWith("#") ? value : "#0057FF"}
          onChange={(e) => onPick(e.target.value)}
          className="h-8 w-8 -m-1 cursor-pointer"
        />
      </label>
      <button
        type="button"
        onClick={() => onPick(undefined)}
        className="text-[10px] px-1.5 rounded border border-border hover:bg-secondary"
      >
        Padrão
      </button>
    </div>
  );
}

function Range({
  label,
  value,
  min,
  max,
  onChange,
  onClear,
}: {
  label: string;
  value?: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  onClear: () => void;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
        <span>{label}</span>
        <span className="flex items-center gap-1">
          <span>{value != null ? `${Math.round(value)}px` : "auto"}</span>
          <button type="button" onClick={onClear} className="hover:text-foreground" title="Limpar">
            <RotateCcw className="h-3 w-3" />
          </button>
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value ?? min}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--primary)]"
      />
    </div>
  );
}

/* --------------------------- interações --------------------------- */

/** Seleção por clique, mini-toolbar flutuante e painel de propriedades. */
export function ElementEditor() {
  const s = usePortalStore();
  const id = useSelectedId();
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const st: ElStyle = (id && s.elStyles[id]) || {};

  // Escolhe o elemento clicado, ignorando o próprio editor e textos em edição.
  useEffect(() => {
    if (!s.editMode) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      if (t.closest("[data-nx-editor]")) return;
      if (t.isContentEditable || t.closest("[contenteditable='true']")) return;
      const next = elementId(t);
      if (!next) {
        selectElement(null);
        setActiveTarget(null);
        return;
      }
      if (t.closest("a")) e.preventDefault();
      selectElement(next);
      setPanelOpen(true);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      selectElement(null);
      setActiveTarget(null);
    };
    document.addEventListener("mousedown", onDown, true);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown, true);
      document.removeEventListener("keydown", onKey);
    };
  }, [s.editMode]);

  useEffect(() => {
    if (!s.editMode) {
      selectElement(null);
      setActiveTarget(null);
    }
  }, [s.editMode]);


  // Contorno de seleção acompanha rolagem/resize.
  useEffect(() => {
    if (!id) {
      setRect(null);
      return;
    }
    const update = () => {
      const el = resolveElement(id);
      setRect(el ? el.getBoundingClientRect() : null);
    };
    update();
    const t = setInterval(update, 300);
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      clearInterval(t);
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [id, s.elStyles]);

  const tag = useMemo(() => {
    if (!id) return "";
    const el = resolveElement(id);
    return el ? el.tagName.toLowerCase() : "";
  }, [id, s.elStyles]);

  if (!s.editMode || typeof document === "undefined") return null;
  const patch = (p: Partial<ElStyle>) => id && portal.patchElStyle(id, p);

  return createPortal(
    <div data-nx-editor="">
      {rect && (
        <div
          className="fixed pointer-events-none z-[9990] rounded-[4px] ring-2 ring-primary/80"
          style={{ top: rect.top - 2, left: rect.left - 2, width: rect.width + 4, height: rect.height + 4 }}
        />
      )}
      {/* Mini-toolbar flutuante */}
      {id && rect && (
        <div
          className="fixed z-[9992] flex items-center gap-1 rounded-full border border-border bg-popover/95 backdrop-blur px-2 py-1 shadow-lg"
          style={{
            top: Math.max(8, rect.top - 40),
            left: Math.min(Math.max(8, rect.left), window.innerWidth - 260),
          }}
        >
          <span className="text-[10px] font-mono text-muted-foreground pr-1">{tag}</span>
          <label className="h-6 w-6 rounded-md border border-border overflow-hidden" title="Cor de preenchimento">
            <input
              type="color"
              value={st.bg?.startsWith("#") ? st.bg : "#E8EEF6"}
              onChange={(e) => patch({ bg: e.target.value })}
              className="h-8 w-8 -m-1 cursor-pointer"
            />
          </label>
          <label className="h-6 w-6 rounded-md border border-border overflow-hidden" title="Cor do texto">
            <input
              type="color"
              value={st.color?.startsWith("#") ? st.color : "#0A1F44"}
              onChange={(e) => patch({ color: e.target.value })}
              className="h-8 w-8 -m-1 cursor-pointer"
            />
          </label>
          <button
            type="button"
            onClick={() => patch({ bold: !st.bold })}
            title="Negrito"
            className={cn("h-6 w-6 grid place-items-center rounded-md border", st.bold ? "border-primary bg-primary/10" : "border-border")}
          >
            <Bold className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => patch({ hidden: !st.hidden })}
            title={st.hidden ? "Mostrar objeto" : "Ocultar objeto"}
            className="h-6 w-6 grid place-items-center rounded-md border border-border"
          >
            {st.hidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => {
              const el = resolveElement(id);
              const parent = el?.parentElement;
              if (parent) {
                const pid = elementId(parent);
                if (pid) selectElement(pid);
              }
            }}
            title="Selecionar objeto pai"
            className="h-6 w-6 grid place-items-center rounded-md border border-border"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setPanelOpen((v) => !v)}
            title="Propriedades"
            className="h-6 w-6 grid place-items-center rounded-md border border-border"
          >
            <Sliders className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => id && portal.clearElStyle(id)}
            title="Restaurar padrão"
            className="h-6 w-6 grid place-items-center rounded-md border border-border"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Painel de propriedades */}
      {id && panelOpen && (
        <aside className="fixed right-3 top-20 bottom-6 z-[9991] w-72 overflow-y-auto rounded-xl border border-border bg-popover/97 backdrop-blur p-3 shadow-2xl text-popover-foreground space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wider">Propriedades</div>
            <button onClick={() => setPanelOpen(false)} className="p-1 rounded hover:bg-secondary" title="Fechar">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="text-[10px] font-mono text-muted-foreground break-all">{id}</div>

          <section className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
              <Palette className="h-3 w-3" /> Preenchimento
            </div>
            <Swatches value={st.bg} onPick={(hex) => patch({ bg: hex })} />
          </section>

          <section className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
              <TypeIcon className="h-3 w-3" /> Cor do texto
            </div>
            <Swatches value={st.color} onPick={(hex) => patch({ color: hex })} />
          </section>

          <section className="space-y-1.5">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Borda</div>
            <Swatches value={st.border} onPick={(hex) => patch({ border: hex })} />
            <Range label="Espessura" value={st.borderW} min={0} max={8} onChange={(v) => patch({ borderW: v })} onClear={() => patch({ borderW: undefined })} />
          </section>

          <section className="space-y-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Tamanho</div>
            <Range label="Largura" value={st.w} min={40} max={1400} onChange={(v) => patch({ w: v })} onClear={() => patch({ w: undefined })} />
            <Range label="Altura" value={st.h} min={20} max={900} onChange={(v) => patch({ h: v })} onClear={() => patch({ h: undefined })} />
            <Range label="Espaçamento interno" value={st.pad} min={0} max={80} onChange={(v) => patch({ pad: v })} onClear={() => patch({ pad: undefined })} />
            <Range label="Arredondamento" value={st.radius} min={0} max={48} onChange={(v) => patch({ radius: v })} onClear={() => patch({ radius: undefined })} />
            <Range label="Tamanho do texto" value={st.fs} min={10} max={72} onChange={(v) => patch({ fs: v })} onClear={() => patch({ fs: undefined })} />
          </section>

          <section className="flex items-center gap-2">
            <button
              onClick={() => patch({ bold: !st.bold })}
              className={cn("flex-1 rounded-md border px-2 py-1.5 text-xs", st.bold ? "border-primary bg-primary/10" : "border-border hover:bg-secondary")}
            >
              Negrito
            </button>
            <button
              onClick={() => patch({ hidden: !st.hidden })}
              className={cn("flex-1 rounded-md border px-2 py-1.5 text-xs", st.hidden ? "border-destructive text-destructive" : "border-border hover:bg-secondary")}
            >
              {st.hidden ? "Mostrar" : "Ocultar"}
            </button>
          </section>

          <button
            onClick={() => portal.clearElStyle(id)}
            className="w-full rounded-md border border-border px-2 py-1.5 text-xs hover:bg-secondary"
          >
            Restaurar este objeto
          </button>
        </aside>
      )}
    </div>,
    document.body,
  );
}
