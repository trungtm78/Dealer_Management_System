# Unit Test Plan v1.0

**Date**: 2026-01-28
**Role**: OpenCode – Unit Test Engineer
**Scope**: Backend Service Logic, DTO Validation, and Domain Rules for CRM Module.

## 📋 Test Strategy
- **Framework**: Vitest
- **Mocking**: Prisma Client mocking using `vitest-mock-extended` (if available) or manual mocks.
- **Scope**: Focus on high-risk business logic identified in FRD and API Spec.

## 📊 Test Case Inventory

### 1. Module: CRM - Leads (SCR-CRM-001)
| Test Case ID | Test Scope | Description |
|--------------|------------|-------------|
| TC-CRM-LEAD-001 | listLeads Filtering | Verify leads are filtered by status and source correctly. |
| TC-CRM-LEAD-002 | listLeads Searching | Verify search works across name, phone, and email fields. |
| TC-CRM-LEAD-003 | createLead Defaults | Verify status 'NEW' and score '10' are applied on creation. |
| TC-CRM-LEAD-004 | getLead Handling | Verify NotFoundException is thrown for non-existent IDs. |
| TC-CRM-LEAD-005 | updateLead Logic | Verify partial updates and prevention of updates on 'WON' leads. |
| TC-CRM-LEAD-006 | deleteLead Soft Delete| Verify status is set to 'DEAD' instead of physical deletion. |
| TC-CRM-LEAD-007 | convertLead Flow | Verify customer creation and lead status update in transaction. |

### 2. Module: CRM - Customers (SCR-CRM-002)
| Test Case ID | Test Scope | Description |
|--------------|------------|-------------|
| TC-CRM-CUS-001 | listCustomers Filter | Verify 'INACTIVE' customers are excluded from listing. |
| TC-CRM-CUS-002 | createCustomer Dup | Verify ConflictException on duplicate phone numbers. |
| TC-CRM-CUS-003 | getCustomer Stats | Verify `total_spent` is aggregated correctly from contracts. |
| TC-CRM-CUS-004 | addLoyaltyPoints | Verify points increment and automatic tier upgrades. |

### 3. Module: CRM - Scoring (SCR-CRM-003)
| Test Case ID | Test Scope | Description |
|--------------|------------|-------------|
| TC-CRM-SCORE-001| updateScore | Verify manual score update and response format. |

## ⚙️ Environment Requirements
- Prisma Client generated.
- `vitest` and dependencies installed.
- Test database (SQLite in-memory or mock) configured.
