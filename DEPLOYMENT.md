# 🚀 Deploy to Render.com

This guide will help you deploy your store website to Render.com.

## Prerequisites

- GitHub repository with your code
- Render.com account (free)

## Step 1: Prepare Your Code

1. Make sure all your changes are committed to GitHub:
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

## Step 2: Deploy Backend (API)

1. Go to [Render.com](https://render.com) and sign up/login
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the backend service:
   - **Name**: `store-website-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && node databaseServer.js`
   - **Plan**: Free

5. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`

6. Click "Create Web Service"

## Step 3: Deploy Frontend

1. In Render dashboard, click "New +" and select "Static Site"
2. Connect the same GitHub repository
3. Configure the frontend service:
   - **Name**: `store-website-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`
   - **Plan**: Free

4. Add Environment Variables:
   - `REACT_APP_API_URL`: `https://your-backend-name.onrender.com`
   (Replace with your actual backend URL from Step 2)

5. Click "Create Static Site"

## Step 4: Update Frontend API URL

After your backend is deployed, update the frontend environment variable:

1. Go to your frontend service in Render
2. Go to "Environment" tab
3. Update `REACT_APP_API_URL` to your backend URL
4. Redeploy the frontend

## Your Live Website

- **Frontend**: `https://store-website-frontend.onrender.com`
- **Backend API**: `https://store-website-backend.onrender.com`

## Troubleshooting

### Backend Issues
- Check Render logs for errors
- Ensure all dependencies are in `package.json`
- Verify the start command is correct

### Frontend Issues
- Make sure `REACT_APP_API_URL` points to your backend
- Check that the build completes successfully
- Verify the publish directory is correct

### Database Issues
- SQLite database will be created automatically
- Data persists between deployments
- For production, consider using a managed database service

## Environment Variables

### Backend
- `NODE_ENV`: `production`
- `PORT`: `10000` (Render will override this)

### Frontend
- `REACT_APP_API_URL`: Your backend URL

## Support

If you encounter issues:
1. Check Render service logs
2. Verify all environment variables are set
3. Ensure your code works locally first 