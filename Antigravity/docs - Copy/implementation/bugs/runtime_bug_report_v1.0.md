# Runtime Bug Report v1.0

**Bug ID**: BUG-RT-001  
**Date**: 2026-01-28  
**Status**: FIXED (Verified)

## 🔍 Evidence
`PrismaClientValidationError: Unknown argument description`.

## 🏁 Resolution
- Added `description: String?` to `MarketingCampaign` model in `prisma/schema.prisma`.
- Regenerated Prisma Client and synced DB via `npx prisma db push`.

---

**Bug ID**: BUG-RT-002  
**Date**: 2026-01-28  
**Status**: FIXED (Verified)

## 🔍 Evidence
`P2002: Unique constraint failed on the fields: (phone)` during `prisma.customer.createMany()`.

## 🛠️ Analysis
The seeding process failed because existing data in the database conflicted with the unique constraints (phone numbers) of the new seed data.

## 🏁 Resolution
- Updated `prisma/seed.js` to include a cleanup phase at the start.
- Implemented `deleteMany()` for all relevant models (`Interaction`, `LeadHistory`, `Lead`, `MarketingCampaign`, `RepairOrder`, `Contract`, `Quotation`, `Customer`) in the correct order to respect foreign key constraints.
- Verified successful seeding with a clean database state.
