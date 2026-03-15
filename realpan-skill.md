# Real Pan Frontend Redesign Skill
## Project Overview
E-commerce de pães brasileiros congelados no Japão. Bilíngue PT/JA.
## Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion, next-intl
- **API**: Express + Prisma + PostgreSQL
- **Admin**: Next.js 14 separado (port 3001)
- **Repos**: github.com/andre-kobayashi/realpan-frontend | realpan-api
## Servers
- Frontend: ~/htdocs/realpan.co.jp/realpan-frontend (PM2 id=7)
- Admin: ~/htdocs/realpan.co.jp/realpan-frontend/realpan-admin (PM2 id=6, port 3001)
- API: ~/htdocs/api.realpan.jp/realpan-api (PM2 id=0)
- Build frontend: cd ~/htdocs/realpan.co.jp/realpan-frontend && npx next build && pm2 restart realpan-frontend
- Build admin: cd realpan-admin && npx next build && pm2 restart realpan-admin
## Design Reference: Style Bread (ec.stylebread.com)
- Warm cream/beige background (
#FAF7F2)
- Product grid 2col mobile, foto grande, +/- quantity no card
- Floating cart bar mobile com total
- Hamburger menu com ícones grandes
- Detail: galeria + tabs + instruções de preparo
- Cores: dourado/marrom/creme
## Real Pan Specifics
- Sem frete grátis — cobra por região (Sagawa)
- Bilíngue PT/JA
- PF (varejo) e PJ (atacado com desconto)
- Preços YEN inteiro, imposto 8% alimentos / 10% serviços
- ~301 produtos (280 ativos), 9 categorias
## Priority Order
1. ProductCard — grid 2col, +/- quantity, preço JP style
2. ProductsClient — categorias, hero, filtros
3. Header mobile — hamburger com ícones
4. ProductDetailClient — galeria, tabs, preparo
5. Cart bar mobile — barra fixa rodapé
6. Home page — hero, destaques
7. Sets/Kits — nova seção + admin module  
