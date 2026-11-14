# 02 — Arquitetura Técnica

## 1. Visão Geral da Arquitetura (`VERIFICADO`)

A aplicação utiliza o **Next.js App Router** (`src/app/`) em modo de geração estática (SSG), combinado com uma arquitetura modular de componentes React em `src/components/`, estado global de internacionalização via React Context API (`src/contexts/LanguageContext.tsx`) e separação estrita entre **lógica visual (componentes)**, **textos fixos de UI (`src/i18n/`)** e **dados de conteúdo (`src/data/`)**.

```text
src/app/layout.tsx (Server Component — Metadados, Fontes e <LanguageProvider>)
 └── src/app/page.tsx (Server Component — Estrutura principal de layout)
      ├── Header (Client) ──► HeaderTitle, LanguageSwitcher, HeaderAvatar, useHeaderScroll
      ├── Hero (Client)
      ├── About (Client) ───► ExpandableText
      ├── Experience (Client) ► ExperienceHeader, ExperienceTabs, ExperiencePanel ──► ExperienceActivityItem, ExpandableText
      ├── Skills (Client) ──► SkillGroup ──► SkillButton | SkillModal (Portal <dialog>), useModal, useSelectedSkill, useViewportHint
      ├── Formation (Client) ► FormationHeader, FormationTimeline ──► FormationItem ──► ExpandableText
      ├── Contact (Client) ─► ContactItem, CurriculumDriveAccess, SharePageButton, useCopyToast
      └── Footer (Client)
```

---

## 2. Estrutura de Diretórios e Separação de Responsabilidades (`VERIFICADO`)

### `src/app/` — Entrada, Layout Global e Estilos Base
- [`src/app/layout.tsx`](../../src/app/layout.tsx): Define o `metadata` estático do Next.js, carrega as fontes `Geist` e `Geist_Mono` e envolve `{children}` com `<LanguageProvider>`.
- [`src/app/page.tsx`](../../src/app/page.tsx): Composição estrutural da página única (`<Header />`, `<main>` contendo `<Hero />`, `<About />`, `<Experience />`, `<Skills />`, `<Formation />`, `<Contact />`, e `<Footer />`).
- [`src/app/globals.css`](../../src/app/globals.css): Importa o Tailwind CSS v4 (`@import "tailwindcss";`), define variáveis CSS de tema, a animação contínua de gradiente em `body::before` (`@keyframes floatGradient`) e a classe utilitária `.animate-fade-in`.

### `src/components/` — Componentes de Interface e Hooks de Domínio
Componentes simples residem diretamente na raiz de `src/components/` (`About.tsx`, `Hero.tsx`, `Footer.tsx`, `LanguageSwitcher.tsx`, `SharePageButton.tsx`), enquanto seções compostas possuem subdiretórios próprios:

- **`src/components/Header/`:**
  - `Header.tsx`: Container `<header>` sticky com transição visual baseada em rolagem.
  - `HeaderTitle.tsx`, `HeaderAvatar.tsx`: Subcomponentes visuais que reagem à prop `isScrolled`.
  - `useHeaderScroll.ts`: Hook que escuta `window.scrollY` com histerese (`enterThreshold = 24`, `exitThreshold = 8`) para evitar *flickering* do cabeçalho.
- **`src/components/ExpandableText/`:**
  - `ExpandableText.tsx`: Mede `el.scrollHeight > el.clientHeight` via `requestAnimationFrame` após aplicar `-webkit-line-clamp` para exibir dinamicamente o botão *"Ler mais" / "Ver menos"* apenas em telas mobile (`sm:hidden`) quando o texto realmente ultrapassa o limite de linhas.
- **`src/components/Experience/`:**
  - `Experience.tsx`: Gerencia a aba selecionada (`activeTab`) e injeta os dados de `experiencesByLanguage[language]`.
  - `ExperienceHeader.tsx`, `ExperienceTabs.tsx`, `ExperiencePanel.tsx`, `ExperienceActivityItem.tsx`: Subcomponentes desacoplados que recebem dados via props (facilitando testes unitários isolados).
- **`src/components/Skills/`:**
  - `Skills.tsx`: Filtra as habilidades entre `hard-` e `soft-` com `useMemo`, coordena abertura/fechamento do modal e aciona a dica visual de viewport.
  - `SkillGroup.tsx`, `SkillButton.tsx`, `SkillModal.tsx`: Subcomponentes de apresentação e portal do modal (`createPortal` em `document.body`).
  - `hooks/useModal.ts`: Controla o ciclo de vida de abertura e animação de saída (`isClosing` com timeout de `200ms`).
  - `hooks/useSelectedSkill.ts`: Armazena a `Skill | null` selecionada.
  - `hooks/useViewportHint.ts`: Utiliza `IntersectionObserver` e `sessionStorage` para destacar visualmente os botões de habilidades na primeira vez que a seção entra na tela.
- **`src/components/Contact/`:**
  - `Contact.tsx`: Orquestra itens de contato copiáveis, links sociais, acesso ao PDF e compartilhamento.
  - `ContactItem.tsx`: Componente polimórfico que renderiza `<a>` (quando recebe `href`) ou `<button>` com ícone de cópia/check (quando recebe `onClick`).
  - `CurriculumDriveAccess.tsx`: Botão de link externo para o currículo em PDF.
  - `useCopyToast.ts`: Hook para cópia via `navigator.clipboard.writeText` com reset automático de status após `2000ms`.
  - `ContactToast.tsx`: Componente de toast flutuante (`VERIFICADO`: atualmente não instanciado em `Contact.tsx`, registrado para revisão na branch `chore/project-cleanup`).

---

## 3. Gerenciamento de Estado e Internacionalização (i18n) (`VERIFICADO`)

### Contexto de Idioma (`src/contexts/LanguageContext.tsx`)
- O estado global resume-se ao idioma ativo (`language: 'pt' | 'en'`), gerenciado pelo `LanguageProvider`.
- O valor do contexto é memorizado com `useMemo` e expõe `{ language, t, toggleLanguage }`.
- O hook `useLanguage()` valida se está sendo chamado dentro de `LanguageProvider` e lança `Error('useLanguage must be used within LanguageProvider')` caso contrário.

### Separação entre `src/i18n/` e `src/data/`
A internacionalização é dividida em duas camadas tipadas:
1. **Textos de Interface (`src/i18n/pt.ts`, `src/i18n/en.ts`, `src/i18n/index.ts`):**
   - Tipados pela interface [`Translations`](../../src/types/language.ts). Contêm títulos de seção, rótulos de botões, mensagens de feedback de cópia/compartilhamento e `aria-labels`.
2. **Coleções de Dados de Conteúdo (`src/data/`):**
   - [`src/data/experiences/`](../../src/data/experiences/index.ts): Exporta `experiencesByLanguage` (`pt` e `en`), tipado como `ExperienceItem[]`.
   - [`src/data/skills/`](../../src/data/skills/index.ts): Exporta `skillsByLanguage` (`pt` e `en`), tipado como `Skill[]`.
   - [`src/data/education/`](../../src/data/education/index.ts): Exporta `educationByLanguage` (`pt` e `en`), tipado como `Education[]`.

---

## 4. Tratamento de Erros e Resiliência (`VERIFICADO`)

Como não há chamadas de rede no cliente (fetch/XHR), o tratamento de erros concentra-se nas APIs do navegador que podem falhar ou não estar disponíveis:
- **Clipboard API (`useCopyToast.ts`):** Envolve `navigator.clipboard.writeText(value)` em `try/catch/finally`, definindo `copiedField = 'error'` em caso de rejeição de permissão e exibindo mensagem amigável traduzida (`t.contact.copyHandlerError`).
- **Web Share & Clipboard (`SharePageButton.tsx`):** Verifica a existência de `"share" in navigator`, faz fallback para `"clipboard" in navigator` e, em último caso, utiliza `globalThis.prompt()`. Qualquer exceção (como cancelamento pelo usuário no compartilhamento nativo) captura o erro no `catch`, exibe `t.shareButtonStatus.error` e restaura o estado para `"idle"` após `2500ms`.
- **MatchMedia e SessionStorage (`useViewportHint.ts`):** Verifica `globalThis.window === undefined` para segurança em SSR e usa optional chaining em `globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false`.

---

## 5. Estratégia de Testes (`VERIFICADO`)

- **Framework:** Vitest + React Testing Library em ambiente `jsdom` ([`vitest.config.ts`](../../vitest.config.ts)).
- **Isolamento de Ambiente ([`vitest.setup.tsx`](../../vitest.setup.tsx)):**
  - Substitui `next/image` por uma tag `<img>` padrão nos testes, removendo props exclusivas do Next.js (`fill`, `priority`, `sizes`, `quality`, `placeholder`, `blurDataURL`) para evitar warnings do React no DOM.
  - Injeta `MockIntersectionObserver` globalmente com store inspecionável (`__getIntersectionObserverStore` e `__resetIntersectionObserverStore`).
- **Utilitários de Teste (`src/__tests__/`):**
  - [`src/__tests__/test-utils.tsx`](../../src/__tests__/test-utils.tsx): Helper `renderWithLanguage(ui)` que envolve o componente testado no `<LanguageProvider>`.
  - [`src/__tests__/factories/activityFactory.ts`](../../src/__tests__/factories/activityFactory.ts): Factory `makeActivity(overrides)` para criação limpa de objetos `Activity` nos testes.

---

## 6. Fluxo de Build e Geração de Páginas (`VERIFICADO`)

1. O comando `npm run build` (`next build`) compila o TypeScript e o CSS (via PostCSS/Tailwind v4).
2. O Next.js pré-renderiza estaticamente a rota raiz `/` (HTML completo em português) e `/_not-found`, gerando os bundles JS e CSS otimizados em `.next/static/`.
3. Em produção na Vercel (ou via `npm run start`), o HTML pré-renderizado é entregue imediatamente e o React hidrata os componentes no navegador.
