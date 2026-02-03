# Bug Fix Report - BUG-RT-005 v1.0

**Bug ID**: BUG-RT-005  
**Reference**: `docs/design/testing/bug_confirmation_v1.3.md`  
**Status**: FIXED

## 📋 Gate Check
- **Bug ID**: BUG-RT-005
- **Status**: CONFIRMED BUG
- **Allowed Scope**: Frontend (Lead Create Form)
- **Gate Result**: ✅ PASS

## 🧪 Reproduce Steps
1. Navigate to `/crm/leads`.
2. Click "Tạo Lead Mới".
3. Fill in all fields including vehicle interest, payment method, etc.
4. Click "Tạo Lead".
5. Observe: Red toast message with Prisma error: `Unknown argument color`.

## 🛠️ Root Cause Analysis (RCA)
- **Issue**: The `LeadDialog` component sends a payload containing fields (`color`, `payment_method`, `timeframe`, `is_test_drive`, `test_drive_date`, `trade_in_car`) that are not defined in the Prisma `Lead` model.
- **RCA**: Implementation error in `components/crm/LeadDialog.tsx` where the payload object was constructed with all form fields without filtering for valid entity properties.

## 🔧 Fix Summary
1. **Frontend Fix**: Updated `handleSave` in `components/crm/LeadDialog.tsx` to construct a clean payload containing ONLY fields compatible with the `Lead` model in `prisma/schema.prisma`.
2. **Removed Fields**: `color`, `payment_method`, `timeframe`, `is_test_drive`, `test_drive_date`, `trade_in_car`.

## ✅ Verification Results
- **Script Verification**: Executed `scripts/verify_bug_rt_005.js` simulating the sanitized payload.
    - Result: `Lead created successfully`.
    - Status: 🟢 PASS
- **Manual Verification**: Re-ran the lead creation flow.
    - Result: Lead created without errors. Success toast displayed.
    - Status: 🟢 PASS
