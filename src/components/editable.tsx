import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode, type FocusEvent, type KeyboardEvent, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { portal, registerText, usePortalStore } from "@/lib/portal-store";
import { cn } from "@/lib/utils";

/* --------------------------------------------------------------- *
 * Seleção de objeto no modo edição: os controles (arrastar,
 * redimensionar, restaurar) só aparecem no objeto selecionado,
 * evitando a poluição visual de todos os marcadores ao mesmo tempo.
 * --------------------------------------------------------------- */
let activeTarget: string | null = null;
const targetListeners = new Set<() => void>();

export function setActiveTarget(id: string | null) {
  if (activeTarget === id) return;
  activeTarget = id;
  targetListeners.forEach((l) => l());
}

export function useActiveTarget() {
  return useSyncExternalStore(
    (cb) => {
      targetListeners.add(cb);
      return () => targetListeners.delete(cb);
    },
    () => activeTarget,
    () => null,
  );
}


const EDIT_PALETTE = [
  "#2279D1", "#0A1F44", "#0057FF", "#227981", "#3A7BFF",
  "#5BA3E8", "#87CEFA", "#9A4EAE", "#7A0277", "#5B3FD1",
  "#400080", "#CE93D8", "#B39DDB", "#636812", "#7ABC82",
  "#FF6030", "#F99C92", "#FF6780",
  "#333333", "#1A1A1A", "#FFFFFF",
];

const SIZE_OPTIONS: { key: string; label: string; em: string }[] = [
  { key: "sm", label: "P", em: "0.85em" },
  { key: "md", label: "M", em: "1em" },
  { key: "lg", label: "G", em: "1.35em" },
  { key: "xl", label: "GG", em: "1.75em" },
];
const SIZE_MAP: Record<string, string> = Object.fromEntries(SIZE_OPTIONS.map((s) => [s.key, s.em]));

function hasHTML(s: string) {
  return /<[a-z][\s\S]*>/i.test(s);
}

type Props = {
  id: string;
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4" | "div";
  children: string;
  className?: string;
  multiline?: boolean;
};

export function EditableText({ id, as = "span", children, className, multiline }: Props) {
  const s = usePortalStore();
  const Tag = as as any;
  const value = s.texts[id] ?? children;
  const color = s.textColors[id];
  const sizeKey = s.texts[`__size__${id}`];
  const sizeEm = sizeKey ? SIZE_MAP[sizeKey] : undefined;
  const ref = useRef<HTMLElement>(null);
  const [focused, setFocused] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const [dragged, setDragged] = useState(false);
  const dragRef = useRef<{ dx: number; dy: number } | null>(null);
  const savedRangeRef = useRef<Range | null>(null);

  const rangeBelongsToEditor = (range: Range) => {
    const el = ref.current;
    if (!el) return false;
    const start = range.startContainer.nodeType === Node.ELEMENT_NODE
      ? range.startContainer
      : range.startContainer.parentNode;
    const end = range.endContainer.nodeType === Node.ELEMENT_NODE
      ? range.endContainer
      : range.endContainer.parentNode;
    return Boolean(start && end && el.contains(start) && el.contains(end));
  };

  const rememberSelection = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
    const range = sel.getRangeAt(0);
    if (rangeBelongsToEditor(range)) savedRangeRef.current = range.cloneRange();
  };

  const restoreSelection = () => {
    const sel = window.getSelection();
    const saved = savedRangeRef.current;
    if (!sel || !saved || !rangeBelongsToEditor(saved) || saved.collapsed) return null;
    sel.removeAllRanges();
    sel.addRange(saved);
    return saved;
  };

  const getEditableRange = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
      const range = sel.getRangeAt(0);
      if (rangeBelongsToEditor(range)) return range;
    }
    return restoreSelection();
  };

  const forceDescendantsToInheritSize = (root: HTMLElement) => {
    root.querySelectorAll<HTMLElement>("*").forEach((node) => {
      node.style.fontSize = "inherit";
    });
  };

  useEffect(() => {
    if (!focused || !ref.current || dragged) return;
    const PALETTE_W = 240;
    const PALETTE_H = 180;
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const spaceBelow = vh - r.bottom;
      const top = spaceBelow > PALETTE_H + 12 ? r.bottom + 6 : Math.max(8, r.top - PALETTE_H - 6);
      const left = Math.min(Math.max(8, r.left), vw - PALETTE_W - 8);
      setPos({ top, left });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [focused, dragged]);

  useEffect(() => {
    if (!focused) setDragged(false);
  }, [focused]);

  const onDragStart = (e: React.MouseEvent) => {
    if (!pos) return;
    e.preventDefault();
    dragRef.current = { dx: e.clientX - pos.left, dy: e.clientY - pos.top };
    const onMove = (ev: MouseEvent) => {
      const d = dragRef.current;
      if (!d) return;
      const left = Math.min(Math.max(0, ev.clientX - d.dx), window.innerWidth - 240);
      const top = Math.min(Math.max(0, ev.clientY - d.dy), window.innerHeight - 40);
      setDragged(true);
      setPos({ top, left });
    };
    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  useEffect(() => {
    registerText(id, children);
  }, [id, children]);

  // Keep DOM in sync when store changes and we're NOT actively editing this node
  useEffect(() => {
    if (!ref.current) return;
    if (document.activeElement === ref.current) return;
    if (hasHTML(value)) {
      if (ref.current.innerHTML !== value) ref.current.innerHTML = value;
    } else if (ref.current.innerText !== value) {
      ref.current.innerText = value;
    }
  }, [value]);

  const style: CSSProperties = {};
  if (color) style.color = color;
  if (sizeEm) style.fontSize = sizeEm;

  if (!s.editMode) {
    if (hasHTML(value)) {
      return <Tag className={className} style={style} dangerouslySetInnerHTML={{ __html: value }} />;
    }
    return <Tag className={className} style={style}>{value}</Tag>;
  }

  const applyColorToSelection = (hex: string) => {
    const el = ref.current;
    if (!el) return;
    const range = getEditableRange();
    if (range) {
      try {
        document.execCommand("styleWithCSS", false, "true");
        document.execCommand("foreColor", false, hex);
        rememberSelection();
      } catch {}
      // Do NOT setText here — a re-render would wipe the selection.
      // The updated HTML is committed on blur.
    } else {
      portal.setTextColor(id, hex);
    }
  };

  const applySize = (key: string) => {
    const el = ref.current;
    const em = SIZE_MAP[key];
    if (el && em) {
      const range = getEditableRange();
      const sel = window.getSelection();
      if (range) {
      const span = document.createElement("span");
      span.style.fontSize = em;
      try {
        span.appendChild(range.extractContents());
        forceDescendantsToInheritSize(span);
        range.insertNode(span);
        // reselect the inserted span content
        const newRange = document.createRange();
        newRange.selectNodeContents(span);
        sel?.removeAllRanges();
        sel?.addRange(newRange);
        savedRangeRef.current = newRange.cloneRange();
      } catch {
        portal.setText(`__size__${id}`, key);
      }
      // Commit the HTML change immediately so it persists
      portal.setText(id, el.innerHTML);
      return;
      }
    }
    portal.setText(`__size__${id}`, key);
  };
  const clearSize = () => portal.resetText(`__size__${id}`);

  // Negrito: aplica na seleção; sem seleção, alterna o negrito do item todo.
  const applyBold = () => {
    const el = ref.current;
    if (!el) return;
    const range = getEditableRange();
    if (range) {
      try {
        document.execCommand("styleWithCSS", false, "true");
        document.execCommand("bold");
        rememberSelection();
      } catch {}
      portal.setText(id, el.innerHTML);
      return;
    }
    const html = el.innerHTML;
    const isBold = /^\s*<(strong|b)[^>]*>[\s\S]*<\/(strong|b)>\s*$/i.test(html);
    el.innerHTML = isBold ? html.replace(/^\s*<(strong|b)[^>]*>([\s\S]*)<\/(strong|b)>\s*$/i, "$2") : `<strong>${html}</strong>`;
    portal.setText(id, el.innerHTML);
  };


  return (
    <span className="relative inline-block align-baseline" style={{ maxWidth: "100%" }}>
    <Tag
      ref={ref as any}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      style={style}
      className={cn(
        "outline-none rounded-sm ring-1 ring-dashed ring-primary/50 hover:ring-primary focus:ring-2 focus:ring-primary bg-primary/5",
        className,
      )}
      onFocus={() => setFocused(true)}
      onMouseUp={rememberSelection}
      onKeyUp={rememberSelection}
      onBlur={(e: FocusEvent<HTMLElement>) => {
        setTimeout(() => setFocused(false), 150);
        savedRangeRef.current = null;
        const el = e.currentTarget as HTMLElement;
        const html = el.innerHTML;
        const text = el.innerText;
        const next = hasHTML(html)
          ? html
          : multiline
            ? text
            : text.replace(/\n/g, " ").trim();
        if (next !== value) portal.setText(id, next);
      }}
      onKeyDown={(e: KeyboardEvent<HTMLElement>) => {
        if (!multiline && e.key === "Enter") {
          e.preventDefault();
          (e.currentTarget as HTMLElement).blur();
        }
      }}
      // Render HTML as HTML (not escaped text). React only re-applies this
      // when the string actually changes, and never while the user is typing
      // (state only updates on blur), so selection/cursor are preserved.
      dangerouslySetInnerHTML={{ __html: value }}
    />
    {focused && pos && typeof document !== "undefined" && createPortal(
      <div
        onMouseDown={(e) => e.preventDefault()}
        style={{ position: "fixed", top: pos.top, left: pos.left, width: 240 }}
        className="z-[9999] flex flex-wrap items-center gap-1 rounded-md border border-border bg-popover text-popover-foreground shadow-lg p-1.5"
      >
        <div
          onMouseDown={onDragStart}
          className="w-full flex items-center justify-between gap-2 px-1 pb-1 cursor-move select-none"
          title="Arraste para mover"
        >
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            ⋮⋮ Cor (item ou seleção)
          </span>
          {dragged && (
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onClick={() => setDragged(false)}
              className="text-[10px] px-1.5 py-0.5 rounded border border-border hover:bg-secondary"
            >
              Reposicionar
            </button>
          )}
        </div>
        {EDIT_PALETTE.map((hex) => (
          <button
            key={hex}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => applyColorToSelection(hex)}
            title={hex}
            className="h-5 w-5 rounded border border-border hover:scale-110 transition-transform"
            style={{ backgroundColor: hex }}
          />
        ))}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            portal.setTextColor(id, null);
            const el = ref.current;
            if (el && hasHTML(el.innerHTML)) {
              el.innerHTML = el.innerText;
              portal.setText(id, el.innerText);
            }
          }}
          className="ml-auto text-[10px] px-1.5 py-0.5 rounded border border-border hover:bg-secondary"
        >
          Limpar
        </button>
        <span className="w-full text-[10px] uppercase tracking-wider text-muted-foreground px-1 pt-2 pb-1 border-t border-border mt-1">
          Estilo
        </span>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={applyBold}
          title="Negrito (seleção ou item inteiro)"
          className="h-6 min-w-8 px-1.5 rounded border border-border text-[12px] font-bold hover:bg-secondary"
        >
          B
        </button>
        <span className="w-full text-[10px] uppercase tracking-wider text-muted-foreground px-1 pt-2 pb-1 border-t border-border mt-1">
          Tamanho
        </span>

        {SIZE_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => applySize(opt.key)}
            title={`Tamanho ${opt.label}`}
            className={cn(
              "h-6 min-w-8 px-1.5 rounded border text-[11px] font-medium hover:bg-secondary",
              sizeKey === opt.key ? "border-primary bg-primary/10" : "border-border",
            )}
          >
            {opt.label}
          </button>
        ))}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={clearSize}
          className="ml-auto text-[10px] px-1.5 py-0.5 rounded border border-border hover:bg-secondary"
        >
          Padrão
        </button>
      </div>,
      document.body,
    )}
    </span>
  );
}

export function Hideable({ id, children, label }: { id: string; children: ReactNode; label?: string }) {
  const s = usePortalStore();
  const hidden = s.texts[`__hidden__${id}`] === "1";
  const pos = s.positions[id];
  const wrapperRef = useRef<HTMLDivElement>(null);

  const startDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const start = { x: e.clientX, y: e.clientY };
    const base = pos ?? { x: 0, y: 0 };
    const onMove = (ev: MouseEvent) => {
      const nx = base.x + (ev.clientX - start.x);
      const ny = base.y + (ev.clientY - start.y);
      if (wrapperRef.current) {
        wrapperRef.current.style.transform = `translate(${nx}px, ${ny}px)`;
      }
    };
    const onUp = (ev: MouseEvent) => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      const nx = base.x + (ev.clientX - start.x);
      const ny = base.y + (ev.clientY - start.y);
      portal.setPosition(id, { x: nx, y: ny });
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  if (hidden && !s.editMode) return null;
  if (!s.editMode) {
    if (!pos) return <>{children}</>;
    return (
      <div style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}>{children}</div>
    );
  }
  return (
    <div
      ref={wrapperRef}
      className={cn("relative group/hideable", hidden && "opacity-40", pos && "movable-moved")}
      style={pos ? { transform: `translate(${pos.x}px, ${pos.y}px)` } : undefined}
    >
      <button
        onMouseDown={startDrag}
        className="movable-handle"
        title="Arrastar para reposicionar"
        type="button"
      >
        ✥
      </button>
      <div className="absolute -top-2 -right-2 z-10 flex gap-1">
        {pos && (
          <button
            onClick={() => portal.setPosition(id, null)}
            className="rounded-full bg-secondary text-secondary-foreground text-[10px] px-2 py-0.5 shadow"
            title="Restaurar posição"
          >
            ↺
          </button>
        )}
        <button
          onClick={() =>
            hidden ? portal.resetText(`__hidden__${id}`) : portal.setText(`__hidden__${id}`, "1")
          }
          className="rounded-full bg-destructive text-destructive-foreground text-[10px] px-2 py-0.5 shadow"
          title={label || id}
        >
          {hidden ? "Mostrar" : "Ocultar"}
        </button>
      </div>
      {children}
    </div>
  );
}

// Drag-only wrapper (sem botão de ocultar). Usa a mesma store de posições.
export function Movable({
  id,
  children,
  label,
  as = "div",
  className,
  inline,
}: {
  id: string;
  children: ReactNode;
  label?: string;
  as?: "div" | "section" | "span";
  className?: string;
  inline?: boolean;
}) {
  const s = usePortalStore();
  const active = useActiveTarget();
  const isActive = active === `mv:${id}`;
  const pos = s.positions[id];
  const wrapperRef = useRef<HTMLDivElement>(null);
  const Tag = as as any;


  const startDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const start = { x: e.clientX, y: e.clientY };
    const base = pos ?? { x: 0, y: 0 };
    const onMove = (ev: MouseEvent) => {
      const nx = base.x + (ev.clientX - start.x);
      const ny = base.y + (ev.clientY - start.y);
      if (wrapperRef.current) {
        wrapperRef.current.style.transform = `translate(${nx}px, ${ny}px)`;
      }
    };
    const onUp = (ev: MouseEvent) => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      const nx = base.x + (ev.clientX - start.x);
      const ny = base.y + (ev.clientY - start.y);
      portal.setPosition(id, { x: nx, y: ny });
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  if (!s.editMode) {
    if (!pos) return <Tag className={className}>{children}</Tag>;
    return (
      <Tag className={className} style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      ref={wrapperRef as any}
      className={cn(
        "relative group/movable",
        inline ? "inline-block align-baseline" : "",
        pos && "movable-moved",
        className,
      )}
      style={pos ? { transform: `translate(${pos.x}px, ${pos.y}px)` } : undefined}
    >
      <button
        onMouseDown={startDrag}
        className="movable-handle"
        title={label ? `Arrastar: ${label}` : "Arrastar para reposicionar"}
        type="button"
      >
        ✥
      </button>
      {pos && (
        <button
          onClick={() => portal.setPosition(id, null)}
          className="absolute -top-2 -right-2 z-10 rounded-full bg-secondary text-secondary-foreground text-[10px] px-2 py-0.5 shadow"
          title="Restaurar posição"
          type="button"
        >
          ↺
        </button>
      )}
      {children}
    </Tag>
  );
}

// Linha divisória de seção que pode ser reposicionada e redimensionada.
export function SectionDivider({ id, className }: { id: string; className?: string }) {
  const s = usePortalStore();
  const size = s.sizes[id];
  const w = size?.w;
  const h = size?.h ?? 1;
  return (
    <Movable id={id} label="Divisor" className={cn("block", className)}>
      <Resizable
        id={id}
        axis="both"
        minW={40}
        minH={1}
        maxH={40}
        defaultW={undefined}
        defaultH={1}
        style={{ width: w != null ? `${w}px` : "100%" }}
      >
        <div
          style={{ height: `${h}px` }}
          className="w-full bg-border rounded-full"
        />
      </Resizable>
    </Movable>
  );
}

// Generic resizable wrapper. Shows a handle in edit mode; persists width/height
// (in pixels) to the portal store under the given id.
export function Resizable({
  id,
  children,
  axis = "both",
  minW = 80,
  minH = 20,
  maxW,
  maxH,
  defaultW,
  defaultH,
  className,
  style,
  as = "div",
}: {
  id: string;
  children: ReactNode;
  axis?: "x" | "y" | "both";
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  defaultW?: number;
  defaultH?: number;
  className?: string;
  style?: CSSProperties;
  as?: "div" | "section" | "span";
}) {
  const s = usePortalStore();
  const size = s.sizes[id];
  const w = size?.w ?? defaultW;
  const h = size?.h ?? defaultH;
  const Tag = as as any;
  const ref = useRef<HTMLElement>(null);

  const startResize = (dir: "x" | "y" | "both") => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = rect.width;
    const startH = rect.height;
    const onMove = (ev: MouseEvent) => {
      let nw = startW + (ev.clientX - startX);
      let nh = startH + (ev.clientY - startY);
      nw = Math.max(minW, maxW ? Math.min(maxW, nw) : nw);
      nh = Math.max(minH, maxH ? Math.min(maxH, nh) : nh);
      portal.setSize(id, {
        w: dir === "y" ? size?.w : Math.round(nw),
        h: dir === "x" ? size?.h : Math.round(nh),
      });
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const appliedStyle: CSSProperties = { ...style };
  if (w != null) appliedStyle.width = `${w}px`;
  if (h != null && (axis === "y" || axis === "both")) appliedStyle.height = `${h}px`;

  if (!s.editMode) {
    return (
      <Tag ref={ref as any} className={className} style={appliedStyle}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref as any}
      className={cn("relative group/resizable", className)}
      style={appliedStyle}
    >
      {children}
      {(axis === "x" || axis === "both") && (
        <span
          onMouseDown={startResize("x")}
          title="Redimensionar largura"
          className="absolute top-1/2 -right-1 -translate-y-1/2 z-20 h-8 w-2 rounded-full bg-primary/70 hover:bg-primary cursor-ew-resize shadow ring-1 ring-white/30"
        />
      )}
      {(axis === "y" || axis === "both") && (
        <span
          onMouseDown={startResize("y")}
          title="Redimensionar altura"
          className="absolute left-1/2 -bottom-1 -translate-x-1/2 z-20 h-2 w-8 rounded-full bg-primary/70 hover:bg-primary cursor-ns-resize shadow ring-1 ring-white/30"
        />
      )}
      {axis === "both" && (
        <span
          onMouseDown={startResize("both")}
          title="Redimensionar"
          className="absolute -right-1 -bottom-1 z-20 h-3 w-3 rounded-sm bg-primary hover:scale-110 cursor-nwse-resize shadow ring-1 ring-white/30"
        />
      )}
      {(size?.w != null || size?.h != null) && (
        <button
          type="button"
          onClick={() => portal.setSize(id, null)}
          className="absolute -left-2 -bottom-2 z-20 rounded-full bg-secondary text-secondary-foreground text-[10px] px-2 py-0.5 shadow"
          title="Restaurar tamanho"
        >
          ↺
        </button>
      )}
    </Tag>
  );
}

