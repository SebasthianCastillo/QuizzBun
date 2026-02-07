# QuizzBun Deployment Plan: Vercel + Railway

## Overview

This document outlines the complete deployment strategy for the QuizzBun quiz application using:
- **Frontend**: Vercel (React + Vite + Bun)
- **Backend**: Railway (Express + PostgreSQL + Bun Runtime)
- **Database**: Railway PostgreSQL (free tier)
- **Repository**: Monorepo structure in single GitHub repo
- **Package Manager**: Bun (for all operations)

## Project Structure Analysis

```
C:\Projects\QuizzBun/
├── AGENTS.md                 # Development guidelines
├── backend/                  # Express.js API server
│   ├── .env                  # Environment variables
│   ├── package.json          # Dependencies
│   └── src/
│       ├── db/postgres.ts    # PostgreSQL connection
│       └── server.ts         # Express server (port 3000)
└── frontend/                 # React + Vite application
    ├── package.json          # Dependencies
    ├── public/data.json      # Static quiz data
    └── src/                  # React components and stores
```

### Current State
✅ **Ready**: Clean monorepo with modern tech stack  
✅ **Ready**: PostgreSQL connection configured  
✅ **Ready**: Frontend build scripts available  
✅ **Ready**: Bun package manager configured  
❌ **Missing**: Backend production build scripts (Bun-specific)  
❌ **Missing**: Deployment configuration files  
❌ **Missing**: Environment variable support for production  
❌ **Missing**: Bun runtime configuration for Railway  

---

## Phase 1: Backend Production Setup

### 1.1 Add Production Scripts

**File**: `backend/package.json`

```json
{
  "name": "backend",
  "module": "index.ts",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "bun --watch src/server.ts",
    "build": "bun build src/server.ts --outdir dist --target node",
    "start": "bun dist/server.js"
  },
  "dependencies": {
    "@types/cors": "^2.8.19",
    "@types/express": "^5.0.6",
    "@types/node": "^25.0.10",
    "@types/pg": "^8.16.0",
    "cors": "^2.8.6",
    "dotenv": "^17.2.3",
    "express": "^5.2.1",
    "pg": "^8.17.2"
  },
  "devDependencies": {
    "@types/bun": "latest",
    "typescript": "^5.9.3"
  }
}
```

### 1.2 Update CORS Configuration

**File**: `backend/src/server.ts`

```typescript
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { pool } from "./db/postgres.ts";
import cors from "cors";

const app = express();
app.use(express.json());

// Updated CORS configuration for production
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://quizzbun.vercel.app', 'https://quizzbun-api.railway.app']
    : '*',
  credentials: true
}));

// Production port handling
const PORT = process.env.PORT || 3000;

app.post("/addScore", async (req, res) => {
  try {
    const { name, score } = req.body;
    const query = "INSERT INTO score (name, score) VALUES ($1, $2)";
    const values = [name, score];
    await pool.query(query, values);
    res.status(200).json({ message: "score added" });
  } catch (error) {
    console.error("Error adding score:", error);
    res.status(500).json({ message: "Error adding score" });
  }
});

app.get("/getScore", async (req, res) => {
  try {
    const query = "SELECT * FROM score";
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching scores:", error);
    res.status(500).json({ message: "Error fetching scores" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 1.3 Add TypeScript Build Configuration

**File**: `backend/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## Phase 2: Frontend Environment Variables

### 2.1 Add Environment Variable Files

**File**: `frontend/.env.development`
```
VITE_API_URL=http://localhost:3000
VITE_DATA_URL=http://localhost:5173
```

**File**: `frontend/.env.production`
```
VITE_API_URL=https://quizzbun-api.railway.app
VITE_DATA_URL=https://quizzbun.vercel.app
```

### 2.2 Update Store for Environment Variables

**File**: `frontend/src/store/useQuestionsStore.ts`

```typescript
import { create } from "zustand";
import type { Questions } from ".././../types";

// Environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const DATA_URL = import.meta.env.VITE_DATA_URL || 'http://localhost:5173';

interface questionStore {
  questions: Questions[];
  currentQuestion: number;
  name: string;
  isGameComplete: boolean;
  setCurrentUser: (name: string) => void;
  clearName: () => void;
  fetchQuestions: () => Promise<void>;
  selectedAnswer: (id: string, index: number) => void;
  goNextQuestion: () => void;
  goPreviusQuestion: () => void;
  resetGame: () => void;
}

export const useQuestionStore = create<questionStore>((set, get) => {
  return {
    questions: [],
    currentQuestion: 0,
    name: "",
    isGameComplete: false,
    setCurrentUser: (name) => set({ name }),
    clearName: () => set({ name: "" }),
    fetchQuestions: async () => {
      try {
        const response = await fetch(`${DATA_URL}/data.json`);
        if (!response.ok) throw "error fetching data";
        const questions = await response.json();
        set({ questions });
      } catch (error) {
        console.log("error:" + error);
      }
    },
    selectedAnswer: (id: string, index: number) => {
      const { questions, currentQuestion } = get();
      const newQuestion = structuredClone(questions);
      const questionIndex = newQuestion.findIndex((q) => q.id == id);
      const questionInfo = newQuestion[questionIndex];
      const isCorrectAnswer = questionInfo.correctAnswer == questionIndex;
      newQuestion[questionIndex] = {
        ...questionInfo,
        isCorrectAnswer,
        userSelectedAnswer: index,
      };
      set({ questions: newQuestion });

      if (currentQuestion === questions.length - 1) {
        set({ isGameComplete: true });
      }
    },
    goNextQuestion: () => {
      const { questions, currentQuestion } = get();
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length)
        set({ currentQuestion: nextQuestion });
    },
    goPreviusQuestion: () => {
      const { currentQuestion } = get();
      const previusQuestion = currentQuestion - 1;
      if (previusQuestion >= 0) set({ currentQuestion: previusQuestion });
    },
    resetGame: () => {
      set({
        currentQuestion: 0,
        isGameComplete: false,
        questions: get().questions.map((q) => ({
          ...q,
          userSelectedAnswer: undefined,
          isCorrectAnswer: undefined,
        })),
      });
    },
  };
});
```

### 2.3 Update Game Component API Calls

**File**: `frontend/src/components/Game.tsx`

```typescript
// Update scoreUser function
const scoreUser = async (scoreUser: { name: string, score: string }) => {
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const response = await fetch(`${API_URL}/addScore`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(scoreUser),
    });

    if (!response.ok) {
      throw new Error("Failed to create user");
    }

    return response.json();
  } catch (error) {
    console.error("Error saving score:", error);
  }
};
```

### 2.4 Update Score Component API Calls

**File**: `frontend/src/components/Score.tsx`

```typescript
const getUser = async () => {
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const res = await fetch(`${API_URL}/getScore`);

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to fetch scores");
    }

    const data = await res.json();
    setScores(data);
    console.log("Scores fetched:", data);
  } catch (error) {
    console.error("Error fetching scores:", error);
  } finally {
    setLoading(false);
  }
};
```

---

## Phase 3: Monorepo Root Configuration

### 3.1 Create Root Package.json

**File**: `package.json` (in project root)

```json
{
  "name": "quizzbun",
  "private": true,
  "workspaces": ["frontend", "backend"],
  "scripts": {
    "dev": "bun run dev:frontend & bun run dev:backend",
    "dev:frontend": "cd frontend && bun run dev",
    "dev:backend": "cd backend && bun run dev",
    "build": "bun run build:backend && bun run build:frontend",
    "build:backend": "cd backend && bun run build",
    "build:frontend": "cd frontend && bun run build",
    "start": "bun run start:backend",
    "start:backend": "cd backend && bun run start",
    "install:all": "bun install && cd frontend && bun install && cd ../backend && bun install"
  }
}
```

### 3.2 Create Root .gitignore

**File**: `.gitignore` (in project root)

```
# Dependencies
node_modules/
*/node_modules/

# Production builds
frontend/dist/
backend/dist/

# Environment variables
.env
.env.local
.env.production
frontend/.env.production
backend/.env.production

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
bun-debug.log*
bun-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
```

---

## Phase 4: Deployment Configuration

### 4.1 Vercel Configuration

**File**: `vercel.json` (in project root)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "frontend/dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://quizzbun-api.railway.app/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ],
  "env": {
    "VITE_API_URL": "@api_url"
  }
}
```

### 4.2 Railway Configuration

Railway will automatically detect the Express server, but we can add a configuration file:

**File**: `railway.json` (in project root)

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd backend && bun start",
    "healthcheckPath": "/getScore"
  }
}
```

---

## Phase 5: Environment Variables Setup

### 5.1 Railway Environment Variables

Set these in Railway dashboard under your project settings:

```
NODE_ENV=production
PORT=3000
DB_HOST=postgresql.railway.app
DB_PORT=5432
DB_NAME=railway
DB_USER=postgres
DB_PASSWORD=[auto-generated-by-railway]
DATABASE_URL=postgresql://postgres:[password]@host:port/dbname
BUN_RUNTIME=production
```

**Bun-Specific Variables:**
- `BUN_RUNTIME=production` - Optimizes Bun for production
- `NODE_ENV=production` - Standard Node.js compatibility
- Railway automatically configures Bun runtime when detected

### 5.2 Vercel Environment Variables

Set these in Vercel dashboard under your project settings:

```
VITE_API_URL=https://quizzbun-api.railway.app
VITE_DATA_URL=https://quizzbun.vercel.app
```

---

## Phase 6: Bun Runtime Configuration

### 6.1 Railway Bun Runtime Setup

Railway supports Bun runtime natively. Configure your Railway project to use Bun:

**Railway Settings:**
- **Runtime**: Bun (latest stable)
- **Build Command**: `cd backend && bun run build`
- **Start Command**: `cd backend && bun start`

**Benefits of Bun Runtime:**
- 🚀 **3x faster** startup time than Node.js
- 📦 **Smaller memory footprint** 
- ⚡ **Built-in TypeScript** support
- 🔧 **Native performance** optimizations

### 6.2 Bun Build Optimization

**Backend Build Process:**
```bash
# Bun's optimized build
bun build src/server.ts --outdir dist --target node

# Benefits:
# - Faster compilation (2-3x faster than tsc)
# - Smaller bundle sizes
# - Built-in minification
# - Tree shaking
```

**Frontend Integration:**
- Vite works seamlessly with Bun
- Use `bun run dev` for faster development
- Use `bun run build` for optimized production builds

### 6.3 Bun Development Workflow

**Hot Reload Development:**
```bash
# Backend with hot reload
cd backend && bun --watch src/server.ts

# Frontend development
cd frontend && bun run dev

# Concurrent development (from root)
bun run dev
```

**Dependency Management:**
```bash
# Install all workspace dependencies
bun run install:all

# Add dependency to specific workspace
cd frontend && bun add package-name
cd backend && bun add package-name

# Update all dependencies
bun update
```

---

## Phase 7: Database Setup

### 6.1 PostgreSQL Schema

Create this table in Railway PostgreSQL:

```sql
CREATE TABLE score (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    score VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Add index for better performance
CREATE INDEX idx_score_name ON score(name);
```

### 6.2 Database Connection Update

**File**: `backend/src/db/postgres.ts`

```typescript
import { Pool } from 'pg';

// Use DATABASE_URL if available, otherwise fall back to individual variables
const connectionString = process.env.DATABASE_URL;

export const pool = new Pool({
  connectionString: connectionString,
  // Fallback to individual variables if DATABASE_URL not set
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'quizz',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});
```

---

## Deployment Steps

### Step 1: Code Preparation
1. ✅ Add production build scripts to backend
2. ✅ Update CORS configuration for production
3. ✅ Add environment variable support to frontend
4. ✅ Create root package.json with workspaces
5. ✅ Add deployment configuration files
6. ✅ Update all API calls to use environment variables

### Step 2: Deploy Backend (Railway)
1. Push all code changes to GitHub
2. Create Railway account (railway.app)
3. Connect Railway to GitHub repository
4. Select `backend` folder as root directory
5. Railway auto-detects Express and provisions PostgreSQL
6. Set environment variables in Railway dashboard
7. Deploy backend → Get Railway URL (e.g., `quizzbun-api.railway.app`)

### Step 3: Deploy Frontend (Vercel)
1. Create Vercel account (vercel.com)
2. Connect Vercel to same GitHub repository
3. Configure to build `frontend` folder
4. Set environment variables with Railway URL
5. Deploy frontend → Get Vercel URL (e.g., `quizzbun.vercel.app`)

### Step 4: Final Integration
1. Update CORS in backend with actual Vercel URL
2. Test API connectivity between services
3. Verify quiz functionality works end-to-end
4. Test score saving and retrieval

---

## Testing Checklist

### Pre-Deployment Testing
- [ ] Frontend builds successfully (`bun run build`)
- [ ] Backend compiles successfully (`bun run build`)
- [ ] Local development works with environment variables
- [ ] API endpoints work correctly
- [ ] Database operations work correctly
- [ ] Bun runtime works correctly in development

### Post-Deployment Testing
- [ ] Frontend loads at Vercel URL
- [ ] Backend API responds at Railway URL
- [ ] Quiz questions load correctly
- [ ] Score submission works
- [ ] Score retrieval and display works
- [ ] CORS errors are resolved
- [ ] Environment variables are properly loaded

---

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Verify Vercel URL is added to CORS origins in backend
   - Check that environment variables are properly set

2. **Database Connection Issues**
   - Verify DATABASE_URL is correct in Railway
   - Check PostgreSQL is running in Railway
   - Test database schema exists

3. **Build Failures**
   - Check TypeScript compilation in backend
   - Verify all dependencies are installed
   - Check for missing environment variables

4. **API 404 Errors**
   - Verify API URLs are correct in environment variables
   - Check that backend is deployed and running
   - Test endpoints directly

### Debug Commands

```bash
# Test backend locally
cd backend && bun run build && bun start

# Test frontend build
cd frontend && bun run build && bun run preview

# Install all dependencies
bun run install:all

# Check environment variables
echo $VITE_API_URL
echo $DATABASE_URL
```

---

## Cost Analysis

### Free Tier Limits (Current Usage)

**Vercel (Frontend)**
- ✅ 100GB bandwidth/month
- ✅ Unlimited static sites
- ✅ Custom domains
- ✅ SSL certificates

**Railway (Backend + Database)**
- ✅ 500 hours/month runtime
- ✅ 1GB PostgreSQL storage
- ✅ Auto-sleep after 15 minutes inactivity
- ✅ Custom domains

**Estimated Monthly Cost**: $0 (well within free limits)

---

## Maintenance

### Regular Tasks
1. **Monitor usage** - Stay within free tier limits
2. **Update dependencies** - `bun update` for latest patches
3. **Backup database** - Export scores periodically
4. **Performance monitoring** - Check response times
5. **Bun runtime updates** - Keep Bun runtime current on Railway

### Scaling Considerations
- **Database**: Upgrade to paid tier if >1GB needed
- **Backend**: Upgrade if >500 hours runtime needed
- **Frontend**: Upgrade if >100GB bandwidth needed

---

## Timeline

### Implementation Time: ~1.5-2 hours
- Code changes: 45 minutes (faster with Bun)
- Railway setup: 20 minutes (Bun runtime auto-detection)
- Vercel setup: 30 minutes
- Testing and integration: 15 minutes (Bun's faster builds)

### Deployment Time: ~15 minutes
- Railway deploy: 5 minutes
- Vercel deploy: 5 minutes
- Final testing: 5 minutes

---

## Success Metrics

✅ **Application loads correctly** at custom domain  
✅ **Quiz functionality works** end-to-end  
✅ **Score system works** (save/retrieve)  
✅ **No CORS errors** between services  
✅ **Database operations** work correctly  
✅ **Mobile responsive** design works  
✅ **Fast loading** times (<3 seconds)  

---

## Next Steps

1. **Review this plan** and confirm all requirements
2. **Install Bun globally** if not already installed
3. **Implement code changes** in the order specified
4. **Test locally with Bun** before deploying
5. **Deploy to Railway** first (backend with Bun runtime)
6. **Deploy to Vercel** second (frontend)
7. **Perform integration testing**
8. **Monitor and optimize** performance
9. **Enjoy faster builds and runtime** with Bun!

---

## Bun Performance Benefits

### 🚀 **Development Speed**
- **3x faster** dependency installation
- **2x faster** build compilation
- **Instant hot reload** with `--watch` flag
- **Native TypeScript** support

### 📦 **Production Performance**
- **3x faster** cold start times
- **50% smaller** memory footprint
- **Built-in optimizations** for production
- **Native runtime** performance

### 💰 **Cost Efficiency**
- **Faster builds** = less CI/CD time
- **Smaller containers** = lower resource usage
- **Better performance** = happier users
- **Free tier optimization** = maximum value

---

*This deployment plan provides a robust, scalable, and cost-free solution for the QuizzBun application using modern cloud platforms, Bun runtime, and best practices. Enjoy the speed and performance benefits of Bun!*