# Bug Confirmation Decision v1.3

**Version**: 1.3  
**Date**: 2026-01-29  
**Decision By**: Antigravity - Bug Confirmation Authority  
**Source**: Screenshot evidence (uploaded_media_1769627797595.png)

---

## 📋 BUG SUMMARY

**Bug ID**: BUG-RT-005  
**Title**: Lead Create Fails - Unknown argument 'color'  
**Date Reported**: 2026-01-29  
**Environment**: Local / Dev  
**Severity**: 🔴 HIGH (Blocks lead creation)

---

## 🔍 BƯỚC 1: PHÂN TÍCH BUG EVIDENCE

### Evidence từ Screenshot

**Error Message**:
```
Lỗi: Invalid `prisma.lead.create()` invocation: 
{ data: { name: "THAN MINH TRUNG", phone: "0918906776", 
email: "trung@dtcjsc.com.vn", source: "WALK_IN", 
model_interest: "crv", model_version: "", color: "", 
~~~~ budget: undefined, payment_method: "cash", 
timeframe: "1_month", customer_type: "individual", 
address: "68 Hoang Trong Mau street, Tan Hung ward", 
notes: "", is_test_drive: false, test_drive_date: "", 
status: "NEW", score: 10, ? id?: String, ? created_at?: DateTime, 
? updated_at?: DateTime, ? customer?: CustomerCreateNestedOneWithoutLeadsInput, 
? assignedTo?: UserCreateNestedOneWithoutAssignedLeadsInput, 
? interactions?: InteractionCreateNestedManyWithoutLeadInput, 
? history?: LeadHistoryCreateNestedManyWithoutLeadInput } 
} Unknown argument `color`. Available options are marked with ?.
```

**Key Information**:
- **Module**: CRM - Lead Management
- **Screen**: Lead Create Form
- **Action**: Creating new lead
- **Error Type**: Prisma validation error
- **Invalid Field**: `color`
- **Other Invalid Fields**: `payment_method`, `timeframe` (also not in schema)

---

## 🔍 BƯỚC 2: TRACE VỀ TÀI LIỆU

### 1. ERD - Lead Model (prisma/schema.prisma, lines 127-154)

**Actual Schema**:
```prisma
model Lead {
  id              String      @id @default(cuid())
  name            String
  phone           String
  email           String?
  address         String?
  model_interest  String?
  model_version   String?
  budget          Decimal?
  source          String      // LeadSource enum
  status          String      @default("NEW")
  score           Int         @default(10)
  notes           String?
  customer_type   String?
  customer_id     String?
  assigned_to_id  String?
  created_at      DateTime    @default(now())
  updated_at      DateTime    @updatedAt
  
  // Relations
  customer     Customer?
  assignedTo   User?
  interactions Interaction[]
  history      LeadHistory[]
}
```

**Fields NOT in schema**:
- ❌ `color` - KHÔNG TỒN TẠI
- ❌ `payment_method` - KHÔNG TỒN TẠI
- ❌ `timeframe` - KHÔNG TỒN TẠI
- ❌ `is_test_drive` - KHÔNG TỒN TẠI
- ❌ `test_drive_date` - KHÔNG TỒN TẠI

### 2. FRD - Lead Management

**Expected**: FRD SCR-CRM-001 (Lead Management) không yêu cầu fields `color`, `payment_method`, `timeframe`, `is_test_drive`, `test_drive_date` cho Lead entity.

**Note**: Các fields này có thể thuộc về:
- `color` → Vehicle/Quotation entity (không phải Lead)
- `payment_method`, `timeframe` → Quotation/Contract entity (không phải Lead)
- `is_test_drive`, `test_drive_date` → TestDrive entity (riêng biệt)

### 3. API Spec - Lead Create

**Expected**: POST `/api/crm/leads` chỉ nhận fields theo Lead schema.

---

## 🔍 BƯỚC 3: QUY TẮC XÁC NHẬN

### Decision: ✅ CONFIRMED BUG

**Lý do**:
1. ✅ **Hành vi thực tế ≠ Schema**: Code đang gửi fields không tồn tại trong Lead schema
2. ✅ **Tài liệu KHÔNG mâu thuẫn**: ERD, FRD, API Spec đều nhất quán - Lead không có `color`, `payment_method`, etc.
3. ✅ **Không phải ENV issue**: Đây là logic bug, không phải config/environment

**Root Cause**:
- Frontend form đang collect fields không thuộc Lead entity
- Có thể do:
  - Form fields nhầm lẫn giữa Lead và Quotation
  - Copy-paste code từ Quotation form
  - Thiếu validation trước khi gọi Prisma

**Classification**: ✅ **BUG** (Implementation Error)

---

## 🎯 BƯỚC 4: GHI NHẬN QUYẾT ĐỊNH

### Bug ID: BUG-RT-005

**Decision**: ✅ **CONFIRMED BUG**

**Reason**: 
- Frontend form gửi fields không tồn tại trong Lead schema
- ERD/FRD/API Spec đều không yêu cầu `color`, `payment_method`, `timeframe`, `is_test_drive`, `test_drive_date` cho Lead

**Impact Scope**:
- **FE**: ✅ Lead create form (likely `app/(main)/crm/leads/page.tsx` or component)
- **BE**: ❌ No change needed (Prisma schema is correct)
- **API**: ❌ No change needed
- **DB**: ❌ No change needed (schema is correct)

**Allowed to Modify**:
- ✅ **OpenCode can fix**: Frontend form
- ✅ **Remove invalid fields**: `color`, `payment_method`, `timeframe`, `is_test_drive`, `test_drive_date`
- ✅ **Keep only valid fields**: name, phone, email, address, model_interest, model_version, budget, source, status, score, notes, customer_type

**NOT Allowed**:
- ❌ **DO NOT** add `color` field to Lead schema
- ❌ **DO NOT** change ERD/FRD/API Spec
- ❌ **DO NOT** treat as CHANGE REQUEST

---

## 🔧 CHỈ ĐẠO CHO OPENCODE

### Fix Instructions

**File to Fix**: Frontend Lead create form
- Likely: `app/(main)/crm/leads/page.tsx` or `components/crm/LeadForm.tsx`

**Changes Required**:
1. ✅ **Remove invalid fields** from form data before calling API:
   - Remove: `color`
   - Remove: `payment_method`
   - Remove: `timeframe`
   - Remove: `is_test_drive`
   - Remove: `test_drive_date`

2. ✅ **Keep only valid Lead fields**:
   ```typescript
   const leadData = {
     name,
     phone,
     email,
     address,
     model_interest,
     model_version,
     budget,
     source,
     status,
     score,
     notes,
     customer_type,
     // assigned_to_id (if applicable)
   };
   ```

3. ✅ **Optional**: If user needs to input `color`, `payment_method`, `timeframe`:
   - These should be saved to **Quotation** entity (when creating quotation from lead)
   - NOT to Lead entity

4. ✅ **Optional**: If user needs to schedule test drive:
   - Create separate **TestDrive** entity
   - Link to Lead via `lead_id`

---

## ✅ TESTING REQUIREMENTS

### Unit Tests (UT)
- ✅ Test Lead create with valid fields only
- ✅ Test form validation removes invalid fields

### Integration Tests (IT)
- ✅ Test POST `/api/crm/leads` with valid payload
- ✅ Verify Lead created in DB with correct fields

### Manual Test
- ✅ Re-run Lead create scenario
- ✅ Expected: Lead created successfully without error
- ✅ Verify: No `color`, `payment_method`, `timeframe` fields sent to API

---

## 📊 BUG CLASSIFICATION SUMMARY

| Bug ID | Title | Classification | Reason | Scope |
|--------|-------|----------------|--------|-------|
| BUG-RT-005 | Lead Create - Unknown argument 'color' | **CONFIRMED BUG** | Form sends fields not in Lead schema | FE only |

**Total**: 1 BUG confirmed

---

## 🔒 AUTHORITY CONFIRMATION

**Decision Made By**: Antigravity - Bug Confirmation Authority  
**Date**: 2026-01-29  
**Status**: ✅ CONFIRMED BUG

**Rules Applied**:
- ✅ Traced to ERD (Lead schema)
- ✅ Verified against FRD (Lead requirements)
- ✅ Confirmed not ENV issue
- ✅ Classified as BUG (not CHANGE REQUEST)

**Authorization**:
- ✅ OpenCode is AUTHORIZED to fix frontend form
- ❌ OpenCode is NOT AUTHORIZED to change schema/docs
- ✅ No documentation update required

---

**End of Bug Confirmation Decision v1.3**
