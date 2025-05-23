#!/bin/bash

# Signals Testing Playground - Cloudflare Pages Deployment Script

echo "🚀 Deploying Signals Testing Playground to Cloudflare Pages..."

# Build the project
echo "📦 Building project..."
npm run build

# Check if wrangler is installed
if command -v wrangler &> /dev/null; then
    echo "🔧 Deploying with Wrangler CLI..."
    wrangler pages deploy dist --project-name=signal-playground
else
    echo "❌ Wrangler CLI not found."
    echo ""
    echo "Please install Wrangler globally:"
    echo "  npm install -g wrangler"
    echo ""
    echo "Or deploy manually:"
    echo "1. Go to https://pages.cloudflare.com"
    echo "2. Create new project"
    echo "3. Upload the 'dist' folder"
    echo ""
    echo "Your built files are ready in: $(pwd)/dist"
fi

echo "✅ Deployment process complete!" 