# 11. Política de Commits Atômicos e Rastreabilidade de Alterações

> **Classificação de Status neste Documento:**
> - `VERIFICADO`: Diretriz operacional permanente do repositório, aplicada na consolidação e integração da iniciativa `P2.2` (`ab38555`..`cbc0425` → merge `--no-ff` `a0d9260`).

Este documento estabelece a política permanente de **commits atômicos** e **rastreabilidade de alterações** para todos os trabalhos futuros no repositório `curriculum`. Ele atua em conjunto com [`05-git-and-branch-workflow.md`](05-git-and-branch-workflow.md) e **não substitui** as regras existentes de isolamento por branch, proteção da `master` e exigência de autorização explícita para merges e operações remotas.

---

## 1. Princípio Fundamental

Um commit deve representar uma **unidade lógica, coerente e rastreável de alteração**.

Cada commit registrado no histórico deve permitir compreender, de forma independente:

- **O que foi alterado:** quais componentes, configurações, testes ou documentos sofreram modificação.
- **Por que a alteração foi realizada:** a motivação funcional, corretiva, arquitetural ou de qualidade/segurança.
- **A qual funcionalidade, correção ou etapa pertence:** o contexto dentro do plano de trabalho ou requisito atendido.
- **Quais arquivos e responsabilidades foram afetados:** o perímetro exato da mudança sem efeitos colaterais ocultos.
- **Como a alteração pode ser validada:** quais verificações estáticas, testes automatizados ou builds comprovam sua integridade.

> **Equilíbrio de granularidade:** Atomicidade **não** significa criar o maior número possível de micro-commits fragmentados. Significa manter cada commit **pequeno o suficiente para ser compreendido e auditado com clareza**, mas **completo o suficiente para representar uma mudança coerente e autossuficiente**, sem produzir estados intermediários quebrados.

---

## 2. Regras de Organização dos Commits

1. **Separar funcionalidades independentes em commits distintos:** capacidades ou melhorias que não dependem uma da outra devem ser registradas separadamente.
2. **Separar correções não relacionadas:** ajustes de bugs, acessibilidade, estilo ou segurança pertencentes a contextos distintos não devem ser misturados no mesmo commit.
3. **Manter testes junto da implementação correspondente:** quando os testes unitários ou de integração validam diretamente a nova funcionalidade ou correção e fazem parte da mesma unidade lógica, devem integrar o mesmo commit da implementação.
4. **Manter documentação associada à mudança quando preservar a rastreabilidade:** atualizações pontuais de documentação que descrevam exclusivamente a mudança implementada podem acompanhá-la, ou constituir um commit documental dedicado ao final de uma bateria de etapas relacionadas.
5. **Separar alterações de infraestrutura, CI, dependências e configuração:** mudanças em `package.json`, `package-lock.json`, `.github/workflows/`, `eslint.config.mjs`, `vitest.config.ts` ou `playwright.config.ts` devem ficar em commit próprio quando constituírem uma unidade lógica independente.
6. **Agrupar arquivos com dependência técnica direta:** quando a separação entre arquivos produzir estados intermediários inválidos (erros de compilação TypeScript, imports quebrados, ausência de chaves `i18n` obrigatórias ou falha de mocks necessários aos testes), esses arquivos devem permanecer agrupados no mesmo commit.
7. **Não criar commits vazios:** não utilizar `git commit --allow-empty`.
8. **Não fragmentar alterações artificialmente:** não dividir um único ajuste coeso em múltiplos commits incompletos nem editar conteúdo funcional apenas para forçar uma separação artificial de hunks.
9. **Não misturar alterações funcionais com formatação ou refatorações sem relação direta:** limpezas cosméticas, renomeações amplas ou reordenações não relacionadas ao objetivo da tarefa devem ser evitadas ou isoladas.
10. **Não incluir arquivos gerados, relatórios temporários, segredos ou artefatos locais indevidos:** diretórios como `.next/`, `coverage/`, `playwright-report/`, `test-results/`, `blob-report/`, variáveis de ambiente privadas ou dados pessoais em texto puro nunca devem ser adicionados ao stage.

---

## 3. Convenção de Mensagens (`Conventional Commits`)

O repositório adota o padrão **Conventional Commits** no formato:

```text
<type>(<scope>): <description>
```

### 3.1. Tipos Padronizados

| Tipo | Significado e Aplicação |
| :--- | :--- |
| `feat` | Nova funcionalidade, capacidade de interface ou melhoria estrutural de acessibilidade/SEO. |
| `fix` | Correção de bug funcional, falha visual/contraste ou comportamento incorreto. |
| `test` | Criação ou ampliação de suítes de testes (unitários, integração ou E2E) e infraestrutura de testes. |
| `docs` | Criação ou atualização exclusiva de arquivos de documentação (`README.md`, `AGENTS.md`, `docs/**`). |
| `refactor` | Reorganização interna de código sem alteração do comportamento funcional observável. |
| `chore` | Manutenção, ajustes de ferramentas, limpeza de projeto e tarefas auxiliares. |
| `build` | Alterações que afetam o sistema de build, empacotamento ou dependências de construção. |
| `ci` | Alterações em workflows do GitHub Actions e configurações de integração/análise contínua. |

*(Nota de compatibilidade histórica: prefixos específicos já utilizados no repositório, como `security(<scope>):` para controles de segurança e `merge(<scope>):` para commits explícitos de integração `--no-ff`, permanecem reconhecidos em conjunto com a tabela acima.)*

### 3.2. Diretrizes de Redação e Exemplos

- Redigir mensagens **objetivas, descritivas e preferencialmente em inglês**, no modo imperativo, mantendo consistência com o histórico recente do repositório.
- Evitar mensagens vagas ou genéricas como `update`, `fixes`, `changes`, `wip` ou `final adjustments`.

**Exemplos recomendados:**

- `feat(a11y): implement accessible tab navigation`
- `fix(contact): correct email copy behavior`
- `test(a11y): add keyboard navigation coverage`
- `docs(playbook): document atomic commit policy`
- `chore(deps): update development dependencies`
- `refactor(header): simplify component structure`

---

## 4. Processo Recomendado Antes de Criar Commits

Antes de registrar qualquer commit local, seguir obrigatoriamente esta sequência de 10 passos:

1. **Inspecionar o estado geral do repositório:** verificar a branch ativa e a lista de arquivos modificados e não rastreados com `git status`.
2. **Examinar as alterações em detalhe:** revisar todas as diferenças na working tree (`git diff`) e na área de stage (`git diff --cached`).
3. **Classificar os arquivos por unidade lógica:** agrupar cada arquivo alterado conforme sua responsabilidade (implementação, testes associados, configuração/CI, documentação).
4. **Identificar dependências entre alterações:** mapear contratos de tipos, chaves `i18n`, helpers de setup de testes e componentes acoplados para garantir que nenhum commit intermediário fique quebrado.
5. **Planejar a sequência de commits antes de iniciar o stage:** definir a ordem lógica dos commits (por exemplo: contratos/base → componentes e testes → suíte E2E/CI → documentação).
6. **Utilizar staging seletivo quando necessário:** adicionar apenas os arquivos (ou hunks coerentes) pertencentes ao commit atual.
7. **Inspecionar o conteúdo staged antes do commit:** confirmar a lista exata de arquivos e verificar a ausência de erros de espaço/formatação ou artefatos indevidos.
8. **Executar as validações apropriadas:** garantir que a verificação de tipos, lint, testes e build (`06-testing-and-validation.md`) estejam íntegros.
9. **Criar o commit com mensagem descritiva:** registrar o commit seguindo a convenção `<type>(<scope>): <description>`.
10. **Inspecionar o commit criado:** conferir os metadados e o resumo de arquivos efetivamente gravados no commit antes de prosseguir para o próximo.

### Comandos Git Úteis (Operações Seguras e Não Destrutivas)

```bash
# 1. Visão concisa do estado atual do working tree e stage
git status --short

# 2. Inspeção das alterações não adicionadas ao stage
git diff

# 3. Inspeção exclusiva do que já está preparado no stage
git diff --cached

# 4. Adição seletiva de arquivos específicos de uma unidade lógica
git add <arquivo>

# 5. Adição interativa por trechos (somente quando não quebrar a coerência do arquivo)
git add -p

# 6. Verificação de erros de whitespace ou marcadores de conflito no stage
git diff --cached --check

# 7. Inspeção do resumo de arquivos e estatísticas do commit recém-criado
git show --stat

# 8. Inspeção completa de autoria, datas e mensagem do commit
git show --format=fuller

# 9. Visualização gráfica e compacta da topologia de commits e merges
git log --oneline --graph
```

---

## 5. Rastreamento entre Commits, Etapas e Documentação

Commits atômicos funcionam como trilha de auditoria técnica e permitem rastrear com precisão:

- **Issues e requisitos:** qual commit atende a cada item de verificação ou critério de aceite.
- **Etapas de implementação:** a evolução incremental de programas multi-etapas (como `SEC-*`, `A11Y-*`, `P2.2-*`).
- **Correções e regressões:** localização rápida da origem de um comportamento via `git log` ou `git show` sem precisar analisar milhares de linhas misturadas.
- **Testes relacionados:** comprovação imediata de que cada mudança funcional foi acompanhada de cobertura automatizada.
- **Alterações documentais e decisões técnicas:** vínculo claro entre a implementação no código e seu reflexo no playbook (`08-security-findings-and-risks.md`, `09-technical-decisions.md`, `10-chat-handoff.md`).

### Diretrizes de Identificação e Registro

- **Uso de identificadores existentes:** quando houver identificador real de requisito, achado ou etapa no projeto (ex.: `SEC-04`, `A11Y-03`, `P2.2-E2`), recomenda-se referenciá-lo no escopo, na mensagem ou no corpo do commit, ou no registro documental da etapa.
- **Proibição de identificadores fictícios:** **não inventar** números de issues, tickets externos ou códigos inexistentes, nem exigir identificador de issue quando a tarefa não utilizar esse mecanismo.
- **Registro recomendado por etapa relevante:** ao concluir uma etapa ou integração, documentar no relatório técnico e/ou no playbook:
  1. **Objetivo da etapa.**
  2. **Commits associados** (hashes e mensagens).
  3. **Arquivos principais afetados.**
  4. **Validações executadas** (comandos e resultados reais).
  5. **Resultado final e eventuais ressalvas.**

---

## 6. Preservação do Histórico e Operações Permitidas

1. **Preservar commits atômicos durante merges:** ao integrar uma branch temática em `integration/security-quality`, manter os commits individuais intactos no histórico.
2. **Preferir `git merge --no-ff`:** utilizar merge não *fast-forward* quando a estratégia do projeto exigir registro explícito do ponto de integração da branch temática, preservando a árvore de commits atômicos.
3. **Não utilizar `--squash` indevidamente:** não colapsar commits atômicos com `git merge --squash` quando a rastreabilidade individual das unidades lógicas for requisito da etapa.
4. **Não reescrever histórico compartilhado ou consolidado:** manter imutáveis os commits já validados na linha de base.
5. **Proibição de operações destrutivas ou de reescrita sem autorização:** não executar `git commit --amend`, `git rebase`, `git reset --hard`, `git checkout -- <arquivo>` destrutivo ou `git clean` sem autorização específica do usuário.
6. **Não descartar alterações pendentes:** nunca apagar, sobrescrever ou ocultar alterações legítimas da working tree apenas para simplificar a separação de commits.
7. **Proibição de operações remotas sem autorização explícita:** esta política governa a organização local do histórico e **não autoriza** `git push`, `git fetch`, `git pull`, abertura de Pull Request ou acionamento de deploy sem comando expresso do usuário, conforme [`05-git-and-branch-workflow.md`](05-git-and-branch-workflow.md).

---

## 7. Exemplos Práticos

### Exemplo A — Funcionalidade com testes na mesma unidade lógica

Quando uma nova funcionalidade e seus testes automatizados formam uma única entrega coesa, ambos devem ser registrados juntos em um único commit atômico:

- **Contexto:** Implementação do padrão WAI-ARIA Tabs na seção de experiências (`P2.2-C`).
- **Arquivos no mesmo commit (`914f915`):**
  - `src/components/Experience/Experience.tsx`
  - `src/components/Experience/ExperienceHeader.tsx`
  - `src/components/Experience/ExperiencePanel.tsx`
  - `src/components/Experience/ExperienceTabs.tsx`
  - `src/__tests__/Experience/ExperiencePanel.test.tsx`
  - `src/__tests__/Experience/ExperienceTabs.test.tsx`
- **Mensagem:** `feat(a11y): implement WAI-ARIA tabs pattern and contrast refinements in Experience`
- **Por que é atômico:** a implementação do componente e os testes que verificam `role="tablist"`, `role="tab"`, `role="tabpanel"` e navegação por teclado entram juntos, mantendo a suíte verde e a cobertura intacta naquele exato ponto do histórico.

### Exemplo B — Alterações independentes separadas em commits distintos

Quando o working tree acumula entregas de naturezas distintas, elas devem ser separadas em commits independentes em vez de agrupadas em um único commit genérico:

- **Contexto:** Conclusão de uma frente contendo (1) refatoração de componente + testes, (2) adição de suíte E2E e job de CI, e (3) atualização do playbook documental.
- **Divisão correta em commits separados:**
  1. `feat(a11y): remove empty header navigation landmark and refine LanguageSwitcher accessibility` (apenas `Header.tsx`, `LanguageSwitcher.tsx` e seus testes unitários/integração).
  2. `test(a11y): add Playwright + axe-core E2E accessibility suite and CI gate` (apenas `package.json`, `package-lock.json`, `playwright.config.ts`, `e2e/accessibility.spec.ts`, `.gitignore`, `eslint.config.mjs`, `vitest.config.ts` e `.github/workflows/build.yml`).
  3. `docs(playbook): align guidelines, findings, handoff and ADR-011 for P2.2` (apenas os arquivos `.md` em `docs/project-guidelines/`).

### Exemplo C — Alterações mantidas juntas por dependência técnica direta

Quando dois ou mais arquivos possuem acoplamento técnico imediato, eles **devem permanecer no mesmo commit** para evitar um estado intermediário inválido:

- **Contexto:** Migração de `SkillModal.tsx` para usar métodos imperativos nativos `HTMLDialogElement.prototype.showModal()` e `.close()` com controle de eventos assíncronos (`P2.2-B`).
- **Dependência técnica:** O ambiente JSDOM do Vitest não implementa nativamente `.showModal()` e `.close()` com a semântica completa do navegador; por isso, `vitest.setup.tsx` precisou expor os mocks globais de `<dialog>` e o helper `flushPendingDialogCloseEvents` importado diretamente por `SkillModal.test.tsx`.
- **Decisão correta (`c311f47`):** Agrupar `src/components/Skills/SkillModal.tsx`, `vitest.setup.tsx` e `src/__tests__/Skills/SkillModal.test.tsx` no mesmo commit (`feat(a11y): implement native dialog semantics and focus management in SkillModal`). Separar `vitest.setup.tsx` de `SkillModal.tsx` ou de `SkillModal.test.tsx` produziria um commit intermediário em que os testes de modal falhariam na execução.
