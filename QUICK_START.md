# QuizzBun Deployment Quick Start

## 🚀 Ready to Deploy!

All code changes have been implemented. Your application is now ready for deployment with Bun runtime optimization.

## 📋 Pre-Deployment Checklist

### ✅ Completed Tasks
- [x] Backend production scripts (Bun runtime)
- [x] Frontend environment variables
- [x] CORS configuration for production
- [x] Root monorepo configuration (Bun workspaces)
- [x] Deployment configuration files (Vercel + Railway)
- [x] Database connection updates
- [x] TypeScript compilation fixes
- [x] Local build testing successful
- [x] Database schema script created

### 🔄 Next Steps (Manual Deployment)

#### 1. Push to GitHub
```bash
git add .
git commit -m "feat: add Bun runtime deployment configuration"
git push origin main
```

#### 2. Deploy Backend (Railway)
1. Go to [railway.app](https://railway.app)
2. Sign up/login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your QuizzBun repository
5. Set root directory: `backend`
6. Railway will auto-detect Express and provision PostgreSQL
7. Set environment variables:
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=postgresql://postgres:[password]@host:port/dbname
   BUN_RUNTIME=production
   ```
8. Click "Deploy" → Wait for deployment
9. Copy your Railway URL (e.g., `quizzbun-api.railway.app`)

#### 3. Set Up Database
1. In Railway dashboard, go to your PostgreSQL service
2. Click "Query" tab
3. Copy-paste contents of `database-schema.sql`
4. Execute to create the `score` table

#### 4. Deploy Frontend (Vercel)
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click "New Project" → "Import Git Repository"
4. Select your QuizzBun repository
5. Vercel will auto-detect it's a monorepo
6. Set build settings:
   - Root Directory: `frontend`
   - Build Command: `bun run build`
   - Output Directory: `dist`
7. Set environment variables:
   ```
   VITE_API_URL=https://quizzbun-api.railway.app
   VITE_DATA_URL=https://quizzbun.vercel.app
   ```
8. Click "Deploy" → Wait for deployment

#### 5. Final Integration
1. Test both deployments:
   - Backend: `https://quizzbun-api.railway.app/getScore`
   - Frontend: `https://quizzbun.vercel.app`
2. Test quiz functionality end-to-end
3. Verify score saving and retrieval

## 🎯 Expected URLs

- **Frontend**: `https://quizzbun.vercel.app`
- **Backend API**: `https://quizzbun-api.railway.app`
- **API Endpoints**:
  - GET `/getScore` - Retrieve all scores
  - POST `/addScore` - Save new score

## 🔧 Local Development Commands

```bash
# Install all dependencies
bun run install:all

# Start both frontend and backend
bun run dev

# Build for production
bun run build

# Start backend only
bun run start:backend

# Start frontend only
bun run dev:frontend
```

## 📊 Performance Benefits

With Bun runtime, you get:
- 🚀 3x faster cold starts
- 📦 50% smaller memory footprint
- ⚡ Instant hot reload in development
- 🔧 Native TypeScript support

## 🆘 Troubleshooting

### Common Issues
1. **CORS errors**: Verify Vercel URL is in Railway CORS origins
2. **Database connection**: Check DATABASE_URL in Railway env vars
3. **Build failures**: Ensure all dependencies installed with `bun run install:all`

### Debug Commands
```bash
# Test backend locally
cd backend && bun run build && bun start

# Test frontend build
cd frontend && bun run build && bun run preview

# Check environment variables
echo $VITE_API_URL
```

## 🎉 Success Metrics

Your deployment is successful when:
- ✅ Frontend loads at Vercel URL
- ✅ Backend API responds at Railway URL
- ✅ Quiz questions load correctly
- ✅ Score submission works
- ✅ Score retrieval displays properly
- ✅ No CORS errors in browser console

---

**Ready to deploy! 🚀**