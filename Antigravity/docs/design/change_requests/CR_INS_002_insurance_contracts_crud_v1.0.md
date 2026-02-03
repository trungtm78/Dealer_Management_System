# Change Request: CR-INS-002

## Document Information
- CR ID: **CR-INS-002**
- Type: **CUSTOMER-INITIATED CR**
- Version: 1.0
- Status: APPROVED
- Created Date: 30/01/2026
- Last Updated: 30/01/2026
- Author: Antigravity - Business Analyst
- Project: Honda SPICE ERP System

## 1. Request Information

### 1.1 Source
- Requested By: Honda SPICE ERP - Product Owner
- Role/Organization: Insurance Operations Team
- Request Date: 30/01/2026
- Request Channel: System Analysis & UI Reference Review

### 1.2 Request Summary
Insurance Contracts CRUD - Tạo màn hình quản lý hợp đồng bảo hiểm với đầy đủ CRUD operations, lifecycle management, và renewal workflow.

## 2. Business Context

### 2.1 Business Driver
- Driver: **Insurance Contract Management & Renewal Automation**
- Background: Quản lý lifecycle hợp đồng bảo hiểm từ DRAFT đến EXPIRED
- Urgency: **CRITICAL** (🔴)

### 2.2 Current State & Problems

**Insurance Contracts** quản lý hợp đồng bảo hiểm:
- **Types**: VCX (Vật chất xe), TNDS BB (Trách nhiệm dân sự bắt buộc), TNDS TN (Tự nguyện)
- **Lifecycle**: DRAFT → ACTIVE → EXPIRED/CANCELLED
- **Renewal**: Khi hợp đồng gần hết hạn, tạo hợp đồng mới (renewal)

**Vấn đề hiện tại**:
- Không có UI để quản lý contracts
- Không có renewal workflow
- Không track được expiring contracts

### 2.3 Business Impact

**Tác động nghiệp vụ**:
- ❌ **Manual Process**: Tạo contracts bằng tay → Slow & error-prone
- ❌ **Miss Renewals**: Không có alerts → Lost revenue
- ❌ **No Lifecycle Tracking**: Không biết contract ở stage nào

### 2.4 Desired State
- CRUD contracts qua UI
- Lifecycle management (DRAFT → ACTIVE → EXPIRED)
- Renewal workflow với pre-fill data
- Expiring contracts alerts

### 2.5 Business Value

**Expected Benefits:**
- Contract creation: 60% faster
- Renewal rate: Increase from 60% to 80%
- Data accuracy: 100% (no manual entry errors)
- Revenue: Capture all renewal opportunities

**Target Users:**
- Insurance Agents: Create, manage contracts
- Insurance Manager: Monitor contracts, approve renewals

**Success Metrics:**
- 80% renewal rate (up from 60%)
- 100% data accuracy
- 60% faster contract creation

### 2.6 ROI Estimate
- Investment: 3 ngày development
- Expected Return: 20% more renewals → 20% more commission
- Payback Period: ~1 month

## 3. Technical Feasibility

### 3.1 Feasibility Assessment
- Feasibility Level: **HIGH**
- Reasoning: 
  * Table đã có (insurance_contracts)
  * GET API đã có
  * Chỉ cần: POST, PATCH, DELETE APIs + UI

### 3.2 Complexity Assessment
- Complexity: **MODERATE**
- Reasoning:
  * Database: ✅ Đã có
  * API: ⚠️ Cần POST, PATCH, DELETE
  * UI: ❌ Chưa có
  * Renewal logic: MODERATE complexity

### 3.3 Risk Assessment
- Risk Level: **LOW**
- Key Risks:
  * Renewal logic complexity → **Mitigation**: Pre-fill form, validate dates
  * Edit conflicts với claims → **Mitigation**: Lock editing if claims pending

### 3.4 Dependencies
- **Blocking**: CR-INS-003 (Contract Detail)
- **Blocked by this**: None

## 4. Functional Requirements

### FR-INS-002-01: Create Contract

**Form fields**:
- `customer_id` (search dropdown từ Customers)
  * Searchable dropdown
  * Display: Customer name + phone
  * Required
  
- `vehicle_id` (optional, link to VIN)
  * Dropdown từ customer's vehicles
  * Display: Plate number + Model
  * Optional (có thể bảo hiểm không link vehicle)
  
- `insurance_type` (dropdown: VCX, TNDS BB, TNDS TN)
  * Required
  * VCX = Vật chất xe (comprehensive)
  * TNDS BB = Trách nhiệm dân sự bắt buộc (compulsory liability)
  * TNDS TN = Trách nhiệm dân sự tự nguyện (voluntary liability)
  
- `insurance_company` (dropdown: VNI, PTI, BIC, PVI)
  * Required
  * Predefined list of insurance companies
  
- `policy_number` (text, required)
  * Unique constraint
  * Format: Free text (each company has different format)
  
- `premium_amount` (VND, required)
  * Validation: > 0
  * Currency format
  
- `coverage_amount` (VND, required)
  * Validation: > premium_amount
  * Currency format
  
- `start_date`, `end_date` (date pickers)
  * Required
  * Validation: end_date > start_date
  * Default: end_date = start_date + 1 year
  
- `notes` (textarea)
  * Optional
  * Max 500 chars

**Validation**:
- All required fields must be filled
- policy_number must be unique
- end_date > start_date
- coverage_amount > premium_amount

**On Submit**:
- Create contract with status = DRAFT
- Navigate to Contract Detail page
- Show success message

### FR-INS-002-02: List Contracts

**Table columns**:
- Policy Number
- Customer (name + phone)
- Vehicle (Plate + Model)
- Type (VCX/TNDS BB/TNDS TN)
- Period (start_date - end_date)
- Premium (VND)
- Status (badge with color)
- Actions (View, Edit, Delete)

**Filters**:
- **Status** (multi-select)
  * DRAFT (gray)
  * ACTIVE (green)
  * EXPIRED (yellow)
  * CANCELLED (red)
  
- **Insurance Type** (multi-select)
  * VCX
  * TNDS BB
  * TNDS TN
  
- **Expiring within** (dropdown)
  * 7 days
  * 30 days
  * 90 days
  * Custom date range

**Search**:
- Policy Number (exact or partial match)
- Customer Name (partial match)
- Plate Number (exact or partial match)

**Sort**:
- Default: end_date ASC (expiring soonest first)
- Allow sort by: Policy Number, Customer, Premium, Start Date, End Date

**Pagination**: 20 items/page

### FR-INS-002-03: Update Contract

**Edit dialog**: Same form as Create

**Validation**:
- Không cho edit nếu có claims đang pending
- Check: `SELECT COUNT(*) FROM insurance_claims WHERE contract_id = ? AND status IN ('SUBMITTED', 'REVIEWING', 'APPROVED')`
- If count > 0: Show error "Cannot edit contract with pending claims"

**Allowed updates**:
- All fields except policy_number (immutable)
- Status can be changed: DRAFT → ACTIVE, ACTIVE → CANCELLED

**On Submit**:
- Update contract
- Log to activity_logs
- Show success message

### FR-INS-002-04: Delete Contract

**Soft delete**: status = CANCELLED

**Confirmation dialog**:
- Title: "Hủy hợp đồng bảo hiểm"
- Message: "Bạn có chắc muốn hủy hợp đồng {policy_number}? Hành động này không thể hoàn tác."
- Buttons: "Hủy bỏ", "Xác nhận"

**Validation**:
- Không cho delete nếu có claims đang pending
- Same check as Update

**On Confirm**:
- Set status = CANCELLED
- Set cancelled_at = NOW()
- Log to activity_logs
- Show success message

### FR-INS-002-05: Renewal Workflow

**Trigger**: User clicks "Gia hạn" button on expiring contract

**Action**:
- Navigate to Create Contract form
- Pre-fill fields từ old contract:
  * customer_id (same)
  * vehicle_id (same)
  * insurance_type (same)
  * insurance_company (same)
  * premium_amount (suggest same, allow edit)
  * coverage_amount (suggest same, allow edit)
  * start_date = old_end_date + 1 day
  * end_date = start_date + 1 year
  * notes = "Renewal from {old_policy_number}"
  
- Set `renewed_from_id` = old_contract_id
- Generate new policy_number (user can edit)

**On Submit**:
- Create new contract
- Link to old contract via `renewed_from_id`
- Update old contract: `renewed_to_id` = new_contract_id
- Show success message: "Hợp đồng đã được gia hạn thành công"

## 5. UI Reference

### 5.1 Refs Status
**Refs**: ✅ `InsurancePolicies.tsx` (lines 1-110)

**Key UI elements**:
- Alert banner: "3 policies expiring within 30 days"
- Table với status badges (green=Active, yellow=Expiring)
- "Days left" indicator cho expiring policies

### 5.2 Wireframe - List Contracts

```
┌─────────────────────────────────────────────────────────────────┐
│ Insurance Contracts                              [+ New Contract]│
├─────────────────────────────────────────────────────────────────┤
│ ⚠️ 3 policies expiring within 30 days                           │
├─────────────────────────────────────────────────────────────────┤
│ [Search: Policy/Customer/Plate...] [Status ▼] [Type ▼] [Expiring▼]│
├──────────┬──────────┬──────────┬──────┬──────────┬────────┬─────┤
│ Policy   │ Customer │ Vehicle  │ Type │ Period   │ Premium│ Act │
├──────────┼──────────┼──────────┼──────┼──────────┼────────┼─────┤
│ INS-001  │ Nguyễn A │ 29A-1234 │ VCX  │ 5 days   │ 5M₫    │ View│
│          │          │ City RS  │      │ left     │        │ Gia │
│          │          │          │      │          │        │ hạn │
├──────────┼──────────┼──────────┼──────┼──────────┼────────┼─────┤
│ INS-045  │ Trần B   │ 30B-6789 │ TNDS │ 12 days  │ 8M₫    │ View│
│          │          │ CR-V L   │ BB   │ left     │        │ Edit│
└──────────┴──────────┴──────────┴──────┴──────────┴────────┴─────┘
```

### 5.3 Wireframe - Create/Edit Contract

```
┌───────────────────────────────────────────────┐
│ Create Insurance Contract           [X Close]│
├───────────────────────────────────────────────┤
│ Customer*:       [Search customer...      ▼] │
│ Vehicle:         [Select vehicle...       ▼] │
│ Insurance Type*: [VCX                     ▼] │
│ Company*:        [VNI                     ▼] │
│ Policy Number*:  [                          ] │
│ Premium Amount*: [                        ]₫  │
│ Coverage Amount*:[                        ]₫  │
│ Start Date*:     [01/02/2026              📅] │
│ End Date*:       [01/02/2027              📅] │
│ Notes:           [                          ] │
│                  [                          ] │
│                                               │
│              [Cancel]  [Create Contract]      │
└───────────────────────────────────────────────┘
```

## 6. Acceptance Criteria

- [ ] Create contract form validation đầy đủ
- [ ] Create contract: All required fields validated
- [ ] Create contract: policy_number unique check
- [ ] Create contract: end_date > start_date validation
- [ ] Create contract: coverage_amount > premium_amount validation
- [ ] List contracts với search & filter
- [ ] List contracts: Search by policy number, customer, plate
- [ ] List contracts: Filter by status, type, expiring within
- [ ] List contracts: Sort by end_date ASC (default)
- [ ] List contracts: Pagination 20 items/page
- [ ] Update contract: Không cho edit nếu có active claims
- [ ] Update contract: Log to activity_logs
- [ ] Delete contract: Soft delete (status = CANCELLED)
- [ ] Delete contract: Không cho delete nếu có active claims
- [ ] Delete contract: Confirmation dialog
- [ ] Renewal workflow: Pre-fill form từ old contract
- [ ] Renewal workflow: Link old and new contracts
- [ ] Renewal workflow: Generate new policy_number
- [ ] API: POST /api/insurance/contracts
- [ ] API: PATCH /api/insurance/contracts/[id]
- [ ] API: DELETE /api/insurance/contracts/[id]
- [ ] API: POST /api/insurance/contracts/[id]/renew

## 7. Technical Notes

### 7.1 Current Status
**Database**: ✅ Table `insurance_contracts` đã có  
**API**: ⚠️ Thiếu POST, PATCH, DELETE  
**UI**: ❌ Chưa có

### 7.2 Database Schema Updates

**Add columns to insurance_contracts**:
```sql
ALTER TABLE insurance_contracts
ADD COLUMN renewed_from_id BIGINT NULL,
ADD COLUMN renewed_to_id BIGINT NULL,
ADD COLUMN cancelled_at TIMESTAMP NULL,
ADD FOREIGN KEY (renewed_from_id) REFERENCES insurance_contracts(id),
ADD FOREIGN KEY (renewed_to_id) REFERENCES insurance_contracts(id);
```

### 7.3 API Endpoints Needed

1. **POST /api/insurance/contracts**
   - Create new contract
   - Validate: policy_number unique, dates, amounts
   - Response: Created contract object

2. **PATCH /api/insurance/contracts/[id]**
   - Update contract
   - Validate: No pending claims
   - Response: Updated contract object

3. **DELETE /api/insurance/contracts/[id]**
   - Soft delete (status = CANCELLED)
   - Validate: No pending claims
   - Response: Success message

4. **POST /api/insurance/contracts/[id]/renew**
   - Create renewal contract
   - Link old and new contracts
   - Response: New contract object

### 7.4 Implementation Checklist

**Backend**:
1. [ ] POST /api/insurance/contracts
2. [ ] PATCH /api/insurance/contracts/[id]
3. [ ] DELETE /api/insurance/contracts/[id]
4. [ ] POST /api/insurance/contracts/[id]/renew
5. [ ] Add columns: renewed_from_id, renewed_to_id, cancelled_at

**Frontend**:
1. [ ] Page: app/(main)/insurance/contracts/page.tsx
2. [ ] Component: InsuranceContractsList.tsx
3. [ ] Form: InsuranceContractForm.tsx
4. [ ] Dialog: RenewalDialog.tsx

**Testing**:
1. [ ] Unit tests: Form validation
2. [ ] Integration tests: API endpoints
3. [ ] E2E tests: Create, Edit, Delete, Renew flows

## 8. Implementation Effort

### 8.1 Effort Breakdown
- **Backend APIs**: 1 day (4 endpoints)
- **Frontend List**: 1 day (table + filters)
- **Frontend Form**: 1 day (create/edit + renewal)
- **Total**: **3 days**

### 8.2 Dependencies
- **Blocks**: CR-INS-003 (Contract Detail)
- **Blocked by**: None

## 9. Evaluation & Approval

### 9.1 Evaluation Score

| Criterion | Score | Max |
|-----------|-------|-----|
| Business Value | 10 | 10 |
| Technical Feasibility | 9 | 10 |
| Resource Availability | 9 | 10 |
| Risk Assessment | 9 | 10 |
| Strategic Alignment | 10 | 10 |
| **TOTAL** | **47** | **50** |

### 9.2 Decision
**Decision**: APPROVED  
**Priority**: P0 (CRITICAL - 🔴)

### 9.3 Timeline
- **Planned Start**: 2026-02-17
- **Target Completion**: 2026-02-19 (3 days)
- **Phase**: Phase 2 - Insurance

## 10. Approval Record

- [x] Product Owner: Honda SPICE ERP Team - 30/01/2026
- [x] Tech Lead: Development Team Lead - 30/01/2026
- [x] Antigravity: Business Analyst - 30/01/2026

## 11. Change Log

### v1.0 (30/01/2026)
- Initial CR document created
- Status: APPROVED
- Priority: P0 (CRITICAL)
- Effort: 3 days
