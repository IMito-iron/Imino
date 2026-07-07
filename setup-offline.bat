@echo off
setlocal

cd /d "%~dp0"

set RUNTIME_CACHE=%CD%\.offline-cache-runtime
set NPM_CACHE=%RUNTIME_CACHE%\npm-cache
set ELECTRON_CACHE=%RUNTIME_CACHE%\electron-cache
set ELECTRON_BUILDER_CACHE=%RUNTIME_CACHE%\electron-builder-cache

echo.
echo [1/5] Restoring offline caches...
if not exist "%NPM_CACHE%" mkdir "%NPM_CACHE%"
if not exist "%ELECTRON_CACHE%" mkdir "%ELECTRON_CACHE%"
if not exist "%ELECTRON_BUILDER_CACHE%" mkdir "%ELECTRON_BUILDER_CACHE%"
if not exist "offline-cache\python-wheels" mkdir "offline-cache\python-wheels"

if exist "offline-cache\npm-cache.zip" powershell -NoProfile -ExecutionPolicy Bypass -Command "Expand-Archive -Force 'offline-cache\npm-cache.zip' '%NPM_CACHE%'"
if exist "offline-cache\electron-cache.zip" powershell -NoProfile -ExecutionPolicy Bypass -Command "Expand-Archive -Force 'offline-cache\electron-cache.zip' '%ELECTRON_CACHE%'"
if exist "offline-cache\electron-builder-cache.zip" powershell -NoProfile -ExecutionPolicy Bypass -Command "Expand-Archive -Force 'offline-cache\electron-builder-cache.zip' '%ELECTRON_BUILDER_CACHE%'"
if exist "offline-cache\python-wheels.zip" powershell -NoProfile -ExecutionPolicy Bypass -Command "Expand-Archive -Force 'offline-cache\python-wheels.zip' 'offline-cache\python-wheels'"

set npm_config_cache=%NPM_CACHE%
set ELECTRON_CACHE=%ELECTRON_CACHE%
set ELECTRON_BUILDER_CACHE=%ELECTRON_BUILDER_CACHE%

echo.
echo [2/5] Installing Node dependencies from offline npm cache...
call npm ci --offline --cache "%NPM_CACHE%"
if errorlevel 1 goto :error

echo.
echo [3/5] Creating Python virtual environment...
if not exist "backend\.venv\Scripts\python.exe" (
  python -m venv backend\.venv
  if errorlevel 1 goto :error
)

echo.
echo [4/5] Installing Python dependencies from wheelhouse...
call backend\.venv\Scripts\python -m pip install --no-index --find-links offline-cache\python-wheels -r backend\requirements.txt -r backend\requirements-build.txt
if errorlevel 1 goto :error

echo.
echo [5/5] Building offline release package...
call npm run dist
if errorlevel 1 goto :error

echo.
echo Offline setup and build completed.
echo Output directory: release
pause
exit /b 0

:error
echo.
echo Offline setup failed. Please check the error above.
pause
exit /b 1
