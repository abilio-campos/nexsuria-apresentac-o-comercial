import type React from "react";
import { useEffect, useRef } from "react";
import { HomePage } from "@/pages/index";
import { QuemSomos } from "@/pages/quem-somos";
import { Metodologia } from "@/pages/metodologia";
import { Equipe } from "@/pages/equipe";
import { SolucoesLayout } from "@/pages/solucoes";
import { Ecossistema } from "@/pages/ecossistema";
import { IA } from "@/pages/ia";
import { Diferenciais } from "@/pages/diferenciais";
import { Casos } from "@/pages/casos-de-uso";
import { PercepcoesPage } from "@/pages/percepcoes";
import { Contato } from "@/pages/contato";

/**
 * Todas as sessões do portal vivem em um único documento rolável.
 * O menu deixa de "trocar de página": ele apenas rola até a sessão, e a
 * rolagem contínua marca automaticamente o item correspondente no menu.
 */
export const DOC_SECTIONS: Record<string, () => React.ReactElement> = {
  "/": HomePage,
  "/quem-somos": QuemSomos,
  "/metodologia": Metodologia,
  "/equipe": Equipe,
  "/solucoes": SolucoesLayout,
  "/ecossistema": Ecossistema,
  "/ia": IA,
  "/diferenciais": Diferenciais,
  "/casos-de-uso": Casos,
  "/percepcoes": PercepcoesPage,
  "/contato": Contato,
};

export const isDocPath = (p: string) => Object.prototype.hasOwnProperty.call(DOC_SECTIONS, p);

export function docSectionId(to: string) {
  return `doc-${to === "/" ? "home" : to.replace(/^\//, "").replace(/\//g, "-")}`;
}

export function scrollToDocSection(to: string, behavior: ScrollBehavior = "smooth") {
  const el = document.getElementById(docSectionId(to));
  if (!el) return false;
  const top = el.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: Math.max(0, top - 1), behavior });
  return true;
}

export function ContinuousDoc({
  order,
  initialPath,
  onActiveChange,
}: {
  order: string[];
  initialPath: string;
  onActiveChange: (path: string) => void;
}) {
  const paths = order.filter(isDocPath);
  const jumped = useRef<string | null>(null);
  const settling = useRef(true);

  // Ao entrar (ou ao clicar em um item do menu), posiciona na sessão pedida.
  useEffect(() => {
    if (jumped.current === initialPath) return;
    const first = jumped.current === null;
    jumped.current = initialPath;
    if (!first) {
      scrollToDocSection(initialPath, "smooth");
      return;
    }
    // Na primeira renderização o layout ainda cresce (fontes/imagens), então
    // reposiciona algumas vezes até estabilizar.
    settling.current = true;
    const timers = [0, 80, 200, 450, 800, 1200].map((t) =>
      window.setTimeout(() => scrollToDocSection(initialPath, "auto"), t),
    );
    const done = window.setTimeout(() => { settling.current = false; }, 1400);
    return () => { timers.forEach(clearTimeout); clearTimeout(done); };
  }, [initialPath]);

  // Scroll-spy: marca no menu a sessão visível, sem trocar de rota.
  useEffect(() => {
    let raf = 0;
    let current = initialPath;
    const compute = () => {
      raf = 0;
      if (settling.current) return;
      const probe = window.innerHeight * 0.3;
      let found = paths[0];
      for (const p of paths) {
        const el = document.getElementById(docSectionId(p));
        if (!el) continue;
        if (el.getBoundingClientRect().top <= probe) found = p;
      }
      if (found && found !== current) {
        current = found;
        onActiveChange(found);
        const url = found === "/" ? "/" : found;
        if (window.location.pathname !== url) window.history.replaceState(null, "", url);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    compute();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [paths.join("|"), onActiveChange]);

  return (
    <div className="nx-doc">
      {paths.map((p) => {
        const Section = DOC_SECTIONS[p];
        return (
          <div key={p} id={docSectionId(p)} data-doc-path={p} className="nx-doc-section">
            <Section />
          </div>
        );
      })}
    </div>
  );
}
