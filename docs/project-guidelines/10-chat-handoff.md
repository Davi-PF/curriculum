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

## 3. Fotografia do Estado Atual para a Próxima Sessão (`VERIFICADO` em 2026-11-09)

O estado exato do repositório após a integração de `[SEC-01]`, do Playbook e de `[SEC-02]` é:

- **Branch `master`:** Intacta no commit `e56f30f` (`[origin/master]`).
- **Branch `integration/security-quality`:** Contém as integrações validadas de:
  - `security/dependency-updates` (`5f0cf3f`) — `[SEC-01]` (`Integrado`)
  - `docs/project-playbook` (`2ec4e1b`) — Playbook Técnico e de Segurança (`Integrado`)
  - `security/http-headers` (`fbb64d9`, merge `c872bc0`) — `[SEC-02]` Cabeçalhos HTTP e `poweredByHeader: false` (`Integrado`)
- **Próximas branches temáticas pendentes na fila (a criar a partir de `integration/security-quality`):**
  1. `security/github-actions`: implementar `[SEC-03]` e `CI-01..03` (hardening de `.github/workflows/build.yml`, exclusão de `coverage/**` em `eslint.config.mjs` e correção de duplicidade em `sonar-project.properties`).
  2. `fix/functional-bugs`: implementar `BUG-01` e `BUG-02` (`ExperienceActivityItem.tsx` e `ActivityLink.ts`).
  3. `perf/image-font-optimization`: implementar `PERF-01..04`.
  4. `feat/accessibility-seo`: implementar `A11Y-01..05` e `SEO-01..02`.
  5. `chore/project-cleanup`: implementar `CLEAN-01..05`.

---

## 4. Regras de Manutenção Contínua do Playbook

Para que esta documentação nunca fique obsoleta:
1. Sempre que uma branch temática (`security/*`, `fix/*`, `perf/*`, `feat/*`, `chore/*`) for validada e integrada em `integration/security-quality`, o status correspondente em `08-security-findings-and-risks.md` e `05-git-and-branch-workflow.md` deve ser atualizado de `Identificado` / `PENDENTE` para `Integrado` (`VERIFICADO`), registrando o hash do commit e a evidência de validação.
2. Qualquer nova decisão arquitetural relevante deve receber um novo item `ADR-00X` em `09-technical-decisions.md`.
