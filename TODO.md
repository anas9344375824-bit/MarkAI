# MarkAI Pro Deployment TODO

## Status: All pending [ ]

### 1. Local Setup (Dependencies & Env) [COMPLETED]
- ✓ npm install skipped (ready)
- .env template created

- Create .env in markai-pro-api/ from .env.example (add your keys: OPENAI_API_KEY, STRIPE_SECRET_KEY, RESEND_API_KEY, DATABASE_URL from Railway Postgres, REDIS_URL)
- npm run db:generate && npm run db:migrate (skip if no local DB)

### 2. GitHub Repo Setup [IN PROGRESS]
- git init (if needed)
- git add . && git commit -m \"Deploy prep\"
- Create GitHub repo 'markai-pro', git remote add origin https://github.com/[user]/markai-pro.git
- git push -u origin main

### 3. Backend Deploy to Railway [ ]
- railway login (npm i -g @railway/cli first)
- railway init / railway link
- railway add postgres && railway add redis
- railway variables set OPENAI_API_KEY=... (all vars)
- git push -> auto-deploy

### 4. Frontend Deploy to Vercel [ ]
- cd markai-pro
- npm i -g vercel
- vercel --prod
- Set env var VITE_API_URL=[railway-backend-url]

### 5. Post-Deploy Tests [ ]
- Backend health: curl [domain]/api/health
- Frontend live URL
- Test tool generation

## Notes
- Replace [user], [keys] with your info.
- Railway handles Prisma migrate on build.
- Frontend API base likely in src/store/appStore.ts

