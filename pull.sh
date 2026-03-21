#!/bin/bash

echo "Pull depuis le repo GitHub"
git pull



echo "redemarrage du conteneur frontentd"
docker compose up -d --build

echo "installation des dépendances frontend"
docker exec -it biblegraph_frontend pnpm install