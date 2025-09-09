# Script de validación para PlaylistsNow MVP - Windows PowerShell
# Ejecutar desde la carpeta raíz del proyecto: .\validate.ps1

Write-Host "🎵 === VALIDACIÓN PlaylistsNow MVP ===" -ForegroundColor Cyan
Write-Host ""

# Función para imprimir con colores
function Print-Step($message) {
    Write-Host "[PASO] $message" -ForegroundColor Blue
}

function Print-Success($message) {
    Write-Host "[✓] $message" -ForegroundColor Green
}

function Print-Error($message) {
    Write-Host "[✗] $message" -ForegroundColor Red
}

function Print-Warning($message) {
    Write-Host "[!] $message" -ForegroundColor Yellow
}

# 1. Verificar Docker y Docker Compose
Print-Step "1. Verificando requisitos previos..."

try {
    $dockerVersion = docker --version
    Print-Success "Docker encontrado: $dockerVersion"
} catch {
    Print-Error "Docker no está instalado o no está en el PATH"
    exit 1
}

try {
    $composeVersion = docker-compose --version
    Print-Success "Docker Compose encontrado: $composeVersion"
} catch {
    Print-Error "Docker Compose no está instalado o no está en el PATH"
    exit 1
}

# 2. Verificar estructura de archivos
Print-Step "2. Verificando estructura del proyecto..."

$requiredFiles = @(
    "docker-compose.yml",
    "backend\Dockerfile",
    "backend\package.json",
    "backend\src\index.js",
    "frontend\Dockerfile",
    "frontend\package.json",
    "frontend\src\App.js",
    "README.md"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Print-Success "Archivo encontrado: $file"
    } else {
        Print-Error "Archivo faltante: $file"
        exit 1
    }
}

# 3. Levantar servicios
Print-Step "3. Levantando servicios con Docker Compose..."
docker-compose up -d

# Esperar a que los servicios estén listos
Print-Step "4. Esperando a que los servicios estén listos..."
Start-Sleep -Seconds 15

# 4. Verificar contenedores
Print-Step "5. Verificando estado de contenedores..."

try {
    $backendStatus = docker inspect --format='{{.State.Status}}' playlistsnow-backend 2>$null
    if ($backendStatus -eq "running") {
        Print-Success "Backend container está corriendo"
    } else {
        Print-Error "Backend container no está corriendo (Estado: $backendStatus)"
    }
} catch {
    Print-Error "No se pudo verificar el estado del backend container"
}

try {
    $frontendStatus = docker inspect --format='{{.State.Status}}' playlistsnow-frontend 2>$null
    if ($frontendStatus -eq "running") {
        Print-Success "Frontend container está corriendo"
    } else {
        Print-Error "Frontend container no está corriendo (Estado: $frontendStatus)"
    }
} catch {
    Print-Error "No se pudo verificar el estado del frontend container"
}

# 5. Verificar red
Print-Step "6. Verificando red personalizada..."
$networks = docker network ls
if ($networks -match "playlistsnow-network") {
    Print-Success "Red playlistsnow-network encontrada"
} else {
    Print-Error "Red playlistsnow-network NO encontrada"
}

# 6. Probar API Backend
Print-Step "7. Probando API Backend..."

# Health Check
try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/health" -Method GET -TimeoutSec 10
    Print-Success "Health check OK"
    Write-Host "   Respuesta: $($healthResponse | ConvertTo-Json -Compress)" -ForegroundColor Gray
} catch {
    Print-Error "Health check FALLÓ: $($_.Exception.Message)"
}

# Test GET /api/songs
try {
    $songsResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/songs" -Method GET -TimeoutSec 10
    Print-Success "GET /api/songs OK"
    Write-Host "   Canciones encontradas: $($songsResponse.Count)" -ForegroundColor Gray
} catch {
    Print-Error "GET /api/songs FALLÓ: $($_.Exception.Message)"
}

# Test POST /api/songs
try {
    $postBody = @{
        title = "Canción de Prueba"
        artist = "Artista de Prueba"
    } | ConvertTo-Json

    $postResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/songs" -Method POST -Body $postBody -ContentType "application/json" -TimeoutSec 10
    Print-Success "POST /api/songs OK"
    Write-Host "   Nueva canción creada: $($postResponse.title) - $($postResponse.artist)" -ForegroundColor Gray
} catch {
    Print-Error "POST /api/songs FALLÓ: $($_.Exception.Message)"
}

# 7. Verificar Frontend
Print-Step "8. Verificando Frontend..."
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 10
    if ($frontendResponse.StatusCode -eq 200) {
        Print-Success "Frontend accesible (HTTP 200)"
    } else {
        Print-Error "Frontend NO accesible (HTTP $($frontendResponse.StatusCode))"
    }
} catch {
    Print-Error "Frontend NO accesible: $($_.Exception.Message)"
}

# 8. Mostrar información de acceso
Write-Host ""
Print-Step "9. Información de acceso:"
Write-Host "   🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "   🔧 Backend API: http://localhost:8080" -ForegroundColor Cyan
Write-Host "   ❤️  Health Check: http://localhost:8080/api/health" -ForegroundColor Cyan
Write-Host "   🎵 Songs API: http://localhost:8080/api/songs" -ForegroundColor Cyan

# 9. Mostrar comandos útiles
Write-Host ""
Print-Step "10. Comandos útiles:"
Write-Host "   Ver logs:           docker-compose logs -f" -ForegroundColor Gray
Write-Host "   Detener servicios:  docker-compose down" -ForegroundColor Gray
Write-Host "   Reiniciar:          docker-compose restart" -ForegroundColor Gray
Write-Host "   Ver contenedores:   docker-compose ps" -ForegroundColor Gray

Write-Host ""
Write-Host "🎉 === VALIDACIÓN COMPLETADA ===" -ForegroundColor Cyan
Write-Host ""
Print-Warning "Para detener todos los servicios ejecuta: docker-compose down"
