# ===== BUILD STAGE =====
FROM node:18 AS build

WORKDIR /app

# Kopiramo samo package fajlove radi cache-a
COPY package*.json ./

# NPM install s legacy peer deps (rješava Stripe konflikt)
RUN npm install --legacy-peer-deps

# Kopiramo ostatak projekta
COPY . .

# Build frontend aplikacije
RUN npm run build


# ===== PRODUCTION STAGE =====
FROM nginx:stable

# Kopiramo buildane fajlove u nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
