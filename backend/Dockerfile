FROM node:22.18.0-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Instala todas las dependencias
RUN npm ci

COPY . .

# Compila TypeScript
RUN npm run build

# Etapa de producción
FROM node:22.18.0-alpine AS production

WORKDIR /app

COPY package*.json ./

# Instala solo dependencias de producción
RUN npm ci --only=production

# Copia los archivos compilados
COPY --from=builder /app/dist ./dist


# Expone el puerto 8080
EXPOSE 8080

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
