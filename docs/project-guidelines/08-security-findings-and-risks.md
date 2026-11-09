# 08. Registro de Achados de Segurança, Bugs e Riscos

> **Legenda de Status de Ciclo de Vida:**
> - `Identificado`: Problema comprovado na auditoria sobre `e56f30f`, aguardando início da implementação na branch responsável.
> - `Validado`: Correção implementada e validada com testes/build/audit na branch temática local, aguardando aprovação para merge em `integration/security-quality`.
> - `Integrado`: Correção já mesclada em `integration/security-quality` (nenhuma branch temática foi mesclada até o momento).
> - `Aceito como risco residual`: Risco avaliado e aceito com justificativa técnica ou de negócio.
>
> **Marcadores de Precisão:** `VERIFICADO` | `PENDENTE` | `PLANEJADO` | `RISCO ACEITO`

---

## 1. Achados de Segurança (`SEC-01` a `SEC-05`)

### `[SEC-01]` Vulnerabilidades em Dependências Diretas e Transitivas (SCA)
- **Severidade:** Crítica / Alta (em `e56f30f`) -> Reduzida para Moderada apenas em `devDependencies` (em `5f0cf3f`)
- **Arquivos / Dependências Afetadas:** `package.json`, `package-lock.json` (`next@16.1.6`, `eslint-config-next@16.1.1`, `vitest@4.0.17`, `@vitest/ui@4.0.17`, `@vitest/coverage-v8@4.0.17`, `vite`, `undici`, `flatted`, `picomatch`, `postcss`, `sharp`, `zod`, `js-yaml`, `brace-expansion`).
- **Impacto Potencial:** Negação de serviço (DoS/ReDoS), *HTTP Request/Response Smuggling* em `undici`, *Prototype Pollution* / recursão descontrolada em `flatted`, *Path Traversal* / leitura arbitrária de arquivos no servidor de dev do `vite` e vulnerabilidades no App Router/Image Optimization do `next@16.1.6`.
- **Status Atual:** **`Validado` na branch local `security/dependency-updates` (`5f0cf3f`) [`VERIFICADO`] / `PENDENTE` de merge em `integration/security-quality`**.
- **Branch Responsável:** `security/dependency-updates`
- **Medida Corretiva Adotada:** Atualização de `next` e `eslint-config-next` para `16.4.5`, suíte `vitest` para `4.1.12` (com `vite@8.3.7`) e atualização de dependências transitivas compatíveis.
- **Evidência de Validação (`5f0cf3f`):**
  - `npx tsc --noEmit`: código `0`
  - `npm run lint`: código `0`
  - `npm run test:coverage`: `32 passed` (114 testes), `98.72%` statements
  - `npm run build`: código `0`
  - `npm audit`: redução de **29 vulnerabilidades (4 críticas, 12 altas, 12 moderadas, 1 baixa)** para **8 moderadas** restritas ao linter.
- **Risco Residual (`RISCO ACEITO`):** Permanece o advisory moderado `GHSA-g3hv-75wg-m249` em `minimatch@10.2.6` (subdependência de `@typescript-eslint/typescript-estree@8.72.2` -> `eslint-config-next@16.4.5`). Afeta apenas o linter em desenvolvimento; corrigi-lo via `--force` faria downgrade incompatível para `eslint-config-next@15.5.29`.

---

### `[SEC-02]` Ausência de Cabeçalhos HTTP de Segurança e Exposição de `X-Powered-By` (DAST / Configuração)
- **Severidade:** Média
- **Arquivos Afetados:** `next.config.ts`
- **Impacto Potencial:** Ausência de defesa em profundidade contra *Clickjacking* (falta de `X-Frame-Options` e `frame-ancestors`), *MIME-sniffing* (falta de `X-Content-Type-Options: nosniff`), injeção de scripts/estilos de terceiros (falta de `Content-Security-Policy`), vazamento excessivo de URL de referência (falta de `Referrer-Policy`), uso indevido de APIs de hardware (falta de `Permissions-Policy`) e exposição desnecessária do cabeçalho `X-Powered-By: Next.js`.
- **Status Atual:** **`Identificado` [`VERIFICADO` em auditoria] / `PENDENTE` de implementação**.
- **Branch Responsável:** `security/http-headers` (`PLANEJADO`)
- **Medida Corretiva Planejada:** Configurar `poweredByHeader: false` e função `async headers()` em `next.config.ts` aplicando `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` e `Permissions-Policy: camera=(), microphone=(), geolocation=(), browsing-topics=()`.
- **Evidência de Validação:** A ser comprovada na branch `security/http-headers` via `npm run build`, `npm run start` e inspeção dos cabeçalhos HTTP de resposta (`HEAD http://localhost:3000`).
- **Risco Residual:** Uso de `'unsafe-inline'` em `script-src` e `style-src` na CSP estática é requerido pelo modelo de geração estática (SSG) do Next.js App Router quando nonces dinâmicos por requisição não são utilizados.

---

### `[SEC-03]` Fragilidades de Supply Chain e Permissões no Workflow do GitHub Actions
- **Severidade:** Média / Baixa
- **Arquivos Afetados:** `.github/workflows/build.yml`
- **Impacto Potencial:**
  1. O comando `npm i -g vercel` instala sempre a versão mais recente sem fixação de versão, expondo os jobs de deploy (que detêm `VERCEL_TOKEN`) a alterações inesperadas ou comprometimento de supply chain.
  2. Uso de tags mutáveis (`@v4`, `@v5`, `@v6`) nas actions.
  3. Permissões `checks: write` e `issues: write` concedidas globalmente em todos os eventos, inclusive `push`.
- **Status Atual:** **`Identificado` [`VERIFICADO` em auditoria] / `PENDENTE` de implementação**.
- **Branch Responsável:** `security/github-actions` (`PLANEJADO`)
- **Medida Corretiva Planejada:** Restringir `permissions` por job seguindo o princípio do menor privilégio, fixar versão determinística do pacote `vercel` CLI e adicionar verificações de `lint`, `tsc --noEmit` e `build` no job `ci`.
- **Evidência de Validação:** A ser validada na branch `security/github-actions`.

---

### `[SEC-04]` Exposição Pública de Dados de Contato e Currículo Externo (Privacidade)
- **Severidade:** Baixa / Informativa
- **Arquivos Afetados:** `src/components/Contact/Contact.tsx`, `README.md`, `src/components/CurriculumDriveAccess/CurriculumDriveAccess.tsx`
- **Impacto Potencial:** Coleta automatizada (*scraping*) de endereço de e-mail e número de telefone por bots de spam/phishing em repositório público.
- **Status Atual:** **`Aceito como risco residual` [`RISCO ACEITO`]** para a aplicação de portfólio; **regra de proteção ativa na documentação (`VERIFICADO`)** proibindo replicar telefone/e-mail nos arquivos de `docs/` e `AGENTS.md`.
- **Branch Responsável:** N/A (Decisão de negócio; higienização documental aplicada em `docs/project-playbook`).
- **Medida Corretiva Adotada:** Manter os links funcionais na UI para recrutadores, omitir dados pessoais em texto puro na documentação técnica (`AGENTS.md` e `docs/`) e manter verificação de que imagens em `public/images/` não possuem metadados EXIF de GPS (`VERIFICADO`).

---

### `[SEC-05]` SAST, Detecção de Segredos e Segurança de Links Externos
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
| `CI-01` | CI/CD | O job `ci` em `.github/workflows/build.yml` executa apenas testes, não validando `npm run lint`, `npx tsc --noEmit` nem `npm run build` antes do deploy. | **Média** | `.github/workflows/build.yml` | `Identificado` (`PENDENTE`) | `security/github-actions` |
| `CI-02` | Qualidade / Lint | `eslint.config.mjs` não ignora `coverage/**`, gerando 2 warnings nos arquivos de relatório do Vitest quando `npm run lint` roda após `test:coverage`. | **Baixa** | `eslint.config.mjs` | `Identificado` (`PENDENTE`) | `security/github-actions` |
| `CI-03` | Qualidade / Sonar | `sonar-project.properties` define a chave `sonar.cpd.exclusions` duas vezes (linhas 16 e 19), fazendo a segunda sobrescrever a primeira e anular a exclusão de `src/data/**`. | **Baixa** | `sonar-project.properties` | `Identificado` (`PENDENTE`) | `security/github-actions` |
| `CLEAN-01` | Limpeza | Dependência `next-themes` não utilizada em `package.json` e arquivos órfãos do Jest (`jest.config.js`, `jest.setup.js`). | **Baixa** | `package.json`, `jest.config.js`, `jest.setup.js` | `Identificado` (`PENDENTE`) | `chore/project-cleanup` |
| `CLEAN-02` | Limpeza | Componente morto `ContactToast.tsx` (e `ContactToast.test.tsx`) nunca importado por `Contact.tsx` ou qualquer outro módulo. | **Baixa** | `src/components/Contact/ContactToast.tsx`, `ContactToast.test.tsx` | `Identificado` (`PENDENTE`) | `chore/project-cleanup` |
| `CLEAN-03` | Limpeza | Ativos públicos não utilizados (`public/file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`, `public/images/logos/logoDinamio.png`) e chaves i18n órfãs (`navbar`, `*.description`, `shareButtonStatus.id`). | **Baixa** | `public/`, `src/i18n/{pt,en}.ts` | `Identificado` (`PENDENTE`) | `chore/project-cleanup` |
| `CLEAN-04` | Tipagem / Config | `tsconfig.json` referencia arquivo inexistente `src/components/ThemeSelector/hooks/themeSelectorHook.tsx`; `FormationTimeline.tsx` e `FormationItem.tsx` não importam `Education` de `src/types/education.ts`; `vitest.setup.tsx` duplica `vi.stubGlobal("IntersectionObserver", ...)`. | **Baixa** | `tsconfig.json`, `FormationTimeline.tsx`, `FormationItem.tsx`, `vitest.setup.tsx` | `Identificado` (`PENDENTE`) | `chore/project-cleanup` |
| `CLEAN-05` | DX / Config | `.vscode/tasks.json` possui 3 tasks duplicadas `"Run Dev Server"`, sendo a primeira inválida (sem `"args"`). | **Baixa** | `.vscode/tasks.json` | `Identificado` (`PENDENTE`) | `chore/project-cleanup` |
