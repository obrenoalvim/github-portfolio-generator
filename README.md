# GitHub Portfolio Generator

[![CI](https://github.com/obrenoalvim/github-portfolio-generator/actions/workflows/ci.yml/badge.svg)](https://github.com/obrenoalvim/github-portfolio-generator/actions/workflows/ci.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Transforme seu perfil do GitHub em um portfólio profissional e personalizável. Este projeto em Next.js consome a API pública do GitHub para exibir informações do usuário, projetos em destaque, tecnologias principais e uma linha do tempo de experiência (opcional via configuração).

- Geração instantânea de portfólio em `/[username]`
- Destaque de repositórios com stars, forks, tópicos e linguagem
- Cálculo automático de principais tecnologias pelas linguagens dos repositórios
- Personalização por repositório `config` com arquivo `portfolio.json`
- Tema customizável (cores/background)
- Linha do tempo de experiências profissionais (opcional)
- UI moderna com Tailwind CSS e componentes shadcn/ui

## Tecnologias
- Next.js 13 (App Router)
- React 18 + TypeScript
- Tailwind CSS
- shadcn/ui + Radix UI
- Lucide Icons

## Pré-requisitos
- Node.js 18+ (recomendado)
- npm 9+ ou pnpm/yarn

## Instalação e execução (desenvolvimento)
```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Acesse
http://localhost:3000
```

Na página inicial, informe um username do GitHub (ex.: `octocat`) para gerar o portfólio em tempo real.

## Scripts disponíveis
- `npm run dev` — inicia o servidor de desenvolvimento
- `npm run build` — build de produção
- `npm run start` — inicia o servidor após o build
- `npm run lint` — executa o linter

## Rotas
- `/` — Landing page com formulário para digitar o username
- `/:username` — Página do portfólio gerada a partir do perfil do GitHub

## Personalização (repositório config)
Você pode personalizar o portfólio criando no seu GitHub um repositório público chamado `config` contendo um arquivo `portfolio.json` na raiz:

Caminho buscado: `https://api.github.com/repos/<username>/config/contents/portfolio.json`

Exemplo de `portfolio.json`:
```json
{
  "theme": {
    "primaryColor": "#3B82F6",
    "backgroundColor": "#F8FAFC",
    "textColor": "#1E293B"
  },
  "sections": {
    "about": "Desenvolvedor apaixonado por...",
    "skills": ["JavaScript", "React", "Node.js"],
    "featured": ["repo1", "repo2", "repo3"],
    "experience": [
      {
        "title": "Desenvolvedor Frontend",
        "company": "Empresa X",
        "period": "2022 — Atual",
        "summary": "Atuação em desenvolvimento de interfaces e design system.",
        "highlights": [
          "React + TypeScript",
          "Integração com APIs",
          "Performance e acessibilidade"
        ]
      }
    ]
  },
  "social": {
    "linkedin": "seu-usuario",
    "website": "https://seusite.com",
    "email": "voce@exemplo.com"
  }
}
```

Campos suportados:
- `theme.primaryColor` — cor de destaque (links, ícones)
- `theme.backgroundColor` — cor de fundo da página
- `theme.textColor` — cor de texto (opcional)
- `sections.about` — texto de apresentação (sobre)
- `sections.skills` — lista de habilidades exibidas como badges
- `sections.featured` — nomes dos repositórios a destacar (case-sensitive)
- `sections.experience` — lista de experiências para a linha do tempo
- `social.linkedin` — seu perfil no LinkedIn (apenas usuário)
- `social.website` — URL do seu site/portfolio
- `social.email` — e-mail de contato

## Como os repositórios são escolhidos
- Busca até 20 repositórios mais recentemente atualizados via `GET /users/:username/repos?sort=updated&per_page=20`
- Exclui repositórios chamados `config`, `readme` ou com o mesmo nome do usuário
- Exibe até 6 projetos em destaque; se `sections.featured` existir, usa exatamente os nomes listados
- Mostra tópicos do repositório (quando existirem) e métricas (stars/forks)
- Calcula as principais tecnologias a partir do campo `language` dos repositórios

Observação: repositórios cujo nome contenha "fork" são filtrados.

## Limites da API do GitHub
- O projeto utiliza a API pública sem autenticação por padrão (60 requisições/hora por IP)
- Em uso intenso, você pode atingir rate limit; considere adicionar autenticação no fetch (não implementado aqui por padrão)

## Build e produção
```bash
npm run build
npm run start
```

## Créditos
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)
