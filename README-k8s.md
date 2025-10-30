# Kubernetes Deployment

# Ejecutar aplicación

```bash
# Construir imágenes Docker
docker-compose build

# Crear namespace y configurar como default
kubectl apply -f k8s/namespace.yaml
kubectl config set-context --current --namespace=upc-devops

# Aplicar configuraciones
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

# Verificar deployment
kubectl get pods -l app=web-hello
kubectl get events
kubectl logs deployment/web-hello
kubectl describe deployment web-hello
kubectl describe service web-hello-svc

# Escalar a 5 réplicas
kubectl scale deployment web-hello --replicas=5

# Operaciones rollout
kubectl rollout restart deployment/web-hello
kubectl rollout history deployment/web-hello

# Port forward para acceso local
kubectl port-forward service/web-hello-svc 3000:80 8080:8080
```

# Acceso

- Frontend: http://localhost:3000
- Backend: http://localhost:8080
