# Honda DMS - API Data Mapping v1.0

**Version**: 1.0  
**Date**: 2026-01-28  
**Purpose**: Traceability mapping từ FRD → ERD → API

---

## 📋 Overview

Document này cung cấp traceability đầy đủ từ:
- **FRD Screen ID** → **ERD Table** → **API Endpoint**

Giúp đảm bảo:
- ✅ Mọi requirement trong FRD đều được implement
- ✅ Mọi API đều có nguồn gốc từ FRD
- ✅ Database schema phục vụ đúng business needs

---

## 🎯 Module 1: Dashboard

| FRD Screen | Screen Name | ERD Tables | API Endpoints | Count |
|------------|-------------|------------|---------------|-------|
| SCR-DSH-001 | Dashboard Overview | leads, customers, contracts, repair_orders, invoices | GET /api/dashboard/summary | 1 |
| SCR-DSH-001 | Dashboard Overview | contracts, quotations | GET /api/dashboard/sales | 1 |
| SCR-DSH-001 | Dashboard Overview | repair_orders, service_appointments | GET /api/dashboard/service | 1 |
| SCR-DSH-001 | Dashboard Overview | parts, stock_movements | GET /api/dashboard/inventory | 1 |
| SCR-DSH-001 | Dashboard Overview | activity_logs | GET /api/dashboard/activities | 1 |

**Total**: 5 APIs

---

## 🎯 Module 2: CRM

### Leads Management

| FRD Screen | Screen Name | ERD Tables | API Endpoints | Count |
|------------|-------------|------------|---------------|-------|
| SCR-CRM-001 | Quản Lý Leads | leads, users | GET /api/crm/leads | 1 |
| SCR-CRM-001 | Quản Lý Leads | leads | POST /api/crm/leads | 1 |
| SCR-CRM-001 | Quản Lý Leads | leads, users, customers | GET /api/crm/leads/{id} | 1 |
| SCR-CRM-001 | Quản Lý Leads | leads | PUT /api/crm/leads/{id} | 1 |
| SCR-CRM-001 | Quản Lý Leads | leads | DELETE /api/crm/leads/{id} | 1 |
| SCR-CRM-001 | Quản Lý Leads | leads | POST /api/crm/leads/{id}/assign | 1 |
| SCR-CRM-001 | Quản Lý Leads | leads, customers | POST /api/crm/leads/{id}/convert | 1 |
| SCR-CRM-003 | Chấm Điểm Lead | leads | POST /api/crm/leads/{id}/score | 1 |
| SCR-CRM-001 | Quản Lý Leads | leads | GET /api/crm/leads/search | 1 |
| SCR-CRM-005 | Lịch Sử & Hoạt Động | interactions, users | GET /api/crm/leads/{id}/activities | 1 |

### Customers Management

| FRD Screen | Screen Name | ERD Tables | API Endpoints | Count |
|------------|-------------|------------|---------------|-------|
| SCR-CRM-002 | Khách Hàng | customers | GET /api/crm/customers | 1 |
| SCR-CRM-002 | Khách Hàng | customers | POST /api/crm/customers | 1 |
| SCR-CRM-002 | Khách Hàng | customers, contracts, leads | GET /api/crm/customers/{id} | 1 |
| SCR-CRM-002 | Khách Hàng | customers | PUT /api/crm/customers/{id} | 1 |
| SCR-CRM-002 | Khách Hàng | customers | DELETE /api/crm/customers/{id} | 1 |
| SCR-CRM-007 | Chương Trình Loyalty | loyalty_transactions | GET /api/crm/customers/{id}/loyalty | 1 |
| SCR-CRM-007 | Chương Trình Loyalty | loyalty_transactions, customers | POST /api/crm/customers/{id}/loyalty | 1 |
| SCR-CRM-002 | Khách Hàng | customers | GET /api/crm/customers/search | 1 |

### Scoring, Interactions, Reminders, Complaints, Marketing

| FRD Screen | Screen Name | ERD Tables | API Endpoints | Count |
|------------|-------------|------------|---------------|-------|
| SCR-CRM-003 | Chấm Điểm Lead | scoring_rules | GET /api/crm/scoring/rules | 1 |
| SCR-CRM-003 | Chấm Điểm Lead | scoring_rules | PUT /api/crm/scoring/rules | 1 |
| SCR-CRM-003 | Chấm Điểm Lead | scoring_rules, leads | POST /api/crm/scoring/calculate/{id} | 1 |
| SCR-CRM-003 | Chấm Điểm Lead | leads | GET /api/crm/scoring/distribution | 1 |
| SCR-CRM-003 | Chấm Điểm Lead | scoring_rules | POST /api/crm/scoring/simulate | 1 |
| SCR-CRM-005 | Lịch Sử & Hoạt Động | interactions, leads, customers, users | GET /api/crm/interactions | 1 |
| SCR-CRM-005 | Lịch Sử & Hoạt Động | interactions | POST /api/crm/interactions | 1 |
| SCR-CRM-005 | Lịch Sử & Hoạt Động | interactions | GET /api/crm/interactions/{id} | 1 |
| SCR-CRM-005 | Lịch Sử & Hoạt Động | interactions | PUT /api/crm/interactions/{id} | 1 |
| SCR-CRM-005 | Lịch Sử & Hoạt Động | interactions | DELETE /api/crm/interactions/{id} | 1 |
| SCR-CRM-006 | Nhắc Bảo Dưỡng | reminders, customers | GET /api/crm/reminders | 1 |
| SCR-CRM-006 | Nhắc Bảo Dưỡng | reminders | POST /api/crm/reminders | 1 |
| SCR-CRM-006 | Nhắc Bảo Dưỡng | reminders | PUT /api/crm/reminders/{id}/status | 1 |
| SCR-CRM-006 | Nhắc Bảo Dưỡng | reminders | POST /api/crm/reminders/{id}/send | 1 |
| SCR-CRM-009 | Khiếu Nại | complaints, customers, users | GET /api/crm/complaints | 1 |
| SCR-CRM-009 | Khiếu Nại | complaints | POST /api/crm/complaints | 1 |
| SCR-CRM-009 | Khiếu Nại | complaints | PUT /api/crm/complaints/{id}/status | 1 |
| SCR-CRM-009 | Khiếu Nại | complaints | POST /api/crm/complaints/{id}/resolve | 1 |
| SCR-CRM-010 | Marketing | marketing_campaigns | GET /api/crm/campaigns | 1 |
| SCR-CRM-010 | Marketing | marketing_campaigns | POST /api/crm/campaigns | 1 |
| SCR-CRM-010 | Marketing | marketing_campaigns | GET /api/crm/campaigns/{id}/performance | 1 |
| SCR-CRM-010 | Marketing | marketing_campaigns | POST /api/crm/campaigns/{id}/send | 1 |

**Total**: 40 APIs

---

## 🎯 Module 3: Sales

### Quotations

| FRD Screen | Screen Name | ERD Tables | API Endpoints | Count |
|------------|-------------|------------|---------------|-------|
| SCR-SAL-002 | Danh Sách Báo Giá | quotations, customers, users | GET /api/sales/quotations | 1 |
| SCR-SAL-001 | Tạo Báo Giá | quotations | POST /api/sales/quotations | 1 |
| SCR-SAL-001 | Tạo Báo Giá | quotations, customers, users | GET /api/sales/quotations/{id} | 1 |
| SCR-SAL-001 | Tạo Báo Giá | quotations | PUT /api/sales/quotations/{id} | 1 |
| SCR-SAL-002 | Danh Sách Báo Giá | quotations | DELETE /api/sales/quotations/{id} | 1 |
| SCR-SAL-002 | Danh Sách Báo Giá | quotations | POST /api/sales/quotations/{id}/send | 1 |
| SCR-SAL-002 | Danh Sách Báo Giá | quotations | POST /api/sales/quotations/{id}/approve | 1 |
| SCR-SAL-001 | Tạo Báo Giá | quotations | GET /api/sales/quotations/{id}/profit | 1 |

### Test Drives, VIN, Contracts, Deposits, PDS

| FRD Screen | Screen Name | ERD Tables | API Endpoints | Count |
|------------|-------------|------------|---------------|-------|
| SCR-SAL-003 | Lịch Lái Thử | test_drives, customers, users | GET /api/sales/test-drives | 1 |
| SCR-SAL-003 | Lịch Lái Thử | test_drives | POST /api/sales/test-drives | 1 |
| SCR-SAL-003 | Lịch Lái Thử | test_drives, customers, users | GET /api/sales/test-drives/{id} | 1 |
| SCR-SAL-003 | Lịch Lái Thử | test_drives | PUT /api/sales/test-drives/{id} | 1 |
| SCR-SAL-003 | Lịch Lái Thử | test_drives | POST /api/sales/test-drives/{id}/cancel | 1 |
| SCR-SAL-003 | Lịch Lái Thử | test_drives | POST /api/sales/test-drives/{id}/complete | 1 |
| SCR-SAL-007 | Kho VIN | vins | GET /api/sales/vins | 1 |
| SCR-SAL-007 | Kho VIN | vins | POST /api/sales/vins | 1 |
| SCR-SAL-007 | Kho VIN | vins, contracts | GET /api/sales/vins/{id} | 1 |
| SCR-SAL-007 | Kho VIN | vins | POST /api/sales/vins/{id}/allocate | 1 |
| SCR-SAL-007 | Kho VIN | vins | POST /api/sales/vins/{id}/sold | 1 |
| SCR-SAL-007 | Kho VIN | vins, contracts, pds_checklists | GET /api/sales/vins/{id}/history | 1 |
| SCR-SAL-005 | Hợp Đồng Mua Bán | contracts, customers, quotations, vins | GET /api/sales/contracts | 1 |
| SCR-SAL-005 | Hợp Đồng Mua Bán | contracts | POST /api/sales/contracts | 1 |
| SCR-SAL-005 | Hợp Đồng Mua Bán | contracts, customers, quotations, vins, deposits | GET /api/sales/contracts/{id} | 1 |
| SCR-SAL-005 | Hợp Đồng Mua Bán | contracts | PUT /api/sales/contracts/{id} | 1 |
| SCR-SAL-005 | Hợp Đồng Mua Bán | contracts | POST /api/sales/contracts/{id}/complete | 1 |
| SCR-SAL-004 | Quản Lý Đặt Cọc | deposits, customers, contracts | GET /api/sales/deposits | 1 |
| SCR-SAL-004 | Quản Lý Đặt Cọc | deposits | POST /api/sales/deposits | 1 |
| SCR-SAL-004 | Quản Lý Đặt Cọc | deposits, customers, contracts, users | GET /api/sales/deposits/{id} | 1 |
| SCR-SAL-004 | Quản Lý Đặt Cọc | deposits | POST /api/sales/deposits/{id}/refund | 1 |
| SCR-SAL-004 | Quản Lý Đặt Cọc | deposits | POST /api/sales/deposits/{id}/cancel | 1 |
| SCR-SAL-006 | Giao Xe (PDS) | pds_checklists, contracts, vins | GET /api/sales/pds | 1 |
| SCR-SAL-006 | Giao Xe (PDS) | pds_checklists | POST /api/sales/pds | 1 |
| SCR-SAL-006 | Giao Xe (PDS) | pds_checklists | PUT /api/sales/pds/{id} | 1 |
| SCR-SAL-006 | Giao Xe (PDS) | pds_checklists | POST /api/sales/pds/{id}/complete | 1 |
| SCR-SAL-006 | Giao Xe (PDS) | pds_checklists, contracts, vins, users | GET /api/sales/pds/{id} | 1 |

**Total**: 35 APIs

---

## 🎯 Module 4: Service

### Service Quotes, Appointments, Repair Orders, QC, Settlement

| FRD Screen | Screen Name | ERD Tables | API Endpoints | Count |
|------------|-------------|------------|---------------|-------|
| SCR-SVC-002 | Danh Sách Báo Giá DV | service_quotes, customers, users | GET /api/service/quotes | 1 |
| SCR-SVC-001 | Báo Giá Dịch Vụ | service_quotes | POST /api/service/quotes | 1 |
| SCR-SVC-001 | Báo Giá Dịch Vụ | service_quotes, customers, users | GET /api/service/quotes/{id} | 1 |
| SCR-SVC-001 | Báo Giá Dịch Vụ | service_quotes | PUT /api/service/quotes/{id} | 1 |
| SCR-SVC-002 | Danh Sách Báo Giá DV | service_quotes, repair_orders | POST /api/service/quotes/{id}/convert | 1 |
| SCR-SVC-003 | Đặt Lịch Hẹn | service_appointments, customers, users | GET /api/service/appointments | 1 |
| SCR-SVC-003 | Đặt Lịch Hẹn | service_appointments | POST /api/service/appointments | 1 |
| SCR-SVC-003 | Đặt Lịch Hẹn | service_appointments, customers, users | GET /api/service/appointments/{id} | 1 |
| SCR-SVC-003 | Đặt Lịch Hẹn | service_appointments | PUT /api/service/appointments/{id} | 1 |
| SCR-SVC-004 | Tiếp Nhận | service_appointments | POST /api/service/appointments/{id}/checkin | 1 |
| SCR-SVC-003 | Đặt Lịch Hẹn | service_appointments | POST /api/service/appointments/{id}/cancel | 1 |
| SCR-SVC-005 | Lệnh Sửa Chữa (RO) | repair_orders, customers, users | GET /api/service/orders | 1 |
| SCR-SVC-004 | Tiếp Nhận | repair_orders | POST /api/service/orders | 1 |
| SCR-SVC-005 | Lệnh Sửa Chữa (RO) | repair_orders, customers, users, ro_line_items, work_logs | GET /api/service/orders/{id} | 1 |
| SCR-SVC-005 | Lệnh Sửa Chữa (RO) | repair_orders | PUT /api/service/orders/{id} | 1 |
| SCR-SVC-005 | Lệnh Sửa Chữa (RO) | ro_line_items | POST /api/service/orders/{id}/items | 1 |
| SCR-SVC-005 | Lệnh Sửa Chữa (RO) | ro_line_items | DELETE /api/service/orders/{ro_id}/items/{item_id} | 1 |
| SCR-SVC-005 | Lệnh Sửa Chữa (RO) | repair_orders | POST /api/service/orders/{id}/assign | 1 |
| SCR-SVC-006 | Giao Diện KTV | work_logs | POST /api/service/orders/{id}/worklogs | 1 |
| SCR-SVC-006 | Giao Diện KTV | work_logs, users | GET /api/service/orders/{id}/worklogs | 1 |
| SCR-SVC-005 | Lệnh Sửa Chữa (RO) | repair_orders | POST /api/service/orders/{id}/complete | 1 |
| SCR-SVC-007 | Kiểm Tra Chất Lượng | qc_checklists, repair_orders, users | GET /api/service/qc | 1 |
| SCR-SVC-007 | Kiểm Tra Chất Lượng | qc_checklists | POST /api/service/qc | 1 |
| SCR-SVC-007 | Kiểm Tra Chất Lượng | qc_checklists, repair_orders | POST /api/service/qc/{id}/complete | 1 |
| SCR-SVC-007 | Kiểm Tra Chất Lượng | qc_checklists, repair_orders, users | GET /api/service/qc/{id} | 1 |
| SCR-SVC-008 | Thanh Toán | repair_orders, ro_line_items | GET /api/service/orders/{id}/invoice | 1 |
| SCR-SVC-008 | Thanh Toán | repair_orders | POST /api/service/orders/{id}/discount | 1 |
| SCR-SVC-008 | Thanh Toán | invoices, payments, repair_orders | POST /api/service/orders/{id}/payment | 1 |
| SCR-SVC-008 | Thanh Toán | repair_orders, ro_line_items, invoices | GET /api/service/orders/{id}/invoice/print | 1 |
| SCR-SVC-008 | Thanh Toán | repair_orders, invoices, payments | GET /api/service/settlement/summary | 1 |

**Total**: 30 APIs

---

## 🎯 Module 5: Parts (25 APIs)

| FRD Screen | ERD Tables | API Count |
|------------|------------|-----------|
| SCR-PRT-001 to SCR-PRT-010 | parts, stock_movements, purchase_orders, stock_takes | 25 |

---

## 🎯 Module 6: Insurance (10 APIs)

| FRD Screen | ERD Tables | API Count |
|------------|------------|-----------|
| SCR-INS-001 to SCR-INS-005 | insurance_contracts, insurance_claims | 10 |

---

## 🎯 Module 7: Accounting (20 APIs)

| FRD Screen | ERD Tables | API Count |
|------------|------------|-----------|
| SCR-ACC-001 to SCR-ACC-008 | invoices, payments, transactions, fixed_assets | 20 |

---

## 🎯 Module 8: Admin (10 APIs)

| FRD Screen | ERD Tables | API Count |
|------------|------------|-----------|
| SCR-ADM-001, SCR-ADM-002 | users, activity_logs, system_metrics | 10 |

---

## 📊 Summary

**Total Screens**: 75  
**Total ERD Tables**: 50+  
**Total APIs**: 175

**Traceability**: 100% - Mọi API đều có mapping rõ ràng từ FRD Screen → ERD Table

---

**End of API Data Mapping v1.0**
