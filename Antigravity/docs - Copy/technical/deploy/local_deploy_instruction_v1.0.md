# Honda DMS - Local Deploy Instruction v1.0

**Version**: 1.0  
**Date**: 2026-01-28  
**Owner**: Antigravity (Deployment Instruction Authority)  
**Target Audience**: OpenCode, DevOps, QA Team

---

## 📋 A. Overview

### Purpose
Hướng dẫn deploy Honda DMS trên môi trường local để:
- Development (Dev)
- Unit Testing (UT)
- Integration Testing (IT)
- User Acceptance Testing (UAT) nội bộ

### Scope
Hệ thống Honda DMS bao gồm:
- **Frontend**: Next.js 14.1.0 (App Router) + React 18
- **Backend**: NestJS 11.x (embedded trong Next.js API routes)
- **Database**: SQLite (dev.db) - No PostgreSQL required for local
- **Port**: 3000 (default Next.js dev server)

### Supported OS
- ✅ Windows 10/11
- ✅ Linux (Ubuntu 20.04+, Debian, CentOS)
- ✅ macOS (Intel & Apple Silicon)

---

## 🔧 B. Prerequisites

### 1. Required Software

| Software | Version | Download Link | Verification Command |
|----------|---------|---------------|---------------------|
| **Node.js** | v20.x (LTS) | https://nodejs.org | `node --version` |
| **npm** | v10.x+ | (included with Node.js) | `npm --version` |
| **Git** | Latest | https://git-scm.com | `git --version` |

**Optional** (for advanced users):
- **pnpm** v8.x+ (faster alternative to npm)
- **Docker** (if using containerized deployment - not covered in this doc)

### 2. Hardware Requirements

**Minimum**:
- CPU: 2 cores
- RAM: 4 GB
- Disk: 2 GB free space

**Recommended**:
- CPU: 4 cores
- RAM: 8 GB
- Disk: 5 GB free space

### 3. Network Requirements
- Internet connection (for npm install)
- Port 3000 available (default Next.js dev server)

---

## 📂 C. Repo Setup

### 1. Clone Repository

```bash
# Clone repo
git clone <REPO_URL> honda-dms
cd honda-dms
```

**Expected Result**:
```
Cloning into 'honda-dms'...
done.
```

### 2. Verify Repo Structure

```bash
# List important directories
ls -la
```

**Expected Structure**:
```
honda-dms/
├── .env                    # Environment variables (DO NOT COMMIT)
├── package.json            # Dependencies
├── prisma/                 # Database schema & migrations
│   ├── schema.prisma
│   └── seed.js
├── app/                    # Next.js App Router pages
├── components/             # React components
├── lib/                    # Utilities
├── actions/                # Server actions
├── services/               # Business logic
├── tests/                  # Unit & Integration tests
├── docs/                   # Documentation
└── scripts/                # Helper scripts
```

---

## 🔐 D. Environment Variables

### 1. Create `.env` File

**Windows**:
```cmd
copy .env.example .env
```

**Linux/macOS**:
```bash
cp .env.example .env
```

**If `.env.example` doesn't exist**, create `.env` manually:

```bash
# Windows
type nul > .env

# Linux/macOS
touch .env
```

### 2. Configure Environment Variables

Edit `.env` file:

```env
# Database (SQLite - No PostgreSQL needed)
DATABASE_URL="file:./dev.db"

# JWT Secret (Change in production!)
JWT_SECRET="your-secret-key-change-this-in-production"

# Optional: Node Environment
NODE_ENV="development"

# Optional: Next.js Port (default: 3000)
PORT=3000
```

**⚠️ IMPORTANT**:
- **DO NOT COMMIT** `.env` file to Git
- `.env` is in `.gitignore` by default
- Use strong `JWT_SECRET` in production

### 3. Verify Environment

```bash
# Windows
type .env

# Linux/macOS
cat .env
```

**Expected Result**: File contains `DATABASE_URL` and `JWT_SECRET`

---

## 🗄️ E. Database Setup

### 1. Initialize Database

Honda DMS uses **SQLite** for local development (no PostgreSQL installation needed).

```bash
# Push schema to database (creates dev.db)
npm run db:push
```

**Expected Result**:
```
Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma
Datasource "db": SQLite database "dev.db" at "file:./dev.db"

SQLite database dev.db created at file:./dev.db

🚀  Your database is now in sync with your Prisma schema.
```

**Verification**:
```bash
# Check if dev.db exists
# Windows
dir dev.db

# Linux/macOS
ls -lh dev.db
```

### 2. Generate Prisma Client

```bash
npx prisma generate
```

**Expected Result**:
```
✔ Generated Prisma Client (5.22.0) to ./node_modules/@prisma/client
```

### 3. Seed Database (Optional)

```bash
npm run db:seed
```

**Expected Result**:
```
Seeding database...
✅ Admin user created: admin@honda.com.vn
✅ Sample data created
Database seeded successfully!
```

**Default Login Credentials** (after seed):
- Email: `admin@honda.com.vn`
- Password: `admin123`

### 4. Verify Database

```bash
# Open Prisma Studio (DB GUI)
npx prisma studio
```

**Expected Result**: Browser opens at `http://localhost:5555` showing database tables

---

## 🔨 F. Install Dependencies

### 1. Install npm Packages

```bash
npm install
```

**Expected Result**:
```
added 1234 packages in 45s
```

**If errors occur**, try:
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 2. Verify Installation

```bash
# Check if node_modules exists
# Windows
dir node_modules

# Linux/macOS
ls node_modules | wc -l
```

**Expected Result**: `node_modules` directory exists with 1000+ packages

---

## 🚀 G. Start Application

### 1. Start Development Server

```bash
npm run dev
```

**Expected Result**:
```
  ▲ Next.js 14.1.0
  - Local:        http://localhost:3000
  - Environments: .env

 ✓ Ready in 3.2s
```

### 2. Verify Application

**Open Browser**: http://localhost:3000

**Expected Result**:
- Login page displays
- No console errors
- Can login with `admin@honda.com.vn` / `admin123`

### 3. Verify API Endpoints

**Test Healthcheck** (if available):
```bash
# Windows (PowerShell)
Invoke-WebRequest -Uri http://localhost:3000/api/health

# Linux/macOS
curl http://localhost:3000/api/health
```

**Expected Result**: `200 OK` response

---

## ✅ H. Local Integration Test Gate (MANDATORY)

### 1. Run Unit Tests

```bash
npm run test:run
```

**Expected Result**:
```
✓ tests/unit/... (XX tests) XXXms
✓ tests/integration/... (XX tests) XXXms

Test Files  XX passed (XX)
     Tests  XXX passed (XXX)
  Start at  HH:MM:SS
  Duration  XXs
```

**Pass Criteria**:
- ✅ All tests pass (100%)
- ✅ No test failures
- ✅ No timeout errors

**If tests fail**: ❌ **STOP** - Do not proceed to UAT

### 2. Run Integration Tests

```bash
npm run test:conversion
```

**Expected Result**:
```
✓ tests/integration/customer_conversion.test.ts (X tests) XXXms

Test Files  1 passed (1)
     Tests  X passed (X)
```

**Pass Criteria**:
- ✅ Customer conversion flow works
- ✅ Database transactions complete
- ✅ No data integrity errors

### 3. Run E2E Tests (Optional)

```bash
npm run test:e2e:fast
```

**Expected Result**:
```
Running XX tests using 4 workers

  XX passed (XXs)
```

**Pass Criteria**:
- ✅ Login flow works
- ✅ Core UI interactions work
- ✅ No browser errors

---

## 🔍 I. Verification Checklist

After deployment, verify:

- [ ] **Environment**:
  - [ ] `.env` file exists with correct values
  - [ ] `DATABASE_URL` points to `file:./dev.db`
  - [ ] `JWT_SECRET` is set

- [ ] **Database**:
  - [ ] `dev.db` file exists
  - [ ] Prisma Client generated
  - [ ] Database seeded (admin user exists)
  - [ ] Prisma Studio opens successfully

- [ ] **Dependencies**:
  - [ ] `node_modules` directory exists
  - [ ] No npm install errors
  - [ ] `package-lock.json` exists

- [ ] **Application**:
  - [ ] Dev server starts on port 3000
  - [ ] Login page loads
  - [ ] Can login with admin credentials
  - [ ] No console errors

- [ ] **Tests**:
  - [ ] Unit tests pass (100%)
  - [ ] Integration tests pass
  - [ ] E2E tests pass (if run)

---

## 🛠️ J. Common Troubleshooting

### Issue 1: Port 3000 Already in Use

**Error**:
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution**:
```bash
# Windows - Find and kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/macOS
lsof -ti:3000 | xargs kill -9

# OR change port in .env
PORT=3001
```

---

### Issue 2: Environment Variables Not Loaded

**Error**:
```
Error: DATABASE_URL is not defined
```

**Solution**:
```bash
# 1. Verify .env exists
ls -la .env

# 2. Check .env content
cat .env

# 3. Restart dev server
npm run dev
```

---

### Issue 3: Database Connection Error

**Error**:
```
Error: Can't reach database server at `file:./dev.db`
```

**Solution**:
```bash
# 1. Delete existing database
rm dev.db

# 2. Re-initialize
npm run db:push

# 3. Re-seed
npm run db:seed
```

---

### Issue 4: Prisma Client Not Generated

**Error**:
```
Error: @prisma/client did not initialize yet
```

**Solution**:
```bash
# Generate Prisma Client
npx prisma generate

# Restart dev server
npm run dev
```

---

### Issue 5: npm install Fails

**Error**:
```
npm ERR! code ERESOLVE
```

**Solution**:
```bash
# Clear cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules package-lock.json

# Reinstall with legacy peer deps
npm install --legacy-peer-deps
```

---

### Issue 6: Node Version Mismatch

**Error**:
```
Error: The engine "node" is incompatible with this module
```

**Solution**:
```bash
# Check Node version
node --version

# Should be v20.x
# If not, install Node v20 LTS from https://nodejs.org

# Verify
node --version
# Expected: v20.x.x
```

---

### Issue 7: Migration Mismatch

**Error**:
```
Error: Prisma schema and database are out of sync
```

**Solution**:
```bash
# Reset database
npm run db:push -- --accept-data-loss

# Re-seed
npm run db:seed
```

---

### Issue 8: CORS Errors (if using separate FE/BE)

**Error** (in browser console):
```
Access to fetch at 'http://localhost:3000/api/...' has been blocked by CORS policy
```

**Solution**:
- Honda DMS uses Next.js API routes (same origin) - CORS should not occur
- If using external API, add CORS middleware in `next.config.js`

---

## 🔄 K. Rollback / Clean Reset

### 1. Reset Database

```bash
# Delete database
rm dev.db

# Re-initialize
npm run db:push

# Re-seed
npm run db:seed
```

### 2. Clear Build Cache

```bash
# Delete Next.js cache
rm -rf .next

# Delete node_modules
rm -rf node_modules

# Reinstall
npm install
```

### 3. Reset Environment

```bash
# Delete .env
rm .env

# Recreate from example
cp .env.example .env

# Edit .env with correct values
```

### 4. Full Clean Reset

```bash
# Stop dev server (Ctrl+C)

# Delete all generated files
rm -rf .next node_modules dev.db

# Reinstall
npm install

# Re-initialize DB
npm run db:push
npm run db:seed

# Restart
npm run dev
```

---

## 📝 L. Quick Start Script

For convenience, use the provided quick start script:

**Windows**:
```cmd
QUICK_START.bat
```

**Linux/macOS**:
```bash
chmod +x QUICK_START.sh
./QUICK_START.sh
```

This script automates:
1. Database initialization
2. Prisma Client generation
3. Database seeding
4. Application startup

---

## 📚 M. Related Documents

- **UAT Plan**: `docs/design/testing/uat_plan_v1.1.md`
- **API Spec**: `docs/design/api/api_spec_index.md`
- **ERD**: `prisma/schema.prisma`
- **Troubleshooting**: `TROUBLESHOOTING.md`

---

## 🔐 N. Security Notes

### For Local Development

- ✅ Use default `JWT_SECRET` for local dev
- ✅ SQLite database is file-based (no network exposure)
- ✅ Default admin password is acceptable for local

### For Production

- ❌ **NEVER** use default `JWT_SECRET`
- ❌ **NEVER** commit `.env` to Git
- ❌ **NEVER** use SQLite in production (use PostgreSQL)
- ✅ Change admin password immediately
- ✅ Use environment-specific secrets

---

## ✅ O. Success Criteria

Deployment is successful when:

1. ✅ Application starts without errors
2. ✅ Login page loads at http://localhost:3000
3. ✅ Can login with admin credentials
4. ✅ Dashboard displays without errors
5. ✅ All unit tests pass
6. ✅ All integration tests pass
7. ✅ Database contains seeded data

---

## 📞 P. Support

**If you encounter issues**:

1. Check `TROUBLESHOOTING.md`
2. Review this document's troubleshooting section
3. Check logs in terminal
4. Contact: [Your Team Contact]

---

**Document Status**: ✅ READY  
**Last Updated**: 2026-01-28  
**Next Review**: After major version update
