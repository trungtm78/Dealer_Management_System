# Refactoring Baseline Evidence v1.0

**Date**: 2026-01-28
**Scope**: Module CRM (Leads & Customers)
**Refactor ID**: REF-HONDA-001

## 📊 Automated Test Baseline

### 1. Unit Tests
- **Status**: 🟢 PASS
- **Command**: `npx vitest run tests/unit/`
- **Result**: 8 passed, 0 failed.
- **Evidence**:
    ```
    Tests  8 passed (8)
    Duration  2.08s
    ```

### 2. Integration Tests
- **Status**: 🔴 FAIL
- **Command**: `npx vitest run tests/integration/`
- **Result**: 1 passed, 9 failed.
- **Failures identified**:
    - `IT-CRM-LEAD-001`: Create Lead (400 instead of 201)
    - `IT-CRM-LEAD-003`: Get Detail (500 Internal Error - field mismatch)
    - `IT-CRM-CUS-001`: List Customers (500 Internal Error - field mismatch)
- **Key Error Log**:
    ```
    Unknown argument `createdAt`. Did you mean `created_at`?
    Unknown argument `modelInterest`. Did you mean `model_interest`?
    ```

## 🕵️ System State (Baseline)
- **Backend**: Next.js Server Actions and API Routes are inconsistent with Prisma Schema.
- **Database**: `snake_case` columns.
- **Code**: Mix of `camelCase` and `snake_case` causing runtime failures.

## 🏁 Baseline Verdict
Code is technically broken in Integration environment. Refactoring is required to align conventions and restore functionality as per API Spec v1.0.
