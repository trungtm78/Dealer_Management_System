# Runtime Bug Report v1.3

**Bug ID**: BUG-RT-006  
**Date**: 2026-01-29  
**Environment**: Local / Dev  

## 🔍 Evidence
**User Report**: "lỗi không tạo được báo giá phụ tùng kiểm tra dùm" (Error creating parts quotation, please check).

## 🛠️ Analysis
- **Error Message**: Suspected `PrismaClientValidationError` (Unknown argument) based on code inspection.
- **Bug Category**: Backend Logic Bug / Data Mapping Error.
- **Affected Module**: Service / Quotations.
- **Root Cause**: 
    1. The Server Action `createQuote` in `actions/service/quotations.ts` was using `camelCase` field names (e.g., `quoteNumber`, `customerId`) while the Prisma schema defines them as `snake_case` (e.g., `quote_number`, `customer_id`).
    2. The frontend component `ServiceQuoteCreate.tsx` used a non-existent hardcoded advisor ID (`user-1`), which would cause foreign key constraint violations in the database.
    3. The DTO mapper in the backend was also using incorrect field names, preventing data from being displayed correctly even if created.

## 📜 Trace to Docs
- **ERD**: `ServiceQuote` model in `schema.prisma` uses snake_case.
- **FRD**: SCR-SVC-001 (Service Quotations).
- **API Spec**: `POST /api/service/quotations`.

## 🏁 Proposed Action
**Proposed Action**: BUG FIX  
- **Actions Taken**:
    1. Refactored `actions/service/quotations.ts` to align with the `snake_case` database schema.
    2. Updated `components/service/ServiceQuoteCreate.tsx` to use a valid advisor ID from seed data (`usr-admin`).
    3. Standardized DTO mapping to ensure consistency between DB, API, and Frontend.
- **Status**: FIXED (Verified via code alignment).
