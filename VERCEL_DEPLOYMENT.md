# Vercel Deployment Guide

## Prerequisites
- Vercel account (free at vercel.com)
- GitHub account with the repository connected
- MongoDB Atlas database (already configured in .env)

## Files Created for Vercel Deployment

### 1. `backend/vercel.json`
Configuration file for Vercel deployment that specifies:
- Build settings using @vercel/node
- Route configuration to handle all requests
- Environment variable references

### 2. `backend/api/index.js`
Serverless function entry point that:
- Exports Express app for Vercel
- Includes all middleware and routes
- Connects to MongoDB
- Handles errors

### 3. Updated `backend/package.json`
- Changed main entry point to `api/index.js`
- Updated start script for Vercel compatibility

## Deployment Steps

### Step 1: Install Vercel CLI (Optional)
```bash
npm i -g vercel
```

### Step 2: Set Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Create a new project or select existing
3. Go to Settings → Environment Variables
4. Add the following variables:

| Name | Value |
|------|-------|
| `MONGODB_URI` | Your MongoDB connection string |
| `JWT_SECRET` | Your JWT secret key |
| `JWT_EXPIRE` | `7d` |
| `PORT` | `5000` |

**Important:** Use the same values from your local `.env` file.

### Step 3: Deploy via Vercel Dashboard

1. Go to [Vercel](https://vercel.com/new)
2. Import your GitHub repository: `Janganpalli-Vishal/clothing-ecc`
3. Configure project:
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)
4. Add environment variables (see Step 2)
5. Click "Deploy"

### Step 4: Alternative - Deploy via CLI

```bash
# Navigate to backend directory
cd backend

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

### Step 5: Verify Deployment

1. Check the deployment URL provided by Vercel
2. Test API endpoints:
   - `https://your-app.vercel.app/api/auth/register`
   - `https://your-app.vercel.app/api/products`

## Important Notes

### MongoDB Connection
- Ensure your MongoDB Atlas allows access from anywhere (0.0.0.0/0)
- The connection string in Vercel environment variables must match your local setup

### Environment Variables
- Never commit `.env` file to git (already in .gitignore)
- Always set environment variables in Vercel dashboard
- JWT_SECRET should be a strong, random string in production

### Troubleshooting

**Issue: MongoDB Connection Timeout**
- Check MongoDB Atlas whitelist settings
- Verify MONGODB_URI environment variable in Vercel

**Issue: 500 Errors**
- Check Vercel deployment logs
- Verify all environment variables are set
- Ensure API routes are properly exported

**Issue: Build Failures**
- Verify package.json dependencies
- Check that api/index.js exists and exports the app

## Post-Deployment

1. **Update Frontend API URL**: Change frontend API calls to use the new Vercel URL
2. **Monitor Logs**: Use Vercel dashboard to monitor function logs
3. **Set Up Custom Domain** (optional): Configure custom domain in Vercel settings

## Local Development

To continue local development:
```bash
cd backend
npm run dev
```

The local setup remains unchanged and will use the local `.env` file.
