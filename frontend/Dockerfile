# Etapa de build
FROM node:22.18.0-alpine AS builder

# Instalar dependencias del sistema que pueden necesitarse
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production=false

COPY . .

# Asegurar permisos de ejecución para scripts de npm
RUN chmod +x ./node_modules/.bin/*

# Variables de entorno para el build
ENV NODE_ENV=production
ENV GENERATE_SOURCEMAP=false

RUN npm run build

# Etapa de producción: servir archivos estáticos con nginx
FROM nginx:1.25-alpine

# Copia el build de React al directorio de nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Copia configuración personalizada de nginx si la tienes
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]