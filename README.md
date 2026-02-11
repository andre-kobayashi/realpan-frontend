# Real Pan - Frontend Corporativo

Frontend institucional da Real Pan construído com Next.js 14, TypeScript e Tailwind CSS.

## 🚀 Fase 1 - Entrega Rápida

Este é o **frontend corporativo** com conteúdo mockado em JSON, pronto para substituir o WordPress atual.

### ✨ Features Implementadas

- ✅ Next.js 14 com App Router
- ✅ TypeScript strict mode
- ✅ Sistema i18n bilíngue (PT/JA)
- ✅ Tailwind CSS com paleta japonesa corporativa
- ✅ Componentes responsivos mobile-first
- ✅ 4 páginas (Home, Sobre, Produtos, Contato)
- ✅ Mock data em JSON
- ✅ SEO otimizado

## 📋 Pré-requisitos

- Node.js 20 LTS
- npm ou yarn

## 🛠️ Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd realpan-frontend

# Instale as dependências
npm install

# Copie o arquivo de ambiente
cp .env.example .env.local
```

## 🏃 Desenvolvimento

```bash
# Inicie o servidor de desenvolvimento
npm run dev

# Acesse: http://localhost:3000
```

### Idiomas disponíveis:
- Português: `http://localhost:3000/pt`
- Japonês: `http://localhost:3000/ja`

## 🏗️ Build para Produção

```bash
# Gere o build otimizado
npm run build

# Inicie o servidor de produção
npm start
```

## 📁 Estrutura do Projeto

```
realpan-frontend/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── (pages)/
│   │   │   │   ├── about/
│   │   │   │   ├── contact/
│   │   │   │   ├── products/
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── data/
│   │   └── products.json
│   ├── messages/
│   │   ├── pt.json
│   │   └── ja.json
│   ├── i18n.ts
│   └── middleware.ts
├── public/
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## 🎨 Customização

### Cores (tailwind.config.js)
- `primary`: Azul corporativo japonês
- `accent`: Vermelho tradicional japonês
- `neutral`: Tons de cinza

### Traduções (src/messages/)
- `pt.json`: Textos em português
- `ja.json`: Textos em japonês

### Mock Data (src/data/)
- `products.json`: Produtos mockados

## 🚢 Deploy no CloudPanel

### Via SSH no VPS:

```bash
# 1. Acesse o VPS
ssh frontend@seu-servidor

# 2. Clone o repositório
cd ~
git clone <repository-url> realpan-frontend
cd realpan-frontend

# 3. Instale dependências
npm install

# 4. Configure ambiente
cp .env.example .env
nano .env  # Edite as variáveis

# 5. Build
npm run build

# 6. Inicie com PM2 (ou método do CloudPanel)
pm2 start npm --name "realpan-frontend" -- start
pm2 save
```

### Configuração CloudPanel:
- **Domain**: realpan.co.jp
- **Port**: 3000
- **Site User**: frontend
- **Node Version**: 20 LTS

## 📝 Próximas Fases

### Fase 2 - Backend & Database
- [ ] PostgreSQL/Supabase
- [ ] Prisma ORM
- [ ] API REST
- [ ] Autenticação

### Fase 3 - E-commerce B2C
- [ ] Carrinho de compras
- [ ] Checkout
- [ ] Pagamentos

### Fase 4 - E-commerce B2B
- [ ] Cadastro de empresas
- [ ] Preços diferenciados
- [ ] Pedidos sem pagamento

### Fase 5 - Painel Admin
- [ ] Gestão de produtos
- [ ] Gestão de pedidos
- [ ] Dashboard analytics

### Fase 6 - Faturamento
- [ ] Sistema de notas fiscais
- [ ] Relatórios financeiros

## 🤝 Contribuindo

Este é um projeto privado da Real Pan.

## 📄 Licença

Proprietário - Real Pan © 2026
