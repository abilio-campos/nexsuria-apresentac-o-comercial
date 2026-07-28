import { CheckCircle2, Circle } from "lucide-react";
import { type ReactNode } from "react";
import { portal, usePortalStore } from "@/lib/portal-store";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  label: string;
  page: string;
  children: ReactNode;
  className?: string;
  position?: "tr" | "tl" | "br" | "bl";
};

const POS: Record<NonNullable<Props["position"]>, string> = {
  tr: "top-2 right-2",
  tl: "top-2 left-2",
  br: "bottom-2 right-2",
  bl: "bottom-2 left-2",
};

export function Markable({ id, label, page, children, className, position = "tr" }: Props) {
  const s = usePortalStore();
  const mark = s.marks[id];
  const marked = !!mark;
  return (
    <div
      className={cn(
        "relative group/mark rounded-2xl transition-shadow",
        marked && "ring-2 ring-primary ring-offset-2 ring-offset-background",
        className,
      )}
    >
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          portal.toggleMark(id, { label, page });
        }}
        className={cn(
          "absolute z-20 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium border transition-all",
          POS[position],
          marked
            ? "bg-primary text-primary-foreground border-primary shadow"
            : "bg-background/85 backdrop-blur text-muted-foreground border-border opacity-0 group-hover/mark:opacity-100 hover:text-foreground hover:border-primary/50 focus:opacity-100",
        )}
        aria-pressed={marked}
        aria-label={marked ? `Desmarcar ${label}` : `Marcar ${label} como relevante`}
        title={marked ? "Marcado — clique para desmarcar" : "Marcar como relevante para o cliente"}
      >
        {marked ? <CheckCircle2 className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
        {marked ? "Relevante" : "Marcar"}
      </button>
      {children}
    </div>
  );
}