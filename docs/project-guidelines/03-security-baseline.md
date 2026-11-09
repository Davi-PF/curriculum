# 03. Baseline de Segurança do Projeto

> **Classificação de Status neste Documento:**
> - `VERIFICADO`: Controle ou estado auditado e comprovado no código-fonte atual.
> - `PENDENTE`: Controle implementado em branch temática e aguardando merge em `integration/security-quality`, ou planejado para etapa futura.
> - `RISCO ACEITO`: Exposição intencional ou limitação técnica documentada e aceita com justificativa.

---

## 1. Segurança de Código (SAST e Prevenção de XSS)

### Requisitos Obrigatórios
1. **Proibição de Injeção de HTML/Script:**
   - É **estritamente proibido** utilizar `dangerouslySetInnerHTML`, `eval()`, `new Function()`, `document.write()` ou `innerHTML` em qualquer componente ou hook.
   - `Status: VERIFICADO` — A auditoria SAST confirmou zero ocorrências dessas APIs em todo o diretório `src/`.
2. **Manipulação Segura do DOM:**
   - Toda renderização de textos (incluindo dados vindos de `src/i18n/` e `src/data/`) deve ocorrer via JSX padrão do React, garantindo escapamento automático contra XSS.
   - O uso de APIs imperativas do navegador deve restringir-se a operações seguras de estado visual/interação:
     - `window.scrollTo` e `window.scrollY` (`src/components/Header/useHeaderScroll.ts`, `src/components/ScrollToTopButton/ScrollToTopButton.tsx`).
     - `navigator.share` e `navigator.clipboard.writeText` (`src/components/ShareButton/SharePageButton.tsx`), sempre construindo a URL a partir de `window.location.origin + pathname` (sem refletir parâmetros não confiáveis da query string ou hash).
     - `IntersectionObserver` (`src/components/ScrollHint/ScrollHint.tsx`).
3. **Prevenção de Open Redirect:**
   - O projeto não deve utilizar redirecionamentos baseados em parâmetros de URL (`searchParams`, `window.location.href = param`).
   - `Status: VERIFICADO` — Nenhuma rota ou componente realiza redirecionamento dinâmico baseado em entrada do usuário.

### Segurança de Links Externos (`target="_blank"`)
- **Regra Obrigatória:** Todo elemento `<a target="_blank">` que aponte para domínios externos (GitHub, LinkedIn, Google Drive, WhatsApp, certificados, etc.) **deve obrigatoriamente** conter:
  - Protocolo explícito `https://` (ou esquemas seguros específicos como `mailto:` em links de e-mail).
  - Atributo `rel="noopener noreferrer"` para prevenir *Reverse Tabnabbing* e vazamento de referência de janela (`window.opener`).
- **Estado Atual (`VERIFICADO`):**
  - `src/components/Contact/ContactItem.tsx`: Utiliza `target="_blank"` e `rel="noopener noreferrer"`.
  - `src/components/CurriculumDriveAccess/CurriculumDriveAccess.tsx`: Utiliza `target="_blank"` e `rel="noopener noreferrer"`.
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
- **Auditoria e Refinamento da CSP (`SEC-04`):** `Validado` na branch `security/content-security-policy`, `PENDENTE` de merge em `integration/security-quality` (`VERIFICADO`).

Em `next.config.ts`, a aplicação define `poweredByHeader: false`, exporta as funções testáveis `buildCspHeader(isDev)` e `getSecurityHeaders(isDev)` (cobertas por testes automatizados em `src/__tests__/nextConfigHeaders.test.ts`) e aplica os cabeçalhos em `source: "/:path*"`.

| Cabeçalho / Configuração | Valor / Diretiva Configurada | Finalidade Técnica | Status Atual |
| :--- | :--- | :--- | :--- |
| `poweredByHeader` (`next.config.ts`) | `false` | Ocultar o cabeçalho `X-Powered-By: Next.js` para reduzir *fingerprinting* da stack. | `VERIFICADO` (`Integrado` em `integration/security-quality`) |
| `X-Content-Type-Options` | `nosniff` | Impedir *MIME-sniffing* de scripts e folhas de estilo pelo navegador. | `VERIFICADO` (`Integrado` em `integration/security-quality`) |
| `X-Frame-Options` | `DENY` | Prevenir ataques de *Clickjacking* impedindo embutimento em `<frame>`/`<iframe>`. | `VERIFICADO` (`Integrado` em `integration/security-quality`) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Enviar apenas a origem em requisições cross-origin HTTPS e omitir em downgrade HTTP. | `VERIFICADO` (`Integrado` em `integration/security-quality`) |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), browsing-topics=()` | Desabilitar APIs sensíveis do navegador não utilizadas pelo portfólio. | `VERIFICADO` (`Integrado` em `integration/security-quality`) |
| `Content-Security-Policy` (CSP — Produção) | `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; frame-src 'none'; upgrade-insecure-requests` | Política de menor privilégio compatível com SSG no Next.js 16.4.5. Na `SEC-04`, foram removidas permissões desnecessárias (`blob:` de `img-src` e `data:` de `font-src`) e adicionada `frame-src 'none'`. | `VERIFICADO` (`Validado` em `security/content-security-policy` / `PENDENTE` de merge) |
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
4. **Quality Gate Completo no Job `ci`:**
   - O job `ci` executa sequencialmente `npm ci`, `npx tsc --noEmit`, `npm run lint`, `npm run test:coverage`, `npm run build`, `SonarQube Scan`, `SonarCloud Quality Gate` (em PRs e em pushes para `master`) e `Upload coverage`.
   - Em `eslint.config.mjs`, `"coverage/**"` está incluído em `globalIgnores`, garantindo `0 warnings` mesmo quando o lint roda após `test:coverage`.
   - Em `sonar-project.properties`, `sonar.cpd.exclusions` está unificada em uma única declaração contemplando `src/i18n/**`, `src/data/**` e `src/__tests__/**`.

---

## 5. Privacidade, Dados Pessoais (PII) e Metadados de Arquivos

### Diretrizes Obrigatórias para Documentação e Agentes
1. **Não Replicar Dados Pessoais na Documentação Técnica:**
   - Embora o portfólio exiba formas de contato publicamente na interface, **nenhum documento em `docs/` ou `AGENTS.md` deve copiar o número de telefone ou endereço de e-mail pessoal do autor em texto puro**. Referencie apenas os arquivos de código (`src/components/Contact/Contact.tsx` e `README.md`).
2. **Exposição de Contato no Código (`RISCO ACEITO`):**
   - A presença de canais de contato em `src/components/Contact/Contact.tsx` é uma escolha funcional de negócio para recrutadores (`RISCO ACEITO`), documentada em `[SEC-05]` (`08-security-findings-and-risks.md`).
3. **Currículo em PDF e Google Drive:**
   - O currículo em PDF não é armazenado dentro do repositório Git; o acesso ocorre por link externo do Google Drive em `src/components/CurriculumDriveAccess/CurriculumDriveAccess.tsx`.
   - **Recomendação Operacional:** Garantir no Google Drive que o link esteja restrito a *"Qualquer pessoa com o link pode visualizar"* (sem permissão de edição ou listagem de pasta pai) e que os metadados internos do PDF (Autor/Software) contenham apenas informações profissionais desejadas.
4. **Metadados EXIF de Imagens (`VERIFICADO`):**
   - Todas as imagens em `public/images/` (incluindo `public/images/profile.jpg`) foram inspecionadas quanto a metadados EXIF.
   - `Status: VERIFICADO` — Não existem coordenadas GPS, números de série de câmera ou metadados privados sensíveis nos ativos de imagem do repositório. Sempre que uma nova foto for adicionada a `public/images/`, seus metadados EXIF devem ser removidos antes do commit.
