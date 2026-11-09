# 08. Registro de Achados de Segurança, Bugs e Riscos

> **Legenda de Status de Ciclo de Vida:**
> - `Identificado`: Problema comprovado na auditoria sobre `e56f30f`, aguardando início da implementação na branch responsável.
> - `Validado`: Correção implementada e validada com testes/build/audit na branch temática local, aguardando aprovação para merge em `integration/security-quality`.
> - `Integrado`: Correção validada e já mesclada em `integration/security-quality`.
> - `Aceito como risco residual`: Risco avaliado e aceito com justificativa técnica ou de negócio.
>
> **Marcadores de Precisão:** `VERIFICADO` | `PENDENTE` | `PLANEJADO` | `RISCO ACEITO`

---

## 1. Achados de Segurança (`SEC-01` a `SEC-06`)

### `[SEC-01]` Vulnerabilidades em Dependências Diretas e Transitivas (SCA)
- **Severidade:** Crítica / Alta (em `e56f30f`) -> Reduzida para Moderada apenas em `devDependencies` (em `5f0cf3f`)
- **Arquivos / Dependências Afetadas:** `package.json`, `package-lock.json` (`next@16.1.6`, `eslint-config-next@16.1.1`, `vitest@4.0.17`, `@vitest/ui@4.0.17`, `@vitest/coverage-v8@4.0.17`, `vite`, `undici`, `flatted`, `picomatch`, `postcss`, `sharp`, `zod`, `js-yaml`, `brace-expansion`).
- **Impacto Potencial:** Negação de serviço (DoS/ReDoS), *HTTP Request/Response Smuggling* em `undici`, *Prototype Pollution* / recursão descontrolada em `flatted`, *Path Traversal* / leitura arbitrária de arquivos no servidor de dev do `vite` e vulnerabilidades no App Router/Image Optimization do `next@16.1.6`.
- **Status Atual:** **`Integrado` em `integration/security-quality` (`5f0cf3f` / merge `f4cfae2`) [`VERIFICADO`]**.
- **Branch Responsável:** `security/dependency-updates`
- **Medida Corretiva Adotada:** Atualização de `next` e `eslint-config-next` para `16.4.5`, suíte `vitest` para `4.1.12` (com `vite@8.3.7`) e atualização de dependências transitivas compatíveis.
- **Evidência de Validação (`5f0cf3f` / `f4cfae2`):**
  - `npx tsc --noEmit`: código `0`
  - `npm run lint`: código `0`
  - `npm run test:coverage`: `32 passed` (114 testes), `98.72%` statements
  - `npm run build`: código `0`
  - `npm audit`: redução de **29 vulnerabilidades (4 críticas, 12 altas, 12 moderadas, 1 baixa)** para **8 moderadas** restritas ao linter.
- **Risco Residual (`RISCO ACEITO`):** Permanece o advisory moderado `GHSA-g3hv-75wg-m249` em `minimatch@10.2.6` (subdependência de `@typescript-eslint/typescript-estree@8.72.2` -> `eslint-config-next@16.4.5`). Afeta apenas o linter em desenvolvimento; corrigi-lo via `--force` faria downgrade incompatível para `eslint-config-next@15.5.29`.

---

### `[SEC-02]` Ausência de Cabeçalhos HTTP de Segurança e Exposição de `X-Powered-By` (DAST / Configuração)
- **Severidade:** Média
- **Arquivos Afetadas:** `next.config.ts`
- **Impacto Potencial:** Ausência de defesa em profundidade contra *Clickjacking* (falta de `X-Frame-Options` e `frame-ancestors`), *MIME-sniffing* (falta de `X-Content-Type-Options: nosniff`), injeção de scripts/estilos de terceiros (falta de `Content-Security-Policy`), vazamento excessivo de URL de referência (falta de `Referrer-Policy`), uso indevido de APIs de hardware (falta de `Permissions-Policy`) e exposição desnecessária do cabeçalho `X-Powered-By: Next.js`.
- **Status Atual:** **`Integrado` em `integration/security-quality` (`fbb64d9` / merge `c872bc0`) [`VERIFICADO`]**.
- **Branch Responsável:** `security/http-headers`
- **Medida Corretiva Adotada:** Configuração de `poweredByHeader: false` e função `async headers()` em `next.config.ts` (`source: "/:path*"`) aplicando `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` e `Permissions-Policy: camera=(), microphone=(), geolocation=(), browsing-topics=()`, preservando integralmente a arquitetura estática (SSG).
- **Evidência de Validação (`fbb64d9` / `c872bc0`):**
  - `npx tsc --noEmit`: código `0`
  - `npm run lint`: código `0`
  - `npm run test:coverage`: `32 passed` (114 testes), `98.72%` statements
  - `npm run build`: código `0` (rotas `/` e `/_not-found` geradas como `○ Static`)
  - Inspeção HTTP e validação em navegador real (Google Chrome via CDP contra `next start`): confirmação dos 5 cabeçalhos e ausência de `X-Powered-By` nas rotas `/` (`200`) e `/rota-inexistente-404` (`404`), com `0` violações `securitypolicyviolation`.
- **Risco Residual (`RISCO ACEITO`):** Refinado e detalhado em `[SEC-04]` (`ADR-008`).

---

### `[SEC-03]` Fragilidades de Supply Chain, Permissões e Estratégia de Deploy no GitHub Actions
- **Severidade:** Média / Baixa
- **Arquivos Afetados:** `.github/workflows/build.yml`, `eslint.config.mjs`, `sonar-project.properties`
- **Impacto Potencial:**
  1. Instalação não fixada `npm i -g vercel` expunha os jobs de deploy (que detêm `VERCEL_TOKEN`) a versões não testadas ou comprometimento de supply chain.
  2. Uso de tags mutáveis (`@v4`, `@v5`, `@v6`, `@v1`) nas GitHub Actions.
  3. Permissões excessivas de escrita (`pull-requests: write`, `checks: write`, `statuses: write`) no `GITHUB_TOKEN` sem padrão global restritivo.
  4. Acionamento de deploy em `pull_request: closed` sem dependência formal (`needs: ci`) e sem validação do Quality Gate sobre o commit efetivo da `master`.
- **Status Atual:** **`Integrado` em `integration/security-quality` (`15e4cd6` / merge `aaf71f8`) [`VERIFICADO`]**.
- **Branch Responsável:** `security/github-actions`
- **Medida Corretiva Adotada:**
  1. Definido `permissions: contents: read` como padrão global do workflow; no job `ci`, restrito apenas a `contents: read` e `pull-requests: read` (zero permissões de escrita); no job `deploy_vercel`, restrito a `contents: read`.
  2. Todas as Actions fixadas por SHA completo de 40 caracteres do commit oficial dereferenciado (`actions/checkout@11d5960a326750d5838078e36cf38b85af677262`, `actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020`, `SonarSource/sonarqube-scan-action@fd88b7d7ccbaefd23d8f36f73b59db7a3d246602`, `SonarSource/sonarqube-quality-gate-action@7a5fffe8e523c40e0c740b6bc2712ab503e52efa`, `codecov/codecov-action@0fb7174895f61a3b6b78fc075e0cd60383518dac`).
  3. Fixada versão exata da Vercel CLI: `npm i -g vercel@65.14.0`.
  4. Configurada a etapa `SonarCloud Quality Gate` para executar obrigatoriamente em `pull_request` e em `push` para `master` (`github.event_name == 'pull_request' || (github.event_name == 'push' && github.ref == 'refs/heads/master')`), omitindo-a em pushes para `dev` e `integration/security-quality`.
  5. Configurado `deploy_vercel` com `needs: ci` e condição `success() && github.event_name == 'push' && github.ref == 'refs/heads/master'`.
- **Evidência de Validação (`15e4cd6` / `aaf71f8`):**
  - `npx tsc --noEmit`: código `0`
  - `npm run lint`: código `0` (`0 errors, 0 warnings`)
  - `npm run test:coverage`: `32 passed` (114 testes), `98.72%` statements
  - `npm run build`: código `0`
  - Verificação estrutural do YAML, condições `if` e correspondência exata dos SHAs de 40 caracteres via `git ls-remote`.
- **Risco Residual (`RISCO ACEITO`):** O pinning por SHA imutável requer atualização manual do hash de 40 caracteres quando novas versões das Actions forem adotadas, conforme critério documentado em `03-security-baseline.md` e `ADR-007`.

---

### `[SEC-04]` Auditoria e Refinamento da Content Security Policy (CSP) Compatível com SSG
- **Severidade:** Média / Baixa (Hardening de Defesa em Profundidade)
- **Arquivos Afetados:** `next.config.ts`, `src/__tests__/nextConfigHeaders.test.ts`
- **Impacto Potencial (Estado Anterior à SEC-04):**
  1. Ausência da diretiva explícita `frame-src`, fazendo com que o navegador recorresse ao fallback `default-src 'self'` (permitindo que a própria página criasse `<iframe src="/...">` ou `<frame>` same-origin caso ocorresse injeção de HTML).
  2. Permissão desnecessária do esquema `blob:` em `img-src` (`img-src 'self' data: blob:`), sem que a aplicação utilize URLs `blob:`.
  3. Permissão desnecessária do esquema `data:` em `font-src` (`font-src 'self' data:`), dado que todas as 11 faces de fonte `.woff2` geradas por `next/font/google` são servidas exclusivamente via `'self'` (`/_next/static/media/*.woff2`).
  4. Ausência de suíte de testes unitários automatizados para validar continuamente a configuração de `headers()` e as diretivas CSP de produção e desenvolvimento em `next.config.ts`.
- **Status Atual:** **`Validado` na branch local `security/content-security-policy` [`VERIFICADO`] / `PENDENTE` de merge em `integration/security-quality`**.
- **Branch Responsável:** `security/content-security-policy`
- **Medida Corretiva Adotada:**
  1. Adicionada a diretiva explícita `frame-src 'none'` à CSP, bloqueando integralmente o carregamento de `<frame>` e `<iframe>` pela página.
  2. Restringida `img-src` para `'self' data:` (removendo `blob:`), preservando `'self'` para `/_next/image` e `data:` para o SVG placeholder interno do runtime cliente de `next/image`.
  3. Restringida `font-src` para `'self'` (removendo `data:`), autorizando apenas os arquivos `.woff2` auto-hospedados em `/_next/static/media/`.
  4. Mantido `script-src 'self' 'unsafe-inline'` em produção (restringindo `'unsafe-eval'` estritamente a `NODE_ENV === "development"`) e `style-src 'self' 'unsafe-inline'` após comprovação técnica no build `.next/server/app/` de que o Next.js 16.4.5 SSG injeta 6–7 scripts inline `self.__next_f.push(...)` com hashes variáveis por build e estilos inline em `next/image` e `_not-found.html`.
  5. Exportadas as funções `buildCspHeader(isDev)` e `getSecurityHeaders(isDev)` em `next.config.ts` e criada a suíte automatizada `src/__tests__/nextConfigHeaders.test.ts` (4 testes cobrindo 100% de `next.config.ts`).
- **Evidência de Validação:**
  - **Validação estática:** `npx tsc --noEmit` (código `0`) e `npm run lint` (código `0`, `0 errors, 0 warnings`).
  - **Validação automatizada (Vitest):** `npm run test:coverage` (código `0`: `33 passed`, `118 passed`; cobertura de `100%` em `next.config.ts` e `98.75%` statements global).
  - **Validação de build (SSG):** `npm run build` (código `0`; rotas `/` e `/_not-found` pré-renderizadas como `○ Static`).
  - **Validação HTTP (`next start`):** Respostas `200` (`/`) e `404` (`/rota-inexistente-404`) confirmadas sem `X-Powered-By` e com a nova string CSP e demais 4 cabeçalhos de segurança.
  - **Validação em navegador real (Google Chrome headless via CDP contra `next start`):** `0` violações `securitypolicyviolation`, `0` falhas de rede, `13` faces de fonte carregadas (`document.fonts.status === "loaded"`) e navegação/interação íntegras em `/` e `/rota-inexistente-404`.
  - **Validação em produção remota (Vercel):** Não executada nesta etapa (push e deploy não autorizados antes da revisão e integração).
- **Risco Residual (`RISCO ACEITO`):** A presença de `'unsafe-inline'` em `script-src` e `style-src` permanece como concessão arquitetural estritamente necessária para preservar a geração estática (SSG) no Next.js 16.4.5 App Router sem introduzir SSR/Middleware dinâmico por requisição (`ADR-008`), sendo mitigada pela ausência de `'unsafe-eval'` em produção, bloqueio total de origens externas (`default-src 'self'`, `object-src 'none'`, `base-uri 'self'`, `frame-src 'none'`, `frame-ancestors 'none'`) e auditoria SAST limpa (`[SEC-06]`).

---

### `[SEC-05]` Exposição Pública de Dados de Contato e Currículo Externo — Privacidade *(anteriormente registrado como SEC-04)*
- **Severidade:** Baixa / Informativa
- **Arquivos Afetados:** `src/components/Contact/Contact.tsx`, `README.md`, `src/components/CurriculumDriveAccess/CurriculumDriveAccess.tsx`
- **Impacto Potencial:** Coleta automatizada (*scraping*) de endereço de e-mail e número de telefone por bots de spam/phishing em repositório público.
- **Status Atual:** **`Aceito como risco residual` [`RISCO ACEITO`]** para a aplicação de portfólio; **regra de proteção ativa na documentação (`VERIFICADO`)** proibindo replicar telefone/e-mail nos arquivos de `docs/` e `AGENTS.md`.
- **Branch Responsável:** N/A (Decisão de negócio; higienização documental aplicada em `docs/project-playbook`).
- **Medida Corretiva Adotada:** Manter os links funcionais na UI para recrutadores, omitir dados pessoais em texto puro na documentação técnica (`AGENTS.md` e `docs/`) e manter verificação de que imagens em `public/images/` não possuem metadados EXIF de GPS (`VERIFICADO`).

---

### `[SEC-06]` SAST, Detecção de Segredos e Segurança de Links Externos *(anteriormente registrado como SEC-05)*
- **Severidade:** Nenhuma (Auditoria aprovada sem vulnerabilidades)
- **Arquivos Auditados:** Todo o diretório `src/**`, histórico Git (`git log -p`) e componentes com links externos (`ContactItem.tsx`, `CurriculumDriveAccess.tsx`, `ExperienceActivityItem.tsx`).
- **Impacto Potencial:** N/A.
- **Status Atual:** **`Validado` / Conforme [`VERIFICADO`]**.
- **Evidência de Validação:**
  - Zero ocorrências de `dangerouslySetInnerHTML`, `eval`, `innerHTML` ou Open Redirect.
  - Zero segredos ou chaves privadas expostas no código ou histórico Git.
  - Todos os links `target="_blank"` utilizam `https://` e `rel="noopener noreferrer"`.

---

## 2. Achados de Qualidade, Bugs, Performance, Acessibilidade, SEO e Limpeza

| ID | Categoria | Descrição Técnica | Severidade | Arquivos Afetados | Status Atual | Branch Responsável |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `BUG-01` | Bug Funcional | `ExperienceActivityItem` renderiza apenas `activity.links?.[0]`, ignorando os demais itens do array `links` (ocultando 2 links reais da experiência *Full Cycle / Dinamio*: "Mobile Repo" e "Backend Repo"). | **Alta (Funcional)** | `src/components/Experience/ExperienceActivityItem.tsx`, `src/data/experiences/{pt,en}.ts` | `Identificado` (`PENDENTE`) | `fix/functional-bugs` |
| `BUG-02` | Bug Funcional | O mapeamento `activityLinkTypeIcons` aponta `website` para `'/images/icons/link.png'`, arquivo que **não existe** em `public/images/icons/` (causando erro 404 se o tipo `website` for usado). | **Média (Funcional)** | `src/types/ExperienceRelated/ActivityLink.ts`, `public/images/icons/` | `Identificado` (`PENDENTE`) | `fix/functional-bugs` |
| `PERF-01` | Performance | Imagens superdimensionadas: `logoMercado.png` tem **5600×6000 px (950 KB)** para exibição em 32×32 / 48×48 px; `profile.jpg` tem **3840×5760 px (641 KB)** e `HeaderAvatar.tsx` usa `fill` sem a prop `sizes` (baixando imagem de `100vw` para um avatar de `64px`/`80px`). | **Alta (Performance)** | `public/images/logos/logoMercado.png`, `public/images/profile.jpg`, `src/components/Header/HeaderAvatar.tsx` | `Identificado` (`PENDENTE`) | `perf/image-font-optimization` |
| `PERF-02` | Performance | `layout.tsx` baixa e injeta as fontes `Geist` e `Geist_Mono` (~138 KB `.woff2`), mas `globals.css` sobrescreve `body { font-family: Arial, Helvetica, sans-serif; }`, tornando o download das fontes inútil. | **Média (Performance)** | `src/app/layout.tsx`, `src/app/globals.css` | `Identificado` (`PENDENTE`) | `perf/image-font-optimization` |
| `PERF-03` | Performance / a11y | Animação infinita `floatGradient` em `body::before` (`globals.css`) roda continuamente na GPU sem `@media (prefers-reduced-motion: reduce)`. | **Baixa** | `src/app/globals.css` | `Identificado` (`PENDENTE`) | `perf/image-font-optimization` |
| `PERF-04` | Performance | Listener de scroll em `useHeaderScroll.ts` registrado sem `{ passive: true }`. | **Baixa** | `src/components/Header/useHeaderScroll.ts` | `Identificado` (`PENDENTE`) | `perf/image-font-optimization` |
| `A11Y-01` | Acessibilidade / i18n | `<html lang="pt">` estático em `layout.tsx` não atualiza para `"en"` quando o usuário troca o idioma no `LanguageContext`. | **Média** | `src/app/layout.tsx`, `src/context/LanguageContext.tsx` | `Identificado` (`PENDENTE`) | `feat/accessibility-seo` |
| `A11Y-02` | Acessibilidade / i18n | Atributos `aria-label` e `alt` hardcoded em português mesmo quando o idioma ativo é inglês (`HeaderAvatar.tsx`, `SharePageButton.tsx`, `SkillButton.tsx`, `SkillModal.tsx`). | **Média** | `HeaderAvatar.tsx`, `SharePageButton.tsx`, `SkillButton.tsx`, `SkillModal.tsx`, `src/i18n/{pt,en}.ts` | `Identificado` (`PENDENTE`) | `feat/accessibility-seo` |
| `A11Y-03` | Acessibilidade | `SkillModal.tsx` usa `<dialog open={...}>` sem `.showModal()`, não possui *focus trap*, não trata tecla `Escape` e possui dois botões com o mesmo `aria-label="Fechar modal"` na ordem de tabulação. | **Média** | `src/components/Skills/SkillModal.tsx` | `Identificado` (`PENDENTE`) | `feat/accessibility-seo` |
| `A11Y-04` | Acessibilidade | `ExperienceTabs.tsx` não declara `role="tablist"`, `role="tab"` nem `aria-selected`. | **Baixa** | `src/components/Experience/ExperienceTabs.tsx` | `Identificado` (`PENDENTE`) | `feat/accessibility-seo` |
| `A11Y-05` | Acessibilidade | `Header.tsx` utiliza elemento `<nav>` sem links de navegação; `.hintrc` desativa `"axe/aria": "off"`. | **Baixa** | `src/components/Header/Header.tsx`, `.hintrc` | `Identificado` (`PENDENTE`) | `feat/accessibility-seo` |
| `SEO-01` | SEO | `metadata` em `layout.tsx` mistura título em PT com descrição genérica em EN (`"Personal curriculum website"`), sem metadados Open Graph, Twitter Card ou `metadataBase`. | **Média** | `src/app/layout.tsx` | `Identificado` (`PENDENTE`) | `feat/accessibility-seo` |
| `SEO-02` | SEO | Ausência de `src/app/robots.ts` e `src/app/sitemap.ts` para indexação por buscadores. | **Baixa** | `src/app/` | `Identificado` (`PENDENTE`) | `feat/accessibility-seo` |
| `CI-01` | CI/CD | Inclusão de `npx tsc --noEmit`, `npm run lint` e `npm run build` no job `ci` de `.github/workflows/build.yml` antes do deploy. | **Média** | `.github/workflows/build.yml` | `Integrado` em `integration/security-quality` (`VERIFICADO`) | `security/github-actions` |
| `CI-02` | Qualidade / Lint | Inclusão de `"coverage/**"` em `globalIgnores` de `eslint.config.mjs`, eliminando os 2 warnings gerados após `test:coverage`. | **Baixa** | `eslint.config.mjs` | `Integrado` em `integration/security-quality` (`VERIFICADO`) | `security/github-actions` |
| `CI-03` | Qualidade / Sonar | Unificação da chave `sonar.cpd.exclusions` em `sonar-project.properties`, preservando a exclusão de `src/data/**` e `src/__tests__/**`. | **Baixa** | `sonar-project.properties` | `Integrado` em `integration/security-quality` (`VERIFICADO`) | `security/github-actions` |
| `CLEAN-01` | Limpeza | Dependência `next-themes` não utilizada em `package.json` e arquivos órfãos do Jest (`jest.config.js`, `jest.setup.js`). | **Baixa** | `package.json`, `jest.config.js`, `jest.setup.js` | `Identificado` (`PENDENTE`) | `chore/project-cleanup` |
| `CLEAN-02` | Limpeza | Componente morto `ContactToast.tsx` (e `ContactToast.test.tsx`) nunca importado por `Contact.tsx` ou qualquer outro módulo. | **Baixa** | `src/components/Contact/ContactToast.tsx`, `ContactToast.test.tsx` | `Identificado` (`PENDENTE`) | `chore/project-cleanup` |
| `CLEAN-03` | Limpeza | Ativos públicos não utilizados (`public/file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`, `public/images/logos/logoDinamio.png`) e chaves i18n órfãs (`navbar`, `*.description`, `shareButtonStatus.id`). | **Baixa** | `public/`, `src/i18n/{pt,en}.ts` | `Identificado` (`PENDENTE`) | `chore/project-cleanup` |
| `CLEAN-04` | Tipagem / Config | `tsconfig.json` referencia arquivo inexistente `src/components/ThemeSelector/hooks/themeSelectorHook.tsx`; `FormationTimeline.tsx` e `FormationItem.tsx` não importam `Education` de `src/types/education.ts`; `vitest.setup.tsx` duplica `vi.stubGlobal("IntersectionObserver", ...)`. | **Baixa** | `tsconfig.json`, `FormationTimeline.tsx`, `FormationItem.tsx`, `vitest.setup.tsx` | `Identificado` (`PENDENTE`) | `chore/project-cleanup` |
| `CLEAN-05` | DX / Config | `.vscode/tasks.json` possui 3 tasks duplicadas `"Run Dev Server"`, sendo a primeira inválida (sem `"args"`). | **Baixa** | `.vscode/tasks.json` | `Identificado` (`PENDENTE`) | `chore/project-cleanup` |
