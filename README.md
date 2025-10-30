# 🎵 PlaylistsNow MVP

Una aplicación web moderna para descubrir y compartir canciones favoritas en la oficina. Construida con React (frontend) y Node.js/Express (backend), utilizando MongoDB Atlas para persistencia.

## 📋 Descripción del Proyecto

PlaylistsNow es un MVP (Producto Mínimo Viable) que permite:

- Ver un listado de canciones (título y artista)
- Agregar nuevas canciones mediante un formulario simple
- Comunicación frontend-backend a través de API REST
- Persistencia en MongoDB Atlas (con fallback a datos en memoria)

## 🛠️ Tecnologías Utilizadas

### Frontend

- **React 18** - Biblioteca de JavaScript para interfaces de usuario
- **Axios** - Cliente HTTP para comunicación con la API
- **CSS3** - Estilos modernos con gradientes y animaciones

### Backend

- **Node.js** - Entorno de ejecución de JavaScript
- **Express.js** - Framework web minimalista
- **MongoDB/Mongoose** - Base de datos NoSQL (MongoDB Atlas)
- **CORS** - Middleware para manejar solicitudes de origen cruzado
- **Morgan** - Middleware de logging HTTP

### DevOps

- **Docker** - Contenerización de servicios
- **Docker Compose** - Orquestación de contenedores
- **Red Bridge personalizada** - Comunicación entre servicios

## 📁 Estructura del Proyecto

```
playlistsnow/
├── frontend/                 # Aplicación React
│   ├── public/
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   │   ├── AddSongForm.js
│   │   │   ├── Navbar.js
│   │   │   └── SongList.js
│   │   ├── App.js           # Componente principal
│   │   ├── App.css          # Estilos globales
│   │   └── index.js         # Punto de entrada
│   ├── Dockerfile           # Imagen Docker del frontend
│   ├── nginx.conf           # Configuración Nginx
│   └── package.json
├── backend/                  # API REST Node.js
│   ├── src/
│   │   └── index.js         # Servidor Express
│   ├── Dockerfile           # Imagen Docker del backend
│   ├── .env                 # Variables de entorno
│   └── package.json
├── docker-compose.yml        # Orquestación de servicios
└── README.md                # Este archivo
```

## ⚙️ Configuración Inicial

Antes de ejecutar el proyecto, necesitas configurar las credenciales de la base de datos usando Docker Secrets:

1. Crea los archivos de credenciales:

   ```bash
   # En Linux/macOS
   mkdir -p secrets
   echo "tu_usuario_mongodb" > secrets/db_user.txt
   echo "tu_password_mongodb" > secrets/db_password.txt

   # En Windows PowerShell
   New-Item -ItemType Directory -Force -Path secrets
   "tu_usuario_mongodb" | Out-File -FilePath secrets/db_user.txt -Encoding UTF8 -NoNewline
   "tu_password_mongodb" | Out-File -FilePath secrets/db_password.txt -Encoding UTF8 -NoNewline
   ```

2. O copia los archivos de ejemplo:
   ```bash
   cp secrets/db_user.txt.example secrets/db_user.txt
   cp secrets/db_password.txt.example secrets/db_password.txt
   # Luego edita los archivos con las credenciales reales
   ```

**Nota**: La carpeta `secrets/` está en `.gitignore` por seguridad. Todos los desarrolladores usarán las mismas credenciales pero nunca se subirán a Git.

## 🚀 Cómo ejecutar el proyecto

Antes de empezar, asegúrate de tener instalado:

- **Docker** (versión 20.10 o superior)
- **Docker Compose** (versión 2.0 o superior)
- **Git** para clonar el repositorio

### Verificar instalación:

```bash
docker --version
docker-compose --version
```

## 📦 Instalación y Ejecución

### Opción 1: Ejecución Completa con Docker Compose (Recomendado)

1. **Clona el repositorio:**

```bash
git clone <tu-repositorio>
cd playlistsnow
```

2. **Levanta todo el stack:**

```bash
docker-compose up -d
```

3. **Verifica que los servicios están corriendo:**

```bash
docker-compose ps
```

4. **Accede a la aplicación:**

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080
- **Health Check:** http://localhost:8080/api/health

### Opción 2: Ejecución Individual con Docker Run

#### Paso 1: Crear Red Personalizada

```bash
docker network create playlistsnow-network
```

#### Paso 2: Construir Imágenes

**Backend:**

```bash
cd backend
docker build -t playlistsnow-backend .
cd ..
```

**Frontend:**

```bash
cd frontend
docker build -t playlistsnow-frontend .
cd ..
```

#### Paso 3: Ejecutar Contenedores

**Backend:**

```bash
docker run -d \
  --name playlistsnow-backend \
  --network playlistsnow-network \
  -p 8080:8080 \
  -e PORT=8080 \
  -e MONGODB_URI="mongodb+srv://playlistsnow:playlistsnow@playlistsnow.meiecfs.mongodb.net/playlistsnow?retryWrites=true&w=majority" \
  playlistsnow-backend
```

**Frontend:**

```bash
docker run -d \
  --name playlistsnow-frontend \
  --network playlistsnow-network \
  -p 3000:80 \
  -e REACT_APP_API_URL="http://localhost:8080/api" \
  playlistsnow-frontend
```

## 🧪 Pruebas y Validación

### 1. Verificar Estado de la Red

```bash
docker network ls
docker network inspect playlistsnow-network
```

### 2. Pruebas de API Backend

**Health Check:**

```bash
curl http://localhost:8080/api/health
```

_Respuesta esperada:_

```json
{
  "status": "ok",
  "timestamp": "2025-01-09T...",
  "mongodb": "connected"
}
```

**Listar canciones:**

```bash
curl http://localhost:8080/api/songs
```

**Agregar una canción:**

```bash
curl -X POST http://localhost:8080/api/songs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Bohemian Rhapsody",
    "artist": "Queen"
  }'
```

### 3. Pruebas de Frontend

1. Abre http://localhost:3000 en tu navegador
2. Verifica que se muestra el listado de canciones
3. Usa el formulario para agregar una nueva canción
4. Confirma que la nueva canción aparece en la lista

## 🔧 Comandos Útiles

### Docker Compose

```bash
# Levantar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down

# Reconstruir imágenes
docker-compose build --no-cache

# Reiniciar un servicio específico
docker-compose restart backend
```

## 📊 Endpoints de la API

| Método | Endpoint      | Descripción                | Ejemplo de Respuesta                               |
| ------ | ------------- | -------------------------- | -------------------------------------------------- |
| GET    | `/api/health` | Estado del servicio        | `{"status":"ok","mongodb":"connected"}`            |
| GET    | `/api/songs`  | Listar todas las canciones | `[{"_id":"...","title":"Song","artist":"Artist"}]` |
| POST   | `/api/songs`  | Crear nueva canción        | `{"_id":"...","title":"Song","artist":"Artist"}`   |

### Ejemplo de Payload POST:

```json
{
  "title": "Hotel California",
  "artist": "Eagles"
}
```

## 🎯 Criterios de Éxito

✅ **Stack con Compose:** `docker-compose up -d` levanta frontend y backend
✅ **Red personalizada:** Visible en `docker network ls`
✅ **Backend funcional:** Health check responde con status "ok"
✅ **API REST:** GET y POST funcionan correctamente
✅ **Frontend funcional:** Muestra listado y permite agregar canciones
✅ **Comunicación:** Frontend se comunica con backend exitosamente

---

**¡Disfruta compartiendo tu música favorita con PlaylistsNow! 🎵**
