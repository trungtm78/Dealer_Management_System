# API Spec Service Changes v1.1 (CR-003)

**Document**: API Specification - Service Module  
**Version**: v1.0 → v1.1  
**Change Type**: MINOR (Adding 10 new endpoints)  
**CR-ID**: CR-003  
**Date**: 2026-01-29

---

## CHANGE SUMMARY

**Added**: 10 new API endpoints for Bay Utilization Management

**Endpoints**:
- 5 Bay Management APIs
- 5 Bay Assignment APIs

---

## NEW ENDPOINTS

### 1. GET /api/service/bays

**Description**: Get list of all service bays

**Auth**: Required (Service Advisor, Service Manager, Admin)

**Request**:
```http
GET /api/service/bays?status=ACTIVE&available=true
```

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| status | String | No | Filter by status (ACTIVE/INACTIVE/MAINTENANCE) |
| available | Boolean | No | Filter by availability |

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "bay_001",
      "name": "Bay 1",
      "location": "Workshop A",
      "capacity": "Standard",
      "equipment": ["Lift", "Diagnostic Tool"],
      "status": "ACTIVE",
      "is_available": true,
      "current_assignment": {
        "id": "assign_001",
        "repair_order_id": "WO-2026-0121",
        "vehicle": "Honda Accord",
        "technician": "Trần Văn Hùng",
        "progress_percent": 65,
        "status": "IN_PROGRESS"
      }
    }
  ]
}
```

---

### 2. GET /api/service/bays/{id}

**Description**: Get bay details by ID

**Auth**: Required

**Request**:
```http
GET /api/service/bays/bay_001
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "bay_001",
    "name": "Bay 1",
    "location": "Workshop A",
    "capacity": "Standard",
    "equipment": ["Lift", "Diagnostic Tool"],
    "status": "ACTIVE",
    "is_available": false,
    "current_assignment": {
      "id": "assign_001",
      "repair_order_id": "WO-2026-0121",
      "vehicle": "Honda Accord",
      "technician": "Trần Văn Hùng",
      "started_at": "2026-01-29T08:30:00Z",
      "estimated_end": "2026-01-29T10:30:00Z",
      "progress_percent": 65,
      "delay_minutes": 0,
      "status": "IN_PROGRESS"
    },
    "history": [
      {
        "status": "WORKING",
        "changed_at": "2026-01-29T08:30:00Z",
        "changed_by": "user_001"
      }
    ]
  }
}
```

---

### 3. POST /api/service/bays

**Description**: Create new service bay

**Auth**: Required (Admin only)

**Request**:
```json
{
  "name": "Bay 9",
  "location": "Workshop C",
  "capacity": "Standard",
  "equipment": ["Lift", "Diagnostic Tool", "Air Compressor"]
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "bay_009",
    "name": "Bay 9",
    "location": "Workshop C",
    "capacity": "Standard",
    "equipment": ["Lift", "Diagnostic Tool", "Air Compressor"],
    "status": "ACTIVE",
    "is_available": true
  }
}
```

---

### 4. PUT /api/service/bays/{id}

**Description**: Update bay information

**Auth**: Required (Admin only)

**Request**:
```json
{
  "location": "Workshop D",
  "capacity": "Large Vehicle",
  "status": "MAINTENANCE"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "bay_009",
    "name": "Bay 9",
    "location": "Workshop D",
    "capacity": "Large Vehicle",
    "status": "MAINTENANCE",
    "is_available": false
  }
}
```

---

### 5. DELETE /api/service/bays/{id}

**Description**: Delete service bay (soft delete)

**Auth**: Required (Admin only)

**Request**:
```http
DELETE /api/service/bays/bay_009
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Bay deleted successfully"
}
```

**Business Rules**:
- Cannot delete bay with active assignment
- Soft delete (set status = 'INACTIVE')

---

### 6. GET /api/service/bays/utilization

**Description**: Get bay utilization dashboard data

**Auth**: Required

**Request**:
```http
GET /api/service/bays/utilization
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "kpis": {
      "total_bays": 8,
      "idle_bays": 2,
      "working_bays": 3,
      "delayed_bays": 2,
      "completed_bays": 1,
      "utilization_rate": 75
    },
    "bays": [
      {
        "id": "bay_001",
        "name": "Bay 1",
        "status": "working",
        "work_order": "WO-2026-0121",
        "vehicle": "Honda Accord",
        "technician": "Trần Văn Hùng",
        "start_time": "08:30",
        "estimated_end": "10:30",
        "progress_percent": 65,
        "delay_minutes": 0
      }
    ],
    "delayed_alert": {
      "count": 2,
      "message": "Cảnh báo: 2 bay đang bị trễ hạn"
    }
  }
}
```

---

### 7. POST /api/service/bays/{id}/assign

**Description**: Assign work order to bay

**Auth**: Required (Service Advisor, Service Manager)

**Request**:
```json
{
  "repair_order_id": "WO-2026-0125",
  "estimated_end": "2026-01-29T12:00:00Z",
  "notes": "Urgent repair"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "assign_005",
    "bay_id": "bay_003",
    "repair_order_id": "WO-2026-0125",
    "assigned_at": "2026-01-29T09:30:00Z",
    "estimated_end": "2026-01-29T12:00:00Z",
    "status": "ASSIGNED",
    "progress_percent": 0
  }
}
```

**Business Rules**:
- Bay must be available (is_available = true)
- Repair order must exist and status = 'PENDING'
- Creates bay assignment
- Updates bay is_available = false
- Updates repair order status = 'IN_PROGRESS'
- Creates status log entry

**Error Responses**:
- 400: Bay not available
- 404: Bay or Repair Order not found
- 409: Repair Order already assigned

---

### 8. PUT /api/service/bays/{id}/progress

**Description**: Update work progress

**Auth**: Required (Service Advisor, Technician)

**Request**:
```json
{
  "progress_percent": 80,
  "notes": "Engine work completed"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "assign_001",
    "progress_percent": 80,
    "delay_minutes": 0,
    "status": "IN_PROGRESS"
  }
}
```

**Business Rules**:
- Progress can only increase
- Auto-calculate delay_minutes if current_time > estimated_end
- Auto-update status to 'DELAYED' if delayed
- Creates status log entry

---

### 9. POST /api/service/bays/{id}/complete

**Description**: Complete work and free bay

**Auth**: Required (Service Advisor, Service Manager)

**Request**:
```json
{
  "notes": "Work completed successfully"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "assignment_id": "assign_001",
    "status": "COMPLETED",
    "actual_end": "2026-01-29T10:25:00Z",
    "bay_status": "idle"
  }
}
```

**Business Rules**:
- Updates assignment status = 'COMPLETED'
- Records actual_end timestamp
- Updates bay is_available = true
- Updates repair order status = 'READY'
- Creates status log entry

---

### 10. GET /api/service/bays/{id}/history

**Description**: Get bay status history

**Auth**: Required

**Request**:
```http
GET /api/service/bays/bay_001/history?limit=20
```

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| limit | Number | No | Max records (default: 50) |
| from_date | String | No | Filter from date (ISO 8601) |
| to_date | String | No | Filter to date (ISO 8601) |

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "log_001",
      "status": "WORKING",
      "assignment_id": "assign_001",
      "changed_at": "2026-01-29T08:30:00Z",
      "changed_by": "user_001",
      "notes": "Work started"
    }
  ]
}
```

---

## ERROR CODES

| Code | Message | HTTP Status |
|------|---------|-------------|
| BAY_NOT_FOUND | Bay not found | 404 |
| BAY_NOT_AVAILABLE | Bay is not available | 400 |
| BAY_HAS_ACTIVE_ASSIGNMENT | Bay has active assignment | 409 |
| REPAIR_ORDER_NOT_FOUND | Repair order not found | 404 |
| REPAIR_ORDER_ALREADY_ASSIGNED | Repair order already assigned to a bay | 409 |
| INVALID_PROGRESS | Progress must be between 0 and 100 | 400 |
| UNAUTHORIZED | User not authorized | 403 |

---

## CHANGE LOG

| Date | Version | CR-ID | Changes | Author |
|------|---------|-------|---------|--------|
| 2026-01-29 | v1.1 | CR-003 | Added 10 APIs for Bay Utilization Management | Antigravity |

---

**Document Owner**: API Architect  
**Last Updated**: 2026-01-29  
**Status**: ✅ APPROVED

---

**End of API Spec Service Changes v1.1 (CR-003)**
