# Etapa de build
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production=false

# Copiar código fuente
COPY . .

# Build de la aplicación
ENV NODE_ENV=production
ENV GENERATE_SOURCEMAP=false
RUN npm run build

# Etapa de producción
FROM nginx:1.25-alpine

# Copiar build de React
COPY --from=builder /app/build /usr/share/nginx/html

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]