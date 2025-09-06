FROM node:22.18.0-alpine AS builder

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

WORKDIR /app

# Cambiar propietario del directorio
RUN chown -R nextjs:nodejs /app

# Cambiar a usuario no-root
USER nextjs

COPY --chown=nextjs:nodejs package*.json ./

# Instala todas las dependencias
RUN npm ci

COPY --chown=nextjs:nodejs . .

# Usa npm run build en lugar de npx babel directamente
RUN npm run build

# Etapa de producción
FROM node:22.18.0-alpine AS production

# Crear el mismo usuario en producción
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

WORKDIR /app

RUN chown -R nextjs:nodejs /app

USER nextjs

COPY --chown=nextjs:nodejs package*.json ./

# Instala solo dependencias de producción
RUN npm ci --only=production

# Copia los archivos compilados
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist


# Expone el puerto 8080
EXPOSE 8080

# Comando para ejecutar la aplicación
CMD ["node", "dist/index.js"]
