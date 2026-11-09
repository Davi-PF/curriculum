# 09. Decisões Técnicas (ADRs Simplificados)

Este documento registra as decisões arquiteturais e operacionais tomadas no repositório (`HISTÓRICO` / `VERIFICADO`) para evitar que futuras sessões ou agentes revertam escolhas já avaliadas.

---

## ADR-001: Manutenção do Next.js (App Router) em vez de Migração para Vite SPA

- **Data:** 2026-11-09 (`VERIFICADO`)
- **Contexto:** O portfólio é uma aplicação de página única e geração estática (SSG) sem banco de dados ou APIs complexas. Durante a auditoria arquitetural, avaliou-se se valeria a pena migrar o projeto do Next.js 16 para uma SPA pura com Vite + React, reduzindo a superfície do framework.
- **Opções Avaliadas:**
  1. **Manter Next.js 16 (App Router):** Preservar a estrutura atual, aproveitando `next/image`, `next/font`, geração nativa de `metadata` / `sitemap.ts` / `robots.ts`, configuração declarativa de `headers()` em `next.config.ts` e integração nativa na Vercel.
  2. **Migrar para Vite + React SPA:** Reescrever configuração de build, substituir `next/image` por tags `<img>` manuais, configurar cabeçalhos via `vercel.json` e perder metadados nativos no servidor.
- **Decisão Tomada:** **Opção 1 — Manter Next.js 16 (App Router).**
- **Justificativa:** O projeto já está estabilizado em Next.js 16 com suíte de testes automatizados (~98.7% de cobertura) e deploy configurado na Vercel. Os benefícios nativos de otimização de imagens (`next/image`), SEO (`Metadata` API) e cabeçalhos HTTP (`next.config.ts`) superam o custo e o risco de reescrever a camada de build.
- **Impacto Técnico:** As melhorias de performance (`perf/image-font-optimization`), segurança (`security/http-headers`, `security/content-security-policy`) e SEO (`feat/accessibility-seo`) devem utilizar os recursos nativos do Next.js 16.

---

## ADR-002: Adoção da Branch Intermediária `integration/security-quality`

- **Data:** 2026-11-09 (`VERIFICADO`)
- **Contexto:** A auditoria identificou melhorias distribuídas em frentes distintas (dependências, cabeçalhos HTTP, GitHub Actions, CSP, bugs funcionais, performance de ativos, acessibilidade/SEO e limpeza de projeto), além da criação deste Playbook. Integrar cada frente diretamente em `master` acionaria deploys de produção parciais e dificultaria testes integrados do conjunto.
- **Opções Avaliadas:**
  1. Fazer merge de cada branch temática diretamente em `master`.
  2. Implementar todas as melhorias em uma única branch monolítica.
  3. Utilizar uma branch de integração dedicada (`integration/security-quality`) como base e destino intermediário de todas as branches temáticas, preservando `master` intocada até a validação final.
- **Decisão Tomada:** **Opção 3 — Utilizar `integration/security-quality` como branch de integração.**
- **Justificativa:** Permite validar cada escopo isoladamente sem poluir `master` e sem misturar alterações não relacionadas em um único PR monolítico.
- **Impacto Técnico:** Toda branch temática deve ser criada a partir da versão mais recente de `integration/security-quality` e integrada de volta nela somente após aprovação explícita do usuário.

---

## ADR-003: Segregação Estrita de Melhorias em Branches Temáticas Independentes

- **Data:** 2026-11-09 (`VERIFICADO`)
- **Contexto:** Alterações de dependências (`package-lock.json`), regras de segurança (`next.config.ts`), pipelines de CI (`.github/workflows/build.yml`) e componentes React (`src/components/`) possuem perfis de risco e requisitos de validação muito diferentes.
- **Opções Avaliadas:**
  1. Agrupar todas as correções de segurança em uma branch e todas as de código em outra.
  2. Segregar em branches granulares por domínio técnico (`docs/project-playbook`, `security/dependency-updates`, `security/http-headers`, `security/github-actions`, `security/content-security-policy`, `fix/functional-bugs`, `perf/image-font-optimization`, `feat/accessibility-seo`, `chore/project-cleanup`).
- **Decisão Tomada:** **Opção 2 — Segregação em branches granulares por domínio.**
- **Justificativa:** Facilita o code review humano, isola eventuais regressões (ex.: se uma diretiva CSP bloquear um recurso, é simples auditar apenas a branch correspondente) e mantém o histórico Git limpo e rastreável.
- **Impacto Técnico:** É proibido corrigir problemas de uma branch dentro de outra (ex.: não remover código morto durante a implementação de cabeçalhos HTTP ou CSP).

---

## ADR-004: Proibição de `npm audit fix --force` Cego e Aceite Temporário do Risco Residual em `minimatch`

- **Data:** 2026-11-09 (`VERIFICADO`)
- **Contexto:** Ao atualizar as dependências na branch `security/dependency-updates` (`5f0cf3f`), 100% das vulnerabilidades críticas, altas e de produção foram eliminadas. Restaram 8 ocorrências moderadas do advisory `GHSA-g3hv-75wg-m249` em `minimatch@10.2.6` (subdependência de `@typescript-eslint/typescript-estree@8.72.2` dentro de `eslint-config-next@16.4.5`). O comando `npm audit fix --force` propunha resolver esse aviso fazendo downgrade de `eslint-config-next` para `15.5.29`.
- **Opções Avaliadas:**
  1. Executar `npm audit fix --force` para obter `0 vulnerabilities` a qualquer custo.
  2. Forçar `overrides` agressivos de `minimatch` no `package.json` sem garantia de compatibilidade interna com `@typescript-eslint`.
  3. Atualizar todas as dependências compatíveis na série `Next 16.4.x` / `Vitest 4.1.x` e registrar `minimatch@10.2.6` como risco residual aceito temporariamente (`RISCO ACEITO`).
- **Decisão Tomada:** **Opção 3 — Proibir downgrade via `--force` e aceitar temporariamente o risco residual em `devDependencies`.**
- **Justificativa:** Rebaixar `eslint-config-next` para a v15 em um projeto Next.js 16 introduz incompatibilidade real de toolchain para corrigir um ReDoS teórico que só existe no linter local de desenvolvimento e nunca vai para produção.
- **Impacto Técnico:** O estado esperado do `npm audit` após a branch `security/dependency-updates` é de 8 avisos moderados restritos à cadeia `@typescript-eslint` -> `minimatch`, devendo ser reavaliado quando o upstream lançar patch compatível na série 16.

---

## ADR-005: Preferência por APIs Web Nativas em vez de Bibliotecas Externas de UI

- **Data:** 2026-11-09 (`VERIFICADO`)
- **Contexto:** O projeto implementa modal de detalhes de competências, compartilhamento de página, animação de dica de rolagem e alternância de idioma PT/EN.
- **Opções Avaliadas:**
  1. Utilizar bibliotecas externas pesadas (Radix UI / Headless UI para modal, `react-i18next` para tradução, bibliotecas de clipboard/share).
  2. Utilizar APIs nativas da plataforma Web (`<dialog>`, `navigator.share`, `navigator.clipboard`, `IntersectionObserver`) e Context API nativa do React (`LanguageContext`).
- **Decisão Tomada:** **Opção 2 — Priorizar APIs Web nativas e React Context.**
- **Justificativa:** Reduz drasticamente o bundle JavaScript enviado ao cliente, minimiza a árvore de dependências sujeita a CVEs (SCA) e simplifica a manutenção a longo prazo.
- **Impacto Técnico:** Melhorias de acessibilidade no modal (`SkillModal.tsx`) devem aprimorar o uso do elemento `<dialog>` nativo, sem instalar bibliotecas externas de modal.

---

## ADR-006: Manutenção de Contatos Públicos na UI e Omissão de PII na Documentação Técnica

- **Data:** 2026-11-09 (`VERIFICADO`)
- **Contexto:** Por ser um currículo/portfólio público, a aplicação exibe botões de contato direto (WhatsApp, LinkedIn, E-mail e GitHub) em `src/components/Contact/Contact.tsx`.
- **Opções Avaliadas:**
  1. Remover telefone e e-mail do portfólio ou exigir CAPTCHA/formulário de backend.
  2. Manter os canais de contato visíveis na interface da aplicação (`RISCO ACEITO`), mas proibir a cópia de telefone e e-mail em texto puro nos arquivos de documentação técnica (`AGENTS.md` e `docs/`).
- **Decisão Tomada:** **Opção 2 — Manter na UI do portfólio como risco de negócio aceito e higienizar a documentação técnica.**
- **Justificativa:** A finalidade principal do portfólio é permitir contato rápido e sem fricção por recrutadores. Ao mesmo tempo, evitar repetir PII em arquivos de documentação e prompts reduz a propagação desnecessária desses dados em contextos de IA e logs.
- **Impacto Técnico:** Nenhum arquivo em `docs/` ou `AGENTS.md` deve conter o telefone ou e-mail pessoal em texto puro.

---

## ADR-007: Hardening do GitHub Actions — Deploy Exclusivo via `push` em `master` Condicionado à CI/Quality Gate e Pinning por SHA

- **Data:** 2026-11-09 (`VERIFICADO`)
- **Contexto:** O workflow original (`.github/workflows/build.yml`) disparava o deploy de produção no fechamento de PR (`pull_request: closed`) sem exigir `needs: ci`, executava o `SonarCloud Quality Gate` apenas em eventos `pull_request`, concedia permissões de escrita no `GITHUB_TOKEN`, usava tags mutáveis nas Actions e instalava `vercel` sem versão fixa.
- **Opções Avaliadas:**
  1. Manter o deploy atrelado ao evento `pull_request: closed` e executar o Quality Gate apenas em PRs.
  2. Acionar o deploy exclusivamente em eventos `push` na branch `master` (`github.event_name == 'push' && github.ref == 'refs/heads/master'`), condicionado a `needs: ci`, tornando o `SonarCloud Quality Gate` obrigatório tanto em `pull_request` quanto em `push` para `master` (sem executá-lo em pushes para `dev` ou `integration/security-quality`), com menor privilégio estrito no `GITHUB_TOKEN`, Actions fixadas por SHA de 40 caracteres e Vercel CLI com versão exata (`vercel@65.14.0`).
- **Decisão Tomada:** **Opção 2 — Deploy exclusivo via `push` na `master` condicionado à aprovação integral do job `ci` (incluindo o Quality Gate em `master`), menor privilégio estrito e Pinning por SHA de 40 caracteres.**
- **Justificativa:**
  1. O Quality Gate é obrigatório tanto em PRs quanto em pushes para `master` (`github.event_name == 'pull_request' || (github.event_name == 'push' && github.ref == 'refs/heads/master')`).
  2. O deploy (`deploy_vercel`) depende da aprovação integral do job `ci` (`needs: ci`), incluindo a aprovação do Quality Gate.
  3. A execução em `master` avalia o commit efetivamente recebido pela branch antes de liberar o deploy de produção, enquanto evita bloqueios desnecessários em pushes intermediários para `dev` e `integration/security-quality`.
- **Impacto Técnico:** Qualquer atualização futura de GitHub Actions em `.github/workflows/build.yml` deve consultar o commit SHA dereferenciado (`^{}`) da release oficial via `git ls-remote` e manter o comentário da versão correspondente.

---

## ADR-008: Auditoria e Refinamento da Content Security Policy (CSP) Estática Compatível com Next.js App Router (SSG)

- **Data:** 2026-11-09 (`VERIFICADO`)
- **Contexto:** Durante a auditoria técnica dedicada de Content Security Policy (`SEC-04`), inspecionaram-se os artefatos reais gerados pelo Next.js 16.4.5 (`.next/server/app/index.html`, `_not-found.html`, `_global-error.html` e chunks CSS/JS em `.next/static/`) para verificar a viabilidade de eliminar `'unsafe-inline'` via nonces ou hashes SHA-256, avaliar `Content-Security-Policy-Report-Only` e eliminar permissões excessivas ou diretivas ausentes na CSP introduzida na `SEC-02`.
- **Opções Avaliadas:**
  1. **CSP Dinâmica com Nonces (`'nonce-...'` via `middleware.ts` / SSR):** Gerar um nonce por requisição HTTP e forçar renderização dinâmica em todas as rotas.
  2. **CSP Estática com Hashes SHA-256 (`'sha256-...'`) sem `'unsafe-inline'`:** Tentar listar hashes estáticos no cabeçalho HTTP em `next.config.ts`.
  3. **Substituir a CSP de bloqueio por `Content-Security-Policy-Report-Only`:** Operar apenas em modo de observação sem bloqueio efetivo.
  4. **Manter CSP em Modo de Bloqueio (`Content-Security-Policy`) com Refinamento de Menor Privilégio Compatível com SSG:** Adicionar `frame-src 'none'`, remover esquemas não utilizados (`blob:` de `img-src` e `data:` de `font-src`), manter `'unsafe-eval'` restrito exclusivamente a `development`, preservar `'unsafe-inline'` em `script-src` e `style-src` como concessão documentada para SSG e instituir testes unitários automatizados (`src/__tests__/nextConfigHeaders.test.ts`).
- **Decisão Tomada:** **Opção 4 — CSP em modo de bloqueio com menor privilégio estrito compatível com SSG e validação automatizada.**
- **Justificativa:**
  1. **Inviabilidade de Nonces em SSG:** Nonces exigem geração por requisição via Middleware e desativam a geração estática (`○ Static`), contrariando a arquitetura do portfólio (`ADR-001`).
  2. **Inviabilidade de Hashes SHA-256 em `next.config.ts`:** O Next.js 16.4.5 App Router injeta 6 scripts inline em `index.html` e `_not-found.html` (`self.__next_f.push(...)`) contendo nomes de chunks e build ID gerados durante a compilação, enquanto `next.config.ts` (`headers()`) é avaliado antes da geração dos arquivos HTML. Além disso, `next/image` e `_not-found.html` injetam atributos HTML `style="..."` que não suportam nonces individuais.
  3. **Inadequação de `Report-Only` isolado:** Sem um endpoint externo coletor de relatórios (`report-uri`/`report-to`), substituir `Content-Security-Policy` por `Content-Security-Policy-Report-Only` apenas desativaria a proteção ativa no navegador, enfraquecendo a política anterior.
  4. **Redução efetiva da superfície de ataque:** A remoção de `blob:` em `img-src`, a remoção de `data:` em `font-src` e a adição de `frame-src 'none'` eliminam permissões desnecessárias sem afetar nenhum recurso legítimo do portfólio.
- **Impacto Técnico:** As funções `buildCspHeader(isDev)` e `getSecurityHeaders(isDev)` em `next.config.ts` são verificadas automaticamente pela suíte `src/__tests__/nextConfigHeaders.test.ts` em toda execução do Vitest e na pipeline de CI.
