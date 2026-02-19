#!/bin/bash

set -e

DB_NAME="compostly"
DB_USER="postgres"
DB_PASSWORD="postgres"
DB_PORT="15432"
CONTAINER_NAME="compostly-db"

echo "Starting PostgreSQL 17 container..."

docker run -d \
  --name "$CONTAINER_NAME" \
  -e POSTGRES_USER="$DB_USER" \
  -e POSTGRES_PASSWORD="$DB_PASSWORD" \
  -e POSTGRES_DB="$DB_NAME" \
  -p "$DB_PORT":15432 \
  postgres:17

echo "Waiting for PostgreSQL to be ready..."
until docker exec "$CONTAINER_NAME" pg_isready -U "$DB_USER" -d "$DB_NAME" > /dev/null 2>&1; do
  sleep 1
done

echo "PostgreSQL is ready!"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DB_DIR="$(dirname "$SCRIPT_DIR")/db"

echo "Running migrations..."

docker exec -i "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" < "$DB_DIR/schema.sql"
docker exec -i "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" < "$DB_DIR/seed.sql"

echo "Database setup complete!"
echo "Connection: postgres://$DB_USER:$DB_PASSWORD@localhost:$DB_PORT/$DB_NAME"
