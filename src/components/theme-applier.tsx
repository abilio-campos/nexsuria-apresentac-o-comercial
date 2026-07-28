import { useEffect } from "react";
import { usePortalStore } from "@/lib/portal-store";

function isLight(hex: string): boolean {
  const h = hex.replace("#", "");
  if (h.length !== 6) return false;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  // Perceived luminance
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

export function ThemeApplier() {
  const { theme, btnScale } = usePortalStore();
  useEffect(() => {
    const root = document.documentElement;
    if (theme.primary) {
      root.style.setProperty("--primary", theme.primary);
      root.style.setProperty("--ring", theme.primary);
      root.style.setProperty(
        "--primary-foreground",
        isLight(theme.primary) ? "#111111" : "#ffffff",
      );
    } else {
      root.style.removeProperty("--primary");
      root.style.removeProperty("--ring");
      root.style.removeProperty("--primary-foreground");
    }
    if (theme.foreground) {
      root.style.setProperty("--foreground", theme.foreground);
    } else {
      root.style.removeProperty("--foreground");
    }
  }, [theme.primary, theme.foreground]);
  useEffect(() => {
    const map: Record<string, string> = { p: "0.85", m: "1", g: "1.2", gg: "1.45" };
    document.documentElement.style.setProperty("--btn-scale", map[btnScale] ?? "1");
  }, [btnScale]);
  return null;
}