# 04. Padrões de Código e Desenvolvimento

> **Classificação de Status neste Documento:**
> - `VERIFICADO`: Padrão existente e praticado no código atual.
> - `PENDENTE`: Ajuste de conformidade planejado em branch específica de melhoria.

---

## 1. Convenções de Nomenclatura (`VERIFICADO`)

| Artefato | Convenção | Exemplo Real no Repositório |
| :--- | :--- | :--- |
| Diretórios de Componentes | `PascalCase` | `src/components/Experience/`, `src/components/Skills/` |
| Arquivos de Componentes React | `PascalCase.tsx` | `ExperienceTimeline.tsx`, `SkillModal.tsx` |
| Hooks Customizados | `camelCase.ts` iniciado por `use` | `src/components/Header/useHeaderScroll.ts` |
| Arquivos de Testes | `<NomeDoComponente>.test.tsx` (colocalizado) | `src/components/Header/Header.test.tsx` |
| Tipos e Interfaces | `PascalCase` em `src/types/` | `src/types/experiences.ts`, `src/types/Skill.ts` |
| Constantes de Dados e i18n | `camelCase` exportado por idioma (`pt.ts`, `en.ts`) | `src/i18n/pt.ts`, `src/data/experiences/en.ts` |

---

## 2. Organização de Componentes React (`VERIFICADO`)

1. **Diretiva `"use client"`:**
   - Como os componentes de UI dependem de `useLanguage()` (`LanguageContext`), eventos de clique, `useState`, `useEffect` ou APIs do navegador, todo componente interativo deve declarar `"use client";` na primeira linha do arquivo.
   - O arquivo `src/app/layout.tsx` permanece como Server Component para exportar `metadata` estática do Next.js.
2. **Tipagem Imutável de Props (`readonly`):**
   - Todas as interfaces ou tipos de `props` de componentes devem marcar suas propriedades como `readonly` (ou usar `Readonly<{ ... }>`), atendendo às regras do ESLint/SonarQube e prevenindo mutação acidental de propriedades.
   - Exemplo praticado em `src/app/layout.tsx` e nos componentes de `src/components/`:
     ```tsx
     interface SkillButtonProps {
       readonly skill: Skill;
       readonly onSelect: (skill: Skill) => void;
     }
     ```
3. **Coesão e Responsabilidade Única:**
   - Dividir seções complexas em subcomponentes coesos dentro da mesma pasta de domínio (ex.: `ExperienceTimeline.tsx` orquestra `ExperienceTabs.tsx`, `ExperienceItem.tsx`, `ExperienceActivityList.tsx` e `ExperienceActivityItem.tsx`).
4. **Proibição de Código Morto:**
   - Não manter componentes órfãos sem importação na árvore da aplicação (como `src/components/Contact/ContactToast.tsx`, cuja remoção está planejada na branch `chore/project-cleanup` — `PENDENTE`).

---

## 3. Uso de TypeScript (`VERIFICADO`)

1. **`strict: true` Obrigatório:**
   - O projeto opera com `"strict": true` em `tsconfig.json`. Nenhum código novo pode introduzir `any` explícito ou implícito, `@ts-ignore` ou `@ts-nocheck`.
2. **Centralização e Reuso de Tipos em `src/types/`:**
   - Modelos de dados compartilhados entre `src/data/` e `src/components/` devem ser definidos em `src/types/` (`experiences.ts`, `Skill.ts`, `education.ts`) e importados onde necessários.
   - **Nota de Melhoria (`PENDENTE` em `chore/project-cleanup`):** Atualmente, `FormationTimeline.tsx` e `FormationItem.tsx` redeclaram tipos inline em vez de importar `Education` de `src/types/education.ts`. Novas alterações devem sempre importar o tipo canônico de `src/types/`.
3. **Imports de Tipo:**
   - Utilizar `import type { ... }` quando importar apenas interfaces ou tipos que não existem em tempo de execução.

---

## 4. Hooks Customizados e Gerenciamento de Estado (`VERIFICADO`)

1. **Isolamento de Efeitos de Navegador:**
   - Listeners de eventos de `window` ou `document` (como `scroll`) devem ser encapsulados em hooks dedicados (ex.: `src/components/Header/useHeaderScroll.ts`) e **sempre** remover o listener na função de cleanup do `useEffect`.
   - Para listeners de `scroll` que não chamam `preventDefault()`, utilizar `{ passive: true }` (`PENDENTE` em `perf/image-font-optimization`).
2. **Uso do `LanguageContext`:**
   - Componentes que exibem textos ou dados localizados devem consumir o idioma através do hook `useLanguage()` exportado por `src/context/LanguageContext.tsx`.
   - Não criar estados paralelos de idioma fora do `LanguageProvider`.

---

## 5. Estilização com Tailwind CSS v4 e CSS Global (`VERIFICADO`)

1. **Tailwind CSS Utility-First:**
   - Utilizar classes utilitárias do Tailwind CSS v4 diretamente no atributo `className`, mantendo responsividade mobile-first (`sm:`, `md:`, `lg:`).
   - O tema visual do projeto é baseado em fundo escuro (`bg-slate-950`, `text-slate-100`, acentos em `blue-400`/`cyan-400` e superfícies translúcidas com `backdrop-blur`).
2. **Regras para `src/app/globals.css`:**
   - Manter em `globals.css` apenas variáveis de tema, animações globais (`@keyframes floatGradient`) e estilos de elementos nativos específicos (como `dialog::backdrop`).
   - Sempre respeitar a preferência de movimento reduzido do sistema operacional (`@media (prefers-reduced-motion: reduce)`) ao criar animações contínuas (`PENDENTE` em `perf/image-font-optimization`).

---

## 6. Paridade Bilíngue Obrigatória (`pt` / `en`) (`VERIFICADO`)

1. **Sincronia Estrita de Chaves:**
   - Qualquer adição, renomeação ou remoção de chave em `src/i18n/pt.ts` **deve obrigatoriamente** ser espelhada em `src/i18n/en.ts` na mesma alteração.
   - O mesmo vale para os catálogos de dados em `src/data/experiences/`, `src/data/skills/` e `src/data/education/`.
2. **Proibição de Strings Hardcoded em Componentes:**
   - Textos visíveis ao usuário, bem como atributos `aria-label`, `title` e `alt` descritivos de ações, devem vir do dicionário `src/i18n/{pt,en}.ts` (a remoção de `aria-label` hardcoded em português em `HeaderAvatar.tsx`, `SharePageButton.tsx`, `SkillButton.tsx` e `SkillModal.tsx` está `PENDENTE` na branch `feat/accessibility-seo`).

---

## 7. Tratamento de Erros e Operações Assíncronas (`VERIFICADO`)

1. **APIs de Navegador que Podem Rejeitar Promises:**
   - Chamadas a `navigator.share()` e `navigator.clipboard.writeText()` (como em `src/components/ShareButton/SharePageButton.tsx`) devem sempre estar protegidas por blocos `try / catch / finally` para lidar graciosamente com cancelamento pelo usuário (`AbortError`) ou falta de permissão da área de transferência, evitando *Unhandled Promise Rejections*.
2. **Testabilidade de Falhas:**
   - Todo caminho de erro (`catch`) ou fallback deve possuir cobertura de teste unitário correspondente no arquivo `.test.tsx` do componente.

---

## 8. Acessibilidade (a11y) e Semântica HTML

1. **Elementos Nativos e Semânticos:**
   - Utilizar `<button type="button">` para ações interativas e `<a href="...">` para navegação. Nunca usar `<div onClick={...}>` para elementos acionáveis.
2. **Modais (`<dialog>`):**
   - Ao utilizar o elemento nativo `<dialog>` (`src/components/Skills/SkillModal.tsx`), garantir gerenciamento adequado de foco, fechamento via tecla `Escape` e ausência de botões duplicados com o mesmo `aria-label` na ordem de tabulação (`PENDENTE` em `feat/accessibility-seo`).
3. **Abas e Navegação:**
   - Componentes de abas (`src/components/Experience/ExperienceTabs.tsx`) devem expor semântica WAI-ARIA apropriada (`role="tablist"`, `role="tab"`, `aria-selected`) (`PENDENTE` em `feat/accessibility-seo`).
