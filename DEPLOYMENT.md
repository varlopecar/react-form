# 🚀 Deployment Guide

This guide will walk you through deploying your React Form application to production with a MySQL database.

## 📋 Prerequisites

- GitHub account
- Vercel account (free tier available)
- MySQL database provider (Aiven, PlanetScale, Railway, etc.)
- Domain name (optional)

## 🗄️ Step 1: Set Up Production MySQL Database

### Option A: Aiven (Recommended - Free Tier)

1. **Create Aiven Account**

   - Go to [Aiven.io](https://aiven.io/)
   - Sign up for a free account
   - Verify your email

2. **Create MySQL Service**

   - Click "Create New Service"
   - Select "MySQL"
   - Choose your region (closest to your users)
   - Select "Hobbyist" plan (free)
   - Click "Create Service"

3. **Get Connection Details**
   - Go to your MySQL service
   - Click "Overview" tab
   - Note down:
     - Host
     - Port
     - Database name
     - Username
     - Password

### Option B: PlanetScale

1. **Create Account**

   - Go to [PlanetScale.com](https://planetscale.com/)
   - Sign up with GitHub
   - Create a new organization

2. **Create Database**

   - Click "New Database"
   - Choose a name
   - Select region
   - Click "Create Database"

3. **Get Connection String**
   - Go to "Connect" tab
   - Copy the connection string

### Option C: Railway

1. **Create Account**

   - Go to [Railway.app](https://railway.app/)
   - Sign up with GitHub

2. **Create Project**

   - Click "New Project"
   - Select "Provision from Template"
   - Choose "MySQL"

3. **Get Connection Details**
   - Go to your MySQL service
   - Click "Connect" tab
   - Copy connection details

## 🔧 Step 2: Deploy Backend to Vercel

### 2.1 Install Vercel CLI

```bash
npm install -g vercel
```

### 2.2 Login to Vercel

```bash
vercel login
```

### 2.3 Deploy Backend

```bash
cd backend
vercel --prod
```

### 2.4 Configure Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to Settings → Environment Variables
4. Add the following variables:

```env
DATABASE_URL=mysql+pymysql://username:password@host:port/database
SECRET_KEY=your-super-secret-key-here-make-it-long-and-random
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=secure-admin-password-123
CORS_ORIGINS=https://your-frontend-domain.com,https://your-username.github.io
```

### 2.5 Initialize Production Database

1. **Set environment variables locally**:

   ```bash
   export DATABASE_URL="mysql+pymysql://username:password@host:port/database"
   export ADMIN_EMAIL="admin@yourdomain.com"
   export ADMIN_PASSWORD="secure-admin-password-123"
   ```

2. **Run initialization script**:
   ```bash
   cd scripts
   python init-production-db.py
   ```

## 🌐 Step 3: Deploy Frontend to GitHub Pages

### 3.1 Update Frontend Environment

Create `.env.production` in your root directory:

```env
VITE_API_URL=https://your-backend-url.vercel.app
```

### 3.2 Build and Deploy

```bash
# Install dependencies
pnpm install

# Build for production
pnpm run build

# Deploy to GitHub Pages
pnpm run deploy
```

### 3.3 Configure GitHub Pages

1. Go to your GitHub repository
2. Settings → Pages
3. Configure:
   - Source: Deploy from a branch
   - Branch: `gh-pages`
   - Folder: `/ (root)`
4. Click Save

## 🔐 Step 4: Set Up GitHub Secrets for CI/CD

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Add the following secrets:

```env
# Vercel deployment
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id

# Production database
DATABASE_URL=mysql+pymysql://username:password@host:port/database
SECRET_KEY=your-super-secret-key-here
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=secure-admin-password-123

# Frontend API URL
VITE_API_URL=https://your-backend-url.vercel.app
```

### How to Get Vercel Tokens

1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Give it a name (e.g., "GitHub Actions")
4. Copy the token

To get ORG_ID and PROJECT_ID:

```bash
vercel ls
```

## 🧪 Step 5: Test Your Deployment

### 5.1 Test Frontend

- Visit your GitHub Pages URL
- Try registering a new user
- Verify form validation works

### 5.2 Test Backend API

- Visit `https://your-backend-url.vercel.app/docs`
- Test the API endpoints

### 5.3 Test Admin Panel

- Login with admin credentials
- Verify you can see registered users
- Test user deletion

## 🔄 Step 6: Enable Automatic Deployments

Your GitHub Actions workflow will automatically:

1. **Run tests** on every push/PR
2. **Deploy backend** to Vercel on main branch
3. **Deploy frontend** to GitHub Pages on main branch
4. **Upload coverage** to Codecov

## 📊 Step 7: Monitor Your Application

### 7.1 Vercel Analytics

- Go to your Vercel project
- Check Analytics tab for performance metrics

### 7.2 Database Monitoring

- Monitor your MySQL database usage
- Set up alerts for high usage

### 7.3 GitHub Actions

- Check Actions tab for deployment status
- Monitor test results and coverage

## 🛠️ Troubleshooting

### Common Issues

1. **Database Connection Failed**

   - Check DATABASE_URL format
   - Verify database credentials
   - Ensure database is accessible from Vercel

2. **CORS Errors**

   - Update CORS_ORIGINS in Vercel environment variables
   - Include your frontend domain

3. **Build Failures**

   - Check GitHub Actions logs
   - Verify all dependencies are installed
   - Check for TypeScript errors

4. **Admin Login Not Working**
   - Run the database initialization script
   - Verify admin credentials in environment variables

### Useful Commands

```bash
# Check Vercel deployment status
vercel ls

# View Vercel logs
vercel logs

# Redeploy backend
cd backend && vercel --prod

# Redeploy frontend
pnpm run build && pnpm run deploy

# Test database connection
python scripts/init-production-db.py
```

## 🎉 Success!

Your application is now deployed and should be accessible at:

- **Frontend**: `https://your-username.github.io/your-repo-name`
- **Backend API**: `https://your-backend-url.vercel.app`
- **API Docs**: `https://your-backend-url.vercel.app/docs`

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review GitHub Actions logs
3. Check Vercel deployment logs
4. Verify environment variables are set correctly
