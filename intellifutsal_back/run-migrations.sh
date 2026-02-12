#!/bin/sh

set -e

# Determine which database configuration to use based on environment
if [ "$NODE_ENV" = "production" ]; then
  DB_HOST=$DB_PROD_HOST
  DB_PORT=$DB_PROD_PORT
  DB_USERNAME=$DB_PROD_USERNAME
  DB_PASSWORD=$DB_PROD_PASSWORD
  DB_NAME=$DB_PROD_NAME
else
  DB_HOST=$DB_DEV_HOST
  DB_PORT=$DB_DEV_PORT
  DB_USERNAME=$DB_DEV_USERNAME
  DB_PASSWORD=$DB_DEV_PASSWORD
  DB_NAME=$DB_DEV_NAME
fi

echo "Environment: $NODE_ENV"
echo "Database host: $DB_HOST"
echo "Database port: $DB_PORT"
echo "Database name: $DB_NAME"

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to start at $DB_HOST:$DB_PORT..."

timeout=60
counter=0
until PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USERNAME -d $DB_NAME -c '\q' 2>/dev/null; do
  counter=$((counter+1))
  if [ $counter -gt $timeout ]; then
    echo "Error: Timed out waiting for PostgreSQL to start"
    exit 1
  fi
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

echo "PostgreSQL is ready"

# Run migrations if enabled
if [ "$RUN_MIGRATIONS" = "true" ]; then
  echo "Running database migrations..."
  npm run migration:run
  echo "Migrations completed successfully"
fi

# Execute the CMD from the Dockerfile
echo "Starting application..."
exec "$@"