#!/bin/bash

echo "🚀 Preparing for Render deployment..."

# Build frontend with production API URL
echo "📦 Building frontend..."
cd frontend
npm install
REACT_APP_API_URL=https://store-website-backend.onrender.com npm run build
cd ..

# Build backend
echo "🔧 Building backend..."
cd backend
npm install
cd ..

echo "✅ Build complete!"
echo ""
echo "📋 Next steps:"
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Prepare for Render deployment'"
echo "   git push origin main"
echo ""
echo "2. Go to https://render.com and:"
echo "   - Connect your GitHub repository"
echo "   - Deploy the backend service first"
echo "   - Then deploy the frontend service"
echo ""
echo "3. Your website will be available at:"
echo "   Frontend: https://store-website-frontend.onrender.com"
echo "   Backend: https://store-website-backend.onrender.com" 