#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting deployment process..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please create one from .env.example"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
cd backend && npm install
cd ../user-frontend && npm install
cd ../admin-frontend && npm install
cd ..

# Build frontend applications
echo "🏗️ Building frontend applications..."
cd user-frontend && npm run build
cd ../admin-frontend && npm run build
cd ..

# Generate sitemap
echo "🗺️ Generating sitemap..."
cd backend && node scripts/generate-sitemap.js
cd ..

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment completed successfully!" 