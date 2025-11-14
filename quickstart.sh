#!/bin/bash

echo "🚀 Velosta CRM Vendor App - Quick Start"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "✅ Dependencies installed successfully!"
echo ""

# Check if expo-cli is installed globally
if ! command -v expo &> /dev/null
then
    echo "📱 Expo CLI not found. Installing globally..."
    npm install -g expo-cli
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Run 'npm start' to start the development server"
echo "2. Install Expo Go app on your phone"
echo "3. Scan the QR code to run the app"
echo ""
echo "Or run:"
echo "  - 'npm run android' for Android emulator"
echo "  - 'npm run ios' for iOS simulator"
echo ""
echo "📖 Check SETUP.md for detailed instructions"
echo ""
