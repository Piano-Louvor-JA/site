## O que muda na documentação

<!-- Página(s) afetada(s) e resumo da mudança -->

## Checklist do autor

- [ ] `reviewed_at` atualizado nas páginas alteradas
- [ ] Primeiro parágrafo responde a pergunta principal da página (resposta-direta)
- [ ] Passos numerados testados no app/versão indicada
- [ ] `pnpm build` verde localmente
- [ ] Sem conteúdo inventado — tudo confere com o produto real

## Como verificar (reviewer)

1. `pnpm build && pnpm preview` — abrir as páginas alteradas
2. Conferir conteúdo contra o app real (paridade)
3. Verificar JSON-LD/`llms.txt` se rotas novas
