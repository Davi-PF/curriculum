# 10. Guia de Continuidade e Handoff entre Sessões de Chat

Este documento define o protocolo padrão para iniciar uma nova conversa com um agente de programação de IA neste repositório sem perda de contexto e sem risco de violar as regras de arquitetura, segurança e Git.

---

## 1. Procedimento Passo a Passo para Iniciar um Novo Chat

Sempre que abrir uma nova sessão ou conversa com um agente de IA:

1. **Solicite a leitura obrigatória inicial:**
   - O agente deve ler primeiro `AGENTS.md` e `docs/project-guidelines/README.md`, seguidos de `05-git-and-branch-workflow.md`, `11-atomic-commits-and-change-tracking.md`, `08-security-findings-and-risks.md` e o documento específico do tema da tarefa.
2. **Exija a inspeção do estado real do Git antes de qualquer ação:**
   - O agente deve executar `git status`, `git branch -a -vv` e `git log --oneline -n 5` para verificar em qual branch o repositório está posicionado e quais branches já foram integradas em `integration/security-quality`.
3. **Defina claramente a branch de trabalho e o escopo:**
   - Informe qual branch temática deve ser utilizada ou criada a partir de `integration/security-quality`.
4. **Exija commits atômicos e reforce a proibição de merge ou push automático:**
   - O agente deve implementar, validar (`tsc`, `lint`, `test:coverage`, `build`, `test:a11y` quando aplicável), estruturar os commits de forma atômica conforme `11-atomic-commits-and-change-tracking.md`, apresentar o relatório completo e **aguardar aprovação explícita do usuário** antes de qualquer merge ou operação remota.

---

## 2. Template Padrão de Prompt para Nova Sessão (Copiar e Colar)

Copie o bloco abaixo ao iniciar uma nova conversa e preencha os campos entre colchetes `[...]`:

```markdown
# Continuidade de Desenvolvimento — Portfólio Next.js

Antes de realizar qualquer alteração ou propor código, leia obrigatoriamente os seguintes arquivos do repositório:
1. `AGENTS.md`
2. `docs/project-guidelines/README.md`
3. `docs/project-guidelines/05-git-and-branch-workflow.md`
4. `docs/project-guidelines/11-atomic-commits-and-change-tracking.md`
5. `docs/project-guidelines/06-testing-and-validation.md`
6. `docs/project-guidelines/08-security-findings-and-risks.md`
7. [Opcional: ex. `docs/project-guidelines/03-security-baseline.md`]

## Contexto da Tarefa Atual
- **Branch base de integração:** `integration/security-quality`
- **Branch de trabalho desta tarefa:** `[ex.: security/github-actions]`
- **Objetivo / Escopo exclusivo:** `[ex.: Hardening do workflow do GitHub Actions e configurações de qualidade conforme SEC-03 e CI-01..03]`
- **Arquivos permitidos no escopo:** `[ex.: .github/workflows/build.yml, eslint.config.mjs, sonar-project.properties]`

## Regras Obrigatórias desta Sessão
1. Inspecione primeiro `git status`, `git branch -a -vv` e `git log --oneline -n 5`.
2. Nunca altere a branch `master` diretamente.
3. Confirme se as branches anteriores aprovadas já estão integradas em `integration/security-quality` antes de criar a nova branch. Se não estiverem, informe a situação e aguarde minha orientação.
4. Não misture alterações fora do escopo desta branch.
5. Ao concluir a implementação, execute obrigatoriamente:
   - `npx tsc --noEmit`
   - `npm run lint`
   - `npm run test:coverage`
   - `npm run build`
   - `[Validações extras aplicáveis, ex.: npm audit ou verificação de headers via next start]`
6. Quando autorizado a criar commits, organize-os como commits atômicos conforme `docs/project-guidelines/11-atomic-commits-and-change-tracking.md`.
7. Atualize o status correspondente em `docs/project-guidelines/08-security-findings-and-risks.md` (se aplicável e solicitado).
8. **NÃO faça merge nem push automático** em `integration/security-quality` nem em `master`. Apresente os resultados das validações e aguarde minha revisão.
```

---

## 3. Fotografia do Estado Atual (`P2.2 — Acessibilidade` Integrada Localmente em `integration/security-quality`)

- **Branch atual de integração:** `integration/security-quality` (HEAD de referência: `a0d92600c3149f4be41d66cf6483669334720e14`).
- **Branch temática integrada:** `feat/accessibility` (HEAD: `cbc042560d403fc8a00d4b36f40b8698347bc381`), integrada localmente em `integration/security-quality` via `git merge --no-ff` (`a0d9260`), preservando os 7 commits atômicos (`ab38555`..`cbc0425`).
- **Branches de produção / desenvolvimento preservadas:** `master` permanece intocada em `18208bff39008bd31f5b27dd8340b357c882b781` e `dev` em `5ffeb076facd012c180d8f9104cca093e3cd65be`.
- **Estado de Ciclo de Vida / Publicação:** **`Integrado`** localmente em `integration/security-quality`, porém **não `Publicado`** em produção. **Não houve `push`, `fetch`, `pull`, abertura de PR nem deploy.**
- **Etapas Concluídas na Iniciativa `P2.2`:**
  - **`P2.2-A` até `P2.2-E3`:** implementadas, validadas e consolidadas nos commits atômicos `ab38555` (`P2.2-A` `<html lang>` + i18n a11y), `c311f47` (`P2.2-B` `SkillModal` `<dialog>` nativo), `914f915` (`P2.2-C` `ExperienceTabs` WAI-ARIA), `088c9f1` (`P2.2-D` `Header`/`LanguageSwitcher`), `fca1748` (`P2.2-E3` contraste `:root` `#1c1917`, estados `:hover` e WCAG 2.5.3) e `c01f324` (`P2.2-E2` suíte E2E Playwright + `axe-core` e job `a11y_e2e` em `.github/workflows/build.yml`).
  - **`P2.2-F` e `P2.2-G`:** auditoria consolidada (`Readiness B — Ready with Caveats`) e alinhamento documental (`cbc0425`, incluindo `ADR-011`).
  - **Integração Local Controlada (`a0d9260`):** `git merge --no-ff feat/accessibility` validado antes e depois do merge (`npx tsc --noEmit`, `npm run lint`, `npm run test:coverage -- --maxWorkers=2` [`35` arquivos, `171` testes, `99.12%` Stmts / `95.65%` Branches / `100%` Funcs / `100%` Lines], `npm run build` [`/` e `/_not-found` Static], `npm run test:a11y` [`7/7` testes aprovados, `0` violações, `0` incompletos] e `git diff --check` todos aprovados).
  - **`P2.2-H` (Alinhamento Pós-Integração e Política de Commits Atômicos):** atualizado o status documental de `A11Y-01`..`A11Y-05` para `Integrado` (e `Integrado` parcialmente em `A11Y-05`) e instituída a diretriz permanente em [`11-atomic-commits-and-change-tracking.md`](11-atomic-commits-and-change-tracking.md) para todas as próximas frentes do repositório.
- **Diretriz Permanente Estabelecida para as Próximas Etapas:**
  - Todo trabalho futuro deve seguir obrigatoriamente a política de commits atômicos e rastreabilidade definida em [`11-atomic-commits-and-change-tracking.md`](11-atomic-commits-and-change-tracking.md) em conjunto com [`05-git-and-branch-workflow.md`](05-git-and-branch-workflow.md).
- **Ressalvas e Pendências Abertas:**
  1. **Execução remota pendente (`a11y_e2e`):** o primeiro resultado do job `a11y_e2e` no runner Ubuntu (`ubuntu-latest`) do GitHub Actions continua pendente até etapa remota autorizada.
  2. **Auditoria de dependências (`npm audit` / `ADR-004`):** permanecem `7` ocorrências moderadas de `minimatch` exclusivamente em `devDependencies` (`@typescript-eslint`), com `0` vulnerabilidades críticas, altas ou em dependências de runtime.
  3. **`.hintrc` legado (`A11Y-05` parcial):** permanece como configuração legada (`"axe/aria": "off"`), sem Webhint no fluxo oficial de CI (substituído operacionalmente por Playwright + `axe-core`).
  4. **Limitações conhecidas do `axe-core`:** não calcula autonomamente todos os contrastes sobre gradientes animados, pseudo-elementos e estados transitórios (`:hover`), nem substitui validação manual com leitores de tela reais e zoom (`200%`/`400%`).
  5. **Avisos de tooling relacionados ao Node 26 (`ADR-010`):** avisos informativos `[DEP0205]` (`module.register()`) e `configLoader: 'native'` no Vitest/Next.js permanecem sem impacto nas validações executadas.
  6. **Escopo futuro segregado e backlog não bloqueante:** `SEO-01` e `SEO-02` seguem `Identificado` (`PENDENTE` para branch dedicada `feat/seo`), assim como `perf/image-font-optimization` (`PERF-01..04`), `chore/project-cleanup` (`CLEAN-01..05`) e melhorias visuais opcionais da `P2.2-F` (`ring-offset` em `SkillButton.tsx` e `scroll-margin-top` nos painéis de experiência).
- **Próximos Passos Planejados:**
  1. Revisão e consolidação documental da etapa `P2.2-H` (quando autorizado commit documental correspondente).
  2. Execução remota autorizada no GitHub Actions para validar o job `a11y_e2e` no runner Ubuntu e o scan do SonarCloud.
  3. Planejamento das próximas branches temáticas pendentes (`feat/seo`, `perf/image-font-optimization`, `chore/project-cleanup`) a partir de `integration/security-quality`, aplicando a política de commits atômicos (`11-atomic-commits-and-change-tracking.md`).
  4. Decisão separada e posterior sobre promoção para `master` e publicação/deploy na Vercel.

*(Referência histórica anterior ao ciclo P2.2 preservada em `08-security-findings-and-risks.md` e `09-technical-decisions.md`.)*

---

## 4. Regras de Manutenção Contínua do Playbook

Para que esta documentação nunca fique obsoleta:
1. Sempre que uma branch temática (`security/*`, `fix/*`, `perf/*`, `feat/*`, `chore/*`) for validada e integrada em `integration/security-quality`, o status correspondente em `08-security-findings-and-risks.md` e `05-git-and-branch-workflow.md` deve ser atualizado de `Identificado` / `PENDENTE` para `Integrado` (`VERIFICADO`), registrando o hash do commit e a evidência de validação.
2. Qualquer nova decisão arquitetural relevante deve receber um novo item `ADR-00X` em `09-technical-decisions.md`.
