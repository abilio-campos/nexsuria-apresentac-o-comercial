import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, Moon, Sun, Pencil, Settings2, ChevronLeft, LogIn, LogOut, User, PanelLeft, Maximize2, Minimize2, GripVertical, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import logoAsset from "@/assets/nexsuria-logo.png.asset.json";
import { getResolvedNav, portal, usePortalStore } from "@/lib/portal-store";
import { useAuth } from "@/lib/auth";

export function PortalShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const store = usePortalStore();
  const auth = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);
  const [sidebarDark, setSidebarDark] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [presenting, setPresenting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => setMobileOpen(false), [pathname]);
  useEffect(() => {
    const stored = localStorage.getItem("nx-theme");
    if (stored === "dark") { document.documentElement.classList.add("dark"); setDark(true); }
    const c = localStorage.getItem("nx-sidebar-collapsed");
    if (c === "1") setCollapsed(true);
    const sd = localStorage.getItem("nx-sidebar-dark");
    if (sd === "1") setSidebarDark(true);
  }, []);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setScrollPct(max > 0 ? Math.min(100, Math.max(0, (h.scrollTop / max) * 100)) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);
  const toggleTheme = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("nx-theme", next ? "dark" : "light");
    setDark(next);
    if (next && !sidebarDark) {
      setSidebarDark(true);
      localStorage.setItem("nx-sidebar-dark", "1");
    }
  };
  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("nx-sidebar-collapsed", next ? "1" : "0");
  };
  const toggleSidebarDark = () => {
    const next = !sidebarDark;
    setSidebarDark(next);
    localStorage.setItem("nx-sidebar-dark", next ? "1" : "0");
  };

  const enterFullscreen = async () => {
    const el = document.documentElement as any;
    const req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
    if (req) { try { await req.call(el); } catch {} }
  };
  const exitFullscreen = async () => {
    const d = document as any;
    const exit = d.exitFullscreen || d.webkitExitFullscreen || d.msExitFullscreen;
    if (exit && (d.fullscreenElement || d.webkitFullscreenElement)) { try { await exit.call(d); } catch {} }
  };
  const togglePresent = async () => {
    const next = !presenting;
    setPresenting(next);
    if (next) await enterFullscreen(); else await exitFullscreen();
  };
  useEffect(() => {
    document.documentElement.classList.toggle("presenting", presenting);
    return () => { document.documentElement.classList.remove("presenting"); };
  }, [presenting]);
  useEffect(() => {
    const onFs = () => {
      const d = document as any;
      const fs = !!(d.fullscreenElement || d.webkitFullscreenElement);
      setIsFullscreen(fs);
      if (!fs) setPresenting(false);
    };
    document.addEventListener("fullscreenchange", onFs);
    document.addEventListener("webkitfullscreenchange", onFs as any);
    return () => {
      document.removeEventListener("fullscreenchange", onFs);
      document.removeEventListener("webkitfullscreenchange", onFs as any);
    };
  }, []);

  const items = useMemo(() => getResolvedNav(store).filter((i) => !i.hidden || store.editMode), [store]);
  const [dragTo, setDragTo] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const groups = useMemo(() => {
    const map = new Map<string, typeof items>();
    items.forEach((i) => {
      const g = i.group || "Outros";
      if (!map.has(g)) map.set(g, [] as any);
      map.get(g)!.push(i);
    });
    return Array.from(map.entries());
  }, [items]);

  // Sequential numbering across all visible items (LG-style "01, 02, …")
  const numberMap = useMemo(() => {
    const map = new Map<string, string>();
    items.forEach((it, idx) => map.set(it.to, String(idx + 1).padStart(2, "0")));
    return map;
  }, [items]);

  // Arrow key navigation between menu items
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tgt = e.target as HTMLElement | null;
      if (tgt && (tgt.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(tgt.tagName))) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "f" || e.key === "F") { e.preventDefault(); togglePresent(); return; }
      if (e.key === "Escape" && presenting) { setPresenting(false); exitFullscreen(); return; }
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      const idx = items.findIndex((it) => (it.to === "/" ? pathname === "/" : pathname.startsWith(it.to)));
      if (idx === -1) return;
      const dir = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1;
      const next = items[(idx + dir + items.length) % items.length];
      if (next) { e.preventDefault(); navigate({ to: next.to }); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [items, pathname, navigate, presenting]);

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={cn(
          sidebarDark && "sidebar-executive",
          "fixed z-40 inset-y-0 left-0 flex flex-col transition-[width,transform] duration-300",
          sidebarDark
            ? "bg-gradient-to-b from-[var(--sidebar-executive)] via-[var(--sidebar-executive)] to-[var(--sidebar-executive)]/95 border-r border-[var(--sidebar-executive-border)] text-[var(--sidebar-executive-foreground)]"
            : "bg-gradient-to-b from-sidebar via-sidebar to-sidebar/95 border-r border-sidebar-border text-sidebar-foreground",
          "backdrop-blur-xl",
          "shadow-[4px_0_24px_-8px_rgb(0_0_0_/_0.08)] dark:shadow-[4px_0_24px_-8px_rgb(0_0_0_/_0.5)]",
          collapsed ? "w-16" : "w-72",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
        )}
      >
        <div className={cn("flex items-center justify-between h-14 px-3 border-b", sidebarDark ? "border-[var(--sidebar-executive-border)]" : "border-sidebar-border")}>
          <Link to="/" className="flex items-center gap-2 min-w-0">
            <img src={logoAsset.url} alt="Nexsuria" className="h-8 w-8 object-contain shrink-0" />
            {!collapsed && (
              <div className="leading-tight min-w-0">
                <div className="text-sm font-semibold truncate">Nexsuria</div>
                <div className={cn("text-[10px] uppercase tracking-[0.14em] truncate", sidebarDark ? "text-[var(--sidebar-executive-foreground)]/60" : "text-muted-foreground")}>
                  Portal Executivo
                </div>
              </div>
            )}
          </Link>
          <button
            onClick={toggleCollapsed}
            className={cn("hidden lg:inline-flex p-1.5 rounded-md", sidebarDark ? "hover:bg-[var(--sidebar-executive-accent)] text-[var(--sidebar-executive-foreground)]/70" : "hover:bg-sidebar-accent text-muted-foreground")}
            aria-label="Recolher menu"
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-2">
          {groups.map(([group, list]) => (
            <div key={group}>
              <ul className="space-y-0.5">
                {list.map((item) => {
                  const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
                  const num = numberMap.get(item.to) ?? "";
                  return (
                    <li key={item.to}>
                      <div
                        draggable={store.editMode}
                        onDragStart={(e) => {
                          if (!store.editMode) return;
                          setDragTo(item.to);
                          e.dataTransfer.effectAllowed = "move";
                        }}
                        onDragOver={(e) => {
                          if (!store.editMode || !dragTo) return;
                          e.preventDefault();
                          setDragOver(item.to);
                        }}
                        onDragLeave={() => setDragOver((v) => (v === item.to ? null : v))}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (!store.editMode || !dragTo || dragTo === item.to) return;
                          const order = items.map((i) => i.to);
                          const target = order.indexOf(item.to);
                          portal.moveNavTo(dragTo, target);
                          setDragTo(null);
                          setDragOver(null);
                        }}
                        onDragEnd={() => { setDragTo(null); setDragOver(null); }}
                        className={cn(dragOver === item.to && "nav-drag-over")}
                      >
                      <Link
                        to={item.to}
                        className={cn(
                          "group relative flex items-center gap-3 rounded-lg overflow-hidden transition-all duration-300",
                          collapsed ? "px-0 py-1.5 justify-center" : "px-3 py-1.5",
                          active
                            ? sidebarDark
                              ? "bg-gradient-to-r from-primary/20 via-primary/10 to-transparent text-foreground shadow-sm ring-1 ring-primary/50"
                              : "bg-gradient-to-r from-primary/15 via-primary/5 to-transparent text-foreground shadow-sm ring-1 ring-primary/20"
                            : sidebarDark
                              ? "text-[var(--sidebar-executive-foreground)]/90 hover:text-[var(--sidebar-executive-foreground)] hover:bg-[var(--sidebar-executive-accent)]/70 hover:translate-x-0.5"
                              : "text-foreground/85 hover:text-foreground hover:bg-sidebar-accent/60 hover:translate-x-0.5",
                          item.hidden && "opacity-50 line-through",
                        )}
                        title={collapsed ? item.label : undefined}
                      >
                        {store.editMode && !collapsed && (
                          <GripVertical className="h-3.5 w-3.5 opacity-60 shrink-0 cursor-grab" />
                        )}
                        <span
                          className={cn(
                            "absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full transition-all duration-300",
                            active
                              ? "h-8 bg-gradient-to-b from-primary to-primary/60 shadow-[0_0_12px_theme(colors.primary/60%)]"
                              : "h-0 bg-primary/40 group-hover:h-4",
                          )}
                        />
                        {collapsed ? (
                          <span
                            className={cn(
                              "font-mono text-[11px] w-8 h-8 flex items-center justify-center rounded-md transition-all",
                              active
                                ? sidebarDark
                                  ? "bg-primary/30 text-primary ring-1 ring-primary/60"
                                  : "bg-primary/15 text-primary ring-1 ring-primary/30"
                                : sidebarDark
                                  ? "bg-[var(--sidebar-executive-accent)] text-[var(--sidebar-executive-foreground)] group-hover:bg-[var(--sidebar-executive-accent)] group-hover:text-[var(--sidebar-executive-foreground)]"
                                  : "text-muted-foreground/70 group-hover:bg-sidebar-accent group-hover:text-foreground",
                            )}
                          >
                            {num}
                          </span>
                        ) : (
                          <>
                            <span
                              className={cn(
                                "font-mono text-[10px] shrink-0 w-7 h-7 flex items-center justify-center rounded-md transition-all",
                                active
                                  ? sidebarDark
                                    ? "bg-primary/30 text-[var(--sidebar-executive-foreground)] ring-1 ring-primary/60"
                                    : "bg-primary/20 text-primary ring-1 ring-primary/30"
                                  : sidebarDark
                                    ? "bg-[var(--sidebar-executive-accent)] text-[var(--sidebar-executive-foreground)] ring-1 ring-[var(--sidebar-executive-border)] group-hover:bg-[var(--sidebar-executive-accent)] group-hover:text-[var(--sidebar-executive-foreground)]"
                                    : "bg-sidebar-accent/40 text-muted-foreground/80 group-hover:bg-sidebar-accent group-hover:text-foreground",
                              )}
                            >
                              {num}
                            </span>
                            <span className="truncate text-sm font-semibold tracking-tight flex-1">
                              {item.label}
                            </span>
                            {active && (
                              <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_theme(colors.primary)] animate-pulse" />
                            )}
                          </>
                        )}
                        {active && !collapsed && (
                          <span className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary via-primary/70 to-transparent transition-[width] duration-150"
                            style={{ width: `${scrollPct}%` }}
                          />
                        )}
                      </Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className={cn("border-t p-2 space-y-1", sidebarDark ? "border-[var(--sidebar-executive-border)]" : "border-sidebar-border")}>
          <button
            onClick={togglePresent}
            className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm bg-primary/10 text-primary hover:bg-primary/20 ring-1 ring-primary/30"
            title="Modo apresentação (F)"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4 shrink-0" /> : <Maximize2 className="h-4 w-4 shrink-0" />}
            {!collapsed && <span className="font-semibold">{isFullscreen ? "Sair da apresentação" : "Apresentar"}</span>}
          </button>
          {auth.user && (
            <Link
              to="/admin"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm",
                sidebarDark ? "hover:bg-[var(--sidebar-executive-accent)]" : "hover:bg-sidebar-accent",
                pathname.startsWith("/admin") && (sidebarDark ? "bg-[var(--sidebar-executive-accent)]" : "bg-sidebar-accent"),
              )}
              title="Configurar portal"
            >
              <Settings2 className="h-4 w-4 shrink-0" />
              {!collapsed && <span>Configurar</span>}
            </Link>
          )}
          {auth.user && (
            <button
              onClick={() => portal.toggleEdit()}
              className={cn(
                "w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm",
                sidebarDark ? "hover:bg-[var(--sidebar-executive-accent)]" : "hover:bg-sidebar-accent",
                store.editMode && "bg-primary/10 text-primary",
              )}
            >
              <Pencil className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{store.editMode ? "Sair da edição" : "Editar textos"}</span>}
            </button>
          )}
          <button
            onClick={toggleTheme}
            className={cn("w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm", sidebarDark ? "hover:bg-[var(--sidebar-executive-accent)]" : "hover:bg-sidebar-accent")}
          >
            {dark ? <Sun className="h-4 w-4 shrink-0" /> : <Moon className="h-4 w-4 shrink-0" />}
            {!collapsed && <span>{dark ? "Modo claro" : "Modo escuro"}</span>}
          </button>
          <button
            onClick={toggleSidebarDark}
            className={cn("w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm", sidebarDark ? "hover:bg-[var(--sidebar-executive-accent)]" : "hover:bg-sidebar-accent")}
            title="Alternar tema do menu"
          >
            <PanelLeft className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{sidebarDark ? "Menu claro" : "Menu escuro"}</span>}
          </button>

          {auth.user ? (
            <button
              onClick={() => auth.signOut()}
              className={cn(
                "w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm",
                sidebarDark ? "hover:bg-[var(--sidebar-executive-accent)] text-[var(--sidebar-executive-foreground)]/70" : "hover:bg-sidebar-accent text-muted-foreground",
              )}
              title={auth.user.email || "Sair"}
            >
              <User className="h-4 w-4 shrink-0" />
              {!collapsed && (
                <span className="truncate flex-1 text-left">
                  {auth.user.email?.split("@")[0] || "Sair"}
                </span>
              )}
              <LogOut className="h-4 w-4 shrink-0" />
            </button>
          ) : (
            <Link
              to="/auth"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm",
                sidebarDark ? "hover:bg-[var(--sidebar-executive-accent)] text-[var(--sidebar-executive-foreground)]/70" : "hover:bg-sidebar-accent text-muted-foreground",
              )}
            >
              <LogIn className="h-4 w-4 shrink-0" />
              {!collapsed && <span>Entrar</span>}
            </Link>
          )}
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 h-12 z-30 flex items-center justify-between px-3 border-b border-border bg-background">
        <button
          className="p-2 rounded-md border border-border"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
        <Link to="/" className="flex items-center gap-2">
          <img src={logoAsset.url} alt="Nexsuria" className="h-7 w-7 object-contain" />
          <span className="text-sm font-semibold">Nexsuria</span>
        </Link>
        {auth.user && (
          <button
            onClick={() => portal.toggleEdit()}
            className={cn("p-2 rounded-md border border-border", store.editMode && "bg-primary/10 border-primary")}
            aria-label="Editar"
          >
            <Pencil className="h-4 w-4" />
          </button>
        )}
      </div>
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-30 bg-black/40"
        />
      )}

      {/* Main */}
      <div className={cn("flex-1 flex flex-col min-w-0 transition-[margin] duration-300", collapsed ? "lg:ml-16" : "lg:ml-72", "pt-12 lg:pt-0")}>
        {presenting && (
          <button
            onClick={togglePresent}
            className="fixed top-4 right-4 z-50 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 backdrop-blur px-3 py-1.5 text-xs text-foreground shadow-lg hover:bg-background"
            title="Sair da apresentação (Esc)"
          >
            <Minimize2 className="h-3.5 w-3.5" /> Sair
          </button>
        )}
        {store.editMode && (
          <div className="sticky top-12 lg:top-0 z-20 bg-primary text-primary-foreground text-xs px-4 py-1.5 flex items-center justify-between">
            <span>Modo edição ativo — clique nos textos para editar. As alterações são salvas automaticamente.</span>
            <Link to="/admin" className="underline underline-offset-2">Painel de configuração</Link>
          </div>
        )}
        <main className="flex-1">{children}</main>
        {store.editMode && auth.user && (
          <EditFloatingToolbar pathname={pathname} btnScale={store.btnScale} />
        )}
        <footer className="border-t border-border py-4 px-6 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} Nexsuria — Centro de Inteligência Empresarial.</span>
          <span>Campinas / SP · Brasil</span>
        </footer>
      </div>
    </div>
  );
}

function EditFloatingToolbar({ pathname, btnScale }: { pathname: string; btnScale: "p" | "m" | "g" | "gg" }) {
  const items = getResolvedNav(usePortalStore());
  const current = items.find((i) => (i.to === "/" ? pathname === "/" : pathname.startsWith(i.to)));
  const scales: { key: "p" | "m" | "g" | "gg"; label: string }[] = [
    { key: "p", label: "P" }, { key: "m", label: "M" }, { key: "g", label: "G" }, { key: "gg", label: "GG" },
  ];
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-full border border-border bg-background/95 backdrop-blur px-3 py-2 shadow-lg text-xs">
      <div className="flex items-center gap-1">
        <span className="text-muted-foreground pr-1">Botões</span>
        {scales.map((s) => (
          <button
            key={s.key}
            onClick={() => portal.setBtnScale(s.key)}
            className={cn(
              "h-6 w-7 rounded-md border text-[11px] font-semibold",
              btnScale === s.key ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-secondary",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
      {current && (
        <>
          <span className="h-4 w-px bg-border" />
          <button
            onClick={() => {
              if (confirm(`Excluir "${current.label}" do menu? Você pode restaurar depois no painel Configurar.`)) {
                portal.toggleHidden(current.to);
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-md border border-destructive/40 text-destructive px-2 py-1 hover:bg-destructive/10"
            title="Ocultar esta página do menu"
          >
            <Trash2 className="h-3.5 w-3.5" /> Excluir esta página
          </button>
        </>
      )}
    </div>
  );
}
