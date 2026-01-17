# Portfolio / Currículo Online

Este repositório contém meu **portfolio pessoal e currículo online**, desenvolvido com foco em **clareza, acessibilidade, qualidade de código e boas práticas de frontend moderno**.

O projeto apresenta informações profissionais, experiência, habilidades e formas de contato, além de permitir **compartilhamento do link da página** e **acesso direto ao currículo em PDF**.

---

## ✨ Principais Funcionalidades

- 📄 Currículo online com acesso ao PDF
- 🔗 Compartilhamento da página via:
  - Web Share API (dispositivos compatíveis)
  - Clipboard API
  - Fallback com `window.prompt`
- 🌐 Internacionalização (i18n)
- ♿ Acessibilidade (teclado, ARIA e semântica correta)
- 🎨 Interface responsiva com Tailwind CSS
- 🧪 Testes automatizados
- 🔍 Qualidade de código com ESLint e SonarCloud
- 🚀 CI/CD com GitHub Actions

---

## 🛠️ Tecnologias Utilizadas

- **Next.js** (App Router)
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Vitest**
- **@testing-library/react**
- **ESLint**
- **SonarCloud**
- **Codecov**
- **Vercel**

---

## 📂 Estrutura do Projeto

```text
src/
├── app/                    # App Router (layouts e páginas)
├── components/             # Componentes reutilizáveis
│   ├── Contact/            # Seção de contato
│   ├── Experience/         # Seção de Experiências
│   ├── ExpandableText/     # Responsável por manipular textos longos
│   ├── Formation/          # Seção com formação acadêmica
│   ├── Header/             # Seção de controle do Header
│   ├── Skills/             # Seção de habilidades
│   ├── About               # Componente do Sobre mim
│   ├── Footer              # Rodapé da página
│   ├── Hero                # Bem-vindo da aplicação
│   ├── LanguageSwitcher    # Componente de troca de idioma
│   └── SharePageButton     # Botão de compartilhamento
│
├── contexts/               # Contextos globais (ex: idioma)
├── __tests__/              # Testes automatizados
├── data/                   # Dados estáticos específicos (Skills, Experiences, etc)
├── i18n/                   # Dados estáticos gerais (Títulos, descrições, etc)
└── types/                  # Tipagem de dados
public/
└── images/                 # Assets estáticos
```

---

## ▶️ Executando o Projeto Localmente

### Pré-requisitos

- Node.js **v18+** (recomendado v22)
- npm ou yarn

### Instalação

```bash
npm install
```

### Ambiente de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em:

```
http://localhost:3000
```

---

## 🧪 Testes

### Executar todos os testes

```bash
npm test
```

### Executar testes com cobertura

```bash
npx vitest run --coverage
```


## 🔄 CI / CD

Este projeto utiliza **GitHub Actions** para integração contínua, incluindo:

- Instalação de dependências
- Execução de testes automatizados
- Coleta de cobertura de código
- Análise de qualidade com SonarCloud
- Publicação de cobertura no Codecov
- Deploy automático via Vercel

---

## 🚀 Deploy

O deploy é realizado automaticamente utilizando a **Vercel**:

1. Push do código para o GitHub
2. Repositório conectado à Vercel
3. Build e deploy automáticos

Documentação oficial:
https://nextjs.org/docs/app/building-your-application/deploying

---

## 📬 Contato

- **LinkedIn**: https://www.linkedin.com/in/daviprudente/
- **GitHub**: https://github.com/Davi-PF
- **E-mail**: daviprufer@gmail.com

---

## 📄 Licença

Este projeto é de uso pessoal e demonstrativo.
Sinta-se à vontade para se inspirar, mas não reutilizar o conteúdo diretamente.
