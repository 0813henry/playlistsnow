#!/bin/bash

# Script de validación para PlaylistsNow MVP
# Ejecutar desde la carpeta raíz del proyecto

echo "🎵 === VALIDACIÓN PlaylistsNow MVP ==="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir con colores
print_step() {
    echo -e "${BLUE}[PASO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

# 1. Verificar Docker y Docker Compose
print_step "1. Verificando requisitos previos..."
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    print_success "Docker encontrado: $DOCKER_VERSION"
else
    print_error "Docker no está instalado"
    exit 1
fi

if command -v docker-compose &> /dev/null; then
    COMPOSE_VERSION=$(docker-compose --version)
    print_success "Docker Compose encontrado: $COMPOSE_VERSION"
else
    print_error "Docker Compose no está instalado"
    exit 1
fi

# 2. Verificar estructura de archivos
print_step "2. Verificando estructura del proyecto..."
required_files=(
    "docker-compose.yml"
    "backend/Dockerfile"
    "backend/package.json"
    "backend/src/index.js"
    "frontend/Dockerfile"
    "frontend/package.json"
    "frontend/src/App.js"
    "README.md"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        print_success "Archivo encontrado: $file"
    else
        print_error "Archivo faltante: $file"
        exit 1
    fi
done

# 3. Levantar servicios
print_step "3. Levantando servicios con Docker Compose..."
docker-compose up -d

# Esperar a que los servicios estén listos
print_step "4. Esperando a que los servicios estén listos..."
sleep 10

# 4. Verificar contenedores
print_step "5. Verificando estado de contenedores..."
BACKEND_STATUS=$(docker inspect --format='{{.State.Status}}' playlistsnow-backend 2>/dev/null)
FRONTEND_STATUS=$(docker inspect --format='{{.State.Status}}' playlistsnow-frontend 2>/dev/null)

if [ "$BACKEND_STATUS" = "running" ]; then
    print_success "Backend container está corriendo"
else
    print_error "Backend container no está corriendo (Estado: $BACKEND_STATUS)"
fi

if [ "$FRONTEND_STATUS" = "running" ]; then
    print_success "Frontend container está corriendo"
else
    print_error "Frontend container no está corriendo (Estado: $FRONTEND_STATUS)"
fi

# 5. Verificar red
print_step "6. Verificando red personalizada..."
if docker network ls | grep -q "playlistsnow-network"; then
    print_success "Red playlistsnow-network encontrada"
    
    # Verificar que los contenedores están conectados
    BACKEND_NETWORK=$(docker inspect playlistsnow-backend --format='{{range $k, $v := .NetworkSettings.Networks}}{{$k}}{{end}}' 2>/dev/null)
    FRONTEND_NETWORK=$(docker inspect playlistsnow-frontend --format='{{range $k, $v := .NetworkSettings.Networks}}{{$k}}{{end}}' 2>/dev/null)
    
    if [[ "$BACKEND_NETWORK" == *"playlistsnow-network"* ]]; then
        print_success "Backend conectado a playlistsnow-network"
    else
        print_error "Backend NO conectado a playlistsnow-network"
    fi
    
    if [[ "$FRONTEND_NETWORK" == *"playlistsnow-network"* ]]; then
        print_success "Frontend conectado a playlistsnow-network"
    else
        print_error "Frontend NO conectado a playlistsnow-network"
    fi
else
    print_error "Red playlistsnow-network NO encontrada"
fi

# 6. Probar API Backend
print_step "7. Probando API Backend..."

# Health Check
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/health)
if [ "$HEALTH_RESPONSE" = "200" ]; then
    print_success "Health check OK (HTTP 200)"
    HEALTH_DATA=$(curl -s http://localhost:8080/api/health)
    echo "   Respuesta: $HEALTH_DATA"
else
    print_error "Health check FALLÓ (HTTP $HEALTH_RESPONSE)"
fi

# Test GET /api/songs
SONGS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/songs)
if [ "$SONGS_RESPONSE" = "200" ]; then
    print_success "GET /api/songs OK (HTTP 200)"
else
    print_error "GET /api/songs FALLÓ (HTTP $SONGS_RESPONSE)"
fi

# Test POST /api/songs
POST_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:8080/api/songs \
    -H "Content-Type: application/json" \
    -d '{"title":"Test Song","artist":"Test Artist"}')
if [ "$POST_RESPONSE" = "201" ]; then
    print_success "POST /api/songs OK (HTTP 201)"
else
    print_error "POST /api/songs FALLÓ (HTTP $POST_RESPONSE)"
fi

# 7. Verificar Frontend
print_step "8. Verificando Frontend..."
FRONTEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$FRONTEND_RESPONSE" = "200" ]; then
    print_success "Frontend accesible (HTTP 200)"
else
    print_error "Frontend NO accesible (HTTP $FRONTEND_RESPONSE)"
fi

# 8. Mostrar información de acceso
echo ""
print_step "9. Información de acceso:"
echo "   🌐 Frontend: http://localhost:3000"
echo "   🔧 Backend API: http://localhost:8080"
echo "   ❤️  Health Check: http://localhost:8080/api/health"
echo "   🎵 Songs API: http://localhost:8080/api/songs"

# 9. Mostrar comandos útiles
echo ""
print_step "10. Comandos útiles:"
echo "   Ver logs:           docker-compose logs -f"
echo "   Detener servicios:  docker-compose down"
echo "   Reiniciar:          docker-compose restart"
echo "   Ver contenedores:   docker-compose ps"

echo ""
echo "🎉 === VALIDACIÓN COMPLETADA ==="
echo ""
print_warning "Para detener todos los servicios ejecuta: docker-compose down"
