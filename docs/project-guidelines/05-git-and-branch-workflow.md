# 05. Fluxo de Git e Estratégia de Branches

> **Classificação de Status neste Documento:**
> - `VERIFICADO`: Estrutura de branches e commits existente no repositório Git.
> - `PLANEJADO`: Branches temáticas definidas na estratégia de execução que serão criadas sob demanda.

---

## 1. Hierarquia e Arquitetura de Branches

O projeto adota um modelo de **branch de integração intermediária** para isolar e validar todas as melhorias de segurança, correções funcionais, performance, acessibilidade e limpeza antes de qualquer atualização na branch principal `master`.

```text
master (18208bf — Produção estável / Intocável durante o ciclo)
  └── integration/security-quality (20823a5 — Branch base de integração das melhorias)
        ├── feat/accessibility               [P2.2-A..G: Acessibilidade, Playwright/axe-core, Contraste & Docs — Validada localmente]
        ├── feat/seo                         [PLANEJADO: SEO-01..02 segregados fora de feat/accessibility]
        ├── perf/image-font-optimization     [PLANEJADO: PERF-01..04]
        └── chore/project-cleanup            [PLANEJADO: CLEAN-01..05]
```

---

## 2. Estado Atual das Branches (`VERIFICADO`)

| Branch | Estado no Git | Escopo Exclusivo | Status do Trabalho |
| :--- | :--- | :--- | :--- |
| `master` | Existente (`local` + `origin/master` em `18208bf`) | Versão estável de produção. | **Intacta (`VERIFICADO`)**. Nenhuma alteração direta permitida. |
| `integration/security-quality` | Existente (`local` + `origin/integration/security-quality` em `20823a5`) | Concentrar e validar a integração das branches temáticas antes do merge final em `master`. | **Ativa (`VERIFICADO`)**. Base atual de `feat/accessibility` (`20823a5`). |
| `docs/project-playbook` | Existente (`local` em `2ec4e1b`) | Criação e manutenção de `AGENTS.md` e `docs/project-guidelines/*.md`. | **Integrada em `integration/security-quality` (`VERIFICADO`)**. |
| `security/dependency-updates` | Existente (`local` em `5f0cf3f`) | Atualização segura de dependências (`next@16.4.5`, `vitest@4.1.12`, etc.) para mitigar `[SEC-01]`. | **Integrada em `integration/security-quality` (`VERIFICADO`)**. |
| `security/http-headers` | Existente (`local` em `fbb64d9`) | Implementação dos cabeçalhos HTTP de segurança e `poweredByHeader: false` em `next.config.ts` (`[SEC-02]`). | **Integrada em `integration/security-quality` (`VERIFICADO`)**. |
| `security/github-actions` | Existente (`local` em `15e4cd6`) | Hardening de `.github/workflows/build.yml`, exclusão de `coverage/**` no ESLint e correção de `sonar-project.properties` (`[SEC-03]` e `CI-01..03`). | **Integrada em `integration/security-quality` (`VERIFICADO`)**. |
| `security/content-security-policy` | Existente (`local` em `3428e7f`) | Refinamento da CSP para menor privilégio compatível com SSG (`[SEC-04]`). | **Integrada em `integration/security-quality` (`VERIFICADO`)**. |
| `security/privacy-audit` | Existente (`local` em `e95d19b`) | Auditoria de privacidade e minimização de URL em `SharePageButton.tsx` (`[SEC-05]`). | **Integrada em `integration/security-quality` (`VERIFICADO`)**. |
| `security/sast-code-quality` | Existente (`local` em `0a62c19`) | Regras preventivas ESLint 9 e estratégia SAST/SonarCloud (`[SEC-06]`). | **Integrada em `integration/security-quality` (`VERIFICADO`)**. |
| `fix/functional-bugs` | Existente (`local` em `cc039b4`) | Correção de `ExperienceActivityItem.tsx` (múltiplos links) e `ActivityLink.ts` (ícone `website`). | **Integrada em `integration/security-quality` (`VERIFICADO` — merge `20823a5`)**. |
| `maintenance/node-26-lts` | Existente (`local` em `4322741`) | Padronização Node.js `26.13.0` / `26.x` e Actions `node24` (`ADR-010`). | **Existente localmente (`VERIFICADO`)**. |
| `feat/accessibility` | Existente (`local`, HEAD atual `20823a5` com alterações locais não commitadas) | Programa `P2.2`: i18n `lang`, `SkillModal`, `ExperienceTabs`, `Header`/`LanguageSwitcher`, Playwright + `axe-core`, contraste/hover e alinhamento documental (`A11Y-01..05`). | **Validada localmente na branch temática (`VERIFICADO` — `P2.2-A..G`)**. **Não houve commit, merge, push ou deploy**; integração futura destinada a `integration/security-quality` somente mediante autorização explícita. |
| `feat/seo` *(anteriormente agrupada como `feat/accessibility-seo`)* | `PLANEJADO` | Metadados Open Graph, Twitter Card, `sitemap.ts` e `robots.ts` (`SEO-01..02`). | Pendente (fora do escopo da iniciativa `P2.2`). |
| `perf/image-font-optimization` | `PLANEJADO` | Redimensionamento de imagens pesadas, `sizes` em `HeaderAvatar`, limpeza de fontes, `prefers-reduced-motion` e scroll `{ passive: true }`. | Pendente de criação. |
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
