# 05. Fluxo de Git e Estratégia de Branches

> **Classificação de Status neste Documento:**
> - `VERIFICADO`: Estrutura de branches e commits existente no repositório Git.
> - `PLANEJADO`: Branches temáticas definidas na estratégia de execução que serão criadas sob demanda.

---

## 1. Hierarquia e Arquitetura de Branches

O projeto adota um modelo de **branch de integração intermediária** para isolar e validar todas as melhorias de segurança, correções funcionais, performance, acessibilidade e limpeza antes de qualquer atualização na branch principal `master`.

```text
master (e56f30f — Produção estável / Intocável durante o ciclo)
  └── integration/security-quality (Branch base de integração das melhorias)
        ├── docs/project-playbook            [Documentação permanente e Playbook de Agentes]
        ├── security/dependency-updates      [SEC-01: Atualização de dependências e correção de CVEs]
        ├── security/http-headers            [SEC-02: CSP, X-Frame-Options, nosniff, Referrer, Permissions, poweredByHeader]
        ├── security/github-actions          [SEC-03 + CI-01..03: Hardening de workflow GitHub Actions e SonarCloud]
        ├── fix/functional-bugs              [BUG-01..02: Renderização de múltiplos links e ícone de website]
        ├── perf/image-font-optimization     [PERF-01..04: Otimização de imagens, fontes, reduced-motion e scroll passivo]
        ├── feat/accessibility-seo           [A11Y-01..06 + SEO-01..02: Lang dinâmico, ARIA, dialog, OpenGraph, sitemap/robots]
        └── chore/project-cleanup            [CLEAN-01..05: Remoção de arquivos/deps órfãos, tipagem Education e tasks VS Code]
```

---

## 2. Estado Atual das Branches (`VERIFICADO`)

| Branch | Estado no Git | Escopo Exclusivo | Status do Trabalho |
| :--- | :--- | :--- | :--- |
| `master` | Existente (`local` + `origin/master` em `e56f30f`) | Versão estável de produção. | **Intacta (`VERIFICADO`)**. Nenhuma alteração direta permitida. |
| `integration/security-quality` | Existente (`local` + `origin/integration/security-quality` em `e56f30f`) | Concentrar e validar a integração das branches temáticas antes do merge final em `master`. | **Ativa (`VERIFICADO`)**. Aguardando integração de `docs/project-playbook` e `security/dependency-updates`. |
| `docs/project-playbook` | Existente (`local`, criada a partir de `integration/security-quality`) | Criação de `AGENTS.md` e `docs/project-guidelines/*.md`. | **Implementada (`VERIFICADO`)**, aguardando revisão e merge em `integration/security-quality`. |
| `security/dependency-updates` | Existente (`local` em `5f0cf3f`) | Atualização segura de dependências (`next@16.4.5`, `vitest@4.1.12`, etc.) para mitigar `[SEC-01]`. | **Implementada e Validada (`VERIFICADO`)**, aguardando aprovação de merge em `integration/security-quality`. |
| `security/http-headers` | `PLANEJADO` | Implementação dos cabeçalhos HTTP de segurança e `poweredByHeader: false` em `next.config.ts` (`[SEC-02]`). | Pendente de criação após integração de `security/dependency-updates`. |
| `security/github-actions` | `PLANEJADO` | Hardening de `.github/workflows/build.yml`, exclusão de `coverage/**` no ESLint e correção de `sonar-project.properties`. | Pendente de criação. |
| `fix/functional-bugs` | `PLANEJADO` | Correção de `ExperienceActivityItem.tsx` (múltiplos links) e `ActivityLink.ts` (ícone `website`). | Pendente de criação. |
| `perf/image-font-optimization` | `PLANEJADO` | Redimensionamento de imagens pesadas, `sizes` em `HeaderAvatar`, limpeza de fontes, `prefers-reduced-motion` e scroll `{ passive: true }`. | Pendente de criação. |
| `feat/accessibility-seo` | `PLANEJADO` | Sincronização de `<html lang>`, i18n de `aria-label`, acessibilidade de `SkillModal` e `ExperienceTabs`, Open Graph e `sitemap.ts`/`robots.ts`. | Pendente de criação. |
| `chore/project-cleanup` | `PLANEJADO` | Remoção de `next-themes`, `jest.*`, `ContactToast`, SVGs não usados, chaves i18n órfãs e ajustes de `tsconfig.json`/`.vscode/tasks.json`. | Pendente de criação. |

---

## 3. Regras de Ouro de Git e Governança

1. **Proibição de Commits Diretos em `master` e `integration/security-quality`:**
   - Todo trabalho técnico ou documental deve nascer em uma branch específica criada a partir da versão mais recente de `integration/security-quality`.
2. **Isolamento Estrito de Escopo:**
   - Uma branch nunca deve misturar assuntos de outras branches (ex.: não corrigir bugs de componentes dentro de `security/http-headers`, nem alterar código-fonte na branch `docs/project-playbook`).
3. **Proibição de Merge Automático:**
   - Agentes de IA **nunca** devem fazer merge de uma branch temática em `integration/security-quality` (ou de `integration/security-quality` em `master`) sem **aprovação explícita do usuário** após apresentação do relatório de validação.
4. **Proibição de Operações Destrutivas (`--force`):**
   - É proibido executar `git push --force`, `git reset --hard` em commits compartilhados ou `git clean -fd` sem confirmação explícita.
5. **Inspeção Prévia Obrigatória:**
   - Antes de criar uma branch, trocar de branch ou editar qualquer arquivo, sempre verificar `git status --short` e `git branch -vv` para garantir que não existam alterações não commitadas ou conflitos latentes.

---

## 4. Convenção de Commits

Utilizar mensagens de commit padronizadas no formato **Conventional Commits** em inglês ou português claro, com escopo conciso:

- `security(deps): ...` — Atualizações de dependências por motivos de segurança (`security/dependency-updates`).
- `security(headers): ...` — Configuração de cabeçalhos HTTP (`security/http-headers`).
- `security(ci): ...` — Hardening de workflows e configurações de análise estática (`security/github-actions`).
- `fix(experience): ...` — Correções de bugs funcionais (`fix/functional-bugs`).
- `perf(assets): ...` / `perf(ui): ...` — Otimizações de imagens, fontes e eventos (`perf/image-font-optimization`).
- `feat(a11y): ...` / `feat(seo): ...` — Melhorias de acessibilidade e SEO (`feat/accessibility-seo`).
- `chore(cleanup): ...` — Limpeza de arquivos, dependências e configurações órfãs (`chore/project-cleanup`).
- `docs(playbook): ...` — Criação ou atualização da documentação em `AGENTS.md` e `docs/project-guidelines/` (`docs/project-playbook`).

---

## 5. Procedimento Operacional Padrão (Exemplos de Comandos)

### A. Inspecionar Estado Atual Antes de Iniciar Tarefa
```bash
git status
git branch -a -vv
git log --oneline -n 5
```

### B. Integrar uma Branch Aprovada pelo Usuário em `integration/security-quality`
*(Executar **somente** após autorização explícita do usuário)*
```bash
git checkout integration/security-quality
git pull origin integration/security-quality
git merge --no-ff <nome-da-branch-aprovada>
git push origin integration/security-quality
```

### C. Criar a Próxima Branch de Trabalho a Partir da Branch de Integração Atualizada
```bash
git checkout integration/security-quality
git pull origin integration/security-quality
git checkout -b <nova-branch-tematica>
```

### D. Resolução de Conflitos e Divergências
Caso uma branch temática fique defasada em relação a `integration/security-quality`:
1. Não utilize `git push --force`.
2. Faça `git checkout <branch-tematica>` e incorpore `integration/security-quality` via `git merge integration/security-quality` (ou recrie a branch se ainda não houver commits enviados ao remoto).
3. Reexecute **toda a bateria de validação** (`06-testing-and-validation.md`) após resolver qualquer conflito.
