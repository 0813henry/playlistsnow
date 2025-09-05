FROM node:16-alpine AS build

WORKDIR /app

# Copiar archivos del frontend
COPY package*.json ./
RUN npm install

COPY . ./

# Construir la aplicación React
RUN npm run build

# Servir la aplicación con un servidor estático
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
