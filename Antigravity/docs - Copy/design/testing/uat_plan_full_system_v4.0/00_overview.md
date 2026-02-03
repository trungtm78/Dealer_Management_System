# Honda DMS - UAT Plan v4.0 - Overview

**Version**: 4.0  
**Date**: 2026-01-29  
**Author**: Antigravity - System UAT Authority  
**Format**: EXPLICIT - Split Into Multiple Files

---

## 📋 Document Structure

UAT Plan v4.0 được chia thành 10 files riêng biệt để dễ quản lý và execute:

| File | Module | Scenarios | Pages |
|------|--------|-----------|-------|
| `00_overview.md` | Overview | - | 5 |
| `01_admin.md` | Admin | 15 | 12 |
| `02_crm.md` | CRM | 60 | 48 |
| `03_sales.md` | Sales | 55 | 44 |
| `04_service.md` | Service | 55 | 44 |
| `05_parts.md` | Parts | 60 | 48 |
| `06_insurance.md` | Insurance | 20 | 16 |
| `07_accounting.md` | Accounting | 50 | 40 |
| `08_supporting.md` | Supporting | 30 | 24 |
| `09_coverage_matrix.md` | Coverage Matrix | - | 10 |
| **TOTAL** | - | **359** | **~291** |

---

## 🎯 UAT Objectives

### Primary Goal
Verify TOÀN BỘ storage operations (CRUD + File + State + Delete) cho 49 entities theo ERD v1.0

### Key Principles
1. ✅ UAT theo ENTITY (không theo màn hình)
2. ✅ UAT theo STORAGE ACTION (CRUD + File + State)
3. ✅ DELETE phải test riêng (soft/hard/FK)
4. ✅ Không bỏ sót bất kỳ entity nào

---

## 📊 Coverage Summary

| Metric | Value |
|--------|-------|
| **Total Entities** | 49 |
| **Total Scenarios** | 359 |
| **CREATE Coverage** | 49/49 (100%) |
| **UPDATE Coverage** | 43/49 (88%) |
| **DELETE Coverage** | 46/49 (94%) |
| **FILE Coverage** | 12/12 (100%) |
| **STATUS Coverage** | 35/35 (100%) |
| **VALIDATION Coverage** | 49/49 (100%) |
| **FK Coverage** | 32/32 (100%) |

---

## 🎯 Scenario Organization

### By Action Type

| Action Type | Scenarios | Description |
|-------------|-----------|-------------|
| **CREATE** | 49 | Create entity successfully |
| **UPDATE** | 43 | Update entity and persist |
| **FILE** | 24 | Upload/attach files |
| **STATUS** | 35 | Change status/workflow |
| **VALIDATION** | 98 | Validation errors |
| **DELETE-SOFT** | 36 | Soft delete (flag) |
| **DELETE-HARD** | 10 | Hard delete (remove) |
| **DELETE-FK** | 64 | FK constraint tests |

---

## 📋 Scenario Template

Mỗi scenario trong UAT Plan v4.0 có cấu trúc:

```markdown
### UAT-{MODULE}-{NUM}-{ACTION}: {Title}

**Scenario ID**: UAT-{MODULE}-{NUM}-{ACTION}
**Module**: {Module Name}
**Entity**: {Entity Name}
**Action**: {Action Type}
**Priority**: P0/P1/P2/P3

**Preconditions**:
- {Precondition 1}
- {Precondition 2}

**Test Steps**:
1. {Step 1}
2. {Step 2}
3. {Step 3}

**Expected UI Result**:
- ✅ {Expected UI behavior 1}
- ✅ {Expected UI behavior 2}

**Expected DB Result**:
- ✅ {Expected DB state 1}
- ✅ {Expected DB state 2}

**ERD Constraints Verified**:
- ✅ {Constraint 1}
- ✅ {Constraint 2}

**Pass Criteria**: {Clear pass/fail criteria}
```

---

## 🎯 Priority Levels

| Priority | Description | Examples |
|----------|-------------|----------|
| **P0** | Critical - Core business flow | Create Customer, Delete with FK |
| **P1** | High - Important features | Update, Status change |
| **P2** | Medium - Supporting features | File upload, Validation |
| **P3** | Low - Nice-to-have | System metrics, Logs |

---

## ✅ Quality Gates

| Gate | Requirement | Status |
|------|-------------|--------|
| **Entity Coverage** | 100% | ✅ PASS |
| **CREATE Coverage** | 100% | ✅ PASS |
| **UPDATE Coverage** | ≥85% | ✅ PASS |
| **DELETE Coverage** | ≥90% | ✅ PASS |
| **FILE Coverage** | 100% | ✅ PASS |
| **VALIDATION Coverage** | 100% | ✅ PASS |
| **FK Coverage** | 100% | ✅ PASS |

---

## 🚀 Execution Plan

### Phase 1: Create & Update (Weeks 1-2)
- Execute CREATE scenarios (49)
- Execute UPDATE scenarios (43)
- **Target**: 92 scenarios, ~30 hours

### Phase 2: File & Status (Week 3)
- Execute FILE scenarios (24)
- Execute STATUS scenarios (35)
- **Target**: 59 scenarios, ~20 hours

### Phase 3: Validation (Week 4)
- Execute VALIDATION scenarios (98)
- **Target**: 98 scenarios, ~32 hours

### Phase 4: DELETE Operations (Weeks 5-6)
- Execute SOFT DELETE scenarios (36)
- Execute HARD DELETE scenarios (10)
- Execute FK CONSTRAINT scenarios (64)
- **Target**: 110 scenarios, ~36 hours

### Phase 5: Regression (Week 7)
- Re-run all P0 scenarios (~100)
- **Target**: ~30 hours

**Total**: 148 hours (7 weeks)

---

## 📂 How to Use This UAT Plan

### For Testers

1. **Start with Overview** (this file)
2. **Choose Module** (e.g., `02_crm.md`)
3. **Execute Scenarios** one by one
4. **Record Results** in Coverage Matrix (`09_coverage_matrix.md`)
5. **Report Failures** to Antigravity for classification

### For Managers

1. **Review Coverage Matrix** (`09_coverage_matrix.md`)
2. **Track Progress** by module
3. **Monitor Pass Rate** (target: ≥95%)

### For Developers (OpenCode)

1. **Review Failed Scenarios**
2. **Fix Bugs** as directed by Antigravity
3. **Re-run Tests** after fixes

---

## 🚨 Critical Rules

1. **DELETE is MANDATORY**: Every deletable entity MUST have delete test
2. **FK Constraints**: MUST verify CASCADE/RESTRICT/SET NULL behavior
3. **Soft vs Hard**: Clearly distinguish soft delete (flag) vs hard delete (remove)
4. **Append-Only Tables**: No UPDATE/DELETE tests (e.g., activity_logs, transactions)
5. **Reload Verification**: ALWAYS reload page after create/update to verify persistence

---

## 📊 Module Summary

| Module | Entities | Scenarios | File |
|--------|----------|-----------|------|
| Admin | 3 | 15 | `01_admin.md` |
| CRM | 8 | 60 | `02_crm.md` |
| Sales | 7 | 55 | `03_sales.md` |
| Service | 7 | 55 | `04_service.md` |
| Parts | 9 | 60 | `05_parts.md` |
| Insurance | 2 | 20 | `06_insurance.md` |
| Accounting | 7 | 50 | `07_accounting.md` |
| Supporting | 6 | 30 | `08_supporting.md` |

---

## ✅ Approval

**Status**: ✅ APPROVED FOR EXECUTION

**Approved By**: Antigravity - System UAT Authority  
**Date**: 2026-01-29  
**Version**: 4.0

**Approval Criteria Met**:
- ✅ All 49 entities covered
- ✅ No entity omitted
- ✅ DELETE coverage ≥90%
- ✅ All quality gates passed
- ✅ Explicit scenarios documented
- ✅ Split into manageable files

---

**Maintained By**: Antigravity (System UAT Authority)  
**Last Updated**: 2026-01-29  
**Version**: 4.0  
**Next Review**: After UAT execution

---

**End of Overview**
