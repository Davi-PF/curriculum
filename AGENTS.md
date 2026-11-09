# Instruções Operacionais para Agentes de IA (`AGENTS.md`)

Este arquivo é o **ponto de entrada obrigatório** para qualquer agente de codificação que atue neste repositório (`curriculum`).

---

## 1. Leitura Inicial Obrigatória

Antes de propor, planejar ou executar qualquer alteração relevante no repositório, você **DEVE**:

1. Ler o índice central em [`docs/project-guidelines/README.md`](docs/project-guidelines/README.md).
2. Consultar os documentos específicos do playbook aplicáveis à tarefa solicitada (arquitetura, segurança, padrões de código, fluxo Git, testes, dependências, riscos e decisões técnicas).
3. Consultar o registro de achados em [`docs/project-guidelines/08-security-findings-and-risks.md`](docs/project-guidelines/08-security-findings-and-risks.md) e de decisões em [`docs/project-guidelines/09-technical-decisions.md`](docs/project-guidelines/09-technical-decisions.md).

---

## 2. Regras Inegociáveis de Fluxo Git e Ambiente

1. **Inspeção Prévia Obrigatória:** Antes de tocar em qualquer arquivo, execute `git status`, `git branch -vv` e `git log -n 3 --oneline` para confirmar a branch ativa e garantir que não há alterações não commitadas que possam ser sobrescritas ou perdidas.
2. **Proteção Absoluta da `master`:** **NUNCA** faça commits, edições diretas, push ou merge diretamente na branch `master`.
3. **Isolamento de Escopo por Branch:** Todo desenvolvimento deve ocorrer na branch específica designada para a tarefa, criada a partir da versão mais recente da branch base (`integration/security-quality`), conforme definido em [`docs/project-guidelines/05-git-and-branch-workflow.md`](docs/project-guidelines/05-git-and-branch-workflow.md). Não misture escopos distintos na mesma branch.
4. **Proibição de Operações Destrutivas ou Automáticas:**
   - **NÃO** utilize `--force` ou `--hard` em operações Git.
   - **NÃO** execute `npm audit fix --force` indiscriminadamente.
   - **NÃO** realize merge, push ou deploy sem autorização explícita do usuário quando isso não estiver expressamente determinado na tarefa atual.

---

## 3. Segurança, Qualidade e Validação

1. **Conformidade com a Linha de Base de Segurança:** Toda modificação deve respeitar os controles obrigatórios descritos em [`docs/project-guidelines/03-security-baseline.md`](docs/project-guidelines/03-security-baseline.md) e os padrões de código em [`docs/project-guidelines/04-coding-standards.md`](docs/project-guidelines/04-coding-standards.md).
2. **Privacidade e Segredos:** Nunca exponha, copie ou reproduza tokens, credenciais, chaves privadas ou dados pessoais desnecessários (como telefone ou e-mail pessoal em texto puro) em relatórios, commits ou arquivos de documentação.
3. **Validação Obrigatória Pré-Conclusão:** Antes de dar uma implementação por concluída, execute as validações pertinentes documentadas em [`docs/project-guidelines/06-testing-and-validation.md`](docs/project-guidelines/06-testing-and-validation.md) (`npx tsc --noEmit`, `npm run lint`, `npm run test:coverage`, `npm run build` e verificações específicas do escopo).

---

## 4. Precisão, Confiabilidade e Manutenção do Playbook

1. **Proibição de Alucinação Técnica:** Não invente funcionalidades, scripts, configurações, resultados de testes ou validações que não foram efetivamente verificados no código ou no terminal.
2. **Evidência Real:** Não marque vulnerabilidades ou bugs como resolvidos/integrados apenas porque existe um plano ou uma branch não integrada.
3. **Atualização da Documentação:** Sempre que uma tarefa concluída alterar a arquitetura, os padrões, o estado de uma vulnerabilidade/correção ou uma decisão técnica, atualize pontualmente o documento correspondente em `docs/project-guidelines/` seguindo as regras de [`docs/project-guidelines/README.md`](docs/project-guidelines/README.md).
