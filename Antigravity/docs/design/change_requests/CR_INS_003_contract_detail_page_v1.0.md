# Change Request: CR-INS-003

## Document Information
- CR ID: **CR-INS-003**
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
Insurance Contract Detail - Tạo màn hình chi tiết hợp đồng bảo hiểm với đầy đủ thông tin, claims history, document management, và status transitions.

## 2. Business Context

### 2.1 Business Driver
- Driver: **Complete Contract Information & Document Management**
- Background: Contract Detail là central hub cho tất cả thông tin liên quan đến hợp đồng
- Urgency: **CRITICAL** (🔴)

### 2.2 Current State & Problems

**Contract Detail** hiển thị đầy đủ thông tin hợp đồng bảo hiểm:
- Customer info, Vehicle info
- Policy details (coverage, premium, period)
- Claims history (list of claims related to this contract)
- Documents (policy PDF, customer ID scan)

**Vấn đề hiện tại**:
- Không có detail page → Phải xem từng field riêng lẻ
- Không có claims history → Không biết contract có claims nào
- Không có document management → Documents scattered

### 2.3 Business Impact

**Tác động nghiệp vụ**:
- ❌ **Poor UX**: Không có overview page
- ❌ **No Claims Visibility**: Không biết contract có claims pending
- ❌ **Document Chaos**: Không có central document storage

### 2.4 Desired State
- Detail page hiển thị đầy đủ contract info
- Claims history integrated
- Document upload & preview
- Status transition buttons

### 2.5 Business Value

**Expected Benefits:**
- Complete visibility: 100% contract information in one place
- Claims tracking: See all claims for a contract
- Document management: Centralized storage
- Faster operations: 40% faster to find information

**Target Users:**
- Insurance Agents: View contract details, manage documents
- Insurance Manager: Review contracts, approve status changes

**Success Metrics:**
- 100% contract information visible
- 40% faster information lookup
- 100% documents stored centrally

### 2.6 ROI Estimate
- Investment: 3 ngày development
- Expected Return: Operational efficiency + better customer service
- Payback Period: ~2 months

## 3. Technical Feasibility

### 3.1 Feasibility Assessment
- Feasibility Level: **HIGH**
- Reasoning: 
  * Data đã có trong DB
  * APIs đã có (GET)
  * Chỉ cần: Frontend detail page + document upload

### 3.2 Complexity Assessment
- Complexity: **MODERATE**
- Reasoning:
  * Database: ✅ Đã có
  * API: ⚠️ Cần document upload endpoint
  * UI: ❌ Chưa có detail page
  * PDF viewer: Use library (react-pdf)

### 3.3 Risk Assessment
- Risk Level: **LOW**
- Key Risks:
  * PDF viewer performance → **Mitigation**: Lazy loading, pagination
  * Large file uploads → **Mitigation**: File size limit (10MB)

### 3.4 Dependencies
- **Blocking**: None
- **Blocked by this**: CR-INS-002 (Contracts CRUD)

## 4. Functional Requirements

### FR-INS-003-01: Contract Information Display

**Sections**:

1. **Policy Info**
   - Policy Number (large, prominent)
   - Insurance Type (badge with color)
   - Insurance Company (logo + name)
   - Status (badge: DRAFT/ACTIVE/EXPIRED/CANCELLED)
   - Created Date, Updated Date

2. **Customer Info**
   - Name (link to Customer Detail)
   - Phone (clickable to call)
   - Email (clickable to email)
   - Address (full address)
   - Customer ID

3. **Vehicle Info**
   - Plate Number (large, prominent)
   - Model (link to VehicleModel)
   - VIN
   - Year
   - Color

4. **Coverage Details**
   - Coverage Amount (VND, large)
   - Premium Amount (VND)
   - Deductible (if applicable)
   - Coverage Type (comprehensive/liability)

5. **Period**
   - Start Date
   - End Date
   - Days Remaining (calculated)
   - Progress bar (visual representation of time elapsed)
   - Alert if expiring within 30 days

**Layout**: Card-based layout với sections

### FR-INS-003-02: Claims History

**Table columns**:
- Claim Number (link to Claim Detail)
- Date (incident date)
- Type (COLLISION/THEFT/FIRE/FLOOD/OTHER)
- Claim Amount (VND)
- Approved Amount (VND)
- Status (badge)
- Actions (View)

**Click row**: Navigate to Claim Detail page

**Empty state**: "Chưa có claims nào cho hợp đồng này"

**Summary stats**:
- Total Claims: Count
- Total Claim Amount: Sum
- Total Approved Amount: Sum

### FR-INS-003-03: Document Management

**Document types**:
- Policy PDF (insurance policy document)
- Customer ID Scan (CMND/CCCD)
- Vehicle Registration (đăng ký xe)
- Other Documents

**Upload**:
- Button: "Upload Document"
- Dialog: Select document type, choose file
- Validation: File size < 10MB, types: PDF, JPG, PNG
- On upload: Store in cloud storage, save URL to DB

**Display**:
- List of documents với:
  * Document name
  * Type
  * Upload date
  * Uploaded by
  * File size
  * Actions: Preview, Download, Delete

**Preview**:
- PDF: Inline viewer (react-pdf)
- Images: Lightbox viewer
- Download button

### FR-INS-003-04: Status Transitions

**Workflow**: DRAFT → ACTIVE → EXPIRED/CANCELLED

**Button actions**:

1. **DRAFT status**:
   - Button: "Activate Contract"
   - Action: status = ACTIVE, activated_at = NOW()
   - Validation: All required fields filled
   - Confirmation: "Bạn có chắc muốn kích hoạt hợp đồng này?"

2. **ACTIVE status**:
   - Button: "Cancel Contract"
   - Action: status = CANCELLED, cancelled_at = NOW()
   - Validation: No pending claims
   - Confirmation: "Bạn có chắc muốn hủy hợp đồng này? Hành động này không thể hoàn tác."
   - Require: Cancellation reason (textarea)

3. **ACTIVE status (near expiry)**:
   - Button: "Renew Contract"
   - Action: Navigate to Create Contract form với pre-filled data
   - Pre-fill: Same as renewal workflow in CR-INS-002

**Permissions**:
- Insurance Agent: Can activate DRAFT
- Insurance Manager: Can cancel ACTIVE

### FR-INS-003-05: Activity Timeline

**Display timeline** of contract events:
- Created (date, by whom)
- Activated (date, by whom)
- Claims filed (date, claim number)
- Documents uploaded (date, document name)
- Status changes (date, from → to, by whom)
- Renewed (date, new contract link)

**Format**: Vertical timeline với icons

## 5. UI Reference

### 5.1 Refs Status
**Refs**: ✅ `InsurancePolicyDetail.tsx` (lines 1-300+)

### 5.2 Wireframe - Contract Detail

```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back to Contracts                                             │
├─────────────────────────────────────────────────────────────────┤
│ Policy: INS-001                              [ACTIVE] [Renew]   │
│ VCX - VNI Insurance                                             │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐    │
│ │ Customer Info   │ │ Vehicle Info    │ │ Coverage        │    │
│ │ Nguyễn Văn A    │ │ 29A-12345       │ │ 500,000,000₫    │    │
│ │ 0901234567      │ │ Honda City RS   │ │ Premium: 5M₫    │    │
│ │ nguyenvana@...  │ │ VIN: JHM...     │ │                 │    │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘    │
│                                                                 │
│ Period: 01/02/2026 - 01/02/2027 (335 days left)                │
│ [████████████████░░░░░░░░░░░░░░░] 80%                          │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Claims History (2)                                          │ │
│ ├──────────┬──────────┬──────────┬──────────┬────────┬───────┤ │
│ │ Claim #  │ Date     │ Type     │ Amount   │ Status │ View  │ │
│ ├──────────┼──────────┼──────────┼──────────┼────────┼───────┤ │
│ │ CLM-001  │ 15/03/26 │ COLLISION│ 10M₫     │ PAID   │ 👁    │ │
│ │ CLM-045  │ 20/05/26 │ THEFT    │ 50M₫     │ REVIEW │ 👁    │ │
│ └──────────┴──────────┴──────────┴──────────┴────────┴───────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Documents (3)                              [Upload Document]│ │
│ ├──────────────────────┬──────────┬──────────┬───────────────┤ │
│ │ Name                 │ Type     │ Date     │ Actions       │ │
│ ├──────────────────────┼──────────┼──────────┼───────────────┤ │
│ │ policy.pdf           │ Policy   │ 01/02/26 │ 👁 📥 🗑      │ │
│ │ cmnd_scan.jpg        │ ID       │ 01/02/26 │ 👁 📥 🗑      │ │
│ │ vehicle_reg.pdf      │ Vehicle  │ 01/02/26 │ 👁 📥 🗑      │ │
│ └──────────────────────┴──────────┴──────────┴───────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 6. Acceptance Criteria

- [ ] Display full contract info
- [ ] Policy Info section: Policy number, type, company, status
- [ ] Customer Info section: Name, phone, email, address
- [ ] Vehicle Info section: Plate, model, VIN, year
- [ ] Coverage section: Coverage amount, premium, deductible
- [ ] Period section: Start, end, days remaining, progress bar
- [ ] Alert if expiring within 30 days
- [ ] Claims history table
- [ ] Claims history: Display all claims for contract
- [ ] Claims history: Click row → Navigate to Claim Detail
- [ ] Claims history: Summary stats (total claims, amounts)
- [ ] Document upload & preview
- [ ] Document upload: Support PDF, JPG, PNG (max 10MB)
- [ ] Document preview: PDF inline viewer
- [ ] Document preview: Image lightbox
- [ ] Document actions: Preview, Download, Delete
- [ ] Status transition buttons
- [ ] DRAFT: "Activate" button → status = ACTIVE
- [ ] ACTIVE: "Cancel" button → status = CANCELLED (with reason)
- [ ] ACTIVE (near expiry): "Renew" button → Pre-fill renewal form
- [ ] Permissions: Agent can activate, Manager can cancel
- [ ] Activity timeline
- [ ] Timeline: Show all contract events
- [ ] API: GET /api/insurance/contracts/[id]
- [ ] API: POST /api/insurance/contracts/[id]/documents
- [ ] API: PATCH /api/insurance/contracts/[id]/status

## 7. Technical Notes

### 7.1 Current Status
**Database**: ✅ Table exists  
**API**: ⚠️ Thiếu document upload, status transition  
**UI**: ❌ Chưa có detail page

### 7.2 Database Schema Updates

**New table**: `insurance_contract_documents`
```sql
CREATE TABLE insurance_contract_documents (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  contract_id BIGINT NOT NULL,
  document_type ENUM('POLICY','ID','VEHICLE_REG','OTHER') NOT NULL,
  document_name VARCHAR(255) NOT NULL,
  document_url VARCHAR(500) NOT NULL,
  file_size BIGINT,
  uploaded_by BIGINT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contract_id) REFERENCES insurance_contracts(id),
  FOREIGN KEY (uploaded_by) REFERENCES User(id)
);
```

### 7.3 API Endpoints Needed

1. **GET /api/insurance/contracts/[id]**
   - Get full contract details
   - Include: customer, vehicle, claims, documents
   - Response: Contract object with nested data

2. **POST /api/insurance/contracts/[id]/documents**
   - Upload document
   - Validate: File size, type
   - Store: Cloud storage (S3/Azure Blob)
   - Response: Document object

3. **DELETE /api/insurance/contracts/[id]/documents/[doc_id]**
   - Delete document
   - Remove from cloud storage
   - Response: Success message

4. **PATCH /api/insurance/contracts/[id]/status**
   - Update contract status
   - Validate: Workflow rules, permissions
   - Log: Activity timeline
   - Response: Updated contract

### 7.4 Implementation Checklist

**Backend**:
1. [ ] Create table: insurance_contract_documents
2. [ ] GET /api/insurance/contracts/[id] (enhance with nested data)
3. [ ] POST /api/insurance/contracts/[id]/documents
4. [ ] DELETE /api/insurance/contracts/[id]/documents/[doc_id]
5. [ ] PATCH /api/insurance/contracts/[id]/status
6. [ ] Cloud storage integration (S3/Azure)

**Frontend**:
1. [ ] Page: app/(main)/insurance/contracts/[id]/page.tsx
2. [ ] Component: ContractDetailHeader.tsx
3. [ ] Component: ContractInfoCards.tsx
4. [ ] Component: ClaimsHistoryTable.tsx
5. [ ] Component: DocumentManager.tsx
6. [ ] Component: ActivityTimeline.tsx
7. [ ] Component: PDFViewer.tsx (react-pdf)

## 8. Implementation Effort

### 8.1 Effort Breakdown
- **Backend APIs**: 1 day (4 endpoints + cloud storage)
- **Frontend Detail Page**: 1.5 days (layout + components)
- **Document Management**: 0.5 day (upload + preview)
- **Total**: **3 days**

### 8.2 Dependencies
- **Blocks**: None
- **Blocked by**: CR-INS-002

## 9. Evaluation & Approval

### 9.1 Evaluation Score

| Criterion | Score | Max |
|-----------|-------|-----|
| Business Value | 9 | 10 |
| Technical Feasibility | 9 | 10 |
| Resource Availability | 9 | 10 |
| Risk Assessment | 9 | 10 |
| Strategic Alignment | 9 | 10 |
| **TOTAL** | **45** | **50** |

### 9.2 Decision
**Decision**: APPROVED  
**Priority**: P0 (CRITICAL - 🔴)

### 9.3 Timeline
- **Planned Start**: 2026-02-20
- **Target Completion**: 2026-02-22 (3 days)
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
