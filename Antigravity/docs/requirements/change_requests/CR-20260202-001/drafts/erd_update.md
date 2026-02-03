
<!-- CR-20260202-001: ADDED -->
---

## 8. Entity: Employee

**Added by**: CR-20260202-001
**Purpose**: Extended employee profile

### 8.1 Table Schema
```sql
CREATE TABLE Employee (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT UNIQUE COMMENT 'Link to system user',
  employee_code VARCHAR(20) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  department_id BIGINT,
  position_id BIGINT,
  level_id BIGINT,
  join_date DATE,
  status ENUM('ACTIVE','INACTIVE','TERMINATED') DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES User(id),
  FOREIGN KEY (department_id) REFERENCES MasterDepartment(id),
  FOREIGN KEY (position_id) REFERENCES MasterPosition(id)
);
```

### 8.2 Supporting Tables
- `MasterDepartment` (id, code, name)
- `MasterPosition` (id, code, name)
- `MasterLevel` (id, code, name)

---

## 9. Entity: Supplier

**Added by**: CR-20260202-001

### 9.1 Table Schema
```sql
CREATE TABLE Supplier (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  supplier_code VARCHAR(20) UNIQUE NOT NULL,
  supplier_name VARCHAR(200) NOT NULL,
  tax_id VARCHAR(50),
  address TEXT,
  status ENUM('ACTIVE','INACTIVE','BLACKLIST') DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 10. Entity: Warehouse

**Added by**: CR-20260202-001

### 10.1 Table Schema
```sql
CREATE TABLE Warehouse (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  warehouse_code VARCHAR(20) UNIQUE NOT NULL,
  warehouse_name VARCHAR(100) NOT NULL,
  location_address TEXT,
  manager_id BIGINT COMMENT 'Ref Employee',
  is_active BOOLEAN DEFAULT TRUE
);
```

---

## 11. Entity: UOM (Unit of Measure)

**Added by**: CR-20260202-001

### 11.1 Table Schema
```sql
CREATE TABLE UOM (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  uom_code VARCHAR(10) UNIQUE NOT NULL,
  uom_name VARCHAR(50) NOT NULL,
  description VARCHAR(200)
);
```

<!-- END CR-20260202-001 -->
