import { Maximize2, Minimize2, Pencil } from "lucide-react";
import logoAsset from "@/assets/nexsuria-logo.png.asset.json";
import { cn } from "@/lib/utils";
import { portal, usePortalStore } from "@/lib/portal-store";

/**
 * Barra fixa no topo: marca, título, versão, progresso das sessões e o
 * botão Apresentar.
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
    <div className="nx-topbar sticky top-12 lg:top-0 z-40 border-b border-primary/60 bg-primary text-primary-foreground shadow-sm">
      <div className="mx-auto flex h-14 w-full max-w-[1180px] items-center gap-4 px-4">
        <img src={logoAsset.url} alt="Nexsuria" className="h-7 w-7 object-contain shrink-0" />
        <div className="hidden sm:flex flex-col justify-center">
          <span className="text-[11px] font-medium tracking-wide text-primary-foreground/90">
            Apresentação Institucional e Comercial
          </span>
          <span className="text-[10px] font-mono text-orange-400">V-26.07-01</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-[11px] font-mono text-primary-foreground/70">
              {String(Math.min(index + 1, total)).padStart(2, "0")}/{String(total).padStart(2, "0")}
            </span>
            <span className="truncate text-sm font-medium">{label}</span>
          </div>
          <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-primary-foreground/20">
            <div
              className="h-full rounded-full bg-primary-foreground transition-[width] duration-150"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
        {!presenting && (
          <button
            type="button"
            onClick={() => portal.toggleEdit()}
            className={cn(
              "hidden sm:inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium",
              s.editMode
                ? "border-primary-foreground bg-primary-foreground/20 text-primary-foreground"
                : "border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10",
            )}
          >
            <Pencil className="h-3.5 w-3.5" />
            {s.editMode ? "Editando" : "Editar"}
          </button>
        )}
        <button
          type="button"
          onClick={onTogglePresent}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary-foreground px-4 py-1.5 text-xs font-semibold text-primary shadow hover:opacity-90"
        >
          {presenting ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          {presenting ? "Sair" : "Apresentar"}
        </button>
      </div>
    </div>

  );
}
