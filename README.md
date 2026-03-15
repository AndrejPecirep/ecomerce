# NovaStore — Render-ready ecommerce app

This project is prepared for a full Render deployment:
- frontend on Render Static Site
- backend on Render Web Service
- database on Render PostgreSQL

## Features
- modern storefront UI in English
- customer registration and login
- owner account auto-created from environment variables
- owner-only product publishing
- cart and checkout without card processing
- orders saved in PostgreSQL
- automatic table creation and demo product seeding on startup

## Project structure
- `frontend/` Vite React app
- `backend/` Express API with PostgreSQL
- `render.yaml` optional Render Blueprint file

## Local development
### Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Render deployment
### Option A — manual setup in Render dashboard
1. Push the project to GitHub.
2. Create a new PostgreSQL database in Render.
3. Create a new Web Service from the `backend` folder.
4. Set these backend environment variables:
   - `NODE_ENV=production`
   - `PORT=10000`
   - `JWT_SECRET=<long random string>`
   - `DATABASE_URL=<Render Postgres connection string>`
   - `CLIENT_URL=https://your-frontend-name.onrender.com`
   - `OWNER_EMAIL=<owner login email>`
   - `OWNER_PASSWORD=<strong owner password>`
   - `OWNER_NAME=Store Owner`
5. Create a new Static Site from the `frontend` folder.
6. Set this frontend environment variable:
   - `VITE_API_URL=https://your-backend-name.onrender.com/api`
7. Redeploy the backend if you change `CLIENT_URL` after the frontend URL is known.

### Option B — Render Blueprint
Render can also read `render.yaml`. If you use it, review the service names and update `VITE_API_URL` if you change the backend service name.

## Important notes
- The backend creates tables automatically when it starts.
- The owner account is created automatically only if `OWNER_EMAIL` and `OWNER_PASSWORD` are set.
- Demo products are inserted only when the products table is empty.
- The app does not process credit cards. Orders are stored as manual orders.

## Default routes
- `/` shop homepage
- `/login` login
- `/register` register
- `/cart` cart
- `/checkout` checkout
- `/orders` user orders
- `/add-product` owner-only product page
