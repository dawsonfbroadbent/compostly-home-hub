@echo off
setlocal

set DB_NAME=compostly
set DB_USER=postgres
set DB_PASSWORD=postgres
set DB_PORT=15432
set CONTAINER_NAME=compostly-db

echo Starting PostgreSQL container...

docker run -d ^
  --name %CONTAINER_NAME% ^
  -e POSTGRES_USER=%DB_USER% ^
  -e POSTGRES_PASSWORD=%DB_PASSWORD% ^
  -e POSTGRES_DB=%DB_NAME% ^
  -p %DB_PORT%:15432 ^
  postgres:17

echo Waiting for PostgreSQL to be ready...
:wait_loop
docker exec %CONTAINER_NAME% pg_isready -U %DB_USER% -d %DB_NAME% >nul 2>&1
if errorlevel 1 (
  timeout /t 1 /nobreak >nul
  goto wait_loop
)

echo PostgreSQL is ready!

set SCRIPT_DIR=%~dp0
set DB_DIR=%SCRIPT_DIR%..\db

echo Running migrations...

docker exec -i %CONTAINER_NAME% psql -U %DB_USER% -d %DB_NAME% < "%DB_DIR%\schema.sql"
docker exec -i %CONTAINER_NAME% psql -U %DB_USER% -d %DB_NAME% < "%DB_DIR%\seed.sql"

echo Database setup complete!
echo Connection: postgres://%DB_USER%:%DB_PASSWORD%@localhost:%DB_PORT%/%DB_NAME%
