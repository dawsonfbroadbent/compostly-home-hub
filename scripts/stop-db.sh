#!/bin/bash

CONTAINER_NAME="compostly-db"

echo "Stopping and removing PostgreSQL container..."

docker stop "$CONTAINER_NAME" 2>/dev/null || true
docker rm "$CONTAINER_NAME" 2>/dev/null || true

echo "Container removed."
