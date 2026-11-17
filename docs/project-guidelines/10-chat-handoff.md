# 10. Guia de Continuidade e Handoff entre Sessões de Chat

Este documento define o protocolo padrão para iniciar uma nova conversa com um agente de programação de IA neste repositório sem perda de contexto e sem risco de violar as regras de arquitetura, segurança e Git.

---

## 1. Procedimento Passo a Passo para Iniciar um Novo Chat

Sempre que abrir uma nova sessão ou conversa com um agente de IA:

1. **Solicite a leitura obrigatória inicial:**
   - O agente deve ler primeiro `AGENTS.md` e `docs/project-guidelines/README.md`, seguidos de `05-git-and-branch-workflow.md`, `08-security-findings-and-risks.md` e o documento específico do tema da tarefa.
2. **Exija a inspeção do estado real do Git antes de qualquer ação:**
   - O agente deve executar `git status`, `git branch -a -vv` e `git log --oneline -n 5` para verificar em qual branch o repositório está posicionado e quais branches já foram integradas em `integration/security-quality`.
3. **Defina claramente a branch de trabalho e o escopo:**
   - Informe qual branch temática deve ser utilizada ou criada a partir de `integration/security-quality`.
4. **Reforce a proibição de merge automático:**
   - O agente deve implementar, validar (`tsc`, `lint`, `test:coverage`, `build`), apresentar o relatório completo e **aguardar aprovação explícita do usuário** antes de qualquer merge.

---

## 2. Template Padrão de Prompt para Nova Sessão (Copiar e Colar)

Copie o bloco abaixo ao iniciar uma nova conversa e preencha os campos entre colchetes `[...]`:

```markdown
# Continuidade de Desenvolvimento — Portfólio Next.js

Antes de realizar qualquer alteração ou propor código, leia obrigatoriamente os seguintes arquivos do repositório:
1. `AGENTS.md`
2. `docs/project-guidelines/README.md`
3. `docs/project-guidelines/05-git-and-branch-workflow.md`
4. `docs/project-guidelines/06-testing-and-validation.md`
5. `docs/project-guidelines/08-security-findings-and-risks.md`
6. [Opcional: ex. `docs/project-guidelines/03-security-baseline.md`]

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
6. Atualize o status correspondente em `docs/project-guidelines/08-security-findings-and-risks.md` (se aplicável e solicitado).
7. **NÃO faça merge automático** em `integration/security-quality` nem em `master`. Apresente os resultados das validações e aguarde minha revisão.
```

---

## 3. Fotografia do Estado Atual (`P2.2 — Acessibilidade` na branch `feat/accessibility`)

- **Branch temática em curso:** `feat/accessibility` (HEAD de referência: `20823a5d21d1f0009965fe086edb37b4b21e8820`, baseada em `integration/security-quality`).
- **Branch de destino planejada:** `integration/security-quality` (`master` em `18208bf` permanece intocada).
- **Situação Git / Publicação:** todas as alterações do programa `P2.2` permanecem **exclusivamente locais** no working tree de `feat/accessibility`. **Não houve commit, merge, push nem deploy.**
- **Etapas Concluídas na Iniciativa `P2.2`:**
  - **`P2.2-A` até `P2.2-E3`:** concluídas e validadas localmente (`i18n`/`<html lang>`, `SkillModal` com `<dialog>` nativo, `ExperienceTabs` WAI-ARIA, `Header`/`LanguageSwitcher`, auditoria de `.hintrc`, avaliação de tooling, integração Playwright + `axe-core` e CI `a11y_e2e`, remediação de WCAG 2.5.3, contraste `:root` `#1c1917` e estados `:hover` validados em Chromium Desktop/Mobile).
  - **`P2.2-F` (Auditoria Consolidada):** concluída com classificação **Readiness B — Ready with Caveats** (`npx tsc --noEmit`, `npm run lint`, `npm run test:coverage -- --maxWorkers=2` [`35` arquivos, `171` testes, `99.12%` Stmts / `95.65%` Branches / `100%` Funcs / `100%` Lines], `npm run build`, `npm run test:a11y` [`7/7`, `0` violações, `0` incompletos] e `git diff --check` todos aprovados).
  - **`P2.2-G` (Alinhamento Documental):** atualizados os documentos `05`, `06`, `08`, `09` (`ADR-011`) e `10`, pendente de revisão técnica e aprovação explícita antes de qualquer operação Git.
- **Ressalvas e Limitações Abertas (`Readiness B`):**
  1. `npm audit` retorna **código de saída `1`** com `7` ocorrências moderadas relacionadas a `minimatch` exclusivamente em `devDependencies` (`@typescript-eslint`), aceitas temporariamente conforme `ADR-004` (`0` críticas/altas/runtime).
  2. `.hintrc` permanece como arquivo legado contendo `"axe/aria": "off"`, sem Webhint instalado, executável ou integrado em CI.
  3. O novo job remoto `a11y_e2e` em `.github/workflows/build.yml` ainda não teve execução confirmada em runner Ubuntu remoto.
  4. Limitações inerentes ao `axe-core` (não avalia adequadamente estados transitórios de `:hover` nem substitui inspeção visual sobre gradientes/pseudo-elementos) e ausência de validação manual real com leitores de tela (NVDA, VoiceOver, TalkBack) e zoom extremo (`200%`/`400%`).
  5. Melhorias não bloqueantes identificadas na `P2.2-F` (`ring-offset` em `SkillButton.tsx`, `scroll-margin-top` em painéis de experiência e ampliação opcional do E2E), mantidas fora do escopo atual.
  6. `SEO-01` e `SEO-02` seguem fora do escopo de `feat/accessibility` (`PENDENTE` para frente dedicada).
- **Próximos Passos Planejados:**
  1. Revisão técnica da documentação atualizada na `P2.2-G`.
  2. Planejamento da integração local da branch temática `feat/accessibility`.
  3. Integração em `integration/security-quality` **somente após aprovação explícita do usuário**.
  4. Execução do pipeline remoto no GitHub Actions para validar o job `a11y_e2e` em runner Ubuntu.
  5. Avaliação posterior dos resultados da CI remota e decisão separada sobre eventual publicação/deploy na Vercel.

*(Referência histórica anterior ao ciclo P2.2 preservada em `08-security-findings-and-risks.md` e `09-technical-decisions.md`.)*

---

## 4. Regras de Manutenção Contínua do Playbook

Para que esta documentação nunca fique obsoleta:
1. Sempre que uma branch temática (`security/*`, `fix/*`, `perf/*`, `feat/*`, `chore/*`) for validada e integrada em `integration/security-quality`, o status correspondente em `08-security-findings-and-risks.md` e `05-git-and-branch-workflow.md` deve ser atualizado de `Identificado` / `PENDENTE` para `Integrado` (`VERIFICADO`), registrando o hash do commit e a evidência de validação.
2. Qualquer nova decisão arquitetural relevante deve receber um novo item `ADR-00X` em `09-technical-decisions.md`.
