# Honda DMS - ERD Change Log

**Database**: PostgreSQL (Production) / SQLite (Demo)  
**Maintained By**: Data Design Authority

---

## Purpose

Document này ghi lại tất cả thay đổi của ERD qua các versions. Mọi thay đổi ERD **PHẢI** được ghi nhận tại đây.

---

## Change Log

### Version 1.0 - 2026-01-28

**Status**: ✅ **APPROVED** - Initial Release

**Author**: Antigravity - Data Design Authority

**Summary**: Initial ERD design cho Honda Dealer Management System

**Changes**:
- ✅ Created 49 tables across 8 modules
- ✅ Defined all relationships (52 relationships)
- ✅ Classified Master (10) vs Transaction (36) tables
- ✅ Defined indexes for performance
- ✅ Defined constraints (UNIQUE, NOT NULL, DEFAULT)
- ✅ Mapped all tables to FRD screens
- ✅ Documented JSON field structures
- ✅ Defined data lifecycle & status transitions

**Tables Added** (49):

**Module: Admin (3)**
1. `users`
2. `activity_logs`
3. `system_metrics`

**Module: CRM (8)**
4. `leads`
5. `customers`
6. `interactions`
7. `scoring_rules`
8. `reminders`
9. `loyalty_transactions`
10. `complaints`
11. `marketing_campaigns`

**Module: Sales (7)**
12. `quotations`
13. `test_drives`
14. `vins`
15. `contracts`
16. `deposits`
17. `pds_checklists`

**Module: Service (7)**
18. `service_quotes`
19. `service_appointments`
20. `repair_orders`
21. `ro_line_items`
22. `work_logs`
23. `qc_checklists`

**Module: Parts (9)**
24. `parts`
25. `suppliers`
26. `stock_movements`
27. `purchase_orders`
28. `po_line_items`
29. `stock_takes`
30. `stock_take_items`

**Module: Insurance (2)**
31. `insurance_contracts`
32. `insurance_claims`

**Module: Accounting (7)**
33. `invoices`
34. `payments`
35. `transactions`
36. `fixed_assets`
37. `depreciation_schedules`
38. `tax_declarations`

**Module: Supporting (6)**
39. `vehicle_models`
40. `accessories`
41. `services_catalog`

**Relationships Added** (52):
- 4 x 1:1 relationships
- 48 x 1:N relationships
- N:M via JSON fields

**Indexes Added**:
- Primary key indexes (auto)
- 15 business key indexes
- 8 foreign key indexes
- 6 status indexes
- 2 date indexes

**Assumptions**:
1. JSON fields cho accessories/services trong quotations (snapshot data)
2. Soft delete cho master data (status=INACTIVE)
3. Append-only cho audit logs (activity_logs, stock_movements, transactions)
4. Phone UNIQUE cho customers (nghiệp vụ VN)
5. Phone NOT UNIQUE cho leads (có thể trùng từ nhiều nguồn)

**Related Documents**:
- `honda_dms_erd_v1.0.dbml` - DBML source code
- `erd_description_v1.0.md` - ERD description
- `docs/design/database/dictionary/*.md` - Data dictionary

**Validation**:
- ✅ All tables traced to FRD screens
- ✅ No "orphan" tables
- ✅ No "convenience" tables
- ✅ All business rules from BRD/FRD reflected

**Migration Impact**: N/A (initial version)

---

## Change Request Template

### Version X.Y - YYYY-MM-DD

**Status**: 🔄 PENDING / ✅ APPROVED / ❌ REJECTED

**Author**: [Name]

**Related CR**: [CR-YYYY-NNN] (if applicable)

**Summary**: [Brief description]

**Changes**:
- [ ] Tables Added: [list]
- [ ] Tables Modified: [list]
- [ ] Tables Removed: [list]
- [ ] Relationships Added: [list]
- [ ] Relationships Modified: [list]
- [ ] Indexes Added: [list]
- [ ] Constraints Modified: [list]

**Rationale**: [Why this change is needed]

**Impact Analysis**:
- Frontend: [screens affected]
- Backend: [APIs affected]
- Migration: [data migration required?]

**Assumptions**: [any new assumptions]

**Validation**:
- [ ] Traced to FRD/BRD
- [ ] No orphan tables
- [ ] Migration script prepared
- [ ] Documentation updated

---

## Version History Summary

| Version | Date | Author | Tables | Changes | Status |
|---------|------|--------|--------|---------|--------|
| 1.0 | 2026-01-28 | Antigravity | 49 | Initial design | ✅ APPROVED |
| 1.1 | 2026-01-29 | Antigravity | 53 | +4 tables (RBAC + Settings) | ✅ APPROVED |
| 1.2 | 2026-01-30 | Antigravity | 56 | +3 tables (Bay Management) | ✅ APPROVED |

---

## Notes

### Change Management Process

1. **Propose Change**: Create CR in this log
2. **Review**: Data Design Authority reviews
3. **Approve**: Mark as APPROVED/REJECTED
4. **Implement**: Update DBML, description, dictionary
5. **Migrate**: Create migration script
6. **Deploy**: Execute migration

### Breaking Changes

**Breaking changes** (require data migration):
- Removing tables
- Removing columns
- Changing column types
- Adding NOT NULL constraints to existing columns

**Non-breaking changes**:
- Adding tables
- Adding columns (with DEFAULT)
- Adding indexes
- Modifying constraints (relaxing)

---

**End of Change Log**
