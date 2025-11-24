eval $(minikube docker-env)

docker build -t playlistsnow-backend:latest ../../backend

docker build -t playlistsnow-frontend:latest ../../frontend
