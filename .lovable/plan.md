Objetivo: atuar como designer gráfico e fazer uma revisão/ajuste global do modo Apresentar, garantindo que o conteúdo de cada sessão se concentre em no máximo 2 telas de rolagem, sem cortes de layout, e com hierarquia visual consistente.

Diagnóstico inicial (a partir do código e dos ajustes anteriores):
- O CSS atual força cada sessão com PageHeader a ter exatamente `100vh - header` de altura, com `overflow-y: auto`. Isso comprime o conteúdo e cria rolagem interna quando os cards não cabem, gerando a sensação de layout "horrível".
- A Home não usa PageHeader e flui em 3 blocos (Hero, Pilares, Soluções/Diferenciais), podendo extrapolar 2 telas.
- Espaçamentos verticais (`py-16`, `py-20`, `mt-16`, etc.) ainda são generosos no modo Apresentar.
- Tipografia dos headers e cards pode ser levemente reduzida para ganhar espaço sem perder legibilidade.
- Algumas sessões têm conteúdo denso demais para 1 tela (ex.: Quem Somos com PMV + Valores + Mapa/Timeline; IA com dashboard + capacidades; Ecossistema com rede neural + grid de parceiros).

Plano de ação:

1. Reestruturar o container do modo Apresentar no `src/styles.css`
   - Trocar `height: calc(100vh - header)` por `height: auto` com `min-height` e `max-height: calc(200vh - header)`.
   - Remover `justify-content: center` e usar `justify-content: flex-start` com padding controlado, evitando que sessões curtas fiquem flutuando no centro.
   - Manter `overflow-y: auto` apenas quando o conteúdo atingir o limite de 2 telas.
   - Garantir que sessões com muito conteúdo possam ocupar até 2 telas sem cortar.

2. Comprimir a Home (`src/routes/index.tsx`) para caber em 2 telas
   - Reduzir paddings/margens do Hero no modo Apresentar.
   - Compactar grid de KPIs (menor padding, fontes levemente reduzidas).
   - Reduzir seção de Pilares para 2 linhas de 3 cards.
   - Limitar Soluções/Diferenciais a 6 itens já existentes, mas com cards menores.
   - Ajustar via CSS específico `.presenting .home-flow`.

3. Ajustar sessões densas individualmente
   - `quem-somos.tsx`: combinar PMV + Valores em grid mais compacto; timeline em 2 colunas; mapa ao lado.
   - `ia.tsx`: reduzir altura do dashboard (gráfico menor) e grid de capacidades para 2x3.
   - `equipe.tsx`: já foi combinada, apenas ajustar paddings/tamanhos.
   - `ecossistema.tsx`: escalar a rede neural para caber e compactar grid de parceiros.
   - `solucoes.tsx`: reduzir altura dos cards para 3 colunas x 5 linhas caberem.
   - `diferenciais.tsx`, `metodologia.tsx`, `casos-de-uso.tsx`, `contato.tsx`: ajustar paddings e tamanhos de cards.

4. Padronizar tipografia e sombreamento no modo Apresentar
   - Headers com `clamp()` já existente, mas revisar tamanhos mínimos.
   - Cards com padding menor e sombra mais suave.
   - Botões e badges em escala reduzida.

5. Verificar e corrigir o menu lateral no modo Apresentar
   - Manter sidebar visível (já corrigido anteriormente), garantindo que não sobreponha o conteúdo.
   - Ajustar largura do conteúdo principal quando a sidebar estiver expandida.

6. Validar visualmente com screenshots
   - Usar Playwright para navegar por todas as rotas no modo Apresentar.
   - Capturar screenshot de cada sessão e verificar se há cortes ou rolagem excessiva.
   - Ajustar caso alguma sessão ainda extrapole 2 telas.

Arquivos que serão editados:
- `src/styles.css` — ajustes globais do modo Apresentar.
- `src/routes/index.tsx` — compressão da Home.
- `src/routes/quem-somos.tsx` — layout compacto.
- `src/routes/ia.tsx` — dashboard e cards menores.
- `src/routes/equipe.tsx` — ajustes finos.
- `src/routes/ecossistema.tsx` — escala da rede neural e grid.
- `src/routes/solucoes.tsx` — cards mais compactos.
- `src/routes/diferenciais.tsx`, `src/routes/metodologia.tsx`, `src/routes/casos-de-uso.tsx`, `src/routes/contato.tsx` — ajustes de espaçamento.
- Possivelmente `src/components/page-header.tsx` se for necessário reduzir a altura padrão do header.

Critério de aceite:
- Cada rota, no modo Apresentar, deve exibir todo o seu conteúdo sem rolagem interna em até 2 telas de altura (viewport de 1280x822 ou similar).
- Nenhum card, botão ou texto pode estar cortado.
- Hierarquia visual mantida: título > subtítulo > conteúdo > ações.
- Build e type-check passam.