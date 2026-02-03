# FRD Module 06 - Insurance v1.1 - Change Summary

**Base Version**: v1.0  
**New Version**: v1.1  
**Date**: 2026-01-29  
**CR-ID**: CR-001

---

## Changes from v1.0

### SCR-INS-001: Insurance Contract Management - UI Enhancements

**Added UI Components**:
1. **InsuranceContractList.tsx** - Table with filters (status, provider, expiry date)
2. **InsuranceContractForm.tsx** - Create/Edit form with validation
3. **InsuranceContractDetail.tsx** - Detail view with contract info + claims history
4. **ReminderScheduler.tsx** - Automated reminder system (30, 15, 7 days before expiry)

**Added Features**:
- Document upload (contract PDF, customer ID, vehicle registration)
- Renewal workflow (auto-create renewal contract 30 days before expiry)
- Commission tracking
- Export to Excel

---

### SCR-INS-002: Insurance Claim Management - Full Specification

**Added UI Components**:
1. **InsuranceClaimList.tsx** - Table with filters (status, claim type, date range)
2. **InsuranceClaimForm.tsx** - Create claim form with incident details
3. **InsuranceClaimDetail.tsx** - Detail view with timeline + document gallery
4. **DocumentUploader.tsx** - Multi-file upload with preview

**Added Workflow**:
```
SUBMITTED → REVIEWING → APPROVED → PAID
           ↓
         REJECTED
```

**Added Features**:
- Claim approval workflow (Manager approval required for claims > 10M VND)
- Document management (photos, police report, repair estimates)
- Settlement tracking
- Email notifications at each workflow step

**Added Validation Rules**:
- Claim amount must not exceed coverage amount
- Incident date must be within contract period
- Required documents: Incident photos (min 3), Police report (for accidents), Repair estimate

---

## Change Log

| Version | Date | CR-ID | Changes | Author |
|---------|------|-------|---------|--------|
| 1.1 | 2026-01-29 | CR-001 | Added UI components and full functional specs for INS-001 and INS-002 | Antigravity |
| 1.0 | 2026-01-28 | - | Initial FRD for Insurance module | Antigravity |

---

**Note**: For full FRD Module 06 v1.0 content, refer to `FRD_Module_06_Insurance.md`. This document only contains changes introduced in v1.1.

**End of FRD Module 06 v1.1 Change Summary**
