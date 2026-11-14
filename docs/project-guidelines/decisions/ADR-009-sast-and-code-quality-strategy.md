# ADR-009: Estratégia de Análise Estática (SAST) e Qualidade de Código

- **Status:** Accepted
- **Data:** 2026-11-13
- **Etapa Relacionada:** `SEC-06` (`SEC-06-A`, `SEC-06-B`, `SEC-06-C`)

---

## 1. Contexto

O projeto `curriculum` é um portfólio estático (SSG) construído com Next.js 16.4.5, React 19.2.3, TypeScript, Tailwind CSS e Vitest, com build e entrega contínua no GitHub Actions + Vercel e análise externa via SonarCloud (além de upload de cobertura para o Codecov).

A auditoria inicial da etapa `SEC-06` verificou ausência de vulnerabilidades ativas de injeção no código-fonte (`src/**`) e no histórico auditado, porém identificou lacunas estruturais na estratégia SAST e de qualidade:
1. O ESLint 9 (`eslint.config.mjs`) utilizava apenas os presets `nextVitals` e `nextTs`, sem bloco explícito de regras preventivas de segurança com severidade `"error"` (por exemplo, `no-eval`, `no-implied-eval`, `no-new-func`, `no-script-url`, `react/no-danger`, `react/jsx-no-script-url` e `react/jsx-no-target-blank`).
2. O arquivo `next.config.ts` — que centraliza cabeçalhos HTTP de segurança e a política de *Content Security Policy* (CSP) das etapas `SEC-02` e `SEC-04` — estava fora de `sonar.sources` em `sonar-project.properties`.
3. Havia desalinhamento de exclusões de cobertura entre `vitest.config.ts` (que exclui `**/src/app/**`) e `sonar-project.properties` (`src/app/**` não excluído), além de duplicação da propriedade `sonar.javascript.lcov.reportPaths=coverage/lcov.info` entre `sonar-project.properties` e `.github/workflows/build.yml`.
4. Era necessário formalizar o papel complementar das camadas SAST locais e remotas e os critérios objetivos para uma futura adoção do GitHub CodeQL.

---

## 2. Decisão Tomada

Adotar uma estratégia de **defesa em profundidade para análise estática e qualidade de código** composta por quatro camadas integradas no fluxo de desenvolvimento e no job `ci` do GitHub Actions, **sem adicionar novas dependências npm**:

1. **Verificação de Tipos Estritos (TypeScript):** `npx tsc --noEmit` como primeira barreira contra inconsistências de tipos e contratos em `src/**` e configurações tipadas.
2. **Linting Preventivo Local e em CI (ESLint 9 Flat Config):** Bloco nomeado `security/preventive-rules` em [`eslint.config.mjs`](../../../eslint.config.mjs), aplicado a `**/*.{js,jsx,mjs,ts,tsx,mts,cts}` com severidade `"error"` para sete regras nativas e do ecossistema `eslint-plugin-react` já instalado (`SEC-06-A`):
   - `no-eval`
   - `no-implied-eval`
   - `no-new-func`
   - `no-script-url`
   - `react/no-danger`
   - `react/jsx-no-script-url`
   - `react/jsx-no-target-blank`
3. **SAST, Qualidade e Cobertura Centralizada (SonarCloud + Vitest/V8):**
   - [`sonar-project.properties`](../../../sonar-project.properties) atua como fonte única de configuração para escopo (`sonar.sources=src,next.config.ts`), testes (`sonar.tests=src/__tests__`), exclusões de cobertura alinhadas ao Vitest (`src/app/**`, `src/i18n/**`, `src/locales/**`, `public/locales/**`, `**/i18n/**`, `**/locales/**`, `src/**/data/**`, `src/**/constants/**`), exclusões de duplicação (`sonar.cpd.exclusions`) e relatório LCOV (`sonar.javascript.lcov.reportPaths=coverage/lcov.info`) (`SEC-06-B`).
   - [`.github/workflows/build.yml`](../../../.github/workflows/build.yml) mantém a passagem apenas dos identificadores e endpoint do servidor (`-Dsonar.projectKey`, `-Dsonar.organization`, `-Dsonar.host.url=https://sonarcloud.io`), evitando sobrescrita duplicada da propriedade LCOV via CLI.
4. **Manutenção da Decisão sobre GitHub CodeQL (complemento à `ADR-007`):**
   - **Não habilitar GitHub CodeQL nesta etapa.**
   - **Gatilhos objetivos de reavaliação (quando adotar CodeQL):** a decisão deve ser revisitada caso o projeto passe a incluir:
     - API Routes / Route Handlers / Server Actions com entrada de usuário ou integração com bancos de dados/serviços externos;
     - Autenticação, autorização, sessões ou manipulação de dados pessoais/sensíveis;
     - Upload/parse de arquivos ou fluxo de dados complexo multi-arquivo em Node.js/TypeScript que demande análise interprocedural de *taint*;
     - Aumento significativo de dependências de runtime no servidor ou alteração do modelo puramente estático (SSG).

---

## 3. Consequências Positivas

- **Prevenção imediata de regressões XSS e *tabnabbing* no editor e na CI:** qualquer introdução acidental de `eval`, `new Function`, `javascript:` URLs, `dangerouslySetInnerHTML` ou `<a target="_blank">` sem proteção falha no `npm run lint` antes mesmo do commit.
- **Zero aumento da superfície de ataque de dependências:** todas as regras foram ativadas usando pacotes já presentes no projeto (`eslint`, `eslint-config-next`, `eslint-plugin-react`).
- **Cobertura de análise estática estendida à configuração de headers/CSP:** `next.config.ts` passa a ser escaneado pelo SonarCloud juntamente com `src/`.
- **Governança de configuração limpa:** remoção da duplicidade de `lcov.reportPaths` e alinhamento de `src/app/**` entre Vitest e SonarCloud reduzem ruído nos relatórios de cobertura.

---

## 4. Consequências Negativas e Limitações Conhecidas

- **Ausência de *taint analysis* interprocedural no ESLint:** as regras do bloco `security/preventive-rules` analisam padrões sintáticos/AST intra-arquivo e não rastreiam fluxo de dados entre múltiplos módulos; essa cobertura permanece dependente do SonarCloud e da revisão de código.
- **Dependência de execução remota da CI para confirmação no SonarCloud:** embora `sonar-project.properties` e `.github/workflows/build.yml` tenham sido validados localmente, a confirmação efetiva de indexação de `next.config.ts` e importação de `coverage/lcov.info` no servidor do SonarCloud depende da próxima execução autorizada do workflow no GitHub Actions.
- **Visibilidade parcial de controles externos:** parâmetros configurados diretamente nas plataformas remotas (limiares do *Quality Gate* e *Quality Profiles* no SonarCloud; *Secret Scanning* e *Push Protection* no GitHub) não são versionados neste repositório e permanecem fora da verificação local automatizada.

---

## 5. Referências

- [`../03-security-baseline.md`](../03-security-baseline.md)
- [`../06-testing-and-validation.md`](../06-testing-and-validation.md)
- [`../08-security-findings-and-risks.md`](../08-security-findings-and-risks.md)
- [`../09-technical-decisions.md`](../09-technical-decisions.md) (`ADR-007`)
- [`../../../eslint.config.mjs`](../../../eslint.config.mjs)
- [`../../../sonar-project.properties`](../../../sonar-project.properties)
- [`../../../vitest.config.ts`](../../../vitest.config.ts)
- [`../../../.github/workflows/build.yml`](../../../.github/workflows/build.yml)
