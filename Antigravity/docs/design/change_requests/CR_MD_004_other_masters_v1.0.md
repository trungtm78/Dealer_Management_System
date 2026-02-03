# Change Request: CR-MD-004

## Document Information
- CR ID: **CR-MD-004**
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
- Role/Organization: Business Operations Team
- Request Date: 30/01/2026
- Request Channel: System Analysis & Master Data Review

### 1.2 Request Summary
Remaining Master Data Management - Tạo màn hình quản lý cho ServiceBay, ScoringRule, và SystemSetting.

## 2. Business Context

### 2.1 Business Driver
- Driver: **Complete Master Data Coverage**
- Background: Hoàn thiện các master data còn lại
- Urgency: **HIGH** (🟡)

### 2.2 Current State & Problems

**3 Master Data entities còn thiếu UI**:
1. **ServiceBay**: Quản lý bays trong service center
2. **ScoringRule**: Quản lý lead scoring logic
3. **SystemSetting**: Quản lý system configuration

**Vấn đề hiện tại**:
- ServiceBay: Không thể quản lý bays → Hardcoded
- ScoringRule: Không thể customize scoring → Fixed logic
- SystemSetting: Không thể config qua UI → Phải sửa code

### 2.3 Business Impact

**Tác động nghiệp vụ**:
- ❌ **ServiceBay**: Không track bay utilization
- ❌ **ScoringRule**: Không customize lead scoring
- ❌ **SystemSetting**: Phải deploy code để change config

### 2.4 Desired State
- Có màn hình quản lý đầy đủ cho 3 entities
- Admin có thể CRUD qua UI
- No code changes needed for configuration

### 2.5 Business Value

**Expected Benefits:**
- ServiceBay: Track bay utilization, optimize scheduling
- ScoringRule: Customize scoring logic, improve lead quality
- SystemSetting: Change config without deployment

**Target Users:**
- Admin: Quản lý master data
- Service Manager: Quản lý bays
- Sales Manager: Customize scoring rules

**Success Metrics:**
- 100% master data có UI management
- 0 code deployments for config changes
- Bay utilization tracking enabled

### 2.6 ROI Estimate
- Investment: 7 ngày development
- Expected Return: Operational efficiency + flexibility
- Payback Period: ~3 months

## 3. Technical Feasibility

### 3.1 Feasibility Assessment
- Feasibility Level: **HIGH**
- Reasoning: 
  * Tables đã tồn tại
  * APIs đã có (GET/POST)
  * Chỉ cần: PATCH/DELETE + UI

### 3.2 Complexity Assessment
- Complexity: **MODERATE to HIGH**
- Reasoning:
  * ServiceBay: MODERATE (standard CRUD)
  * ScoringRule: HIGH (JSON editor + test simulator)
  * SystemSetting: MODERATE (type-safe editing)

### 3.3 Risk Assessment
- Risk Level: **MODERATE**
- Key Risks:
  * ScoringRule JSON editor UX → **Mitigation**: Use Monaco editor
  * SystemSetting type safety → **Mitigation**: Validate data_type

### 3.4 Dependencies
- **Blocking**: CR-MD-001, CR-MD-002, CR-MD-003
- **Blocked by this**: None

## 4. Functional Requirements

### 4.1 ServiceBay Management (2 ngày)

#### FR-MD-004-01: CRUD ServiceBay

**Create**: Form với fields:
- `name` (required): Bay name (e.g., "Bay 1", "Bay 2")
- `location` (optional): Physical location
- `capacity` (optional): Max vehicles
- `equipment` (JSON array): Equipment list
- `status` (ACTIVE/INACTIVE)
- `is_available` (boolean): Currently available

**Read**: Table với columns:
- Name, Location, Capacity, Equipment, Status, Availability

**Update**: Edit dialog

**Delete**: Soft delete

#### FR-MD-004-02: Equipment Configuration

**Equipment field**: JSON array
```json
["Lift", "Diagnostic Scanner", "Tire Changer", "Wheel Balancer"]
```

**UI**: Multi-select with custom input
- Predefined list: Common equipment
- Allow custom: Admin can add new equipment

#### FR-MD-004-03: Capacity Management

**Track bay utilization**:
- Current assignments: Count from BayAssignment table
- Capacity: Max vehicles
- Utilization %: (current / capacity) * 100

**Display**:
```
Bay 1: 2/3 vehicles (67% utilization)
Bay 2: 3/3 vehicles (100% utilization) [FULL]
Bay 3: 0/2 vehicles (0% utilization)
```

### 4.2 ScoringRule Management (3 ngày)

#### FR-MD-004-04: Visual Rule Builder

**JSON editor**: Monaco editor với syntax highlighting

**Rule structure**:
```json
{
  "name": "High Budget Lead",
  "category": "BUDGET",
  "condition": {
    "field": "budget",
    "operator": ">=",
    "value": 500000000
  },
  "points": 20,
  "is_active": true
}
```

**Operators**: =, !=, >, <, >=, <=, contains, in

**Fields**: budget, source, model_interest, contact_method

#### FR-MD-004-05: Test Simulator

**Input**: Sample lead data
**Output**: Calculated score + applied rules

**Example**:
```
Input Lead:
- Budget: 600,000,000₫
- Source: WEBSITE
- Model: City RS

Applied Rules:
✓ High Budget Lead (+20 points)
✓ Website Source (+10 points)
✓ Premium Model Interest (+15 points)

Total Score: 45 points (HOT)
```

### 4.3 SystemSetting Management (2 ngày)

#### FR-MD-004-06: Type-safe Editing

**Settings grouped by category**:
- General: Company info
- Email: SMTP settings
- SMS: API settings
- Notifications: Enable/disable

**Type-safe rendering**:
- `data_type: string` → Text input
- `data_type: number` → Number input
- `data_type: boolean` → Toggle switch
- `data_type: json` → JSON editor (Monaco)

**Example**:
```
Category: Email
─────────────────────────────────────
SMTP Host:     [smtp.gmail.com     ] (string)
SMTP Port:     [587                ] (number)
Use TLS:       ○ On  ● Off           (boolean)
From Address:  [noreply@honda.com  ] (string)
```

#### FR-MD-004-07: Category Grouping

**UI**: Tabs for categories
- Tab: General
- Tab: Email
- Tab: SMS
- Tab: Notifications
- Tab: Features

**Within each tab**: List of settings

## 5. UI Reference

### 5.1 Refs Status
**ServiceBay**: Không có trong Refs  
**ScoringRule**: `ScoringConfigDialog.tsx` (read-only, cần enhance)  
**SystemSetting**: Không có trong Refs

### 5.2 Wireframe - ServiceBay

```
┌─────────────────────────────────────────────────────────┐
│ Master Data / Service Bays                      [+ New] │
├─────────────────────────────────────────────────────────┤
│ Name   │ Location │ Capacity │ Utilization │ Status     │
├────────┼──────────┼──────────┼─────────────┼────────────┤
│ Bay 1  │ Area A   │ 3        │ 2/3 (67%)   │ AVAILABLE  │
│ Bay 2  │ Area A   │ 3        │ 3/3 (100%)  │ FULL       │
│ Bay 3  │ Area B   │ 2        │ 0/2 (0%)    │ AVAILABLE  │
└────────┴──────────┴──────────┴─────────────┴────────────┘
```

### 5.3 Wireframe - ScoringRule Test Simulator

```
┌───────────────────────────────────────────────┐
│ Test Scoring Rules                   [X Close]│
├───────────────────────────────────────────────┤
│ Sample Lead Data:                             │
│ Budget:        [600,000,000₫              ]   │
│ Source:        [WEBSITE               ▼]      │
│ Model:         [City RS               ▼]      │
│                                               │
│              [Calculate Score]                │
│                                               │
│ ┌─────────────────────────────────────────┐   │
│ │ Applied Rules:                          │   │
│ │ ✓ High Budget Lead        +20 points    │   │
│ │ ✓ Website Source          +10 points    │   │
│ │ ✓ Premium Model Interest  +15 points    │   │
│ │ ─────────────────────────────────────   │   │
│ │ Total Score: 45 points (HOT)            │   │
│ └─────────────────────────────────────────┘   │
└───────────────────────────────────────────────┘
```

## 6. Acceptance Criteria

**ServiceBay**:
- [ ] CRUD ServiceBay hoạt động
- [ ] Equipment configuration (JSON array)
- [ ] Capacity management
- [ ] Utilization tracking

**ScoringRule**:
- [ ] Visual rule builder (Monaco editor)
- [ ] Test simulator
- [ ] CRUD ScoringRule
- [ ] Validate JSON structure

**SystemSetting**:
- [ ] Type-safe editing
- [ ] Category grouping (tabs)
- [ ] CRUD SystemSetting
- [ ] Validate data_type

## 7. Technical Notes

### 7.1 Current Status
**Database**: ✅ All tables exist  
**API**: ⚠️ Thiếu PATCH, DELETE  
**UI**: ❌ Chưa có

### 7.2 Implementation Checklist

**ServiceBay**:
1. [ ] PATCH /api/service-bays/[id]
2. [ ] DELETE /api/service-bays/[id]
3. [ ] GET /api/service-bays/utilization
4. [ ] UI: ServiceBayManagement.tsx

**ScoringRule**:
1. [ ] PATCH /api/crm/scoring-rules/[id]
2. [ ] DELETE /api/crm/scoring-rules/[id]
3. [ ] POST /api/crm/scoring-rules/test
4. [ ] UI: ScoringRuleBuilder.tsx
5. [ ] UI: ScoringTestSimulator.tsx

**SystemSetting**:
1. [ ] PATCH /api/system-settings/[id]
2. [ ] UI: SystemSettingsManagement.tsx
3. [ ] Component: TypeSafeEditor.tsx

## 8. Implementation Effort

### 8.1 Effort Breakdown
- **ServiceBay**: 2 days
- **ScoringRule**: 3 days (JSON editor + simulator)
- **SystemSetting**: 2 days
- **Total**: **7 days**

### 8.2 Dependencies
- **Blocks**: None
- **Blocked by**: CR-MD-001, CR-MD-002, CR-MD-003

## 9. Evaluation & Approval

### 9.1 Evaluation Score

| Criterion | Score | Max |
|-----------|-------|-----|
| Business Value | 8 | 10 |
| Technical Feasibility | 8 | 10 |
| Resource Availability | 8 | 10 |
| Risk Assessment | 7 | 10 |
| Strategic Alignment | 8 | 10 |
| **TOTAL** | **39** | **50** |

### 9.2 Decision
**Decision**: APPROVED  
**Priority**: P1 (HIGH - 🟡)

### 9.3 Timeline
- **Planned Start**: 2026-03-21
- **Target Completion**: 2026-03-27 (7 days)
- **Phase**: Phase 4 - Integration

## 10. Approval Record

- [x] Product Owner: Honda SPICE ERP Team - 30/01/2026
- [x] Tech Lead: Development Team Lead - 30/01/2026
- [x] Antigravity: Business Analyst - 30/01/2026

## 11. Change Log

### v1.0 (30/01/2026)
- Initial CR document created
- Status: APPROVED
- Priority: P1 (HIGH)
- Effort: 7 days
