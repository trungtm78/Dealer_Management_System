# ERD Update: Master Data Schema (CR-20260202-002)

## 1. New Entities

### 1.1 Vehicle Sub-Masters
```sql
CREATE TABLE VehicleVersion (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    model_id BIGINT NOT NULL,
    version_name VARCHAR(100) NOT NULL COMMENT 'e.g. 1.5G, 1.5L',
    specifications JSON COMMENT 'Engine, Transmission details',
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    FOREIGN KEY (model_id) REFERENCES VehicleModel(id)
);

CREATE TABLE VehicleColor (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    model_id BIGINT NOT NULL,
    color_code VARCHAR(50) NOT NULL,
    color_name VARCHAR(100) NOT NULL,
    image_url VARCHAR(500),
    price_adjustment DECIMAL(15,2) DEFAULT 0,
    FOREIGN KEY (model_id) REFERENCES VehicleModel(id)
);
```

### 1.2 Employee Sub-Masters
```sql
CREATE TABLE MasterDepartment (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    dept_code VARCHAR(50) UNIQUE NOT NULL,
    dept_name VARCHAR(100) NOT NULL,
    parent_id BIGINT NULL,
    manager_id BIGINT NULL COMMENT 'Ref Employee',
    FOREIGN KEY (parent_id) REFERENCES MasterDepartment(id)
);

CREATE TABLE MasterPosition (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    position_code VARCHAR(50) UNIQUE NOT NULL,
    position_name VARCHAR(100) NOT NULL,
    level_id BIGINT NULL
);

CREATE TABLE MasterLevel (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    level_code VARCHAR(20) UNIQUE NOT NULL,
    level_name VARCHAR(100) NOT NULL,
    salary_range_min DECIMAL(15,2),
    salary_range_max DECIMAL(15,2)
);
```

### 1.3 Supplier Sub-Masters
```sql
CREATE TABLE SupplierContact (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    supplier_id BIGINT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(50),
    phone VARCHAR(20),
    email VARCHAR(100),
    is_primary BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (supplier_id) REFERENCES Supplier(id)
);

CREATE TABLE SupplierContract (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    supplier_id BIGINT NOT NULL,
    contract_number VARCHAR(50) UNIQUE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('ACTIVE', 'EXPIRED', 'TERMINATED'),
    FOREIGN KEY (supplier_id) REFERENCES Supplier(id)
);
```

### 1.4 System Masters
```sql
CREATE TABLE MasterProvince (
    code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) -- Tinh/Thanh Pho
);

CREATE TABLE MasterDistrict (
    code VARCHAR(10) PRIMARY KEY,
    province_code VARCHAR(10) NOT NULL,
    name VARCHAR(100) NOT NULL,
    FOREIGN KEY (province_code) REFERENCES MasterProvince(code)
);

CREATE TABLE MasterWard (
    code VARCHAR(10) PRIMARY KEY,
    district_code VARCHAR(10) NOT NULL,
    name VARCHAR(100) NOT NULL,
    FOREIGN KEY (district_code) REFERENCES MasterDistrict(code)
);

CREATE TABLE MasterBank (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    bank_code VARCHAR(20) UNIQUE NOT NULL,
    bank_name VARCHAR(200) NOT NULL,
    short_name VARCHAR(50),
    logo_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE MasterPaymentMethod (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    method_code VARCHAR(20) UNIQUE NOT NULL, -- CASH, TRANSFER, CARD
    method_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);
```

## 2. Updated Relationships
- **Employee Table**: Update FKs to point to `MasterDepartment(id)` and `MasterPosition(id)`.
- **Vehicle Table**: Update FKs to `VehicleVersion(id)` and `VehicleColor(id)` (if applicable).
