# 06. Testes, Qualidade e Validação

> **Classificação de Status neste Documento:**
> - `VERIFICADO`: Comandos, ferramentas e métricas reais confirmados pela execução no repositório.

---

## 1. Scripts Disponíveis no `package.json` (`VERIFICADO`)

| Script | Comando Executado | Finalidade |
| :--- | :--- | :--- |
| `npm run dev` | `next dev` | Inicia o servidor de desenvolvimento em `http://localhost:3000`. |
| `npm run build` | `next build` | Gera o build de produção otimizado e valida a geração estática (SSG) das páginas. |
| `npm run start` | `next start` | Inicia o servidor Node.js de produção servindo o resultado de `.next/` (necessário para testar cabeçalhos HTTP reais). |
| `npm run lint` | `eslint` | Executa análise estática com ESLint 9 (`eslint.config.mjs`). |
| `npm test` | `vitest` | Inicia o Vitest em modo *watch* interativo para desenvolvimento local. |
| `npm run test:run` | `vitest run` | Executa toda a suíte de testes uma única vez (sem *watch*) e encerra. |
| `npm run test:ci` | `vitest run --coverage` | Executa testes com cobertura V8 em modo não interativo. |
| `npm run test:ui` | `vitest --ui` | Abre a interface visual do `@vitest/ui` no navegador. |
| `npm run test:coverage` | `vitest run --coverage` | Executa todos os testes e exibe a tabela detalhada de cobertura no terminal, gerando relatórios em `coverage/`. |
| `npm run test:a11y` | `playwright test` | Executa a suíte E2E de acessibilidade (`e2e/accessibility.spec.ts`) com `@playwright/test` + `@axe-core/playwright` contra o servidor `next start` (requer build prévio via `npm run build`). |

---

## 1.5. Ambiente de Runtime Validado (`VERIFICADO` — Node.js 26 LTS)

- **Node.js (local e CI):** `v26.13.0` ([`.nvmrc`](../../.nvmrc) fixado em `26.13.0` e [`package.json`](../../package.json) declarando `"engines": { "node": "26.x" }`).
- **npm utilizado na validação:** `11.20.0` (`npm ci` executado sem flags de contorno, instalando `470` pacotes).
- **Observação de Compatibilidade (não bloqueante):** sob Node.js `v26.13.0`, Vitest (`4.1.12`) e Next.js (`16.4.5`) emitem o aviso `DeprecationWarning: [DEP0205] module.register() is deprecated` e o Vitest exibe aviso informativo de sintaxe ESM em `vitest.config.ts` (`configLoader: 'native'`); ambos não impactam o código de saída nem a geração de artefatos.

---

## 2. Arquitetura da Suíte de Testes (`VERIFICADO`)

- **Test Runner:** Vitest (`vitest.config.ts`) configurado com ambiente `jsdom` e `globals: true`.
- **Arquivo de Setup (`vitest.setup.tsx`):**
  - Importa matchers do `@testing-library/jest-dom`.
  - Define mocks globais para `next/image` (renderizando `<img>` padrão para inspeção de atributos nos testes) e para `IntersectionObserver`.
- **Organização:**
  - Existem **35 arquivos de teste** (`*.test.tsx` / `*.test.ts`) em `src/__tests__/`, totalizando **171 testes unitários e de integração** no Vitest, além de **`e2e/accessibility.spec.ts` (`7` testes E2E)** executado separadamente via Playwright (`npm run test:a11y`).
- **Métricas Atuais de Cobertura Observadas Localmente (`VERIFICADO` em `integration/security-quality` @ `a0d9260` após merge de `feat/accessibility` @ `cbc0425`, sob Node.js `v26.13.0` / npm `11.20.0`):**
  - **Statements:** `99.12%`
  - **Branches:** `95.65%`
  - **Functions:** `100%`
  - **Lines:** `100%`
  - **`next.config.ts` (incluído no escopo do SonarCloud na `SEC-06-B`):** `100%` (Statements, Branches, Functions e Lines).
  - *Nota:* As métricas acima representam os valores observados na execução local com Vitest/V8 (`npm run test:coverage -- --maxWorkers=2`); elas servem como referência técnica de regressão e não devem ser assumidas como limiares configurados no servidor do SonarCloud Quality Gate (configuração externa não auditada localmente).
- **Alinhamento de Exclusões de Cobertura (`vitest.config.ts` ↔ `sonar-project.properties`):**
  - `vitest.config.ts` exclui `**/src/app/**`, `**/src/i18n/**`, `**/src/locales/**`, `**/src/**/data/**` e `**/src/**/constants/**` (além de artefatos de build/teste).
  - Na `SEC-06-B`, `sonar-project.properties` passou a incluir `src/app/**` em `sonar.coverage.exclusions`, alinhando o cálculo de cobertura exibido pelo SonarCloud ao escopo efetivamente medido pelo Vitest em `coverage/lcov.info`.
- **Regra de Manutenção de Cobertura:**
  - Nenhuma alteração de código deve reduzir a cobertura global ou deixar novos ramos condicionais (`if/else`, `try/catch`, fallbacks) sem testes unitários correspondentes.

---

## 3. Checklist de Validação Obrigatória (Antes de Qualquer Commit / PR)

Para toda branch que altere código-fonte (`src/`), configurações (`next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `sonar-project.properties`, `.github/workflows/build.yml`) ou dependências (`package.json`), os **4 comandos abaixo devem ser executados nesta ordem** e todos devem retornar código de saída `0`:

### 1. Verificação de Tipos TypeScript
```bash
npx tsc --noEmit
```
- **Critério de aprovação:** Zero erros de compilação ou tipagem.

### 2. Linting e Regras Preventivas de Segurança (ESLint 9)
```bash
npm run lint
```
- **Critério de aprovação:** Zero erros e zero warnings (`0 errors, 0 warnings`).
- **Cobertura de Segurança (`SEC-06-A`):** Além dos presets `nextVitals` e `nextTs`, o bloco `security/preventive-rules` em `eslint.config.mjs` exige `"error"` para `no-eval`, `no-implied-eval`, `no-new-func`, `no-script-url`, `react/no-danger`, `react/jsx-no-script-url` e `react/jsx-no-target-blank`.
- **Nota Técnica (`VERIFICADO`):** O diretório `"coverage/**"` está incluído em `globalIgnores` em `eslint.config.mjs` (`[CI-02]`), evitando warnings sobre os arquivos gerados pelo Vitest em `coverage/` quando `npm run lint` é executado após `npm run test:coverage`.

### 3. Testes Automatizados e Cobertura (Geração de LCOV)
```bash
npm run test:coverage
```
- **Critério de aprovação:** 100% das suítes e testes passando (`35` arquivos, `171` testes em `integration/security-quality` @ `a0d9260`), geração bem-sucedida de `coverage/lcov.info` e ausência de regressão nas métricas de cobertura.
- **Nota Operacional em Windows:** Em ambientes Windows locais com contenção de CPU ou processos paralelos de workers, o comando equivalente com paralelismo limitado `npm run test:coverage -- --maxWorkers=2` evita *timeouts* de inicialização sem alterar `vitest.config.ts` nem os resultados de cobertura.

### 4. Build de Produção
```bash
npm run build
```
- **Critério de aprovação:** Compilação concluída com sucesso e geração estática (`○ Static`) das rotas `/` e `/_not-found` sem erros.
- **Observação de Rede (`next/font/google`):** O build consulta `fonts.googleapis.com` durante o empacotamento das fontes `Geist` e `Geist Mono`, exigindo acesso de saída HTTPS na execução.

### 5. Pipeline SAST Remota (GitHub Actions + SonarCloud)
- No workflow [`.github/workflows/build.yml`](../../.github/workflows/build.yml), após a sequência local equivalente (`npm ci`, `npx tsc --noEmit`, `npm run lint`, `npm run test:coverage`, `npm run build`), o job `ci` executa `SonarQube Scan` e `SonarCloud Quality Gate` (em `pull_request` e em `push` para `master`), consumindo centralizadamente [`sonar-project.properties`](../../sonar-project.properties) (`sonar.sources=src,next.config.ts` e `sonar.javascript.lcov.reportPaths=coverage/lcov.info`).
- **Pendência de Confirmação Remota:** As alterações em `sonar-project.properties` (`SEC-06-B`) e o novo job `a11y_e2e` em `.github/workflows/build.yml` (`P2.2-E2`) foram validados localmente; a confirmação da indexação efetiva de `next.config.ts`, da importação de `coverage/lcov.info` no SonarCloud e da execução do job `a11y_e2e` em runner Ubuntu remoto depende da próxima execução autorizada da pipeline no GitHub Actions.

### 6. Última Bateria Consolidada Observada (Pós-Merge `P2.2` em `integration/security-quality` @ `a0d9260`)

| Verificação | Resultado observado |
| :--- | :--- |
| TypeScript (`npx tsc --noEmit`) | Aprovado (código de saída `0`) |
| ESLint (`npm run lint`) | Aprovado, sem erros ou warnings (código de saída `0`) |
| Vitest (`npm run test:coverage -- --maxWorkers=2`) | Aprovado: `35` arquivos, `171` testes aprovados |
| Coverage — Statements | `99.12%` |
| Coverage — Branches | `95.65%` |
| Coverage — Functions | `100%` |
| Coverage — Lines | `100%` |
| Build (`npm run build`) | Aprovado (rotas estáticas `/` e `/_not-found`) |
| Playwright + axe (`npm run test:a11y`) | Aprovado: `7/7` testes aprovados, `0` violações, `0` incompletos |
| Git diff check (`git diff --check`) | Aprovado (código de saída `0`) |
| Auditoria de dependências (`npm audit`) | **Não aprovado (código de saída `1`)**: `7` ocorrências moderadas relacionadas a `minimatch` exclusivamente em `devDependencies` (`@typescript-eslint`); `0` vulnerabilidades críticas, altas ou em dependências de runtime (`dependencies`), mantido conforme `ADR-004` |

---

## 4. Validações Adicionais para Alterações de Segurança

### A. Alterações de Dependências (`security/dependency-updates`)
Além dos 4 passos obrigatórios acima, executar:
```bash
npm audit
```
- **Critério de aprovação:** Zero vulnerabilidades críticas ou altas; zero vulnerabilidades em pacotes de runtime de produção (`dependencies`). Qualquer aviso remanescente em `devDependencies` deve ser analisado e documentado conforme `07-dependency-management.md`.

### B. Alterações de Cabeçalhos HTTP (`security/http-headers`)
Além dos 4 passos obrigatórios acima, validar os cabeçalhos reais servidos pelo servidor de produção do Next.js:
1. Executar `npm run build`.
2. Iniciar `npm run start` localmente.
3. Inspecionar os cabeçalhos HTTP de resposta (`curl -I http://localhost:3000`) nas rotas `/` e em uma rota inexistente (`404`), além de validar em navegador a ausência de violações CSP (`securitypolicyviolation`).
4. **Critério de aprovação:**
   - Ausência do cabeçalho `X-Powered-By`.
   - Presença com valores exatos de `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` e `Permissions-Policy`.
   - Verificação funcional da página renderizada sem bloqueio de estilos Tailwind, fontes locais `.woff2` ou imagens `next/image`.


---

## 5. Suíte E2E de Acessibilidade (Playwright + axe-core — `P2.2-E2`)

### Objetivo e Ferramentas Utilizadas
- **Objetivo:** Auditar o DOM efetivamente renderizado, estilizado (Tailwind CSS v4) e hidratado da aplicação em navegador real (`Chromium`), servida pelo servidor de produção (`next start`), complementando os testes unitários e comportamentais em JSDOM do Vitest sem substituí-los.
- **Ferramentas (`devDependencies`):** `@playwright/test` (`1.65.1`) e `@axe-core/playwright` (`4.14.0`, com `axe-core` `4.14.1`), configuradas em [`playwright.config.ts`](../../playwright.config.ts) e isoladas do Vitest via `exclude` em [`vitest.config.ts`](../../vitest.config.ts).
- **Tags WCAG avaliadas:** `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa` e `wcag22aa` em [`e2e/accessibility.spec.ts`](../../e2e/accessibility.spec.ts).

### Como Instalar e Executar Localmente
1. **Instalar o navegador Chromium (uma vez por ambiente/atualização):**
   ```bash
   npx playwright install chromium
   ```
   *(Em runners Linux/CI, utilizar `npx playwright install --with-deps chromium`.)*
2. **Gerar o build de produção antes dos testes** *(o `webServer` inicia `next start` e não executa o build automaticamente)*:
   ```bash
   npm run build
   ```
3. **Executar a auditoria E2E de acessibilidade:**
   ```bash
   npm run test:a11y
   ```
4. **Consultar o relatório HTML e artefatos de diagnóstico (traces/screenshots em falha):**
   ```bash
   npx playwright show-report
   ```
   Os arquivos gerados ficam em `playwright-report/` e `test-results/` (ignorados pelo Git, ESLint e Vitest).

### Como Interpretar Violações, Limitações e Verificações Complementares
- **Ferramenta oficial vs `.hintrc` legado:** Playwright + `@axe-core/playwright` (`npm run test:a11y`) constitui a suíte E2E oficial de acessibilidade do projeto. O arquivo `.hintrc` (incluindo `"axe/aria": "off"`) permanece apenas como configuração legada sem Webhint instalado, executável ou integrado em CI.
- **Relatório de violações:** Em caso de falha, `runAxeAudit` registra o ID da regra, impacto (`minor`, `moderate`, `serious`, `critical`), descrição, seletores CSS dos nós afetados e sugestões de correção do `axe-core`, além de anexar resultados `incomplete`, screenshot e `trace.zip`.
- **Limitações conhecidas da auditoria automatizada (`axe-core`):**
  - A regra `color-contrast` pode computar fundos incorretos ou retornar `incomplete` quando há pseudo-elementos com gradientes (`body::before`) ou superfícies translúcidas (`bg-stone-*/50`, `backdrop-blur-sm`) — motivo pelo qual `:root --background` em `src/app/globals.css` foi atualizado de `#ffffff` para **`#1c1917`** na `P2.2-E3` para refletir o fundo escuro real da aplicação sob `prefers-color-scheme: light`.
  - Não avalia adequadamente todos os estados transitórios de `:hover`.
  - Não substitui a análise visual de gradientes, pseudo-elementos e fundos compostos.
  - Não substitui testes manuais de teclado, zoom (`200%`/`400%`) ou leitores de tela reais (NVDA, VoiceOver, TalkBack).
  - Ferramentas automatizadas detectam apenas violações programáticas objetivas e **não garantem conformidade WCAG completa** mesmo quando todos os cenários automatizados passam.
- **Auditoria visual complementar (`P2.2-E3`, verificação manual/assistida pontual — não automatizada em CI):**
  - Foi executada inspeção visual e quantitativa por amostragem de pixels em navegador Chromium (`159.0.8154.6`, `dpr = 1`) nos viewports Desktop (`1280 × 800`) e Mobile (`375 × 812`) sobre diferentes fases da animação `floatGradient`, cobrindo estados normais, `:focus-visible`, sobreposição do cabeçalho fixo sobre chips de `Skills`, `SkillModal` aberto e estados `:hover` dos três componentes corrigidos na `P2.2-E3` (`SkillButton`, `CurriculumDriveAccess` e `SharePageButton`, atingindo `5,951:1`, `7,819:1`/`7,647:1` e `7,733:1`/`7,555:1`, respectivamente).
  - Essa verificação visual complementar constitui evidência pontual de auditoria, não devendo ser confundida com teste automatizado contínuo na CI.
- **Verificações que continuam exigindo avaliação humana/manual periódica:**
  - Qualidade semântica real de textos alternativos (`alt`), rótulos e mensagens de feedback.
  - Experiência auditiva e fluidez em leitores de tela reais (NVDA, VoiceOver, TalkBack).
  - Visibilidade integral do foco sob cabeçalho fixo (`sticky top-0`) em ampliações extremas (`200%`/`400%`) e sob `prefers-reduced-motion`.
