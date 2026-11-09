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
- **Branch de trabalho desta tarefa:** `[ex.: security/http-headers]`
- **Objetivo / Escopo exclusivo:** `[ex.: Implementar os cabeçalhos HTTP de segurança e poweredByHeader: false conforme SEC-02]`
- **Arquivos permitidos no escopo:** `[ex.: next.config.ts e testes/configurações diretamente relacionados]`

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

Caso uma nova conversa seja iniciada imediatamente após a criação deste Playbook, o estado exato do repositório é:

- **Branch `master`:** Intacta no commit `e56f30f` (`[origin/master]`).
- **Branch `integration/security-quality`:** Posicionada em `e56f30f` (`[origin/integration/security-quality]`).
- **Branch `security/dependency-updates`:** Implementada e validada localmente no commit `5f0cf3f` (`[SEC-01]` concluído e aprovado pelo usuário para integração, aguardando execução do merge em `integration/security-quality`).
- **Branch `docs/project-playbook`:** Contém a criação completa de `AGENTS.md` e `docs/project-guidelines/01..10`, aguardando aprovação e merge em `integration/security-quality`.
- **Próxima tarefa técnica da fila (após integrar `docs/project-playbook` e `security/dependency-updates` em `integration/security-quality`):**
  - Criar a branch `security/http-headers` a partir de `integration/security-quality` atualizada e implementar `[SEC-02]` (`Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` e `poweredByHeader: false` em `next.config.ts`).

---

## 4. Regras de Manutenção Contínua do Playbook

Para que esta documentação nunca fique obsoleta:
1. Sempre que uma branch temática (`security/*`, `fix/*`, `perf/*`, `feat/*`, `chore/*`) for validada e integrada em `integration/security-quality`, o status correspondente em `08-security-findings-and-risks.md` e `05-git-and-branch-workflow.md` deve ser atualizado de `Identificado` / `PENDENTE` para `Integrado` (`VERIFICADO`), registrando o hash do commit e a evidência de validação.
2. Qualquer nova decisão arquitetural relevante deve receber um novo item `ADR-00X` em `09-technical-decisions.md`.
