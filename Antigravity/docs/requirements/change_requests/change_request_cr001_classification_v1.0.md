# CR-001: Complete Missing Screens Implementation

**Date**: 2026-01-29  
**Requested By**: Implementation Gap Analysis  
**CR-ID**: CR-001  
**Status**: Draft

---

## BƯỚC 1: PHÂN LOẠI

**Loại CR** (Multiple):
- ✅ Business logic change
- ✅ Functional flow change  
- ✅ Data model change
- ✅ API contract change
- ✅ UI/UX change

**Mức độ ảnh hưởng**: HIGH

---

## BƯỚC 2: IMPACT ANALYSIS

| Tài liệu | Bị ảnh hưởng | Lý do |
|----------|-------------|-------|
| BRD | **Yes** | Thiếu BR cho ADM-002, ADM-003, ADM-004 |
| FRD - Insurance | **Yes** | UI specs chưa đầy đủ cho INS-001, INS-002 |
| FRD - Admin | **Yes** | Thiếu functional specs cho 5 màn hình |
| ERD | **Yes** | Thiếu tables: roles, permissions, role_permissions, system_settings |
| API Spec - Insurance | **Yes** | Thiếu 5 APIs cho claims |
| API Spec - Admin | **Yes** | Thiếu 22 APIs cho admin module |
| UI Spec | **Yes** | Thiếu component specs cho 7 màn hình |
| UAT Plan | **Yes** | Thiếu 7 test suites |

**Total Impacted**: 8 documents

---

## Version Updates Required

| Document | Current | New | Type |
|----------|---------|-----|------|
| BRD | v2.0 | v2.1 | MINOR |
| FRD Insurance | v1.0 | v1.1 | MINOR |
| FRD Admin | v1.0 | v2.0 | MAJOR |
| ERD | v1.0 | v1.1 | MINOR |
| API Spec Insurance | v1.0 | v1.1 | MINOR |
| API Spec Admin | v1.0 | v2.0 | MAJOR |
| UI Spec | v1.0 | v1.1 | MINOR |
| UAT Plan | v1.1 | v1.2 | MINOR |

---

**Next**: BƯỚC 3 - Tạo 8 tài liệu version mới
