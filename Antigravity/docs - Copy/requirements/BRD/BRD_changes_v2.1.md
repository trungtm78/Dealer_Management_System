# BRD v2.1 - Change Summary

**Base Version**: v2.0  
**New Version**: v2.1  
**Date**: 2026-01-29  
**CR-ID**: CR-001

---

## Changes from v2.0

### Added Business Requirements (3 new BR sections)

#### BR-ADMIN-002: Permission Management

**Business Need**: Quản lý roles và permissions chi tiết để kiểm soát truy cập theo nguyên tắc least privilege.

**Key Requirements**:
- Define roles (ADMIN, MANAGER, SALES_REP, SERVICE_ADVISOR, etc.)
- Assign granular permissions per module (CRM, Sales, Service, Parts, Insurance, Accounting, Admin)
- Permission matrix review quarterly
- Audit trail for all permission changes
- Principle of least privilege enforcement

**Permission Modules**:
- CRM: leads.*, customers.*
- Sales: quotations.*, contracts.*, test_drives.*, deposits.*
- Service: appointments.*, repair_orders.*, work_logs.*
- Parts: inventory.*, purchase_orders.*
- Insurance: contracts.*, claims.*
- Accounting: invoices.*, payments.*, reports.view
- Admin: users.*, roles.*, permissions.*, audit.view, settings.*, monitoring.view

**Success Criteria**:
- 100% users có permissions phù hợp
- 0% unauthorized access
- Permission audit compliance 100%

---

#### BR-ADMIN-003: System Settings

**Business Need**: Cấu hình hệ thống tập trung để dễ quản lý và maintain.

**Setting Categories**:
1. **Email Settings**: SMTP config, templates
2. **SMS Settings**: Provider (FPT, Viettel, VNPT), API keys, templates
3. **Notification Settings**: Lead assignment, service reminders, low stock alerts
4. **General Settings**: Company info, business hours, currency, timezone, session timeout

**Key Requirements**:
- Sensitive settings (passwords, API keys) must be encrypted
- Setting changes logged to audit trail
- Critical settings require confirmation
- Backup settings before update
- "Reset to default" option available

**Success Criteria**:
- 100% settings có validation
- 0% system downtime do misconfiguration
- Settings backup tự động hàng ngày

---

#### BR-ADMIN-004: System Monitoring

**Business Need**: Giám sát hệ thống real-time để phát hiện và xử lý sự cố kịp thời.

**Monitoring Metrics**:
1. **System Health**: CPU, Memory, Disk space, Database size, API response time, Error rate
2. **Business Metrics**: Active users, Transactions/min, Failed logins, API calls/endpoint
3. **Database Metrics**: Query performance, Connection pool, Slow queries, Database locks

**Alert Thresholds**:
- ⚠️ Warning: CPU > 70%, Memory > 80%, Disk > 80%
- 🔴 Critical: CPU > 90%, Memory > 95%, Disk > 95%, Error rate > 5%, API response > 3s

**Key Requirements**:
- Metrics collect every 1 minute
- Metrics retention: 7 days (detailed), 90 days (aggregated)
- Critical alerts via Email + SMS
- Public health check endpoint
- Dashboard refresh every 30 seconds

**Success Criteria**:
- System uptime > 99.5%
- MTTD (Mean Time To Detect) < 5 minutes
- MTTR (Mean Time To Resolve) < 30 minutes
- 100% critical alerts responded within 15 minutes

---

## Change Log

| Version | Date | CR-ID | Changes | Author |
|---------|------|-------|---------|--------|
| 2.1 | 2026-01-29 | CR-001 | Added 3 BR sections: BR-ADMIN-002 (Permission Management), BR-ADMIN-003 (System Settings), BR-ADMIN-004 (System Monitoring) | Antigravity |
| 2.0 | 2026-01-28 | - | Initial business-focused BRD | Antigravity |

---

**Note**: For full BRD v2.0 content, refer to `BRD_Honda_DMS_v2.md`. This document only contains changes introduced in v2.1.

**End of BRD v2.1 Change Summary**
