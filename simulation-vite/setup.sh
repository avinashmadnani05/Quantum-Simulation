#!/bin/bash

# Quantum Simulation Lab Setup Script
echo "🚀 Setting up Quantum Black Hole Simulation Lab..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "🔧 Creating environment file..."
    cat > .env << EOF
# API Configuration
VITE_API_URL=http://localhost:8000

# Development
VITE_DEV_MODE=true

# Analytics (optional)
VITE_ANALYTICS_ID=

# Feature flags
VITE_ENABLE_3D=true
VITE_ENABLE_ANIMATIONS=true
EOF
    echo "✅ Environment file created"
fi

# Check if backend is running
echo "🔍 Checking backend connection..."
if curl -s http://localhost:8000/ > /dev/null; then
    echo "✅ Backend is running on http://localhost:8000"
else
    echo "⚠️  Backend not detected. Make sure to start your FastAPI server:"
    echo "   cd .. && python main.py"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the development server:"
echo "  npm run dev"
echo ""
echo "To build for production:"
echo "  npm run build"
echo ""
echo "The app will be available at: http://localhost:3000"
echo ""
echo "Make sure your FastAPI backend is running on: http://localhost:8000"
