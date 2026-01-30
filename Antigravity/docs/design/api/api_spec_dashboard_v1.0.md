# Honda DMS - API Specification
## Module 1: Dashboard

**Version**: 1.0  
**Date**: 2026-01-28  
**Module**: Dashboard  
**Total APIs**: 5

---

## 📋 Module Overview

**Purpose**: Cung cấp APIs cho Dashboard điều hành, hiển thị KPIs, charts và notifications

**FRD Reference**: SCR-DASH-001

**APIs**:
1. `GET /api/dashboard/kpis` - Get Dashboard KPIs
2. `GET /api/dashboard/revenue-chart` - Get Revenue Chart Data
3. `GET /api/dashboard/leads-chart` - Get Leads Source Chart Data
4. `GET /api/dashboard/models-chart` - Get Top Models Chart Data
5. `GET /api/dashboard/notifications` - Get Notifications

---

## API-DASH-001: Get Dashboard KPIs

### A. Thông tin chung
- **API Name**: Get Dashboard KPIs
- **Endpoint**: `GET /api/dashboard/kpis`
- **Purpose**: Lấy các chỉ số KPI cho dashboard điều hành

### B. FRD Mapping
- **Screen ID**: SCR-DASH-001
- **User Action**: View dashboard overview
- **FRD Section**: Module 1, Dashboard Điều Hành

### C. ERD Mapping
- **Entities**: leads, customers, quotations, test_drives, repair_orders
- **Tables**: 
  - `leads` (count new leads)
  - `customers` (count total customers)
  - `quotations` (revenue calculation)
  - `test_drives` (count appointments)
  - `repair_orders` (service metrics)
- **Relations**: N/A (aggregation only)

### D. Request Specification

**Query Parameters**:
| Name | Type | Required | Description | Validation |
|------|------|----------|-------------|------------|
| date_from | date | No | Start date (default: first day of month) | ISO 8601 format |
| date_to | date | No | End date (default: today) | ISO 8601 format |

**Example**:
```
GET /api/dashboard/kpis?date_from=2026-01-01&date_to=2026-01-31
```

### E. Response Specification

**Success (200)**:
```json
{
  "success": true,
  "data": {
    "revenue": {
      "value": 15000000000,
      "change": 12.5,
      "trend": "up"
    },
    "cars_sold": {
      "value": 45,
      "change": 8.3,
      "trend": "up"
    },
    "new_leads": {
      "value": 120,
      "change": -5.2,
      "trend": "down"
    },
    "appointments": {
      "value": 85,
      "change": 15.7,
      "trend": "up"
    }
  }
}
```

**Field Mapping**:
| Response Field | ERD Mapping | Calculation |
|----------------|-------------|-------------|
| revenue.value | SUM(quotations.total_amount WHERE status='APPROVED') | Aggregation |
| cars_sold.value | COUNT(contracts.id) | Aggregation |
| new_leads.value | COUNT(leads.id WHERE created_at >= date_from) | Aggregation |
| appointments.value | COUNT(test_drives.id) + COUNT(service_appointments.id) | Aggregation |

### F. Business Rules
- BR-DASH-001: Revenue chỉ tính quotations có status = 'APPROVED'
- BR-DASH-002: Cars sold tính theo contracts đã ký
- BR-DASH-003: Change % so với period trước đó (same duration)
- BR-DASH-004: Trend = 'up' nếu change > 0, 'down' nếu change < 0, 'stable' nếu change = 0

### G. Error Handling

| Error Code | Condition | Message |
|------------|-----------|---------|
| DASH_400 | Invalid date format | Invalid date format. Use ISO 8601 (YYYY-MM-DD) |
| DASH_400 | date_from > date_to | Start date must be before end date |

---

## API-DASH-002: Get Revenue Chart Data

### A. Thông tin chung
- **API Name**: Get Revenue Chart Data
- **Endpoint**: `GET /api/dashboard/revenue-chart`
- **Purpose**: Lấy dữ liệu biểu đồ doanh thu theo tháng

### B. FRD Mapping
- **Screen ID**: SCR-DASH-001
- **User Action**: View revenue chart
- **FRD Section**: Module 1, Dashboard - Revenue Chart

### C. ERD Mapping
- **Entity**: quotations
- **Table**: `quotations`
- **Relations**: N/A (aggregation)

### D. Request Specification

**Query Parameters**:
| Name | Type | Required | Description | Validation |
|------|------|----------|-------------|------------|
| months | int | No | Number of months (default: 12) | 1-24 |

### E. Response Specification

**Success (200)**:
```json
{
  "success": true,
  "data": {
    "labels": ["Jan", "Feb", "Mar", "..."],
    "datasets": [{
      "label": "Revenue",
      "data": [1200000000, 1500000000, 1300000000, "..."]
    }]
  }
}
```

**Field Mapping**:
| Response Field | ERD Mapping | Calculation |
|----------------|-------------|-------------|
| data[].value | SUM(quotations.total_amount) GROUP BY MONTH(created_at) | Aggregation |

### F. Business Rules
- BR-DASH-005: Chỉ tính quotations có status = 'APPROVED' hoặc 'CONTRACT'
- BR-DASH-006: Group by month của created_at

### G. Error Handling

| Error Code | Condition | Message |
|------------|-----------|---------|
| DASH_400 | months < 1 or months > 24 | Months must be between 1 and 24 |

---

## API-DASH-003: Get Leads Source Chart Data

### A. Thông tin chung
- **API Name**: Get Leads Source Chart Data
- **Endpoint**: `GET /api/dashboard/leads-chart`
- **Purpose**: Lấy dữ liệu phân bổ leads theo nguồn

### B. FRD Mapping
- **Screen ID**: SCR-DASH-001
- **User Action**: View leads source distribution
- **FRD Section**: Module 1, Dashboard - Leads Chart

### C. ERD Mapping
- **Entity**: leads
- **Table**: `leads`
- **Relations**: N/A (aggregation)

### D. Request Specification

**Query Parameters**:
| Name | Type | Required | Description | Validation |
|------|------|----------|-------------|------------|
| date_from | date | No | Start date | ISO 8601 |
| date_to | date | No | End date | ISO 8601 |

### E. Response Specification

**Success (200)**:
```json
{
  "success": true,
  "data": {
    "labels": ["Facebook", "Website", "Walk-in", "Hotline", "Referral"],
    "datasets": [{
      "data": [45, 30, 15, 8, 2]
    }]
  }
}
```

**Field Mapping**:
| Response Field | ERD Mapping | Calculation |
|----------------|-------------|-------------|
| data[].value | COUNT(leads.id) GROUP BY source | Aggregation |

### F. Business Rules
- BR-DASH-007: Tính tất cả leads (không filter status)
- BR-DASH-008: Group by source enum

### G. Error Handling

| Error Code | Condition | Message |
|------------|-----------|---------|
| DASH_400 | Invalid date | Invalid date format |

---

## API-DASH-004: Get Top Models Chart Data

### A. Thông tin chung
- **API Name**: Get Top Models Chart Data
- **Endpoint**: `GET /api/dashboard/models-chart`
- **Purpose**: Lấy top 5 models bán chạy

### B. FRD Mapping
- **Screen ID**: SCR-DASH-001
- **User Action**: View top selling models
- **FRD Section**: Module 1, Dashboard - Top Models Chart

### C. ERD Mapping
- **Entity**: contracts, vehicle_models
- **Tables**: `contracts`, `vehicle_models`
- **Relations**: `contracts.model_id` → `vehicle_models.id`

### D. Request Specification

**Query Parameters**:
| Name | Type | Required | Description | Validation |
|------|------|----------|-------------|------------|
| limit | int | No | Number of models (default: 5) | 1-10 |

### E. Response Specification

**Success (200)**:
```json
{
  "success": true,
  "data": {
    "labels": ["CR-V", "City", "Accord", "Civic", "HR-V"],
    "datasets": [{
      "data": [25, 18, 12, 8, 5]
    }]
  }
}
```

**Field Mapping**:
| Response Field | ERD Mapping | Calculation |
|----------------|-------------|-------------|
| labels[] | vehicle_models.name | JOIN |
| data[] | COUNT(contracts.id) GROUP BY model_id | Aggregation |

### F. Business Rules
- BR-DASH-009: Chỉ tính contracts đã ký (status != 'CANCELLED')
- BR-DASH-010: Order by count DESC, limit 5

### G. Error Handling

| Error Code | Condition | Message |
|------------|-----------|---------|
| DASH_400 | limit < 1 or limit > 10 | Limit must be between 1 and 10 |

---

## API-DASH-005: Get Notifications

### A. Thông tin chung
- **API Name**: Get Notifications
- **Endpoint**: `GET /api/dashboard/notifications`
- **Purpose**: Lấy danh sách notifications/alerts

### B. FRD Mapping
- **Screen ID**: SCR-DASH-001
- **User Action**: View notifications
- **FRD Section**: Module 1, Dashboard - Notifications

### C. ERD Mapping
- **Entities**: leads, test_drives, service_appointments, reminders
- **Tables**: Multiple tables (aggregation)
- **Relations**: N/A

### D. Request Specification

**Query Parameters**:
| Name | Type | Required | Description | Validation |
|------|------|----------|-------------|------------|
| limit | int | No | Number of notifications (default: 10) | 1-50 |

### E. Response Specification

**Success (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "notif-001",
      "type": "lead",
      "title": "New lead assigned",
      "message": "You have a new lead from Facebook",
      "timestamp": "2026-01-28T10:30:00Z",
      "read": false
    }
  ]
}
```

**Field Mapping**:
| Response Field | ERD Mapping | Source |
|----------------|-------------|--------|
| type | - | Derived from source table |
| title | - | Generated based on type |
| timestamp | created_at | Various tables |

### F. Business Rules
- BR-DASH-011: Notifications include: new leads, upcoming test drives, service appointments, reminders
- BR-DASH-012: Order by timestamp DESC
- BR-DASH-013: Only show unread by default

### G. Error Handling

| Error Code | Condition | Message |
|------------|-----------|---------|
| DASH_400 | limit < 1 or limit > 50 | Limit must be between 1 and 50 |

---

**End of Module 1: Dashboard**
