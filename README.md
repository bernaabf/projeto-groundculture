# Ground Culture - Landing Page

Bem-vindo ao repositório do **Ground Culture**, uma landing page moderna, rápida e responsiva construída com as tecnologias mais recentes do ecossistema web. 

Este projeto foi desenvolvido para oferecer uma experiência de usuário premium, com animações fluidas e uma interface limpa.

## 🚀 Tecnologias Utilizadas

- **[Next.js](https://nextjs.org/)** - Framework React para performance e SEO.
- **[React](https://react.dev/)** - Biblioteca para criação de interfaces de usuário.
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática para maior segurança e manutenção do código.
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitário para estilização rápida e responsiva.
- **[Framer Motion](https://www.framer.com/motion/)** - Biblioteca de animações para React, responsável pelas transições suaves.
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Gerenciamento de estado global leve e rápido (utilizado para o carrinho de compras).
- **[Lucide React](https://lucide.dev/)** - Conjunto de ícones modernos.

## 📦 Estrutura do Projeto

O projeto segue a estrutura baseada no `App Router` do Next.js:

- `src/app/`: Rotas, páginas e layouts.
- `src/components/`: Componentes reutilizáveis (UI, botões, cards, carrinho, layout etc.).
- `src/lib/`: Dados do site (`data.ts`) e configurações de estado global (Zustand store).
- `src/utils/`: Funções utilitárias gerais.
- `public/`: Imagens estáticas e assets.

## ✨ Melhorias Recentes

Este projeto passou recentemente por uma auditoria completa, implementando as seguintes otimizações:

- **SEO & Metadados**: Geração estática e dinâmica de Metadados (`generateMetadata`), adição de dados estruturados (JSON-LD para produtos e organização) e implementação de `sitemap.xml` e `robots.txt`.
- **Acessibilidade (a11y)**: Melhoria de navegação via teclado, adição de `aria-labels` e `roles`, lock de scroll para o carrinho e rings visíveis de focus nos botões.
- **Performance**: Uso otimizado de imagens no Next.js (formatos WebP/AVIF servidos localmente), refatoração de rotas dinâmicas para Server Components e uso de seletores otimizados do Zustand (`useCartStore`) para evitar re-renderizações desnecessárias.
- **Bugs e UX**: Correção do fluxo de filtro nas páginas de produtos e ajustes de estado (Hydration Mismatches). O formulário de contato agora está totalmente integrado para iniciar conversas automaticamente via WhatsApp.

## 🛠️ Como Executar Localmente

Siga os passos abaixo para rodar o projeto na sua máquina:

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/bernaabf/projeto-groundculture.git
   ```

2. **Entre na pasta e instale as dependências:**
   ```bash
   cd código-landingpage-groundculture
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse no navegador:**
   Abra [http://localhost:3000](http://localhost:3000) para ver o resultado.

## 🚀 Como fazer o Deploy

A maneira mais simples de fazer o deploy deste projeto é utilizando a plataforma [Vercel](https://vercel.com/):

1. Faça login na Vercel com a sua conta do GitHub.
2. Clique em **"Add New Project"** e selecione este repositório.
3. Não é necessário alterar nenhuma configuração padrão. Apenas clique em **"Deploy"**.
4. Seu projeto estará online em poucos minutos e receberá atualizações automáticas sempre que você fizer um `git push` para a branch `main`.
