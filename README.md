# Pixel Grid Application

This is a simple pixel grid application with a React frontend and Express backend.

## Project Structure

- `src/` - React frontend code (built with Vite)
- `api/` - Express backend code with SQLite database

## Step-by-Step Deployment Guide for Render + Vercel

This guide will walk you through deploying your application with Vercel (frontend) and Render (backend).

### Prerequisites

1. GitHub account
2. Vercel account (sign up at https://vercel.com)
3. Render account (sign up at https://render.com)
4. Your project code pushed to a GitHub repository

### Part 1: Deploying the Backend to Render

#### Step 1: Prepare Your Repository

1. Ensure your project has the following structure:
   - `api/package.json` - Contains backend dependencies and scripts
   - `api/app.js` - Main Express server file
   - `api/.env` - Environment variables for the backend

2. Make sure your `api/package.json` includes:
   ```json
   {
     "name": "pxgrid-api",
     "version": "1.0.0",
     "type": "module",
     "main": "app.js",
     "scripts": {
       "start": "node app.js",
       "dev": "node app.js"
     },
     "dependencies": {
       "better-sqlite3": "^11.10.0",
       "cors": "^2.8.5",
       "express": "^5.1.0",
       "dotenv": "^16.3.1"
     }
   }
   ```

3. Ensure your `api/app.js` has CORS configured:
   ```javascript
   app.use(cors({
     origin: process.env.FRONTEND_URL || 'http://localhost:5173',
     methods: ['GET', 'POST'],
     credentials: true
   }));
   ```

4. Push these changes to your GitHub repository.

#### Step 2: Create a New Web Service on Render

1. Log in to your Render account
2. Click on the "New +" button and select "Web Service"
3. Connect your GitHub repository
4. Configure your web service:
   - **Name**: Choose a name for your backend service (e.g., "pxgrid-api")
   - **Region**: Choose a region close to your users
   - **Branch**: Select your main branch (usually "main" or "master")
   - **Root Directory**: Leave blank (we'll specify commands to navigate to the api directory)
   - **Runtime**: Node
   - **Build Command**: `cd api && npm install`
   - **Start Command**: `cd api && npm start`
   - **Plan**: Select the Free plan (or another plan if needed)

5. Click "Advanced" and add the following environment variables:
   - `PORT`: `3000`
   - `FRONTEND_URL`: `http://localhost:5173` (we'll update this after deploying the frontend)

6. Click "Create Web Service"

7. Wait for the deployment to complete. This may take a few minutes.

8. Once deployed, note the URL of your backend service (e.g., `https://pxgrid-api.onrender.com`). You'll need this for the frontend deployment.

#### Step 3: Database Considerations for Render

Since SQLite is a file-based database, there are some considerations for deployment:

1. **Persistent Storage**: Render's free tier doesn't provide persistent disk storage between deployments. For a production application, consider:
   - Upgrading to a paid Render plan that includes persistent disk
   - Migrating to a cloud database like PostgreSQL (Render offers a PostgreSQL service)

2. If you decide to use Render's PostgreSQL service:
   - Create a new PostgreSQL database in your Render dashboard
   - Update your backend code to use PostgreSQL instead of SQLite
   - Add the database connection string as an environment variable

### Part 2: Deploying the Frontend to Vercel

#### Step 1: Prepare Your Frontend

1. Ensure your project has the following files:
   - `.env.production` with `VITE_API_URL=https://your-backend-url.com` (you'll update this with your actual Render URL)
   - `vite.config.js` properly configured

2. Update your `.env.production` file with your Render backend URL:
   ```
   VITE_API_URL=https://pxgrid-api.onrender.com
   ```
   (Replace with your actual Render backend URL)

3. Push these changes to your GitHub repository.

#### Step 2: Deploy to Vercel

1. Log in to your Vercel account
2. Click "Add New..." and select "Project"
3. Import your GitHub repository
4. Configure your project:
   - **Framework Preset**: Vite
   - **Root Directory**: Leave as default (project root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Under "Environment Variables", add:
   - `VITE_API_URL`: Your Render backend URL (e.g., `https://pxgrid-api.onrender.com`)

6. Click "Deploy"

7. Wait for the deployment to complete. This should take a minute or two.

8. Once deployed, Vercel will provide you with a URL for your frontend (e.g., `https://pxgrid.vercel.app`).

### Part 3: Connecting Frontend and Backend

#### Step 1: Update Environment Variables

1. Go to your Render dashboard and update the environment variable for your backend:
   - `FRONTEND_URL`: Update with your Vercel frontend URL (e.g., `https://pxgrid.vercel.app`)

2. Save the changes and wait for the backend to redeploy.

#### Step 2: Test the Connection

1. Open your Vercel frontend URL in a browser
2. The application should connect to your Render backend
3. Test the functionality to ensure everything works as expected

### Troubleshooting

#### Common Frontend Issues

1. **API Connection Errors**:
   - Check that `VITE_API_URL` is set correctly in Vercel environment variables
   - Ensure the backend URL doesn't have a trailing slash
   - Check browser console for CORS errors

2. **Build Failures**:
   - Check Vercel build logs for errors
   - Ensure all dependencies are correctly listed in package.json
   - Verify that the build command and output directory are correct

#### Common Backend Issues

1. **CORS Errors**:
   - Ensure the CORS configuration in app.js includes your frontend URL
   - Check that `FRONTEND_URL` environment variable is set correctly in Render

2. **Database Issues**:
   - For SQLite: Check if your database is being reset between deployments (expected behavior on free tier)
   - For PostgreSQL: Verify connection string and credentials

3. **Deployment Failures**:
   - Check Render logs for errors
   - Ensure all dependencies are correctly listed in api/package.json
   - Verify that the build and start commands are correct

## Local Development

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   cd api && npm install
   ```
3. Start the backend:
   ```
   cd api && npm run dev
   ```
4. Start the frontend:
   ```
   npm run dev
   ```
5. Open http://localhost:5173 in your browser
