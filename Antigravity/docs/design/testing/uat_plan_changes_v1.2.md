# UAT Plan v1.2 - Change Summary

**Base Version**: v1.1  
**New Version**: v1.2  
**Date**: 2026-01-29  
**CR-ID**: CR-001

---

## Changes from v1.1

### Added UAT Test Suites (7 new suites)

#### UAT-INS-001: Insurance Contract Management
**Scenarios**: 5
- Create insurance contract
- Update contract details
- Renew contract (30 days before expiry)
- Upload contract documents
- Test reminder system (30, 15, 7 days before expiry)

**Pass Criteria**:
- Contract created with valid data
- Reminders sent on schedule
- Documents uploaded successfully
- Renewal workflow completes

---

#### UAT-INS-002: Insurance Claim Management
**Scenarios**: 6
- Create insurance claim
- Submit claim for review
- Approve claim (Manager role)
- Reject claim with reason
- Upload claim documents (photos, reports)
- Track claim settlement

**Pass Criteria**:
- Claim workflow (SUBMITTED → REVIEWING → APPROVED → PAID) works
- Manager approval required for claims > 10M VND
- Email notifications sent at each step
- Documents uploaded and viewable

---

#### UAT-ADM-001: User Management
**Scenarios**: 7
- Create new user
- Update user details
- Assign role to user
- Reset user password
- Deactivate user
- Bulk activate/deactivate users
- Test account lockout (5 failed logins)

**Pass Criteria**:
- CRUD operations work
- Password policy enforced
- Account lockout after 5 failures
- Bulk operations complete

---

#### UAT-ADM-002: Permission Management
**Scenarios**: 6
- Create custom role
- Assign permissions to role
- View permission matrix
- Update role permissions
- Assign role to user
- Test permission enforcement (access denied for unauthorized action)

**Pass Criteria**:
- Custom roles created
- Permissions assigned correctly
- Permission matrix displays accurately
- Access control enforced

---

#### UAT-ADM-003: Audit Logs
**Scenarios**: 4
- View audit logs with filters
- Filter by user, action, entity, date range
- Export logs to Excel
- Verify log entries for CRUD operations

**Pass Criteria**:
- All CRUD operations logged
- Filters work correctly
- Export generates valid Excel file
- Log retention (90 days) enforced

---

#### UAT-ADM-004: System Settings
**Scenarios**: 5
- View settings by category
- Update email settings
- Update SMS settings
- Update notification rules
- Reset settings to default

**Pass Criteria**:
- Settings updated and persisted
- Validation prevents invalid values
- Sensitive data encrypted
- Reset to default works

---

#### UAT-ADM-005: System Monitoring
**Scenarios**: 4
- View system metrics dashboard
- Test alert thresholds (Warning, Critical)
- Verify email/SMS alerts sent
- Check health endpoint

**Pass Criteria**:
- Dashboard displays real-time metrics
- Alerts triggered at correct thresholds
- Notifications sent via Email + SMS
- Health endpoint returns 200 OK

---

## Test Execution Summary

| Suite | Scenarios | Estimated Time | Priority |
|-------|-----------|----------------|----------|
| UAT-INS-001 | 5 | 2 hours | HIGH |
| UAT-INS-002 | 6 | 3 hours | HIGH |
| UAT-ADM-001 | 7 | 3 hours | CRITICAL |
| UAT-ADM-002 | 6 | 4 hours | CRITICAL |
| UAT-ADM-003 | 4 | 2 hours | HIGH |
| UAT-ADM-004 | 5 | 2 hours | MEDIUM |
| UAT-ADM-005 | 4 | 2 hours | MEDIUM |
| **TOTAL** | **37** | **18 hours** | - |

---

## Change Log

| Version | Date | CR-ID | Changes | Author |
|---------|------|-------|---------|--------|
| 1.2 | 2026-01-29 | CR-001 | Added 7 UAT test suites (37 scenarios) for Insurance and Admin modules | Antigravity |
| 1.1 | 2026-01-28 | CR-UAT-004 | Field name correction for RepairOrder | Antigravity |
| 1.0 | 2026-01-28 | - | Initial UAT plan | Antigravity |

---

**Total Test Suites**: 50+ (v1.1) → 57+ (v1.2) = +7

**End of UAT Plan v1.2 Change Summary**
