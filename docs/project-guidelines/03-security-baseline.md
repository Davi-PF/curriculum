# 03. Baseline de Segurança do Projeto

> **Classificação de Status neste Documento:**
> - `VERIFICADO`: Controle ou estado auditado e comprovado no código-fonte atual.
> - `PENDENTE`: Controle implementado em branch temática e aguardando merge em `integration/security-quality`, ou planejado para etapa futura.
> - `RISCO ACEITO`: Exposição intencional ou limitação técnica documentada e aceita com justificativa.

---

## 1. Segurança de Código (SAST e Prevenção de XSS)

### Análise Estática Preventiva no ESLint 9 (`SEC-06-A`)
- **Configuração (`VERIFICADO`):** `eslint.config.mjs` define o bloco nomeado `security/preventive-rules` aplicado a `**/*.{js,jsx,mjs,ts,tsx,mts,cts}` com severidade `"error"` (sem adicionar novas dependências ao `package.json`), além dos presets `nextVitals` e `nextTs`:
  - `no-eval`: `"error"`
  - `no-implied-eval`: `"error"`
  - `no-new-func`: `"error"`
  - `no-script-url`: `"error"`
  - `react/no-danger`: `"error"`
  - `react/jsx-no-script-url`: `"error"`
  - `react/jsx-no-target-blank`: `"error"`
- **Limitação Conhecida (`RISCO ACEITO` / `ADR-009`):** As regras preventivas do ESLint atuam em nível sintático/AST intra-arquivo e **não realizam análise interprocedural de fluxo de dados (*taint analysis*)**; por isso atuam de forma complementar ao TypeScript (`tsc --noEmit`), às regras de segurança do SonarCloud e aos testes automatizados (ver [`decisions/ADR-009-sast-and-code-quality-strategy.md`](decisions/ADR-009-sast-and-code-quality-strategy.md)).

### Requisitos Obrigatórios
1. **Proibição de Injeção de HTML/Script:**
   - É **estritamente proibido** utilizar `dangerouslySetInnerHTML`, `eval()`, `new Function()`, `document.write()` ou `innerHTML` em qualquer componente ou hook.
   - `Status: VERIFICADO` — A auditoria SAST confirmou zero ocorrências dessas APIs em todo o diretório `src/`, agora protegidas preventivamente pelo bloco `security/preventive-rules` em `eslint.config.mjs` (`SEC-06-A`).
2. **Manipulação Segura do DOM e Minimização de URLs Compartilhadas:**
   - Toda renderização de textos (incluindo dados vindos de `src/i18n/` e `src/data/`) deve ocorrer via JSX padrão do React, garantindo escapamento automático contra XSS.
   - O uso de APIs imperativas do navegador deve restringir-se a operações seguras de estado visual/interação:
     - `window.scrollTo` e `window.scrollY` (`src/components/Header/useHeaderScroll.ts`).
     - `navigator.share`, `navigator.clipboard.writeText` e fallback `window.prompt` (`src/components/SharePageButton.tsx`), construindo a URL canônica estritamente a partir de `globalThis.location.origin + globalThis.location.pathname` (`getCanonicalPageUrl()`), descartando `search` (query string como `utm_*`, `fbclid`, `gclid`) e `hash` (`#...`) para impedir a propagação involuntária de parâmetros de rastreamento ou fragmentos (`VERIFICADO` — implementado e testado em `SEC-05`).
     - `IntersectionObserver` e `sessionStorage` efêmero (`src/components/Skills/hooks/useViewportHint.ts`).
3. **Prevenção de Open Redirect:**
   - O projeto não deve utilizar redirecionamentos baseados em parâmetros de URL (`searchParams`, `window.location.href = param`).
   - `Status: VERIFICADO` — Nenhuma rota ou componente realiza redirecionamento dinâmico baseado em entrada do usuário.

### Segurança de Links Externos (`target="_blank"`)
- **Regra Obrigatória:** Todo elemento `<a target="_blank">` que aponte para domínios externos (GitHub, LinkedIn, Google Drive, YouTube, Google Colab, etc.) **deve obrigatoriamente** conter:
  - Protocolo explícito `https://`.
  - Atributo `rel="noopener noreferrer"` para prevenir *Reverse Tabnabbing* e vazamento de referência de janela (`window.opener`).
  - A regra `react/jsx-no-target-blank: "error"` em `eslint.config.mjs` bloqueia regressões em links JSX estáticos (`SEC-06-A`).
- **Estado Atual (`VERIFICADO`):**
  - `src/components/Contact/ContactItem.tsx`: Utiliza `target="_blank"` e `rel="noopener noreferrer"`.
  - `src/components/Contact/CurriculumDriveAccess.tsx`: Utiliza `target="_blank"` e `rel="noopener noreferrer"`.
  - `src/components/Experience/ExperienceActivityItem.tsx`: Utiliza `target="_blank"` e `rel="noopener noreferrer"`.

---

## 2. Segurança de Dependências (SCA)

### Requisitos Obrigatórios
1. **Auditoria Periódica e Pré-PR:**
   - Executar `npm audit` antes de abrir qualquer Pull Request que altere `package.json` ou `package-lock.json`.
2. **Critérios de Atualização:**
   - Priorizar atualizações `patch` e `minor` compatíveis com a árvore atual (`Next.js 16`, `React 19`, `Vitest 4`, `Tailwind CSS 4`).
   - **Proibição de `--force` cego:** Nunca executar `npm audit fix --force` quando a resolução proposta pelo npm fizer downgrade de pacotes principais para versões majors anteriores incompatíveis (ex.: rebaixar `eslint-config-next` de `16.x` para `15.x`).
3. **Estado Atual das Dependências:**
   - Em `master` (`e56f30f`): **`PENDENTE` de integração final** (29 vulnerabilidades reportadas pelo `npm audit`: 4 críticas, 12 altas, 12 moderadas, 1 baixa).
   - Em `integration/security-quality` (integrado a partir de `security/dependency-updates` @ `5f0cf3f` no merge `f4cfae2`): **`VERIFICADO` / `Integrado`**. Reduziu de 29 para **8 vulnerabilidades moderadas** (100% das vulnerabilidades críticas, altas e de runtime de produção corrigidas).
4. **Critério para Aceite Temporário de Risco Residual (`RISCO ACEITO`):**
   - Vulnerabilidades presentes **exclusivamente em `devDependencies`** (como linters ou ferramentas de teste que não integram o bundle de produção nem executam no servidor Next.js) e cuja correção imediata exija downgrade incompatível de major version podem ser documentadas como risco residual temporário até que a cadeia upstream publique atualização compatível.
   - Veja detalhes do caso `minimatch` em `07-dependency-management.md` e `08-security-findings-and-risks.md`.

---

## 3. Cabeçalhos HTTP de Segurança e Content Security Policy (`SEC-02` e `SEC-04`)

### Estado Atual
- **Base (`SEC-02`):** `Integrado` em `integration/security-quality` via `fbb64d9` / `c872bc0` (`VERIFICADO`).
- **Auditoria e Refinamento da CSP (`SEC-04`):** `Integrado` em `integration/security-quality` via `3428e7f` / `178fce2953a3e3a9444b0c2741322a4ed844d1a3` (`VERIFICADO`).

Em `next.config.ts`, a aplicação define `poweredByHeader: false`, exporta as funções testáveis `buildCspHeader(isDev)` e `getSecurityHeaders(isDev)` (cobertas por testes automatizados em `src/__tests__/nextConfigHeaders.test.ts`) e aplica os cabeçalhos em `source: "/:path*"`.

| Cabeçalho / Configuração | Valor / Diretiva Configurada | Finalidade Técnica | Status Atual |
| :--- | :--- | :--- | :--- |
| `poweredByHeader` (`next.config.ts`) | `false` | Ocultar o cabeçalho `X-Powered-By: Next.js` para reduzir *fingerprinting* da stack. | `VERIFICADO` (`Integrado` em `integration/security-quality`) |
| `X-Content-Type-Options` | `nosniff` | Impedir *MIME-sniffing* de scripts e folhas de estilo pelo navegador. | `VERIFICADO` (`Integrado` em `integration/security-quality`) |
| `X-Frame-Options` | `DENY` | Prevenir ataques de *Clickjacking* impedindo embutimento em `<frame>`/`<iframe>`. | `VERIFICADO` (`Integrado` em `integration/security-quality`) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Enviar apenas a origem em requisições cross-origin HTTPS e omitir em downgrade HTTP. | `VERIFICADO` (`Integrado` em `integration/security-quality`) |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), browsing-topics=()` | Desabilitar APIs sensíveis do navegador (câmera, microfone, geolocalização e Google Topics API) não utilizadas pelo portfólio. | `VERIFICADO` (`Integrado` em `integration/security-quality`) |
| `Content-Security-Policy` (CSP — Produção) | `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; frame-src 'none'; upgrade-insecure-requests` | Política de menor privilégio compatível com SSG no Next.js 16.4.5. Na `SEC-04`, foram removidas permissões desnecessárias (`blob:` de `img-src` e `data:` de `font-src`) e adicionada `frame-src 'none'`. | `VERIFICADO` (`Integrado` em `integration/security-quality` via `178fce2`) |
| `Strict-Transport-Security` (HSTS) | Gerenciado pela borda da Vercel em produção (`max-age=63072000; includeSubDomains; preload` ou padrão da plataforma) | Garantir transporte exclusivamente via HTTPS em produção, sem quebrar `http://localhost:3000` em desenvolvimento. | `VERIFICADO` (delegado à Vercel em produção) |

### Detalhamento Diretiva por Diretiva da CSP (`SEC-04`)

| Diretiva | Origens Autorizadas | Justificativa Técnica e Risco Residual |
| :--- | :--- | :--- |
| `default-src` | `'self'` | Fallback restritivo padrão para diretivas de busca não especificadas, limitando qualquer carregamento à própria origem. |
| `script-src` | `'self' 'unsafe-inline'` *(e `'unsafe-eval'` apenas quando `NODE_ENV === "development"`)* | Autoriza os chunks JS de `'self'` (`/_next/static/chunks/*.js`) e os 6–7 scripts inline de bootstrap/hidratação RSC gerados pelo Next.js 16.4.5 SSG (`self.__next_f.push(...)`). **Risco residual (`RISCO ACEITO`):** `'unsafe-inline'` é necessário porque `next.config.ts` é avaliado antes da geração dos payloads RSC com build ID dinâmico e nonces exigem SSR/Middleware por requisição. Mitigado pela ausência de `'unsafe-eval'` em produção e pela auditoria SAST limpa. |
| `style-src` | `'self' 'unsafe-inline'` | Autoriza a folha de estilo compilada do Tailwind CSS v4 (`/_next/static/chunks/*.css`), os atributos inline `style="color:transparent"` e posicionamento `fill` injetados pelo componente `next/image` e a tag `<style>` das páginas estáticas `_not-found` e `_global-error`. **Risco residual (`RISCO ACEITO`):** `'unsafe-inline'` em estilos não permite execução de scripts em navegadores modernos. |
| `img-src` | `'self' data:` | Autoriza imagens otimizadas servidas por `/_next/image`, ícones estáticos (`/favicon.ico`) e URIs `data:image/svg+xml` utilizadas pelo runtime cliente do `next/image` para placeholders. O esquema `blob:` foi removido na `SEC-04` por ausência de uso no projeto. |
| `font-src` | `'self'` | Autoriza exclusivamente os arquivos `.woff2` auto-hospedados em build-time pelo `next/font/google` sob `/_next/static/media/*.woff2`. O esquema `data:` foi removido na `SEC-04` por ausência de uso no CSS compilado. |
| `connect-src` | `'self'` | Restringe requisições `fetch`/`XHR` de navegação cliente e manifesto de rotas do Next.js à própria origem. |
| `object-src` | `'none'` | Bloqueia integralmente elementos legados `<object>`, `<embed>` e `<applet>`. |
| `base-uri` | `'self'` | Impede injeção de tag `<base>` apontando para domínios externos (prevenção de sequestro de URLs relativas). |
| `form-action` | `'self'` | Restringe submissões de formulários à própria origem, prevenindo exfiltração via injeção de `<form action="https://...">`. |
| `frame-ancestors` | `'none'` | Defesa moderna contra *Clickjacking*, proibindo que qualquer página (mesmo da própria origem) incorpore o portfólio em `<frame>`, `<iframe>`, `<embed>` ou `<object>`. |
| `frame-src` | `'none'` | Adicionada na `SEC-04`: proíbe que a própria página crie ou carregue `<frame>` ou `<iframe>` (inclusive same-origin, que antes seria permitido pelo fallback `default-src 'self'`). |
| `upgrade-insecure-requests` | *(Diretiva sem valor — ativa apenas fora de `development`)* | Instrui navegadores em produção a converter automaticamente qualquer sub-recurso `http://` para `https://`. Omitida em `development` para não interferir em `http://localhost:3000`. |

---

## 4. Segurança de CI/CD e Vercel

### Estado Atual (`VERIFICADO` / `Integrado` em `integration/security-quality` via `15e4cd6` / `aaf71f8`)
- O arquivo `.github/workflows/build.yml` executa validação completa, scan do SonarCloud e verificação do Quality Gate (`ci`), seguidos de deploy de produção via Vercel CLI (`deploy_vercel`).
- **Segredos (`VERIFICADO`):** Não há tokens ou credenciais hardcoded no repositório ou no histórico Git. Os segredos `SONAR_TOKEN`, `SONAR_PROJECT_KEY`, `SONAR_ORGANIZATION_KEY`, `CODECOV_TOKEN`, `VERCEL_TOKEN`, `VERCEL_ORG_ID` e `VERCEL_PROJECT_ID` são injetados via GitHub Actions Secrets.

### Controles Obrigatórios Implementados e Integrados (`SEC-03`)
1. **Pinning de Actions por SHA de 40 caracteres e Vercel CLI com Versão Exata:**
   - Todas as GitHub Actions são fixadas pelo hash SHA completo de 40 caracteres do commit da release oficial, acompanhado de comentário indicando a versão:
     - `actions/checkout@11d5960a326750d5838078e36cf38b85af677262 # v4.4.0`
     - `actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020 # v4.4.0`
     - `SonarSource/sonarqube-scan-action@fd88b7d7ccbaefd23d8f36f73b59db7a3d246602 # v6.0.0`
     - `SonarSource/sonarqube-quality-gate-action@7a5fffe8e523c40e0c740b6bc2712ab503e52efa # v1.2.1`
     - `codecov/codecov-action@0fb7174895f61a3b6b78fc075e0cd60383518dac # v5.5.5`
   - **Critério de Manutenção de SHAs:** Ao atualizar qualquer Action no futuro, verificar obrigatoriamente o commit dereferenciado da tag oficial via `git ls-remote https://github.com/<owner>/<repo>.git "refs/tags/<tag>*"` (usando sempre o hash `^{}` quando a tag for anotada) e atualizar o comentário da versão.
   - **Vercel CLI:** Fixada em `npm i -g vercel@65.14.0` (sem uso de `latest` flutuante).
2. **Menor Privilégio no `GITHUB_TOKEN` (Zero Permissões de Escrita):**
   - Padrão global no topo do workflow: `permissions: contents: read`.
   - Job `ci`: `contents: read` e `pull-requests: read` (nenhuma permissão `write` no `GITHUB_TOKEN`).
   - Job `deploy_vercel`: estritamente `contents: read`.
3. **Estratégia Segura de Deploy Condicionada à CI e ao Quality Gate:**
   - O deploy de produção (`deploy_vercel`) exige `needs: ci` e executa **exclusivamente** quando `success() && github.event_name == 'push' && github.ref == 'refs/heads/master'`.
   - A etapa `SonarCloud Quality Gate` dentro do job `ci` é executada obrigatoriamente tanto em `pull_request` quanto em `push` para `master` (`github.event_name == 'pull_request' || (github.event_name == 'push' && github.ref == 'refs/heads/master')`), não sendo executada em pushes para `dev` ou `integration/security-quality`.
   - Dessa forma, a execução em `master` avalia o commit efetivamente recebido pela branch e bloqueia o `deploy_vercel` caso o Quality Gate reprove o commit.
4. **Quality Gate Completo e SAST em Profundidade no Job `ci`:**
   - O job `ci` executa sequencialmente `npm ci`, `npx tsc --noEmit`, `npm run lint`, `npm run test:coverage`, `npm run build`, `SonarQube Scan`, `SonarCloud Quality Gate` (em PRs e em pushes para `master`) e `Upload coverage`.
   - Em `eslint.config.mjs`, `"coverage/**"` está incluído em `globalIgnores`, garantindo `0 warnings` mesmo quando o lint roda após `test:coverage`, e o bloco `security/preventive-rules` aplica regras preventivas de segurança antes da etapa de análise remota (`SEC-06-A`).
   - Em `sonar-project.properties` (`SEC-06-B`):
     - `sonar.sources=src,next.config.ts` expande o escopo SAST remoto para incluir os cabeçalhos de segurança e a política CSP configurados em `next.config.ts`;
     - `sonar.javascript.lcov.reportPaths=coverage/lcov.info` está centralizado exclusivamente em `sonar-project.properties` (removida a propriedade duplicada de `.github/workflows/build.yml`);
     - `sonar.coverage.exclusions` inclui `src/app/**` (alinhado a `vitest.config.ts`), além de `src/i18n/**`, `src/locales/**`, `public/locales/**`, `**/i18n/**`, `**/locales/**`, `src/**/data/**` e `src/**/constants/**`;
     - `sonar.cpd.exclusions` permanece unificada em uma única declaração contemplando `src/i18n/**`, `src/data/**` e `src/__tests__/**`.
   - **Defesa em Profundidade (`ADR-009`):** `tsc --noEmit` (segurança de tipos), ESLint (`security/preventive-rules`), Vitest (`test:coverage`) e SonarCloud (`SonarQube Scan` / `Quality Gate`) atuam de forma complementar entre prevenção sintática local e análise estática abrangente na CI.
   - **Pendência de Confirmação Remota (`PENDENTE`):** A configuração foi validada localmente na branch `security/sast-code-quality`; a confirmação da indexação efetiva de `next.config.ts` e da importação de `coverage/lcov.info` no servidor do SonarCloud depende da próxima execução autorizada da pipeline CI.

---

## 5. Privacidade, Proteção de Dados (LGPD), Armazenamento e Metadados (`SEC-05`)

### Estado Atual (`VERIFICADO` / `Validado` em `security/privacy-audit`, `PENDENTE` de merge em `integration/security-quality`)

1. **Ausência de Coleta Direta de Dados Pessoais de Visitantes (`VERIFICADO`):**
   - A aplicação é um portfólio estático (SSG) sem formulários (`<form>`, `<input>`, `<textarea>`), sem autenticação, sem banco de dados, sem rotas de API e sem envio de informações do visitante para servidores da aplicação ou de terceiros.
   - A alternância de idioma (`src/contexts/LanguageContext.tsx`) opera exclusivamente em memória (React state) durante a navegação atual.
2. **Cookies, Web Storage e Ausência de Rastreadores (`VERIFICADO`):**
   - **Cookies:** Zero uso de `document.cookie` ou cabeçalhos `Set-Cookie`.
   - **Armazenamento Persistente:** Zero uso de `localStorage`, `IndexedDB`, `Cache API` ou `Service Workers`.
   - **`sessionStorage` Estritamente Funcional e Efêmero:** O hook `src/components/Skills/hooks/useViewportHint.ts` grava apenas a chave `"skills_hint_seen"` com valor `"1"` no `sessionStorage` para exibir uma única vez por aba a animação visual de dica de clique nas competências. Esse dado não é pessoal, não identifica o visitante e é descartado automaticamente ao fechar a aba.
   - **Analytics, Pixels e Telemetria de Runtime:** Zero scripts ou SDKs de rastreamento (Google Analytics, GTM, Meta Pixel, `@vercel/analytics`, Hotjar, Sentry, etc.). Além disso, `Permissions-Policy` desabilita explicitamente `browsing-topics=()`, `geolocation=()`, `camera=()` e `microphone=()`, e `Referrer-Policy: strict-origin-when-cross-origin` restringe o envio de URLs completas a origens externas.
   - **Dispensa Técnica de Banner de Cookies:** Por não existirem cookies nem tecnologias de rastreamento ou armazenamento de dados pessoais, não deve ser adicionado banner/modal de consentimento de cookies (evitando poluição de interface e coleta desnecessária de estado de consentimento).
3. **Minimização de URL no Compartilhamento (`SharePageButton.tsx` — `SEC-05-01`):**
   - Quando nenhuma prop `url` customizada é fornecida, `src/components/SharePageButton.tsx` constrói o endereço compartilhado exclusivamente com `origin + pathname` (`getCanonicalPageUrl()`), descartando `location.search` e `location.hash` para evitar a propagação acidental de parâmetros de campanha/rastreamento (`utm_*`, `fbclid`, `gclid`) ou fragmentos presentes na URL do visitante (`VERIFICADO` por testes unitários em `src/__tests__/SharePageButton.test.tsx`).
4. **Proteção de Dados Pessoais do Titular do Portfólio e Regras para Documentação (`SEC-05-02`):**
   - Embora o portfólio exiba canais de contato profissional na interface (`src/components/Contact/Contact.tsx` e `README.md`) como escolha funcional de negócio (`RISCO ACEITO` conforme `ADR-006`), **nenhum documento em `docs/` ou `AGENTS.md` deve copiar o número de telefone ou endereço de e-mail pessoal do autor em texto puro**.
   - Os botões de contato de e-mail e telefone em `Contact.tsx` copiam o valor apenas para a área de transferência local do dispositivo do visitante (`navigator.clipboard.writeText` em `useCopyToast.ts`), sem transmissão de rede.
5. **Currículo Externo e Links para Plataformas de Terceiros:**
   - Links para LinkedIn, GitHub, Google Drive (`CurriculumDriveAccess.tsx`), YouTube e Google Colab são acionados exclusivamente por clique voluntário do visitante (`<a target="_blank" rel="noopener noreferrer">`), sem pré-carregamento, iframes ou embeds automáticos.
6. **Metadados EXIF/tEXt de Imagens e Source Maps (`VERIFICADO`):**
   - Todas as 14 imagens em `public/images/` foram auditadas em nível binário (`public/images/profile.jpg` não possui segmento EXIF, GPS ou XMP; os ícones PNG possuem apenas metadado genérico de ferramenta `Software=www.inkscape.org` ou timestamp de criação da logo, sem coordenadas GPS, nomes de proprietário ou seriais de dispositivo).
   - O build de produção não gera arquivos `.map` públicos em `.next/static/` (`0` source maps expostos).
   - Sempre que uma nova imagem for adicionada a `public/images/`, seus metadados EXIF/GPS devem ser verificados e removidos antes do commit.
