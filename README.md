# Clicksign Project Manager

## Resumo

Um gerenciador de projetos: cadastre, edite, remova, favorite, ordene e
busque projetos, com uma interface responsiva fiel ao design do Figma.
Todos os dados ficam salvos localmente no navegador, então a listagem
persiste entre sessões sem depender de um backend.

## Requisitos

1. Exibir uma listagem inicial sem nenhum projeto cadastrado, conforme o
   design.
2. Exibir o título da página e o total de projetos cadastrados.
3. Implementar um filtro para exibir apenas os projetos favoritos.
4. Adicionar a opção de ordenação da listagem por:
   - Ordem alfabética (padrão).
   - Projetos iniciados mais recentemente.
   - Projetos próximos à data de finalização.
5. Página com o formulário de edição de projeto.
6. Página com o formulário de criação de projeto.
7. Modal de confirmação de remoção.
8. Favoritar: permitir favoritar/desfavoritar projetos.
9. Implementar uma barra de busca onde o usuário pode digitar ao menos 3
   caracteres para disparar a busca.
10. Implementar um histórico das últimas 5 buscas recentes.
11. Exibir um highlight no texto dos resultados que correspondam à busca.

## Tecnologias

- [Nuxt](https://nuxt.com) 4 (Vue 3, Composition API, `<script setup lang="ts">`)
- TypeScript estrito (`strict: true`, sem `any`)
- [Pinia](https://pinia.vuejs.org) para estado global
- Sass (`@use`, sintaxe SCSS)
- [Vitest](https://vitest.dev) + [Vue Test Utils](https://test-utils.vuejs.org) para testes unitários/integração
- [Playwright](https://playwright.dev) para testes end-to-end
- ESLint (config oficial do Nuxt)
- [vite-svg-loader](https://github.com/jpkleemans/vite-svg-loader) para
  importar os ícones (`assets/icons/*.svg`) como componentes Vue

Nenhuma biblioteca de UI, datas ou debounce foi adicionada — o projeto usa
apenas recursos nativos da plataforma (`Date`, `Intl`, `crypto.randomUUID`,
`setTimeout`, elementos HTML nativos como `<dialog>`) onde eles já resolvem
o problema. A única exceção é `vite-svg-loader`, um plugin de build (não
uma lib de UI) que evita reimplementar manualmente o parsing de SVG em
componente Vue.

## Instalação

Pré-requisito: Node.js `^22.19.0 || ^24.11.0 || >=26.0.0` (exigido pelo Nuxt 4.5).

```bash
npm install
```

## Configuração

| Script | Descrição |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento em `http://localhost:3000` |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build de produção |
| `npm run typecheck` | Checagem de tipos (`vue-tsc` via `nuxt typecheck`) |
| `npm run lint` / `lint:fix` | ESLint |
| `npm run test` / `test:watch` | Testes unitários/integração (Vitest) |
| `npm run test:e2e` | Testes end-to-end (Playwright) — na primeira vez, rode `npx playwright install chromium` |

Não há variáveis de ambiente nem serviços externos a configurar: toda a
persistência é local, via `localStorage` do navegador.
