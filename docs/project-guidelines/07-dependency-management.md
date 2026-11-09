# 07. Gestão de Dependências

> **Classificação de Status neste Documento:**
> - `VERIFICADO`: Estado real do `package.json` / `package-lock.json` e resultados auditados.
> - `PENDENTE`: Integração de `security/dependency-updates` e remoção de pacote órfão em `chore/project-cleanup`.
> - `RISCO ACEITO`: Vulnerabilidade transitiva restrita a `devDependencies` sem patch semver-compatível.

---

## 1. Princípios para Adição de Novas Dependências

1. **Preferência por APIs Nativas do Navegador e do React/Next.js:**
   - O projeto prioriza **zero dependências supérfluas de runtime**.
   - Recursos já resolvidos nativamente **não devem** introduzir bibliotecas externas:
     - Modais: utilizar `<dialog>` nativo (`SkillModal.tsx`).
     - Compartilhamento e cópia: utilizar `navigator.share` e `navigator.clipboard` (`SharePageButton.tsx`).
     - Detecção de visibilidade na viewport: utilizar `IntersectionObserver` (`ScrollHint.tsx`).
     - Internacionalização simples: utilizar `LanguageContext` com dicionários tipados em `src/i18n/` (`LanguageContext.tsx`).
2. **Critérios Obrigatórios Antes de Instalar Qualquer Pacote:**
   - Verificar se a funcionalidade realmente não pode ser implementada em menos de ~50 linhas com APIs nativas.
   - Checar manutenção ativa do pacote, compatibilidade com **React 19** e **Next.js 16**, tamanho de bundle e histórico de CVEs (`npm view <pkg>` e `npm audit`).
   - Classificar corretamente entre `dependencies` (necessário no bundle/servidor de produção) e `devDependencies` (usado apenas em testes, lint ou build).
3. **Remoção de Dependências Não Utilizadas:**
   - Dependências listadas em `package.json` que não possuam nenhuma importação em `src/` ou arquivos de configuração devem ser removidas (ex.: `next-themes`, cuja remoção está planejada na branch `chore/project-cleanup` — `PENDENTE`).

---

## 2. Estado das Dependências: `e56f30f` vs. `security/dependency-updates` (`5f0cf3f`)

### A. Dependências Diretas Atualizadas em `security/dependency-updates` (`VERIFICADO`)

| Pacote | Tipo | Versão em `master` / `integration` (`e56f30f`) | Versão em `security/dependency-updates` (`5f0cf3f`) | Motivo Técnico / Segurança |
| :--- | :--- | :--- | :--- | :--- |
| `next` | `dependencies` | `16.1.6` | `16.4.5` | Corrige 6 advisories de alta/moderada severidade no Next.js App Router/Server Components (`GHSA-f82v-jwr5-mffw`, `GHSA-3x4c-7xq6-9pq8`, `GHSA-g55f-6h2x-9c36`, `GHSA-7m27-7ghc-44w9`, `GHSA-h25m-26qc-wcjf`, `GHSA-9g9p-9gw9-jx7f`). |
| `eslint-config-next` | `devDependencies` | `16.1.1` | `16.4.5` | Alinhamento de versão com `next@16.4.5` e atualização de dependências transitivas de análise. |
| `vitest` | `devDependencies` | `4.0.17` | `4.1.12` | Atualização para série `4.1.x` que migra para `vite@8.3.7`, eliminando vulnerabilidades críticas/altas de `vite` (`GHSA-4w7w-66w2-5vf9`, `GHSA-v2wj-q39q-566r`, `GHSA-p9ff-h696-f583`) e `rollup` (`GHSA-mw96-cpmx-2vgc`). |
| `@vitest/ui` | `devDependencies` | `4.0.17` | `4.1.12` | Sincronização obrigatória de versão com `vitest@4.1.12`. |
| `@vitest/coverage-v8` | `devDependencies` | `4.0.17` | `4.1.12` | Sincronização obrigatória de versão com `vitest@4.1.12`. |

### B. Dependências Transitivas Atualizadas no `package-lock.json` (`5f0cf3f` — `VERIFICADO`)

Na branch `security/dependency-updates`, também foram atualizadas de forma compatível (`npm audit fix` controlado sem `--force`) as seguintes dependências transitivas:
- `flatted` (`3.3.3` -> `3.4.4`) — Corrige CVE crítica `GHSA-25h7-pfq9-p65f` e alta `GHSA-rf6f-7fwh-wjgh`.
- `undici` (`7.16.0` -> `7.30.2`) — Corrige 6 advisories (incluindo crítica `GHSA-c76h-2ccp-4975` e altas de WebSocket/HTTP smuggling).
- `picomatch` (`2.3.1` / `4.0.3` -> `2.3.2` / `4.0.4`) — Corrige alta `GHSA-3v7f-55p6-f55p` e moderada `GHSA-c2c7-rcm5-vvqj`.
- `postcss` (`8.5.6` -> `8.5.23`), `sharp` (`0.34.5` -> `0.35.5`), `zod` (`4.3.6` -> `4.6.7`), `js-yaml` (`4.1.1` -> `4.3.2`), `brace-expansion` (`1.1.12` / `2.0.2` -> `1.1.21` / `2.0.5`), `browserslist` (`4.28.1` -> `4.29.5`), `baseline-browser-mapping` (`2.9.19` -> `2.11.35`), `nanoid` (`3.3.11` -> `3.3.20`), `source-map-js` (`1.2.1` -> `1.2.2`), `fflate` (`0.8.2` -> `0.8.3`), `@babel/core` (`7.28.6` -> `7.29.13`), `@humanfs/node` (`0.16.7` -> `0.16.8`).

---

## 3. Tratamento de Vulnerabilidades sem Correção Compatível (`RISCO ACEITO`)

### Estudo de Caso Real: `minimatch@10.2.6` (`GHSA-g3hv-75wg-m249`)
Após aplicar todas as atualizações seguras em `security/dependency-updates` (`5f0cf3f`), o comando `npm audit` reporta **8 ocorrências de severidade Moderada**, todas referentes a uma única causa raiz:
- **Advisory:** `GHSA-g3hv-75wg-m249` (*minimatch ReDoS via multiple non-adjacent GLOBSTAR segments*) em `minimatch <= 10.2.6`.
- **Cadeia de dependência:** `eslint-config-next@16.4.5` -> `@typescript-eslint/eslint-plugin@8.72.2` / `@typescript-eslint/parser@8.72.2` -> `@typescript-eslint/typescript-estree@8.72.2` -> `minimatch@10.2.6`.
- **Por que `npm audit fix --force` é proibido neste caso:**
  - A resolução automática sugerida por `npm audit fix --force` tenta instalar `eslint-config-next@15.5.29` (um **downgrade de major version** da v16 para a v15), o que quebra o alinhamento com o `next@16.4.5`.
- **Por que o risco é aceito temporariamente (`RISCO ACEITO`):**
  1. `minimatch` faz parte exclusivamente da cadeia de linting (`devDependencies`), executada apenas sobre globs de arquivos locais do próprio repositório durante `npm run lint`.
  2. Não é incluída no bundle de produção do Next.js nem processa entradas de usuários externos.
  3. Será resolvida automaticamente quando `@typescript-eslint` e `eslint-config-next@16.x` publicarem atualização para `minimatch >= 10.2.7`.

---

## 4. Regras sobre `overrides` e `package-lock.json`

1. **Uso Cauteloso de `overrides` no `package.json`:**
   - Só utilizar `overrides` no `package.json` quando uma dependência transitiva de **produção** apresentar vulnerabilidade crítica/alta sem release do pacote pai e a versão forçada em `overrides` for comprovadamente compatível na mesma major version.
   - Não utilizar `overrides` para mascarar avisos cosméticos de `devDependencies` se isso causar incompatibilidade de API interna entre pacotes de build/lint.
2. **Versionamento Obrigatório do `package-lock.json`:**
   - O arquivo `package-lock.json` deve ser sempre versionado no Git junto com qualquer alteração em `package.json`.
   - Nunca excluir `package-lock.json` para regenerá-lo do zero sem necessidade técnica justificada, a fim de preservar a reprodutibilidade da árvore de dependências.
