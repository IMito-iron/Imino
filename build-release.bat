@echo off
setlocal

cd /d "%~dp0"

echo.
echo [1/5] Checking Node dependencies...
if not exist "node_modules" (
  call npm install
  if errorlevel 1 goto :error
) else (
  echo node_modules already exists.
)

echo.
echo [2/5] Checking Python virtual environment...
if not exist "backend\.venv\Scripts\python.exe" (
  python -m venv backend\.venv
  if errorlevel 1 goto :error
) else (
  echo backend\.venv already exists.
)

echo.
echo [3/5] Installing Python backend dependencies...
call backend\.venv\Scripts\python -m pip install -r backend\requirements.txt -r backend\requirements-build.txt
if errorlevel 1 goto :error

echo.
echo.
echo [4/4] Building backend.exe and Electron Windows installer...
call npm run dist
if errorlevel 1 goto :error

echo.
echo Build completed.
echo Output directory: release
pause
exit /b 0

:error
echo.
echo Build failed. Please check the error above.
pause
exit /b 1
