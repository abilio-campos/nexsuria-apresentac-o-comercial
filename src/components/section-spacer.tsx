import { useRef } from "react";
import { Plus, Trash2 } from "lucide-react";
import { portal, usePortalStore } from "@/lib/portal-store";

/**
 * Linhas em branco configuráveis no final de cada sessão — ajudam a compor
 * a rolagem da apresentação sem alterar o conteúdo.
 */
export function SectionSpacers({ path }: { path: string }) {
  const s = usePortalStore();
  const heights = s.spacers[path] ?? [];
  const ref = useRef<HTMLDivElement>(null);

  const startResize = (index: number, current: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const onMove = (ev: MouseEvent) => {
      portal.setSpacerHeight(path, index, current + (ev.clientY - startY));
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  if (!s.editMode) {
    if (heights.length === 0) return null;
    return (
      <div aria-hidden>
        {heights.map((h, i) => (
          <div key={i} style={{ height: `${h}px` }} />
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} data-nx-editor="" className="relative mt-2 space-y-2 px-4 pb-4">
      {heights.map((h, i) => (
        <div
          key={i}
          style={{ height: `${h}px` }}
          className="relative rounded-md border border-dashed border-primary/40 bg-primary/5"
        >
          <span className="absolute left-2 top-1 text-[10px] uppercase tracking-wider text-muted-foreground">
            Espaço {i + 1} · {Math.round(h)}px
          </span>
          <button
            type="button"
            onClick={() => portal.removeSpacer(path, i)}
            title="Remover espaço"
            className="absolute right-2 top-1 rounded p-1 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </button>
          <span
            onMouseDown={startResize(i, h)}
            title="Arraste para ajustar a altura"
            className="absolute left-1/2 -bottom-1 -translate-x-1/2 h-2 w-10 cursor-ns-resize rounded-full bg-primary/70 hover:bg-primary shadow"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => portal.addSpacer(path)}
        className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-primary/50 px-3 py-1 text-[11px] text-primary hover:bg-primary/10"
      >
        <Plus className="h-3 w-3" /> Adicionar espaço no fim da sessão
      </button>
    </div>
  );
}
