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
- **Justificativa:** O projeto já está estabilizado em Next.js 16 com 114 testes automatizados (~98.7% de cobertura) e deploy configurado na Vercel. Os benefícios nativos de otimização de imagens (`next/image`), SEO (`Metadata` API) e cabeçalhos HTTP (`next.config.ts`) superam o custo e o risco de reescrever a camada de build.
- **Impacto Técnico:** As melhorias de performance (`perf/image-font-optimization`), segurança (`security/http-headers`) e SEO (`feat/accessibility-seo`) devem utilizar os recursos nativos do Next.js 16.

---

## ADR-002: Adoção da Branch Intermediária `integration/security-quality`

- **Data:** 2026-11-09 (`VERIFICADO`)
- **Contexto:** A auditoria identificou melhorias distribuídas em 7 frentes distintas (dependências, cabeçalhos HTTP, GitHub Actions, bugs funcionais, performance de ativos, acessibilidade/SEO e limpeza de projeto), além da criação deste Playbook. Integrar cada frente diretamente em `master` acionaria deploys de produção parciais e dificultaria testes integrados do conjunto.
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
  2. Segregar em branches granulares por domínio técnico (`docs/project-playbook`, `security/dependency-updates`, `security/http-headers`, `security/github-actions`, `fix/functional-bugs`, `perf/image-font-optimization`, `feat/accessibility-seo`, `chore/project-cleanup`).
- **Decisão Tomada:** **Opção 2 — Segregação em branches granulares por domínio.**
- **Justificativa:** Facilita o code review humano, isola eventuais regressões (ex.: se uma diretiva CSP bloquear um recurso, é simples auditar apenas `security/http-headers`) e mantém o histórico Git limpo e rastreável.
- **Impacto Técnico:** É proibido corrigir problemas de uma branch dentro de outra (ex.: não remover código morto durante a implementação de cabeçalhos HTTP).

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

## ADR-007: Hardening do GitHub Actions — Deploy Exclusivo via `push` em `master` Condicionado à CI e Pinning por SHA

- **Data:** 2026-11-09 (`VERIFICADO`)
- **Contexto:** O workflow original (`.github/workflows/build.yml`) disparava o deploy de produção no fechamento de PR (`pull_request: closed`) sem exigir `needs: ci`, concedia permissões de escrita no `GITHUB_TOKEN`, usava tags mutáveis nas Actions e instalava `vercel` sem versão fixa.
- **Opções Avaliadas:**
  1. Manter o deploy atrelado ao evento `pull_request: closed` e apenas fixar versões.
  2. Acionar o deploy exclusivamente em eventos `push` na branch `master` (`github.event_name == 'push' && github.ref == 'refs/heads/master'`), com `needs: ci`, `permissions: contents: read` por padrão (sem nenhuma permissão de escrita no `GITHUB_TOKEN`), todas as Actions fixadas por SHA de 40 caracteres e Vercel CLI com versão exata (`vercel@65.14.0`).
- **Decisão Tomada:** **Opção 2 — Deploy exclusivo via `push` na `master` condicionado a `needs: ci`, menor privilégio estrito e Pinning por SHA de 40 caracteres.**
- **Justificativa:** Garante que nenhum código chegue à produção sem que o commit exato da `master` tenha passado por TypeScript, ESLint, testes com cobertura, build SSG e SonarCloud na própria execução da pipeline, além de eliminar riscos de *Supply Chain* por tags mutáveis ou versões flutuantes da CLI.
- **Impacto Técnico:** Qualquer atualização futura de GitHub Actions em `.github/workflows/build.yml` deve consultar o commit SHA dereferenciado (`^{}`) da release oficial via `git ls-remote` e manter o comentário da versão correspondente.
