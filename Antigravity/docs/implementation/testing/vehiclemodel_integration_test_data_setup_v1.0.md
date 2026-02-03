# Integration Test Data Setup - CR-MD-001 VehicleModel Master Data

## Document Information
- **Document ID**: INTEG-TEST-DATA-001
- **Version**: 1.0
- **Date**: 2025-06-18
- **Project**: CRM VehicleModel Master Data Integration
- **Change Request**: CR-MD-001

## 1. Introduction

### 1.1 Purpose
This document defines the test data setup required for integration testing of the VehicleModel Master Data API endpoints. Proper test data ensures comprehensive coverage of all test scenarios and edge cases.

### 1.2 Test Data Strategy
- **Isolated Database**: Use separate test database to avoid affecting production data
- **Known State**: Database should be in known state before each test execution
- **Comprehensive Coverage**: Data sets should cover all validation rules and business scenarios
- **Relationship Integrity**: Include related data to test foreign key constraints

## 2. Database Schema Preparation

### 2.1 VehicleModel Table Setup
```sql
CREATE TABLE VehicleModel (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    description VARCHAR(500),
    category VARCHAR(50) NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_code (code)
);
```

### 2.2 Activity Logs Table Setup
```sql
CREATE TABLE activity_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    entity_type ENUM('VehicleModel', 'Quotation', 'Vehicle', 'Lead', 'Customer') NOT NULL,
    entity_id BIGINT NOT NULL,
    action ENUM('create', 'update', 'delete', 'read') NOT NULL,
    old_values JSON,
    new_values JSON,
    user_id BIGINT,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_entity_type_id (entity_type, entity_id),
    INDEX idx_action (action),
    INDEX idx_timestamp (timestamp)
);
```

### 2.3 Related Tables Setup
```sql
-- Quotation Table
CREATE TABLE Quotation (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    vehicle_model_id BIGINT,
    -- Other quotation fields...
    FOREIGN KEY (vehicle_model_id) REFERENCES VehicleModel(id) ON DELETE SET NULL
);

-- Vehicle Table
CREATE TABLE Vehicle (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    model_id BIGINT,
    -- Other vehicle fields...
    FOREIGN KEY (model_id) REFERENCES VehicleModel(id) ON DELETE SET NULL
);

-- Lead Table
CREATE TABLE Lead (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    preferred_model_id BIGINT,
    -- Other lead fields...
    FOREIGN KEY (preferred_model_id) REFERENCES VehicleModel(id) ON DELETE SET NULL
);
```

## 3. Base VehicleModel Test Data

### 3.1 Standard Vehicle Models
```sql
-- Insert standard vehicle models for basic CRUD testing
INSERT INTO VehicleModel (name, code, description, category, base_price, status) VALUES
('Civic Sedan', 'CIV-SED-001', 'Compact sedan with excellent fuel efficiency', 'Sedan', 22000.00, 'active'),
('Accord Sedan', 'ACC-SED-001', 'Mid-size sedan with premium features', 'Sedan', 28000.00, 'active'),
('CR-V EX', 'CRV-EX-001', 'Compact SUV with versatile interior', 'SUV', 32000.00, 'active'),
('Pilot Touring', 'PIL-TOU-001', 'Full-size SUV with family-friendly features', 'SUV', 42000.00, 'active'),
('Odyssey EX-L', 'ODY-EXL-001', 'Minivan with advanced safety features', 'Minivan', 38000.00, 'active');
```

### 3.2 Edge Case Vehicle Models
```sql
-- Models for boundary and validation testing
INSERT INTO VehicleModel (name, code, description, category, base_price, status) VALUES
('Model Max Name', 'MOD-MAX-001', 'This is a model with maximum name length to test boundary conditions', 'Sedan', 25000.00, 'active'),
('Model Max Code', 'MAXCODE123', 'Model with maximum code length', 'SUV', 35000.00, 'active'),
('Model Max Desc', 'MOD-DESC-001', 'This is a model with a very long description that should test the maximum length allowed for the description field in the database to ensure proper validation', 'Minivan', 40000.00, 'active'),
('Model Min Price', 'MOD-MIN-001', 'Model with minimum allowed price', 'Sedan', 0.01, 'active'),
('Model Max Price', 'MOD-MAX-002', 'Model with high price value', 'SUV', 999999.99, 'active'),
('Inactive Model', 'INACT-001', 'Model with inactive status for filtering tests', 'Sedan', 26000.00, 'inactive');
```

### 3.3 Models for Relationship Testing
```sql
-- Models that will have related records for foreign key testing
INSERT INTO VehicleModel (name, code, description, category, base_price, status) VALUES
('Model With Relations', 'MOD-REL-001', 'Model that will have related records in other tables', 'Sedan', 30000.00, 'active'),
('Model For Deletion', 'MOD-DEL-001', 'Model designed to test deletion with existing relations', 'SUV', 35000.00, 'active');
```

## 4. Related Test Data Setup

### 4.1 Quotation Test Data
```sql
-- Insert quotations that reference vehicle models
INSERT INTO Quotation (vehicle_model_id, quotation_number, customer_id, amount) VALUES
(1, 'Q-2025-001', 1, 22000.00),
(1, 'Q-2025-002', 2, 21500.00),
(3, 'Q-2025-003', 3, 32000.00),
(8, 'Q-2025-004', 4, 30000.00), -- References Model With Relations
(9, 'Q-2025-005', 5, 35000.00); -- References Model For Deletion
```

### 4.2 Vehicle Test Data
```sql
-- Insert vehicles that reference vehicle models
INSERT INTO Vehicle (model_id, vin, license_plate, year) VALUES
(1, '1HGCM82633A123456', 'ABC123', 2023),
(2, '1HGCP2F32AA123456', 'DEF456', 2023),
(3, '5J6RE4H51LL123456', 'GHI789', 2024),
(8, '1HGBH41JXMN123456', 'JKL012', 2024), -- References Model With Relations
(9, '1FAFP4041YF123456', 'MNO345', 2023); -- References Model For Deletion
```

### 4.3 Lead Test Data
```sql
-- Insert leads that reference vehicle models
INSERT INTO Lead (preferred_model_id, name, email, phone) VALUES
(1, 'John Doe', 'john.doe@example.com', '555-0101'),
(2, 'Jane Smith', 'jane.smith@example.com', '555-0102'),
(4, 'Bob Johnson', 'bob.johnson@example.com', '555-0103'),
(8, 'Alice Brown', 'alice.brown@example.com', '555-0104'), -- References Model With Relations
(9, 'Charlie Wilson', 'charlie.wilson@example.com', '555-0105'); -- References Model For Deletion
```

## 5. User Test Data for Audit Logging

### 5.1 Test Users
```sql
-- Create users for audit logging verification
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert test users
INSERT INTO users (username, email, role) VALUES
('testadmin', 'admin@test.com', 'admin'),
('testuser1', 'user1@test.com', 'user'),
('testuser2', 'user2@test.com', 'user'),
('testmanager', 'manager@test.com', 'manager');
```

### 5.2 Authentication Setup
For integration tests requiring authentication:
- **Admin Token**: Valid JWT token for admin user (ID: 1)
- **User Token**: Valid JWT token for regular user (ID: 2)
- **Manager Token**: Valid JWT token for manager user (ID: 4)
- **Expired Token**: Expired JWT token for authentication error testing
- **Invalid Token**: Malformed JWT token for validation error testing

## 6. Test Data Sets by Module

### 6.1 Module 1: CRUD Operations Data
- **Active Models**: Models 1-5 from base data
- **Expected Operations**: Create, read, update, delete basic operations
- **Verification Points**: Basic persistence, retrieval, update, and deletion

### 6.2 Module 2: Validation and Business Rules Data
- **Max Length Models**: Models 7-9 for boundary testing
- **Min/Max Values**: Models 10-11 for numeric boundary testing
- **Status Models**: Model 12 for status transition testing
- **Expected Operations**: Validation rule violations, business rule enforcement
- **Verification Points**: Error responses, constraint violations

### 6.3 Module 3: Filtering and Search Data
- **Mixed Status Models**: Both active and inactive models
- **Various Categories**: Models from different categories
- **Search Terms**: Models with names containing specific terms
- **Expected Operations**: Pagination, sorting, filtering, searching
- **Verification Points**: Correct filtering, accurate search results, proper pagination

### 6.4 Module 4: Audit Logging Data
- **User Context**: Operations performed by different users
- **Action Types**: Create, read, update, delete operations
- **Data Changes**: Operations that modify data
- **Expected Operations**: All operations with audit logging verification
- **Verification Points**: Complete audit trail, accurate data capture

### 6.5 Module 5: Relationship Integrity Data
- **Related Records**: Models 8-9 with existing relations
- **Foreign Key References**: Records in Quotation, Vehicle, Lead tables
- **Expected Operations**: Delete operations with existing references
- **Verification Points**: Soft delete behavior, referential integrity

## 7. Test Data Reset Procedures

### 7.1 Full Database Reset
```sql
-- Procedure to reset all test data
DELIMITER //
CREATE PROCEDURE ResetTestDataBase()
BEGIN
    -- Clear activity logs
    TRUNCATE TABLE activity_logs;
    
    -- Clear related tables first (due to foreign keys)
    TRUNCATE TABLE Quotation;
    TRUNCATE TABLE Vehicle;
    TRUNCATE TABLE Lead;
    
    -- Clear main table
    TRUNCATE TABLE VehicleModel;
    
    -- Reset auto increment counters
    ALTER TABLE VehicleModel AUTO_INCREMENT = 1;
    ALTER TABLE activity_logs AUTO_INCREMENT = 1;
    ALTER TABLE Quotation AUTO_INCREMENT = 1;
    ALTER TABLE Vehicle AUTO_INCREMENT = 1;
    ALTER TABLE Lead AUTO_INCREMENT = 1;
    
    -- Re-insert base test data
    -- [Insert all base test data from sections above]
END //
DELIMITER ;
```

### 7.2 Selective Data Reset
```sql
-- Reset only VehicleModel and related audit logs
DELETE FROM activity_logs WHERE entity_type = 'VehicleModel';
DELETE FROM VehicleModel;
-- Re-insert VehicleModel test data only
```

### 7.3 Test Session Isolation
- **Database Transactions**: Use transactions for each test to ensure isolation
- **Rollback**: Rollback transactions after test completion
- **Connection Pooling**: Use separate connections for concurrent tests

## 8. Test Data Verification

### 8.1 Data Integrity Checks
```sql
-- Verify record counts
SELECT 'VehicleModel count:', COUNT(*) FROM VehicleModel;
SELECT 'Quotation count:', COUNT(*) FROM Quotation;
SELECT 'Vehicle count:', COUNT(*) FROM Vehicle;
SELECT 'Lead count:', COUNT(*) FROM Lead;
SELECT 'Activity logs count:', COUNT(*) FROM activity_logs;

-- Verify foreign key relationships
SELECT 'Quotations with valid models:', COUNT(*) FROM Quotation WHERE vehicle_model_id IS NOT NULL;
SELECT 'Vehicles with valid models:', COUNT(*) FROM Vehicle WHERE model_id IS NOT NULL;
SELECT 'Leads with valid models:', COUNT(*) FROM Lead WHERE preferred_model_id IS NOT NULL;
```

### 8.2 Data Consistency Checks
- **Status Consistency**: Verify all models have valid status values
- **Price Validation**: Ensure all prices are positive numbers
- **Relationship Integrity**: Verify all foreign keys reference valid records
- **Audit Log Completeness**: Verify all operations have corresponding audit entries

## 9. Test Data Maintenance

### 9.1 Data Versioning
- **Version Numbers**: Include version numbers in test data identifiers
- **Change Tracking**: Maintain log of test data changes
- **Compatibility**: Ensure test data is compatible with API and schema versions

### 9.2 Data Refresh Strategy
- **Scheduled Refresh**: Refresh test data on scheduled basis
- **On-Demand Refresh**: Refresh test data before major test executions
- **Incremental Updates**: Update only changed portions when possible

### 9.3 Data Security
- **No Production Data**: Ensure no production data is used in test environment
- **Data Anonymization**: Use anonymized data for privacy-sensitive fields
- **Access Control**: Restrict access to test data setup procedures

## 10. Test Data Environment Configuration

### 10.1 Environment Variables
```bash
# Test database configuration
TEST_DB_HOST=localhost
TEST_DB_PORT=3306
TEST_DB_NAME=vehiclemodel_test
TEST_DB_USER=test_user
TEST_DB_PASSWORD=test_password

# Test API configuration
TEST_API_URL=http://localhost:3000/api
TEST_API_VERSION=v1

# Test authentication
TEST_ADMIN_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
TEST_USER_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
TEST_MANAGER_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 10.2 Configuration Files
```json
// test-config.json
{
  "database": {
    "host": "localhost",
    "port": 3306,
    "name": "vehiclemodel_test",
    "user": "test_user",
    "password": "test_password"
  },
  "api": {
    "baseUrl": "http://localhost:3000/api",
    "version": "v1",
    "timeout": 30000
  },
  "auth": {
    "adminToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "managerToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---
**Approvals**:

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Test Lead | | | |
| Development Lead | | | |
| Database Administrator | | | |