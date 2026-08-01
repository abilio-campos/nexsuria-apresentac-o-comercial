import { Maximize2, Minimize2, Pencil } from "lucide-react";
import logo from "@/assets/nexsuria-logo.png";
import { cn } from "@/lib/utils";
import { portal, usePortalStore } from "@/lib/portal-store";

/**
 * Barra fixa no topo da apresentação: marca, progresso das sessões e o
 * botão simples de Apresentar (padrão usado no projeto de referência).
 */
export function TopBar({
  label,
  index,
  total,
  progress,
  presenting,
  onTogglePresent,
}: {
  label: string;
  index: number;
  total: number;
  progress: number;
  presenting: boolean;
  onTogglePresent: () => void;
}) {
  const s = usePortalStore();
  return (
    <div className="nx-topbar sticky top-12 lg:top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-14 w-full max-w-[1180px] items-center gap-4 px-4">
        <img src={logo} alt="Nexsuria" className="h-6 w-auto shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-[11px] font-mono text-muted-foreground">
              {String(Math.min(index + 1, total)).padStart(2, "0")}/{String(total).padStart(2, "0")}
            </span>
            <span className="truncate text-sm font-medium">{label}</span>
          </div>
          <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-150"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
        {!presenting && (
          <button
            type="button"
            onClick={() => portal.setEditMode(!s.editMode)}
            className={cn(
              "hidden sm:inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium",
              s.editMode
                ? "border-primary bg-primary/10 text-primary"
                : "border-border hover:bg-secondary",
            )}
          >
            <Pencil className="h-3.5 w-3.5" />
            {s.editMode ? "Editando" : "Editar"}
          </button>
        )}
        <button
          type="button"
          onClick={onTogglePresent}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow hover:opacity-90"
        >
          {presenting ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          {presenting ? "Sair" : "Apresentar"}
        </button>
      </div>
    </div>
  );
}
