# 06. Testes, Qualidade e Validação

> **Classificação de Status neste Documento:**
> - `VERIFICADO`: Comandos, ferramentas e métricas reais confirmados pela execução no repositório.

---

## 1. Scripts Disponíveis no `package.json` (`VERIFICADO`)

| Script | Comando Executado | Finalidade |
| :--- | :--- | :--- |
| `npm run dev` | `next dev` | Inicia o servidor de desenvolvimento em `http://localhost:3000`. |
| `npm run build` | `next build` | Gera o build de produção otimizado e valida a geração estática (SSG) das páginas. |
| `npm run start` | `next start` | Inicia o servidor Node.js de produção servindo o resultado de `.next/` (necessário para testar cabeçalhos HTTP reais). |
| `npm run lint` | `eslint` | Executa análise estática com ESLint 9 (`eslint.config.mjs`). |
| `npm test` | `vitest` | Inicia o Vitest em modo *watch* interativo para desenvolvimento local. |
| `npm run test:run` | `vitest run` | Executa toda a suíte de testes uma única vez (sem *watch*) e encerra. |
| `npm run test:ci` | `vitest run --coverage` | Executa testes com cobertura V8 em modo não interativo. |
| `npm run test:ui` | `vitest --ui` | Abre a interface visual do `@vitest/ui` no navegador. |
| `npm run test:coverage` | `vitest run --coverage` | Executa todos os testes e exibe a tabela detalhada de cobertura no terminal, gerando relatórios em `coverage/`. |

---

## 2. Arquitetura da Suíte de Testes (`VERIFICADO`)

- **Test Runner:** Vitest (`vitest.config.ts`) configurado com ambiente `jsdom` e `globals: true`.
- **Arquivo de Setup (`vitest.setup.tsx`):**
  - Importa matchers do `@testing-library/jest-dom`.
  - Define mocks globais para `next/image` (renderizando `<img>` padrão para inspeção de atributos nos testes) e para `IntersectionObserver`.
- **Organização:**
  - Existem **32 arquivos de teste** (`*.test.tsx` / `*.test.ts`)em `src/__tests__/`, totalizando **114 testes unitários e de integração**.
- **Métricas Atuais de Cobertura (`VERIFICADO`):**
  - **Statements:** `98.72%`
  - **Branches:** `95.58%`
  - **Functions:** `100%`
  - **Lines:** `99.53%`
- **Regra de Manutenção de Cobertura:**
  - Nenhuma alteração de código deve reduzir a cobertura global ou deixar novos ramos condicionais (`if/else`, `try/catch`, fallbacks) sem testes unitários correspondentes.

---

## 3. Checklist de Validação Obrigatória (Antes de Qualquer Commit / PR)

Para toda branch que altere código-fonte (`src/`), configurações (`next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `.github/workflows/build.yml`) ou dependências (`package.json`), os **4 comandos abaixo devem ser executados nesta ordem** e todos devem retornar código de saída `0`:

### 1. Verificação de Tipos TypeScript
```bash
npx tsc --noEmit
```
- **Critério de aprovação:** Zero erros de compilação ou tipagem.

### 2. Linting (ESLint)
```bash
npm run lint
```
- **Critério de aprovação:** Zero erros e zero warnings (`0 errors, 0 warnings`).
- **Nota Técnica (`VERIFICADO` em `security/github-actions`):** O diretório `"coverage/**"` foi adicionado a `globalIgnores` em `eslint.config.mjs` (`[CI-02]`), eliminando os 2 warnings que antes ocorriam nos arquivos gerados pelo Vitest em `coverage/`.

### 3. Testes Automatizados e Cobertura
```bash
npm run test:coverage
```
- **Critério de aprovação:** 100% das suítes e testes passando (`32 passed`, `114 passed`), sem regressão nas métricas de cobertura.

### 4. Build de Produção
```bash
npm run build
```
- **Critério de aprovação:** Compilação concluída com sucesso e geração estática das rotas `/` e `/_not-found` sem erros.

---

## 4. Validações Adicionais para Alterações de Segurança

### A. Alterações de Dependências (`security/dependency-updates`)
Além dos 4 passos obrigatórios acima, executar:
```bash
npm audit
```
- **Critério de aprovação:** Zero vulnerabilidades críticas ou altas; zero vulnerabilidades em pacotes de runtime de produção (`dependencies`). Qualquer aviso remanescente em `devDependencies` deve ser analisado e documentado conforme `07-dependency-management.md`.

### B. Alterações de Cabeçalhos HTTP (`security/http-headers`)
Além dos 4 passos obrigatórios acima, validar os cabeçalhos reais servidos pelo servidor de produção do Next.js:
1. Executar `npm run build`.
2. Iniciar `npm run start` localmente.
3. Inspecionar os cabeçalhos HTTP de resposta (`curl -I http://localhost:3000`) nas rotas `/` e em uma rota inexistente (`404`), além de validar em navegador a ausência de violações CSP (`securitypolicyviolation`).
4. **Critério de aprovação:**
   - Ausência do cabeçalho `X-Powered-By`.
   - Presença com valores exatos de `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` e `Permissions-Policy`.
   - Verificação funcional da página renderizada sem bloqueio de estilos Tailwind, fontes locais `.woff2` ou imagens `next/image`.
