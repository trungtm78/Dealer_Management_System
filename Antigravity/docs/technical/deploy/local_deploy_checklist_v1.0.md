# Honda DMS - Local Deploy Checklist v1.0

**Version**: 1.0  
**Date**: 2026-01-28  
**Linked to**: `local_deploy_instruction_v1.0.md`

---

## 📋 Pre-Deployment Checklist

### System Requirements

- [ ] **Node.js v20.x** installed
  ```bash
  node --version
  # Expected: v20.x.x
  ```

- [ ] **npm v10.x+** installed
  ```bash
  npm --version
  # Expected: v10.x.x
  ```

- [ ] **Git** installed
  ```bash
  git --version
  # Expected: git version 2.x.x
  ```

- [ ] **Port 3000** available
  ```bash
  # Windows
  netstat -ano | findstr :3000
  # Expected: No output (port free)
  
  # Linux/macOS
  lsof -ti:3000
  # Expected: No output (port free)
  ```

- [ ] **Minimum 4GB RAM** available
- [ ] **Minimum 2GB disk space** available

---

## 📂 Repository Setup

- [ ] **Clone repository**
  ```bash
  git clone <REPO_URL> honda-dms
  cd honda-dms
  ```

- [ ] **Verify repo structure**
  ```bash
  ls -la
  # Expected: package.json, prisma/, app/, components/, etc.
  ```

- [ ] **Check current branch**
  ```bash
  git branch
  # Expected: * main (or development)
  ```

---

## 🔐 Environment Configuration

- [ ] **Create `.env` file**
  ```bash
  # Windows
  copy .env.example .env
  
  # Linux/macOS
  cp .env.example .env
  ```

- [ ] **Configure `DATABASE_URL`**
  ```env
  DATABASE_URL="file:./dev.db"
  ```

- [ ] **Configure `JWT_SECRET`**
  ```env
  JWT_SECRET="your-secret-key-change-this-in-production"
  ```

- [ ] **Verify `.env` file**
  ```bash
  cat .env
  # Expected: Contains DATABASE_URL and JWT_SECRET
  ```

- [ ] **Verify `.env` is in `.gitignore`**
  ```bash
  grep ".env" .gitignore
  # Expected: .env
  ```

---

## 📦 Dependencies Installation

- [ ] **Install npm packages**
  ```bash
  npm install
  ```
  **Expected**: `added XXXX packages in XXs`

- [ ] **Verify `node_modules` exists**
  ```bash
  ls node_modules | wc -l
  # Expected: 1000+ packages
  ```

- [ ] **Verify `package-lock.json` created**
  ```bash
  ls -la package-lock.json
  # Expected: File exists
  ```

- [ ] **No installation errors**
  - Check terminal output for `npm ERR!`
  - If errors, run: `npm install --legacy-peer-deps`

---

## 🗄️ Database Setup

- [ ] **Push database schema**
  ```bash
  npm run db:push
  ```
  **Expected**: `Your database is now in sync with your Prisma schema.`

- [ ] **Verify `dev.db` created**
  ```bash
  ls -la dev.db
  # Expected: File exists (size > 0 bytes)
  ```

- [ ] **Generate Prisma Client**
  ```bash
  npx prisma generate
  ```
  **Expected**: `Generated Prisma Client to ./node_modules/@prisma/client`

- [ ] **Seed database**
  ```bash
  npm run db:seed
  ```
  **Expected**: `Database seeded successfully!`

- [ ] **Verify seeded data**
  ```bash
  npx prisma studio
  ```
  **Expected**: Browser opens, shows tables with data

- [ ] **Verify admin user exists**
  - Open Prisma Studio
  - Check `users` table
  - Verify `admin@honda.com.vn` exists

---

## 🚀 Application Startup

- [ ] **Start development server**
  ```bash
  npm run dev
  ```
  **Expected**: `✓ Ready in X.Xs`

- [ ] **Verify server running**
  - Terminal shows: `Local: http://localhost:3000`
  - No error messages

- [ ] **Access application**
  - Open browser: http://localhost:3000
  - Login page displays

- [ ] **Test login**
  - Email: `admin@honda.com.vn`
  - Password: `admin123`
  - Login successful

- [ ] **Verify dashboard loads**
  - Dashboard displays without errors
  - No console errors (F12 → Console)

---

## ✅ Testing Gate (MANDATORY)

### Unit Tests

- [ ] **Run unit tests**
  ```bash
  npm run test:run
  ```
  **Expected**: `Test Files XX passed (XX)`

- [ ] **All tests pass**
  - Pass rate: 100%
  - No failures
  - No timeouts

- [ ] **No test errors**
  - Check terminal output
  - No `FAIL` or `ERROR` messages

### Integration Tests

- [ ] **Run integration tests**
  ```bash
  npm run test:conversion
  ```
  **Expected**: `Test Files 1 passed (1)`

- [ ] **Customer conversion test passes**
  - Lead → Customer conversion works
  - Database transactions complete

### E2E Tests (Optional)

- [ ] **Run E2E tests**
  ```bash
  npm run test:e2e:fast
  ```
  **Expected**: `XX passed (XXs)`

- [ ] **Core flows work**
  - Login flow
  - Navigation
  - CRUD operations

---

## 🔍 Verification Checklist

### Environment

- [ ] `.env` file exists
- [ ] `DATABASE_URL` is correct
- [ ] `JWT_SECRET` is set
- [ ] No secrets committed to Git

### Database

- [ ] `dev.db` file exists
- [ ] Prisma Client generated
- [ ] Database schema up-to-date
- [ ] Seeded data present
- [ ] Admin user exists

### Dependencies

- [ ] `node_modules` directory exists
- [ ] All packages installed
- [ ] No version conflicts
- [ ] `package-lock.json` exists

### Application

- [ ] Dev server starts
- [ ] Port 3000 accessible
- [ ] Login page loads
- [ ] Can login successfully
- [ ] Dashboard displays
- [ ] No console errors
- [ ] No network errors

### Tests

- [ ] Unit tests: 100% pass
- [ ] Integration tests: 100% pass
- [ ] E2E tests: Pass (if run)
- [ ] No test failures

---

## 🚨 Failure Handling

### If Any Checkbox Fails

**STOP** and troubleshoot before proceeding:

1. **Review error messages** in terminal
2. **Check `TROUBLESHOOTING.md`**
3. **Check `local_deploy_instruction_v1.0.md` Section J**
4. **Try rollback/clean reset** (Section K)

### Common Failure Points

| Issue | Section to Check |
|-------|------------------|
| Port conflict | Troubleshooting Issue 1 |
| Env vars missing | Troubleshooting Issue 2 |
| DB connection error | Troubleshooting Issue 3 |
| Prisma Client error | Troubleshooting Issue 4 |
| npm install fails | Troubleshooting Issue 5 |
| Node version mismatch | Troubleshooting Issue 6 |
| Migration mismatch | Troubleshooting Issue 7 |

---

## 🔄 Rollback Checklist

### If Deployment Fails

- [ ] **Stop dev server** (Ctrl+C)

- [ ] **Delete generated files**
  ```bash
  rm -rf .next node_modules dev.db
  ```

- [ ] **Reset environment**
  ```bash
  rm .env
  cp .env.example .env
  # Edit .env with correct values
  ```

- [ ] **Reinstall dependencies**
  ```bash
  npm install
  ```

- [ ] **Re-initialize database**
  ```bash
  npm run db:push
  npm run db:seed
  ```

- [ ] **Restart application**
  ```bash
  npm run dev
  ```

- [ ] **Re-run verification checklist**

---

## ✅ Final Sign-off

### Deployment Complete When

- [x] All pre-deployment checks pass
- [x] All repository setup checks pass
- [x] All environment configuration checks pass
- [x] All dependencies installation checks pass
- [x] All database setup checks pass
- [x] All application startup checks pass
- [x] All testing gate checks pass
- [x] All verification checks pass

### Sign-off

**Deployed By**: _______________  
**Date**: _______________  
**Environment**: Local Development  
**Status**: ✅ READY / ❌ FAILED

**Notes**:
_____________________________________________
_____________________________________________
_____________________________________________

---

## 📝 Deployment Log Template

```
===========================================
Honda DMS - Local Deployment Log
===========================================

Date: YYYY-MM-DD HH:MM:SS
Deployed By: [Name]
OS: [Windows/Linux/macOS]
Node Version: [X.X.X]
npm Version: [X.X.X]

---

Pre-Deployment:
- [ ] System requirements met
- [ ] Repository cloned
- [ ] Environment configured

Installation:
- [ ] Dependencies installed
- [ ] Database initialized
- [ ] Database seeded

Startup:
- [ ] Application started
- [ ] Login successful
- [ ] Dashboard loaded

Testing:
- [ ] Unit tests: PASS/FAIL
- [ ] Integration tests: PASS/FAIL
- [ ] E2E tests: PASS/FAIL

Verification:
- [ ] All checks pass

Status: SUCCESS/FAILED

Notes:
[Any issues encountered or special configurations]

===========================================
```

---

## 📚 Related Documents

- **Deploy Instruction**: [`local_deploy_instruction_v1.0.md`](file:///c:/Honda/Antigravity/docs/technical/deploy/local_deploy_instruction_v1.0.md)
- **Troubleshooting**: `TROUBLESHOOTING.md`
- **UAT Plan**: `docs/design/testing/uat_plan_v1.1.md`

---

**Document Status**: ✅ READY  
**Last Updated**: 2026-01-28  
**Next Review**: After major version update
