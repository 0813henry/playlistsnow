kubectl create secret generic db-credentials \
  --from-literal=db_user=playlistsnow \
  --from-literal=db_password=playlistsnow \
  --namespace=default
