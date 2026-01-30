# ERD Changes v1.2 (CR-003)

**Document**: Entity Relationship Diagram  
**Version**: v1.1 → v1.2  
**Change Type**: MINOR (Adding 3 new tables)  
**CR-ID**: CR-003  
**Date**: 2026-01-29

---

## CHANGE SUMMARY

**Added**: 3 new tables for Bay Utilization Management
- `service_bays`
- `bay_assignments`
- `bay_status_logs`

**Reason**: Support bay management functionality for service workshop.

---

## NEW TABLES

### 1. service_bays

**Purpose**: Quản lý thông tin các bay sửa chữa trong xưởng dịch vụ.

**Schema**:
```prisma
model ServiceBay {
  id            String    @id @default(cuid())
  name          String    // "Bay 1", "Bay 2", etc.
  location      String?   // "Workshop A", "Zone 1", etc.
  capacity      String?   // "Standard", "Large Vehicle", etc.
  equipment     String?   // JSON: ["Lift", "Diagnostic Tool", etc.]
  status        String    @default("ACTIVE") // ACTIVE, INACTIVE, MAINTENANCE
  is_available  Boolean   @default(true)
  created_at    DateTime  @default(now())
  updated_at    DateTime  @updatedAt

  assignments   BayAssignment[]
  statusLogs    BayStatusLog[]

  @@map("service_bays")
}
```

**Fields**:
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| id | String | Yes | cuid() | Primary key |
| name | String | Yes | - | Bay name (e.g., "Bay 1") |
| location | String | No | - | Physical location |
| capacity | String | No | - | Bay capacity type |
| equipment | String | No | - | JSON array of equipment |
| status | String | Yes | "ACTIVE" | Bay operational status |
| is_available | Boolean | Yes | true | Whether bay can accept work |
| created_at | DateTime | Yes | now() | Creation timestamp |
| updated_at | DateTime | Yes | now() | Last update timestamp |

**Indexes**:
```prisma
@@index([status])
@@index([is_available])
```

**Business Rules**:
- Bay name must be unique within workshop
- Equipment stored as JSON string
- status values: ACTIVE, INACTIVE, MAINTENANCE
- is_available = false when bay is under maintenance

---

### 2. bay_assignments

**Purpose**: Quản lý việc phân công Work Order cho bay.

**Schema**:
```prisma
model BayAssignment {
  id                String    @id @default(cuid())
  bay_id            String
  repair_order_id   String
  assigned_at       DateTime  @default(now())
  started_at        DateTime?
  estimated_end     DateTime?
  actual_end        DateTime?
  status            String    @default("ASSIGNED") // ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED
  progress_percent  Int       @default(0)
  delay_minutes     Int       @default(0)
  notes             String?
  created_at        DateTime  @default(now())
  updated_at        DateTime  @updatedAt

  bay           ServiceBay   @relation(fields: [bay_id], references: [id])
  repairOrder   RepairOrder  @relation(fields: [repair_order_id], references: [id])
  statusLogs    BayStatusLog[]

  @@map("bay_assignments")
}
```

**Fields**:
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| id | String | Yes | cuid() | Primary key |
| bay_id | String | Yes | - | Foreign key to service_bays |
| repair_order_id | String | Yes | - | Foreign key to repair_orders |
| assigned_at | DateTime | Yes | now() | Assignment timestamp |
| started_at | DateTime | No | - | Work start timestamp |
| estimated_end | DateTime | No | - | Estimated completion time |
| actual_end | DateTime | No | - | Actual completion time |
| status | String | Yes | "ASSIGNED" | Assignment status |
| progress_percent | Int | Yes | 0 | Work progress (0-100) |
| delay_minutes | Int | Yes | 0 | Delay in minutes |
| notes | String | No | - | Additional notes |
| created_at | DateTime | Yes | now() | Creation timestamp |
| updated_at | DateTime | Yes | now() | Last update timestamp |

**Indexes**:
```prisma
@@index([bay_id])
@@index([repair_order_id])
@@index([status])
```

**Business Rules**:
- One bay can only have one active assignment (status != COMPLETED/CANCELLED)
- One repair order can only be assigned to one bay
- delay_minutes calculated as: max(0, current_time - estimated_end) if status != COMPLETED
- progress_percent must be 0-100
- status values: ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED

---

### 3. bay_status_logs

**Purpose**: Lưu lịch sử thay đổi trạng thái bay (audit trail).

**Schema**:
```prisma
model BayStatusLog {
  id             String    @id @default(cuid())
  bay_id         String
  assignment_id  String?
  status         String    // IDLE, WORKING, DELAYED, COMPLETED
  changed_at     DateTime  @default(now())
  changed_by     String?
  notes          String?

  bay        ServiceBay     @relation(fields: [bay_id], references: [id])
  assignment BayAssignment? @relation(fields: [assignment_id], references: [id])
  changedBy  User?          @relation("BayStatusChanger", fields: [changed_by], references: [id])

  @@map("bay_status_logs")
}
```

**Fields**:
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| id | String | Yes | cuid() | Primary key |
| bay_id | String | Yes | - | Foreign key to service_bays |
| assignment_id | String | No | - | Foreign key to bay_assignments |
| status | String | Yes | - | Bay status at this point |
| changed_at | DateTime | Yes | now() | Status change timestamp |
| changed_by | String | No | - | User who changed status |
| notes | String | No | - | Change notes |

**Indexes**:
```prisma
@@index([bay_id])
@@index([changed_at])
```

**Business Rules**:
- Immutable (insert only, no update/delete)
- status values: IDLE, WORKING, DELAYED, COMPLETED
- Automatically created when bay status changes

---

## RELATIONSHIPS

### service_bays ↔ bay_assignments
- One-to-Many
- One bay can have multiple assignments (over time)
- One assignment belongs to one bay

### repair_orders ↔ bay_assignments
- One-to-Many
- One repair order can have multiple assignments (if reassigned)
- One assignment belongs to one repair order

### service_bays ↔ bay_status_logs
- One-to-Many
- One bay can have multiple status logs
- One log belongs to one bay

### bay_assignments ↔ bay_status_logs
- One-to-Many
- One assignment can have multiple status logs
- One log can belong to one assignment (optional)

---

## MIGRATION SCRIPT

```sql
-- Create service_bays table
CREATE TABLE service_bays (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  capacity TEXT,
  equipment TEXT,
  status TEXT DEFAULT 'ACTIVE',
  is_available BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_service_bays_status ON service_bays(status);
CREATE INDEX idx_service_bays_available ON service_bays(is_available);

-- Create bay_assignments table
CREATE TABLE bay_assignments (
  id TEXT PRIMARY KEY,
  bay_id TEXT NOT NULL,
  repair_order_id TEXT NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  started_at TIMESTAMP,
  estimated_end TIMESTAMP,
  actual_end TIMESTAMP,
  status TEXT DEFAULT 'ASSIGNED',
  progress_percent INTEGER DEFAULT 0,
  delay_minutes INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (bay_id) REFERENCES service_bays(id),
  FOREIGN KEY (repair_order_id) REFERENCES repair_orders(id)
);

CREATE INDEX idx_bay_assignments_bay ON bay_assignments(bay_id);
CREATE INDEX idx_bay_assignments_ro ON bay_assignments(repair_order_id);
CREATE INDEX idx_bay_assignments_status ON bay_assignments(status);

-- Create bay_status_logs table
CREATE TABLE bay_status_logs (
  id TEXT PRIMARY KEY,
  bay_id TEXT NOT NULL,
  assignment_id TEXT,
  status TEXT NOT NULL,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  changed_by TEXT,
  notes TEXT,
  FOREIGN KEY (bay_id) REFERENCES service_bays(id),
  FOREIGN KEY (assignment_id) REFERENCES bay_assignments(id),
  FOREIGN KEY (changed_by) REFERENCES users(id)
);

CREATE INDEX idx_bay_status_logs_bay ON bay_status_logs(bay_id);
CREATE INDEX idx_bay_status_logs_time ON bay_status_logs(changed_at);
```

---

## SEED DATA

```typescript
// Seed 8 service bays
const bays = [
  { name: 'Bay 1', location: 'Workshop A', capacity: 'Standard' },
  { name: 'Bay 2', location: 'Workshop A', capacity: 'Standard' },
  { name: 'Bay 3', location: 'Workshop A', capacity: 'Standard' },
  { name: 'Bay 4', location: 'Workshop A', capacity: 'Standard' },
  { name: 'Bay 5', location: 'Workshop B', capacity: 'Large Vehicle' },
  { name: 'Bay 6', location: 'Workshop B', capacity: 'Standard' },
  { name: 'Bay 7', location: 'Workshop B', capacity: 'Standard' },
  { name: 'Bay 8', location: 'Workshop B', capacity: 'Large Vehicle' },
];

for (const bay of bays) {
  await prisma.serviceBay.create({
    data: {
      name: bay.name,
      location: bay.location,
      capacity: bay.capacity,
      equipment: JSON.stringify(['Lift', 'Diagnostic Tool', 'Air Compressor']),
      status: 'ACTIVE',
      is_available: true,
    },
  });
}
```

---

## CHANGE LOG

| Date | Version | CR-ID | Changes | Author |
|------|---------|-------|---------|--------|
| 2026-01-29 | v1.2 | CR-003 | Added 3 tables: service_bays, bay_assignments, bay_status_logs | Antigravity |

---

**Document Owner**: Database Architect  
**Last Updated**: 2026-01-29  
**Status**: ✅ APPROVED

---

**End of ERD Changes v1.2 (CR-003)**
