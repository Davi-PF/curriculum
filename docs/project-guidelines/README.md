# Playbook Técnico, de Segurança e Continuidade do Projeto

- **Última revisão:** `2026-11-09`
- **Situação da documentação:** `Completa` (`VERIFICADO` contra o commit `e56f30f` em `integration/security-quality` e branch local `security/dependency-updates` @ `5f0cf3f`)

---

## 1. Objetivo desta Documentação

Este diretório (`docs/project-guidelines/`) constitui a **fonte única de verdade (Single Source of Truth)** técnica, arquitetural e de segurança do projeto **Portfolio / Currículo Online (`curriculum`)**.

Seu propósito é:
- Preservar o conhecimento técnico e os resultados da auditoria de segurança e qualidade realizada no repositório.
- Estabelecer padrões estritos de engenharia, segurança e validação.
- Permitir a continuidade fluida do trabalho entre diferentes sessões e conversas com agentes de IA sem dependência do histórico de chat anterior.

---

## 2. Índice e Descrição dos Arquivos

| Arquivo | Descrição |
| :--- | :--- |
| [`/AGENTS.md`](../../AGENTS.md) | Ponto de entrada conciso com regras operacionais obrigatórias para agentes de IA. |
| [`01-project-context.md`](01-project-context.md) | Finalidade do portfólio, funcionalidades reais verificadas, stack tecnológica, hospedagem e limitações conhecidas. |
| [`02-architecture.md`](02-architecture.md) | Estrutura de diretórios, organização de componentes, Context API, i18n, estilização, tratamento de erros, testes e build. |
| [`03-security-baseline.md`](03-security-baseline.md) | Requisitos mínimos obrigatórios de segurança de código, dependências, cabeçalhos HTTP, CI/CD, Vercel e privacidade. |
| [`04-coding-standards.md`](04-coding-standards.md) | Convenções de nomenclatura, React, TypeScript (`strict`), hooks, estilos Tailwind v4, traduções e acessibilidade. |
| [`05-git-and-branch-workflow.md`](05-git-and-branch-workflow.md) | Topologia de branches (`master` → `integration/security-quality` → branches temáticas), regras de PR, commits e comandos. |
| [`06-testing-and-validation.md`](06-testing-and-validation.md) | Scripts reais do `package.json`, procedimentos de teste unitário, cobertura, lint, typecheck, build e inspeção HTTP/DAST. |
| [`07-dependency-management.md`](07-dependency-management.md) | Política de adição e atualização de pacotes, uso de `npm audit`, análise de breaking changes e tratamento de transitivas. |
| [`08-security-findings-and-risks.md`](08-security-findings-and-risks.md) | Registro rastreável de todas as vulnerabilidades (`SEC-*`) e melhorias técnicas (`BUG-*`, `PERF-*`, `A11Y-*`, `SEO-*`, `CI-*`, `CLEAN-*`) com status real. |
| [`09-technical-decisions.md`](09-technical-decisions.md) | Registro histórico de decisões arquiteturais e técnicas (ADRs simplificados `ADR-001` a `ADR-006`). |
| [`10-chat-handoff.md`](10-chat-handoff.md) | Guia de transição entre conversas e template de prompt pronto para iniciar novas sessões com agentes de IA. |

---

## 3. Ordem Recomendada de Leitura

Para um agente de IA ou desenvolvedor que está iniciando uma sessão no projeto:

1. **Entrada e Regras Gerais:** [`/AGENTS.md`](../../AGENTS.md) → [`README.md`](README.md) (este arquivo).
2. **Estado Atual e Tarefa:** [`10-chat-handoff.md`](10-chat-handoff.md) → [`08-security-findings-and-risks.md`](08-security-findings-and-risks.md) → [`05-git-and-branch-workflow.md`](05-git-and-branch-workflow.md).
3. **Contexto e Arquitetura:** [`01-project-context.md`](01-project-context.md) → [`02-architecture.md`](02-architecture.md) → [`09-technical-decisions.md`](09-technical-decisions.md).
4. **Execução e Validação:** [`03-security-baseline.md`](03-security-baseline.md) → [`04-coding-standards.md`](04-coding-standards.md) → [`07-dependency-management.md`](07-dependency-management.md) → [`06-testing-and-validation.md`](06-testing-and-validation.md).

---

## 4. Rótulos Padronizados de Precisão e Confiabilidade

Todos os documentos deste playbook utilizam os seguintes rótulos para distinguir fatos verificados de itens planejados ou pendentes:

- **`VERIFICADO`**: Confirmado diretamente no código-fonte, arquivos de configuração, histórico Git ou execução de teste/comando.
- **`PENDENTE`**: Item identificado que ainda precisa ser implementado, validado ou integrado.
- **`PLANEJADO`**: Alteração ou arquitetura cujo planejamento foi aprovado, mas cuja execução/integração ainda não foi concluída.
- **`RISCO ACEITO`**: Risco ou limitação conhecida cuja permanência foi deliberadamente avaliada e aceita para o contexto do projeto.
- **`HISTÓRICO`**: Informação válida sobre um estado anterior do repositório (ex.: configurações legadas do Jest ou versões antes de uma atualização), mantida para rastreabilidade.

---

## 5. Como Utilizar estes Documentos em uma Nova Conversa

Ao abrir uma nova sessão no ChatGPT, Antigravity ou outro assistente de codificação:
1. Copie o modelo de prompt disponível em [`10-chat-handoff.md`](10-chat-handoff.md).
2. Preencha o objetivo da tarefa e a branch alvo.
3. Instrua o agente a ler `/AGENTS.md` e os documentos relevantes antes de executar qualquer alteração.

---

## 6. Regras de Manutenção da Documentação

A documentação deve ser mantida viva de forma **cirúrgica** (não edite todos os documentos a cada commit; atualize apenas os arquivos impactados):

| Tipo de Alteração Realizada | Documento(s) a Atualizar |
| :--- | :--- |
| Mudança na estrutura de pastas, componentes ou fluxo de dados | [`02-architecture.md`](02-architecture.md) |
| Novo controle de segurança implementado ou exigido | [`03-security-baseline.md`](03-security-baseline.md) e [`08-security-findings-and-risks.md`](08-security-findings-and-risks.md) |
| Alteração em convenções de código, tipagem ou lint | [`04-coding-standards.md`](04-coding-standards.md) |
| Criação, conclusão ou merge de branches do plano de ação | [`05-git-and-branch-workflow.md`](05-git-and-branch-workflow.md), [`08-security-findings-and-risks.md`](08-security-findings-and-risks.md) e [`10-chat-handoff.md`](10-chat-handoff.md) |
| Mudança nos scripts do `package.json` ou critérios de teste/CI | [`06-testing-and-validation.md`](06-testing-and-validation.md) |
| Adição, remoção ou atualização de pacotes em `package.json` | [`01-project-context.md`](01-project-context.md), [`07-dependency-management.md`](07-dependency-management.md) e [`08-security-findings-and-risks.md`](08-security-findings-and-risks.md) |
| Mudança de status de vulnerabilidade/bug (ex.: de `Identificado` para `Validado` ou `Integrado`) | [`08-security-findings-and-risks.md`](08-security-findings-and-risks.md) |
| Nova decisão arquitetural ou de segurança aprovada | [`09-technical-decisions.md`](09-technical-decisions.md) |
