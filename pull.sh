#!/bin/bash

echo "Pull depuis le repo GitHub"
git pull

echo "Arret du conteneur frontentd"
docker compose down -v

echo "redemarrage du conteneur frontentd"
docker compose up -d --build