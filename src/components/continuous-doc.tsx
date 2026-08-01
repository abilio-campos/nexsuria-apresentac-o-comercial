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
  el.scrollIntoView({ behavior, block: "start" });
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
  const initialJumpDone = useRef(false);

  // Posiciona uma única vez ao abrir por um endereço direto. Diferente da
  // implementação anterior, não repetimos o salto enquanto imagens carregam:
  // isso fazia a sessão seguinte subir rapidamente durante a rolagem.
  useEffect(() => {
    if (initialJumpDone.current) return;
    initialJumpDone.current = true;
    const frame = requestAnimationFrame(() => {
      if (initialPath !== "/") scrollToDocSection(initialPath, "instant" as ScrollBehavior);
    });
    return () => cancelAnimationFrame(frame);
  }, [initialPath]);

  // Mesmo mecanismo do projeto de referência: o observador apenas marca no
  // menu a seção com maior área visível. A URL e o scroll nunca são alterados.
  useEffect(() => {
    const pathByElement = new Map<Element, string>();
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const path = visible ? pathByElement.get(visible.target) : undefined;
        if (path) onActiveChange(path);
      },
      { threshold: [0.2, 0.5] },
    );

    paths.forEach((path) => {
      const element = document.getElementById(docSectionId(path));
      if (!element) return;
      pathByElement.set(element, path);
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [paths.join("|"), onActiveChange]);

  return (
    <div className="nx-doc">
      {paths.map((p) => {
        const Section = DOC_SECTIONS[p];
        return (
          <div key={p} id={docSectionId(p)} data-doc-path={p} className="nx-doc-section">
            <Section />
            <SectionSpacers path={p} />
          </div>
        );
      })}

    </div>
  );
}
