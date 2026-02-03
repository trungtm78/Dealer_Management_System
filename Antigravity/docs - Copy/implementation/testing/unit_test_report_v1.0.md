# Unit Test Report v1.0

**Date**: 2026-01-28
**Role**: OpenCode – Unit Test Engineer
**Status**: 🟢 PASS (100%)

## 📊 Summary
| Total Tests | Passed | Failed | Skipped |
|-------------|--------|--------|---------|
| 8           | 8      | 0      | 0       |

## 📝 Test Results

### 1. Module: CRM - Leads (SCR-CRM-001)
| Test Case ID | Description | Result | Details |
|--------------|-------------|--------|---------|
| TC-CRM-LEAD-003 | createLead should apply default values (NEW, 10) | ✅ PASS | Verified status 'NEW' and score '10' are applied correctly. |
| TC-CRM-LEAD-004 | getLead should throw NotFoundException | ✅ PASS | Verified exception handling for non-existent lead IDs. |
| TC-CRM-LEAD-006 | deleteLead should apply soft delete (DEAD) | ✅ PASS | Verified status update to 'DEAD' instead of removal. |

### 2. Module: CRM - Customers (SCR-CRM-002)
| Test Case ID | Description | Result | Details |
|--------------|-------------|--------|---------|
| TC-CRM-CUS-002 | createCustomer should throw ConflictException if phone exists | ✅ PASS | Verified duplicate phone check logic. |
| TC-CRM-CUS-004 | addLoyaltyPoints should increment points and update tier | ✅ PASS | Verified automatic tier upgrade (BRONZE -> SILVER). |

### 3. API - DTO Validation
| Test Case ID | Description | Result | Details |
|--------------|-------------|--------|---------|
| TC-API-VAL-001 | CreateLeadDto: Name length validation | ✅ PASS | Fails if name < 2 chars. |
| TC-API-VAL-002 | CreateLeadDto: Phone length validation | ✅ PASS | Fails if phone < 10 or > 11 chars. |
| TC-API-VAL-003 | CreateLeadDto: Valid payload | ✅ PASS | Passes with correct data. |

## 🛠️ Issues Found
- **BUG-001**: `CreateLeadDto.phone` was using `@Max(11)` instead of `@MaxLength(11)`, causing validation to fail for phone numbers like "0123456789" (value > 11).
  - **Status**: FIXED in `src/modules/crm/leads/dto/leads.dto.ts`.

## 🏁 Conclusion
The core business logic and API validation for the CRM module are verified. The identified DTO validation bug was resolved to align with the API Specification.
