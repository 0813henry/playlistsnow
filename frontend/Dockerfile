# Etapa de build
FROM node:22.18.0-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Etapa de producción: servir archivos estáticos con nginx
FROM nginx:1.27.0-alpine

# Copia el build de React al directorio de nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Copia configuración personalizada de nginx si la tienes
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]