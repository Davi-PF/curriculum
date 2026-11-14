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

---

## 1.5. Ambiente de Runtime Validado (`VERIFICADO` — Node.js 26 LTS)

- **Node.js (local e CI):** `v26.13.0` ([`.nvmrc`](../../.nvmrc) fixado em `26.13.0` e [`package.json`](../../package.json) declarando `"engines": { "node": "26.x" }`).
- **npm utilizado na validação:** `11.20.0` (`npm ci` executado sem flags de contorno, instalando `470` pacotes).
- **Observação de Compatibilidade (não bloqueante):** sob Node.js `v26.13.0`, Vitest (`4.1.12`) e Next.js (`16.4.5`) emitem o aviso `DeprecationWarning: [DEP0205] module.register() is deprecated` durante a execução local; o aviso não impacta o código de saída nem a geração de artefatos.

---

## 2. Arquitetura da Suíte de Testes (`VERIFICADO`)

- **Test Runner:** Vitest (`vitest.config.ts`) configurado com ambiente `jsdom` e `globals: true`.
- **Arquivo de Setup (`vitest.setup.tsx`):**
  - Importa matchers do `@testing-library/jest-dom`.
  - Define mocks globais para `next/image` (renderizando `<img>` padrão para inspeção de atributos nos testes) e para `IntersectionObserver`.
- **Organização:**
  - Existem **33 arquivos de teste** (`*.test.tsx` / `*.test.ts`) em `src/__tests__/`, totalizando **120 testes unitários e de integração**.
- **Métricas Atuais de Cobertura Observadas Localmente (`VERIFICADO` sob Node.js `v26.13.0` / npm `11.20.0`):**
  - **Statements:** `98.76%`
  - **Branches:** `95.77%`
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
- **Critério de aprovação:** 100% das suítes e testes passando (`33 passed`, `120 passed`), geração bem-sucedida de `coverage/lcov.info` e ausência de regressão nas métricas de cobertura.
- **Nota Operacional em Windows:** Em ambientes Windows locais com contenção de CPU ou processos paralelos de workers, o comando equivalente com paralelismo limitado `npm run test:coverage -- --maxWorkers=2` evita *timeouts* de inicialização sem alterar `vitest.config.ts` nem os resultados de cobertura.

### 4. Build de Produção
```bash
npm run build
```
- **Critério de aprovação:** Compilação concluída com sucesso e geração estática (`○ Static`) das rotas `/` e `/_not-found` sem erros.
- **Observação de Rede (`next/font/google`):** O build consulta `fonts.googleapis.com` durante o empacotamento das fontes `Geist` e `Geist Mono`, exigindo acesso de saída HTTPS na execução.

### 5. Pipeline SAST Remota (GitHub Actions + SonarCloud)
- No workflow [`.github/workflows/build.yml`](../../.github/workflows/build.yml), após a sequência local equivalente (`npm ci`, `npx tsc --noEmit`, `npm run lint`, `npm run test:coverage`, `npm run build`), o job `ci` executa `SonarQube Scan` e `SonarCloud Quality Gate` (em `pull_request` e em `push` para `master`), consumindo centralizadamente [`sonar-project.properties`](../../sonar-project.properties) (`sonar.sources=src,next.config.ts` e `sonar.javascript.lcov.reportPaths=coverage/lcov.info`).
- **Pendência de Confirmação Remota (`SEC-06-B`):** As alterações em `sonar-project.properties` e `.github/workflows/build.yml` foram validadas localmente; a confirmação da indexação efetiva de `next.config.ts` e da importação de `coverage/lcov.info` no servidor do SonarCloud depende da próxima execução autorizada da pipeline no GitHub Actions.

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
