-- Migration Script: CR-20260202-001 Emergency Master Data Implementation
-- Date: 2026-02-02
-- Purpose: Create tables for Employee, Supplier, Warehouse, and UOM management

-- Create MasterDepartment table for Employee references
CREATE TABLE MasterDepartment (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  department_code VARCHAR(20) UNIQUE NOT NULL COMMENT 'Format: DEPT-XXX',
  department_name VARCHAR(100) NOT NULL,
  description TEXT,
  status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create MasterPosition table for Employee references
CREATE TABLE MasterPosition (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  position_code VARCHAR(20) UNIQUE NOT NULL COMMENT 'Format: POS-XXX',
  position_name VARCHAR(100) NOT NULL,
  description TEXT,
  status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create MasterLevel table for Employee references
CREATE TABLE MasterLevel (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  level_code VARCHAR(20) UNIQUE NOT NULL COMMENT 'Format: LVL-XXX',
  level_name VARCHAR(50) NOT NULL,
  description TEXT,
  status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Employee table (FR-MD-005)
CREATE TABLE Employee (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT UNIQUE COMMENT 'Link to system user',
  employee_code VARCHAR(20) UNIQUE NOT NULL COMMENT 'Format: EMP-XXX',
  full_name VARCHAR(100) NOT NULL,
  department_id BIGINT,
  position_id BIGINT,
  level_id BIGINT,
  join_date DATE,
  status ENUM('ACTIVE','INACTIVE','TERMINATED') DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL COMMENT 'Soft delete timestamp',
  FOREIGN KEY (user_id) REFERENCES User(id),
  FOREIGN KEY (department_id) REFERENCES MasterDepartment(id),
  FOREIGN KEY (position_id) REFERENCES MasterPosition(id),
  FOREIGN KEY (level_id) REFERENCES MasterLevel(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Supplier table (FR-MD-006)
CREATE TABLE Supplier (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  supplier_code VARCHAR(20) UNIQUE NOT NULL COMMENT 'Format: SUP-XXX',
  supplier_name VARCHAR(200) UNIQUE NOT NULL,
  tax_id VARCHAR(50),
  address TEXT,
  contact_person VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  status ENUM('ACTIVE','INACTIVE','BLACKLIST') DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL COMMENT 'Soft delete timestamp'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create SupplierContact table for multiple contacts per supplier
CREATE TABLE SupplierContact (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  supplier_id BIGINT NOT NULL,
  contact_name VARCHAR(100) NOT NULL,
  position VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  is_primary BOOLEAN DEFAULT FALSE,
  status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (supplier_id) REFERENCES Supplier(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Warehouse table (FR-MD-007)
CREATE TABLE Warehouse (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  warehouse_code VARCHAR(20) UNIQUE NOT NULL COMMENT 'Format: WH-XXX',
  warehouse_name VARCHAR(100) UNIQUE NOT NULL,
  location_address TEXT,
  manager_id BIGINT COMMENT 'Ref Employee',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL COMMENT 'Soft delete timestamp',
  FOREIGN KEY (manager_id) REFERENCES Employee(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create UOM table (FR-MD-008)
CREATE TABLE UOM (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  uom_code VARCHAR(10) UNIQUE NOT NULL,
  uom_name VARCHAR(50) NOT NULL,
  description VARCHAR(200),
  status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL COMMENT 'Soft delete timestamp'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create indexes for performance
CREATE INDEX idx_employee_code ON Employee(employee_code);
CREATE INDEX idx_employee_status ON Employee(status);
CREATE INDEX idx_employee_department ON Employee(department_id);
CREATE INDEX idx_employee_position ON Employee(position_id);
CREATE INDEX idx_employee_level ON Employee(level_id);

CREATE INDEX idx_supplier_code ON Supplier(supplier_code);
CREATE INDEX idx_supplier_name ON Supplier(supplier_name);
CREATE INDEX idx_supplier_tax_id ON Supplier(tax_id);
CREATE INDEX idx_supplier_status ON Supplier(status);

CREATE INDEX idx_supplier_contact_supplier_id ON SupplierContact(supplier_id);
CREATE INDEX idx_supplier_contact_primary ON SupplierContact(is_primary);

CREATE INDEX idx_warehouse_code ON Warehouse(warehouse_code);
CREATE INDEX idx_warehouse_active ON Warehouse(is_active);
CREATE INDEX idx_warehouse_manager ON Warehouse(manager_id);

CREATE INDEX idx_uom_code ON UOM(uom_code);
CREATE INDEX idx_uom_status ON UOM(status);

-- Insert sample data for Master tables

-- Sample Departments
INSERT INTO MasterDepartment (department_code, department_name, description) VALUES
('DEPT-001', 'Human Resources', 'Human Resources Department'),
('DEPT-002', 'Finance', 'Finance and Accounting Department'),
('DEPT-003', 'IT', 'Information Technology Department'),
('DEPT-004', 'Sales', 'Sales and Marketing Department'),
('DEPT-005', 'Service', 'Service and Maintenance Department'),
('DEPT-006', 'Parts', 'Parts and Inventory Department');

-- Sample Positions
INSERT INTO MasterPosition (position_code, position_name, description) VALUES
('POS-001', 'General Manager', 'General Manager'),
('POS-002', 'Department Manager', 'Department Manager'),
('POS-003', 'Supervisor', 'Team Supervisor'),
('POS-004', 'Senior Staff', 'Senior Level Staff'),
('POS-005', 'Staff', 'Regular Staff'),
('POS-006', 'Intern', 'Intern/Trainee');

-- Sample Levels
INSERT INTO MasterLevel (level_code, level_name, description) VALUES
('LVL-001', 'Executive', 'Executive Level'),
('LVL-002', 'Senior Management', 'Senior Management'),
('LVL-003', 'Middle Management', 'Middle Management'),
('LVL-004', 'Senior Professional', 'Senior Professional Level'),
('LVL-005', 'Professional', 'Professional Level'),
('LVL-006', 'Junior', 'Junior Level');

-- Sample Employees
INSERT INTO Employee (employee_code, full_name, department_id, position_id, level_id, join_date, status) VALUES
('EMP-001', 'Nguyen Van A', 1, 2, 2, '2020-01-15', 'ACTIVE'),
('EMP-002', 'Tran Thi B', 2, 2, 2, '2019-05-20', 'ACTIVE'),
('EMP-003', 'Le Van C', 3, 2, 2, '2021-03-10', 'ACTIVE'),
('EMP-004', 'Pham Thi D', 4, 3, 4, '2020-08-01', 'ACTIVE'),
('EMP-005', 'Hoang Van E', 5, 3, 4, '2019-11-25', 'ACTIVE'),
('EMP-006', 'Nguyen Thi F', 6, 3, 4, '2021-01-10', 'ACTIVE');

-- Sample Suppliers
INSERT INTO Supplier (supplier_code, supplier_name, tax_id, address, contact_person, phone, email, status) VALUES
('SUP-001', 'Honda Parts Vietnam Ltd.', '0101234567', '123 Nguyen Hue, Hanoi', 'Tran Van G', '0912345678', 'info@hondaparts.vn', 'ACTIVE'),
('SUP-002', 'Auto Accessories Co., Ltd', '0209876543', '456 Le Loi, Ho Chi Minh City', 'Le Thi H', '0923456789', 'sales@autoaccessories.com', 'ACTIVE'),
('SUP-003', 'Vietnam Oil Corporation', '0305556666', '789 Tran Hung Dao, Da Nang', 'Nguyen Van I', '0934567890', 'contact@pvn.com', 'ACTIVE'),
('SUP-004', 'Tire Pro Vietnam', '0407778888', '321 Ba Trieu, Hai Phong', 'Tran Thi K', '0945678901', 'info@tirepro.vn', 'ACTIVE');

-- Sample Supplier Contacts
INSERT INTO SupplierContact (supplier_id, contact_name, position, phone, email, is_primary) VALUES
(1, 'Tran Van G', 'Sales Manager', '0912345678', 'sales@hondaparts.vn', TRUE),
(1, 'Le Thi H', 'Sales Representative', '0987654321', 'contact@hondaparts.vn', FALSE),
(2, 'Nguyen Van I', 'Director', '0923456789', 'director@autoaccessories.com', TRUE),
(3, 'Tran Thi K', 'Procurement Officer', '0934567890', 'procurement@pvn.com', TRUE);

-- Sample Warehouses
INSERT INTO Warehouse (warehouse_code, warehouse_name, location_address, manager_id, is_active) VALUES
('WH-001', 'Main Warehouse', '123 Industrial Zone, Hanoi', 6, TRUE),
('WH-002', 'Parts Warehouse', '456 Service Center, Ho Chi Minh City', 6, TRUE),
('WH-003', 'Tire Warehouse', '789 Storage Facility, Da Nang', 6, TRUE),
('WH-004', 'Accessories Warehouse', '321 Showroom, Hai Phong', 6, TRUE);

-- Sample UOMs
INSERT INTO UOM (uom_code, uom_name, description) VALUES
('PCS', 'Piece', 'Individual piece'),
('SET', 'Set', 'Complete set'),
('BOX', 'Box', 'Box containing multiple pieces'),
('KG', 'Kilogram', 'Unit of weight'),
('L', 'Liter', 'Unit of volume'),
('M', 'Meter', 'Unit of length'),
('PAIR', 'Pair', 'Set of two'),
('DOZ', 'Dozen', 'Set of twelve');

-- Create audit log entries for migration
INSERT INTO activity_logs (user_id, action, entity, entity_id, details, created_at) VALUES
(1, 'CREATE', 'MasterDepartment', 1, '{"action": "batch_insert", "count": 6}', NOW()),
(1, 'CREATE', 'MasterPosition', 1, '{"action": "batch_insert", "count": 6}', NOW()),
(1, 'CREATE', 'MasterLevel', 1, '{"action": "batch_insert", "count": 6}', NOW()),
(1, 'CREATE', 'Employee', 1, '{"action": "batch_insert", "count": 6}', NOW()),
(1, 'CREATE', 'Supplier', 1, '{"action": "batch_insert", "count": 4}', NOW()),
(1, 'CREATE', 'SupplierContact', 1, '{"action": "batch_insert", "count": 3}', NOW()),
(1, 'CREATE', 'Warehouse', 1, '{"action": "batch_insert", "count": 4}', NOW()),
(1, 'CREATE', 'UOM', 1, '{"action": "batch_insert", "count": 8}', NOW());