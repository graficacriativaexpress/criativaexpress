# Auditoria de Paleta — Criativa Express

## Referências da marca aplicadas

| Papel visual | Cor | Aplicação confirmada |
|---|---:|---|
| Cor principal | `#9E268F` | Ações principais, preços, links, rótulos e navegação. |
| Cor de interação | `#00B7E8` | Contornos de foco, bordas de filtros em hover e acentos da vitrine. |
| Cor de destaque | `#FF9F1C` | Selos, marcadores de seção e acentos dos cartões de processo. |
| Cor estrutural | `#202124` | Rodapé e texto de alto contraste. |

## Inspeção visual registrada

A página inicial foi revisada em desktop e em uma viewport de 375 px. Os filtros ativos, preços, badges, botões principais e a hierarquia entre a logo, imagens dos kits e textos permanecem legíveis. A página de detalhe do **Kit 2.000 Tags Brincos** foi revisada em desktop e celular: imagem, título, preço, descrição, composição e botão de pedido apresentaram contraste e leitura adequados.

## Estados interativos verificados

| Elemento | Hover configurado | Focus visível configurado |
|---|---|---|
| Ação “Explorar catálogo” | Magenta secundário | Contorno ciano |
| Ação “Gerenciar loja” | Borda ciano | Contorno ciano |
| Filtros de categoria | Borda ciano e texto magenta | Contorno ciano |
| Botão de pedido por WhatsApp | Magenta secundário | Contorno ciano |

O teste automatizado `server/palette.visual.test.ts` protege os tokens da marca e as classes que implementam esses estados.

## Evidências de contraste e inspeção

| Combinação avaliada | Contraste calculado | Resultado |
|---|---:|---|
| Texto grafite sobre fundo papel | 15,52:1 | Adequado para textos principais e leitura prolongada. |
| Texto branco sobre botão vinho | 7,08:1 | Adequado para a ação principal. |
| Texto branco sobre botão rosa em hover | 4,90:1 | Adequado para texto normal em interação. |
| Texto grafite sobre destaque dourado | 6,37:1 | Adequado para rótulos e destaques da vitrine. |

As relações foram calculadas a partir dos valores OKLCH aplicados em `client/src/index.css`. A inspeção da vitrine foi registrada no preview em 12 de agosto de 2026, nos tamanhos **1280 × 720** e **375 × 812**. O detalhe do produto foi validado em `/produto/kit-2000-tags-brincos`: em ambos os tamanhos, imagem, nome, preço, descrição, composição e botão de pedido permaneceram visíveis e organizados.

No desktop, a ação **Explorar catálogo** também foi inspecionada com o ponteiro para confirmar seu estado de hover. A navegação por teclado foi iniciada pela vitrine pública e confirmou que os controles de navegação são alcançáveis. Os controles com ação da loja, filtros de categoria e botão de pedido possuem contorno de foco ciano explícito, registrado no código e protegido pelo teste `server/palette.visual.test.ts`.
