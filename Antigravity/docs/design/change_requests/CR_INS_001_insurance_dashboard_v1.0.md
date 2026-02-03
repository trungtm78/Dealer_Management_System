# Change Request: CR-INS-001

## Document Information
- CR ID: **CR-INS-001**
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
Insurance Dashboard (Overview) - Tạo màn hình tổng quan cho nghiệp vụ bảo hiểm xe với KPIs, expiring policies alerts, và renewal rate tracking.

## 2. Business Context

### 2.1 Business Driver
- Driver: **Insurance Revenue Visibility & Customer Retention**
- Background: Insurance là revenue stream quan trọng với commission 10-15%
- Urgency: **CRITICAL** (🔴)

### 2.2 Current State & Problems

**Insurance Dashboard** là màn hình tổng quan cho nghiệp vụ bảo hiểm xe:
- **KPIs**: Active Policies, Claims In Progress, Premium YTD, Commission YTD
- **Alerts**: Policies expiring soon (renewal opportunity)
- **Renewal Rate**: Metric quan trọng để đánh giá customer retention

**Nghiệp vụ bảo hiểm xe**:
1. Dealer bán bảo hiểm cho khách hàng (VCX, TNDS)
2. Nhận hoa hồng từ công ty bảo hiểm (10-15% phí bảo hiểm)
3. Hỗ trợ khách hàng claim khi có sự cố

**Vấn đề hiện tại**:
- Không có dashboard → Không track được insurance performance
- Không có alerts → Miss renewal opportunities
- Không có renewal rate metric → Không đánh giá được retention

### 2.3 Business Impact

**Tác động nghiệp vụ**:
- ❌ **Revenue Loss**: Miss renewal opportunities → Lost commission
- ❌ **No Visibility**: Không biết insurance performance
- ❌ **Poor Retention**: Không track renewal rate

### 2.4 Desired State
- Dashboard hiển thị real-time insurance KPIs
- Alerts cho policies expiring soon
- Renewal rate tracking
- Quick actions: Create new policy, Renew policy

### 2.5 Business Value

**Expected Benefits:**
- Revenue visibility: 100% accurate insurance revenue tracking
- Renewal rate: Increase from 60% to 80% (proactive alerts)
- Commission tracking: Know exactly commission YTD
- Customer retention: Better tracking of expiring policies

**Target Users:**
- Insurance Manager: Monitor overall performance
- Insurance Agents: See expiring policies, take action

**Success Metrics:**
- Renewal rate: Increase from 60% to 80%
- Response time: Reduce from 7 days to 2 days for expiring policies
- Commission accuracy: 100%

### 2.6 ROI Estimate
- Investment: 3 ngày development
- Expected Return: 20% increase in renewal rate → 20% more commission
- Payback Period: ~1 month

## 3. Technical Feasibility

### 3.1 Feasibility Assessment
- Feasibility Level: **HIGH**
- Reasoning: 
  * Tables đã có (insurance_contracts, insurance_claims)
  * APIs đã có (GET endpoints)
  * Chỉ cần: Frontend dashboard + calculations

### 3.2 Complexity Assessment
- Complexity: **MODERATE**
- Reasoning:
  * Database: ✅ Đã có
  * API: ✅ Đã có (GET)
  * UI: ❌ Chưa có (cần tạo dashboard)
  * Calculations: Simple aggregations

### 3.3 Risk Assessment
- Risk Level: **LOW**
- Key Risks:
  * Performance với large dataset → **Mitigation**: Indexed queries, caching
  * Real-time updates → **Mitigation**: Polling every 30s

### 3.4 Dependencies
- **Blocking**: Không
- **Blocked by this**: CR-INS-002 (Contracts CRUD)

## 4. Functional Requirements

### FR-INS-001-01: KPI Cards

**4 KPI cards hiển thị**:

1. **Active Policies**
   - Query: `SELECT COUNT(*) FROM insurance_contracts WHERE status = 'ACTIVE'`
   - Display: Number + label
   - Color: Blue gradient
   - Icon: Shield icon

2. **Claims In Progress**
   - Query: `SELECT COUNT(*) FROM insurance_claims WHERE status IN ('SUBMITTED', 'REVIEWING', 'APPROVED')`
   - Display: Number + label
   - Color: Yellow gradient
   - Icon: File icon

3. **Premium YTD**
   - Query: `SELECT SUM(premium_amount) FROM insurance_contracts WHERE YEAR(start_date) = YEAR(NOW())`
   - Display: Currency format (VND)
   - Color: Green gradient
   - Icon: Money icon

4. **Commission YTD**
   - Calculation: `Premium YTD * 0.12` (12% commission rate)
   - Display: Currency format (VND)
   - Color: Purple gradient
   - Icon: Percent icon

**Auto-refresh**: Every 30 seconds

### FR-INS-001-02: Expiring Policies Widget

**List policies expiring soon**:
- Query: `SELECT * FROM insurance_contracts WHERE end_date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 30 DAY) AND status = 'ACTIVE' ORDER BY end_date ASC`
- Display columns:
  * Customer Name
  * Policy Number
  * Vehicle (Plate + Model)
  * Expiry Date
  * Days Left (calculated)
  * Premium Amount
  * Action button: "Gia hạn" (Renew)

**Alert styling**:
- Yellow banner: "3 policies expiring within 30 days"
- Red highlight: Policies expiring within 7 days
- Orange highlight: Policies expiring within 14 days

**Action button "Gia hạn"**:
- Navigate to: `/insurance/contracts/renew/[id]`
- Pre-fill form với data từ old contract:
  * Customer (same)
  * Vehicle (same)
  * Insurance type (same)
  * Premium (suggest same or updated)
  * Start date: old_end_date + 1 day
  * End date: start_date + 1 year

### FR-INS-001-03: Renewal Rate Chart

**Calculate renewal rate**:
```
Renewed Policies = COUNT(contracts WHERE renewed_from_id IS NOT NULL)
Expiring Policies = COUNT(contracts WHERE end_date < NOW() AND end_date >= DATE_SUB(NOW(), INTERVAL 30 DAY))
Renewal Rate = (Renewed Policies / Expiring Policies) * 100
```

**Display**:
- Circular progress chart
- Percentage: 75%
- Label: "Renewal Rate"
- Color: Green if >= 70%, Yellow if 50-70%, Red if < 50%

**Filter options**:
- This Month
- Last Month
- YTD (Year To Date)
- Custom date range

### FR-INS-001-04: Quick Actions

**Buttons**:
1. **"Tạo Hợp Đồng Mới"**
   - Navigate to: `/insurance/contracts/new`
   - Open create contract form

2. **"Xem Tất Cả Hợp Đồng"**
   - Navigate to: `/insurance/contracts`
   - Show contracts list

3. **"Xem Tất Cả Claims"**
   - Navigate to: `/insurance/claims`
   - Show claims list

## 5. UI Reference

### 5.1 Refs Status
**Refs**: ✅ `InsuranceOverview.tsx` (lines 1-140)

**Key UI elements**:
- 4 KPI cards với gradient backgrounds (blue, yellow, green, purple)
- Expiring policies list với yellow alert styling
- Renewal rate với circular progress

### 5.2 Wireframe - Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│ Insurance Dashboard                                             │
├─────────────────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│ │ 🛡️ 156   │ │ 📄 23    │ │ 💰 2.5B₫ │ │ 💯 300M₫ │            │
│ │ Active   │ │ Claims   │ │ Premium  │ │ Commis.  │            │
│ │ Policies │ │ Progress │ │ YTD      │ │ YTD      │            │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘            │
│                                                                 │
│ ⚠️ 3 policies expiring within 30 days                           │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ Customer    │ Policy  │ Vehicle    │ Expiry   │ Premium  │   │
│ ├─────────────┼─────────┼────────────┼──────────┼──────────┤   │
│ │ Nguyễn A    │ INS-001 │ 29A-12345  │ 5 days   │ 5M₫ [Gia │   │
│ │             │         │ City RS    │          │     hạn] │   │
│ ├─────────────┼─────────┼────────────┼──────────┼──────────┤   │
│ │ Trần B      │ INS-045 │ 30B-67890  │ 12 days  │ 8M₫ [Gia │   │
│ │             │         │ CR-V L     │          │     hạn] │   │
│ └─────────────┴─────────┴────────────┴──────────┴──────────┘   │
│                                                                 │
│ Renewal Rate:  ⭕ 75%                                           │
│                                                                 │
│ [Tạo Hợp Đồng Mới] [Xem Tất Cả Hợp Đồng] [Xem Tất Cả Claims]   │
└─────────────────────────────────────────────────────────────────┘
```

## 6. Acceptance Criteria

- [ ] Dashboard hiển thị 4 KPIs chính xác
- [ ] KPI: Active Policies count correct
- [ ] KPI: Claims In Progress count correct
- [ ] KPI: Premium YTD sum correct
- [ ] KPI: Commission YTD calculated correct (12% of Premium YTD)
- [ ] Expiring policies list: Show policies expiring within 30 days
- [ ] Expiring policies: Sort by expiry date ASC (soonest first)
- [ ] Expiring policies: Display days left
- [ ] Expiring policies: Red highlight if < 7 days, orange if < 14 days
- [ ] "Gia hạn" button: Navigate to renewal form
- [ ] "Gia hạn" button: Pre-fill form với data từ old contract
- [ ] Renewal rate: Calculate correctly
- [ ] Renewal rate: Display circular progress
- [ ] Renewal rate: Color coding (green/yellow/red)
- [ ] Renewal rate: Filter by This Month, Last Month, YTD
- [ ] "Tạo Hợp Đồng Mới" button: Navigate to create form
- [ ] "Xem Tất Cả Hợp Đồng" button: Navigate to contracts list
- [ ] "Xem Tất Cả Claims" button: Navigate to claims list
- [ ] Auto-refresh: KPIs update every 30 seconds

## 7. Technical Notes

### 7.1 Current Status
**Database**: ✅ Tables exist (insurance_contracts, insurance_claims)  
**API**: ✅ GET endpoints exist  
**UI**: ❌ Chưa có dashboard

### 7.2 API Endpoints Needed

**New endpoints**:
1. **GET /api/insurance/dashboard/kpis**
   - Response:
   ```json
   {
     "active_policies": 156,
     "claims_in_progress": 23,
     "premium_ytd": 2500000000,
     "commission_ytd": 300000000
   }
   ```

2. **GET /api/insurance/dashboard/expiring-policies**
   - Query params: `days=30` (default)
   - Response: Array of expiring policies

3. **GET /api/insurance/dashboard/renewal-rate**
   - Query params: `period=this_month|last_month|ytd`
   - Response:
   ```json
   {
     "renewed_count": 45,
     "expiring_count": 60,
     "renewal_rate": 75.0
   }
   ```

### 7.3 Implementation Checklist

**Backend**:
1. [ ] GET /api/insurance/dashboard/kpis
2. [ ] GET /api/insurance/dashboard/expiring-policies
3. [ ] GET /api/insurance/dashboard/renewal-rate

**Frontend**:
1. [ ] Page: app/(main)/insurance/dashboard/page.tsx
2. [ ] Component: InsuranceDashboard.tsx
3. [ ] Component: KPICards.tsx
4. [ ] Component: ExpiringPoliciesWidget.tsx
5. [ ] Component: RenewalRateChart.tsx

**Testing**:
1. [ ] Unit tests: KPI calculations
2. [ ] Integration tests: API endpoints
3. [ ] E2E tests: Dashboard rendering, auto-refresh

## 8. Implementation Effort

### 8.1 Effort Breakdown
- **Backend APIs**: 1 day (3 endpoints)
- **Frontend Dashboard**: 1.5 days (KPIs + widgets)
- **Charts**: 0.5 day (Renewal rate circular progress)
- **Total**: **3 days**

### 8.2 Dependencies
- **Blocks**: CR-INS-002
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
- **Planned Start**: 2026-02-14
- **Target Completion**: 2026-02-16 (3 days)
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
