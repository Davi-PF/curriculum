# 01 — Contexto Geral do Projeto

## 1. Finalidade do Projeto (`VERIFICADO`)

O repositório **`curriculum`** contém a aplicação web de **portfólio profissional e currículo online** de Davi Prudente Ferreira.

Trata-se de uma aplicação de página única (*Single-Page Portfolio*), pública, bilíngue (Português e Inglês), pré-renderizada estaticamente (SSG) e sem necessidade de autenticação, banco de dados ou API de backend própria.

---

## 2. Principais Funcionalidades (`VERIFICADO`)

Todas as funcionalidades abaixo foram confirmadas diretamente nos componentes em `src/`:

1. **Cabeçalho Fixo Adaptativo (`src/components/Header/Header.tsx`):**
   - Exibe o título principal (`HeaderTitle`), seletor de idioma (`LanguageSwitcher`) e foto de perfil (`HeaderAvatar`).
   - Reduz suavemente a escala e altera a opacidade ao rolar a página por meio do hook customizado `useHeaderScroll` (histerese com `enterThreshold = 24` e `exitThreshold = 8`).
2. **Alternância de Idioma em Tempo Real (`src/components/LanguageSwitcher.tsx` e `src/contexts/LanguageContext.tsx`):**
   - Alterna toda a interface e os dados estruturados entre Português (`pt`, idioma padrão) e Inglês (`en`).
3. **Seção de Apresentação (`src/components/Hero.tsx`) e Sobre Mim (`src/components/About.tsx`):**
   - Exibe saudação, subtítulo, citação e resumo profissional com truncamento expansível em telas pequenas (`ExpandableText`).
4. **Seção de Experiências Profissionais e Projetos (`src/components/Experience/`):**
   - Navegação em abas (`ExperienceTabs`) entre experiências profissionais (*Neogrid*, *Mercado dos Sonhos*, *Dinamio Tecnologia*) e a aba *Projetos Desenvolvidos*.
   - Painel detalhado (`ExperiencePanel`) com logotipo, cargo, período, descrição expansível e lista de atividades/projetos (`ExperienceActivityItem`) contendo links externos para repositórios GitHub, vídeos de demonstração no YouTube, notebooks no Google Colab e pasta no Google Drive.
5. **Seção de Habilidades (`src/components/Skills/`):**
   - Agrupamento automático (`SkillGroup`) em **Competências Técnicas (Hard Skills)** (IDs iniciados por `hard-`) e **Habilidades Interpessoais (Soft Skills)** (IDs iniciados por `soft-`).
   - Dica visual temporizada ao entrar na viewport (`useViewportHint`), controlada via `sessionStorage` (`skills_hint_seen`) e `IntersectionObserver`, respeitando `prefers-reduced-motion`.
   - Modal de detalhes (`SkillModal`) renderizado via `createPortal(..., document.body)` usando o elemento nativo `<dialog>` para exibir a descrição de cada habilidade clicada.
6. **Seção de Formação Acadêmica (`src/components/Formation/`):**
   - Linha do tempo ordenada (`FormationTimeline` / `FormationItem`) responsiva (vertical em dispositivos móveis, horizontal em telas `md+`).
7. **Seção de Contato e Compartilhamento (`src/components/Contact/` e `src/components/SharePageButton.tsx`):**
   - Botões para copiar endereço de e-mail e telefone diretamente para a área de transferência (`useCopyToast` + `navigator.clipboard.writeText`) com feedback visual imediato.
   - Links externos para perfis no LinkedIn e GitHub (`ContactItem`).
   - Botão de acesso ao currículo completo em PDF hospedado no Google Drive (`CurriculumDriveAccess`).
   - Botão de compartilhamento da página (`SharePageButton`) com cascata de compatibilidade:
     1. `navigator.share` (Web Share API em dispositivos móveis/compatíveis);
     2. `navigator.clipboard.writeText` (cópia direta do link);
     3. `window.prompt` (fallback final).

---

## 3. Tecnologias, Linguagens e Frameworks (`VERIFICADO`)

Conforme verificado em [`package.json`](../../package.json):

### Produção (`dependencies`)
- **Framework Web:** `next` (`^16.1.6` em `integration/security-quality` @ `e56f30f`; atualizado para `^16.4.5` / `16.4.5` na branch `security/dependency-updates` @ `5f0cf3f`).
- **Biblioteca de UI:** `react` (`19.2.3`) e `react-dom` (`19.2.3`).
- **Dependência órfã identificada:** `next-themes` (`^0.4.6`) — instalada em `dependencies`, porém **não utilizada** em nenhum arquivo de `src/` (`VERIFICADO`, remoção planejada na branch `chore/project-cleanup`).

### Desenvolvimento, Estilização, Qualidade e Testes (`devDependencies`)
- **Linguagem:** `typescript` (`^5`).
- **Estilização:** `tailwindcss` (`^4`) e `@tailwindcss/postcss` (`^4`).
- **Testes Automatizados:** `vitest` (`^4.0.17` em `e56f30f`; `^4.1.12` em `security/dependency-updates`), `@vitest/coverage-v8`, `@vitest/ui`, `jsdom` (`^28.1.0`), `@testing-library/react` (`^16.3.1`), `@testing-library/jest-dom` (`^6.9.1`), `@testing-library/user-event` (`^14.6.1`).
- **Padronização e Lint:** `eslint` (`^9`) e `eslint-config-next` (`16.1.1` em `e56f30f`; `^16.4.5` em `security/dependency-updates`).

### Gerenciador de Pacotes (`VERIFICADO`)
- **`npm`** (com lockfile `package-lock.json` `lockfileVersion: 3`). O pipeline de CI utiliza `npm ci`.

---

## 4. Estrutura Geral do Repositório (`VERIFICADO`)

```text
/
├── .github/workflows/build.yml   # Pipeline de CI (Testes, SonarCloud, Codecov) e Deploy (Vercel)
├── .vscode/tasks.json            # Tarefas locais do VS Code
├── docs/project-guidelines/      # Playbook técnico, de segurança e continuidade (esta documentação)
├── public/                       # Assets estáticos públicos (imagens de perfil, ícones e logos)
├── src/
│   ├── __tests__/                # 32 arquivos de testes unitários e de integração (Vitest + Testing Library)
│   ├── app/                      # Next.js App Router (layout.tsx, page.tsx, globals.css, favicon.ico)
│   ├── components/               # Componentes React organizados por domínio/seção
│   ├── contexts/                 # LanguageContext (estado global de idioma PT/EN)
│   ├── data/                     # Conteúdo bilíngue estruturado (education, experiences, skills)
│   ├── i18n/                     # Textos estáticos da interface (pt.ts, en.ts)
│   └── types/                    # Interfaces e tipos TypeScript
├── AGENTS.md                     # Instruções operacionais para agentes de IA
├── eslint.config.mjs             # Configuração Flat Config do ESLint 9
├── jest.config.js / jest.setup.js# Arquivos legados órfãos (HISTÓRICO — substituídos pelo Vitest)
├── next.config.ts                # Configuração do Next.js
├── package.json                  # Scripts e dependências do projeto
├── postcss.config.mjs            # Configuração do PostCSS (@tailwindcss/postcss)
├── sonar-project.properties      # Configuração de análise estática e cobertura do SonarCloud
├── tsconfig.json                 # Configuração do compilador TypeScript
├── vitest.config.ts              # Configuração da suíte de testes e cobertura v8
└── vitest.setup.tsx              # Setup global de testes (mocks de next/image e IntersectionObserver)
```

---

## 5. Hospedagem, Publicação e Integrações Externas (`VERIFICADO`)

1. **Hospedagem:** **Vercel**.
2. **Pipeline CI/CD (`.github/workflows/build.yml`):**
   - **Job `ci`:** Executado em `push` para `dev` e `pull_request` (exceto `closed`) para `master`. Roda `npm ci`, `npm run test:coverage`, scanner do **SonarCloud** (`SonarSource/sonarqube-scan-action@v6`), **SonarCloud Quality Gate** (em PRs) e upload de cobertura para o **Codecov** (`codecov/codecov-action@v5`).
   - **Job `deploy_vercel`:** Executado quando um Pull Request da branch `dev` é fechado e mergeado (`merged == true`) na branch `master`, utilizando a CLI da Vercel (`vercel --prod --token "$VERCEL_TOKEN"`).
3. **Fontes Externas em Build-Time:**
   - O arquivo `src/app/layout.tsx` importa `Geist` e `Geist_Mono` via `next/font/google` (o Next.js baixa os arquivos `.woff2` de `fonts.googleapis.com` durante o `npm run build` e os hospeda localmente em `.next/static/media/`).
4. **Destinos Externos (Links de Saída no Cliente):**
   - GitHub (`https://github.com/...`)
   - LinkedIn (`https://www.linkedin.com/...`)
   - YouTube (`https://www.youtube.com/...`)
   - Google Drive (`https://drive.google.com/...`)
   - Google Colab (`https://colab.research.google.com/...`)

---

## 6. Características de Geração Estática e Limitações Conhecidas (`VERIFICADO`)

- **Geração Estática (SSG):** O comando `next build` gera as rotas `/` e `/_not-found` de forma totalmente estática (`○ (Static) prerendered as static content`).
- **Hidratação no Cliente:** Como a troca de idioma (`LanguageContext`) ocorre em memória no navegador sem mudança de rota (`/pt` ou `/en`), o HTML estático inicial é gerado no idioma padrão (`pt`) e todos os componentes que consomem `useLanguage()` são Client Components (`"use client"`).
- **Ausência de Persistência de Idioma:** A escolha de idioma em `LanguageContext` utiliza apenas `useState<Language>('pt')`, voltando para `pt` ao recarregar a página.
- **Limitações e Bugs Mapeados para Correção:** Problemas pontuais identificados na auditoria (como renderização apenas do primeiro link em `ExperienceActivityItem`, chave duplicada em `sonar-project.properties`, ausência de cabeçalhos HTTP de segurança e imagens superdimensionadas) estão detalhados e rastreados em [`08-security-findings-and-risks.md`](08-security-findings-and-risks.md).
