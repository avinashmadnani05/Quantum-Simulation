@echo off
echo 🚀 Setting up Quantum Black Hole Simulation Lab...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version

echo 📦 Installing dependencies...
npm install

REM Create environment file if it doesn't exist
if not exist .env (
    echo 🔧 Creating environment file...
    (
        echo # API Configuration
        echo VITE_API_URL=http://localhost:8000
        echo.
        echo # Development
        echo VITE_DEV_MODE=true
        echo.
        echo # Analytics ^(optional^)
        echo VITE_ANALYTICS_ID=
        echo.
        echo # Feature flags
        echo VITE_ENABLE_3D=true
        echo VITE_ENABLE_ANIMATIONS=true
    ) > .env
    echo ✅ Environment file created
)

echo 🔍 Checking backend connection...
curl -s http://localhost:8000/ >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend is running on http://localhost:8000
) else (
    echo ⚠️  Backend not detected. Make sure to start your FastAPI server:
    echo    cd .. ^&^& python main.py
)

echo.
echo 🎉 Setup complete!
echo.
echo To start the development server:
echo   npm run dev
echo.
echo To build for production:
echo   npm run build
echo.
echo The app will be available at: http://localhost:3000
echo.
echo Make sure your FastAPI backend is running on: http://localhost:8000
pause
