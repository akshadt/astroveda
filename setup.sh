#!/bin/bash

# AstroVeda Setup Script for macOS

echo "🪐 Starting AstroVeda Environment Setup..."

# 1. Check for Homebrew (macOS package manager)
echo "🔍 Checking for Homebrew..."
if ! command -v brew &> /dev/null; then
    echo "📦 Homebrew not found. Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Ensure brew is in PATH for Apple Silicon/Intel Macs temporarily so script can continue
    eval "$(/opt/homebrew/bin/brew shellenv 2>/dev/null || /usr/local/bin/brew shellenv 2>/dev/null)"
else
    echo "✅ Homebrew is already installed."
fi

# 2. Check for Node.js and npm
echo "🔍 Checking for Node.js and npm..."
if ! command -v npm &> /dev/null; then
    echo "📦 npm not found. Installing Node.js via Homebrew..."
    brew install node
else
    echo "✅ Node.js and npm are already installed. Version: $(node -v)"
fi

# 3. Install Project Dependencies
echo "📦 Installing project dependencies from package.json..."
npm install

echo "✨ Setup complete! You can now run the app using: npm run dev"
