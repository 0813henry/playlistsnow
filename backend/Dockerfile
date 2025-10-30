FROM node:18-alpine

# Instalar wget para healthcheck
RUN apk add --no-cache wget

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeapp -u 1001 -G nodejs

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production && npm cache clean --force

# Copiar código fuente
COPY . .

# Cambiar ownership y usuario
RUN chown -R nodeapp:nodejs /app
USER nodeapp

EXPOSE 8080

CMD ["node", "src/index.js"]
