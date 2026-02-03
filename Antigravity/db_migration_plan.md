# Database Migration Plan
## CR-20250131-002 Implementation

**Date**: 2026-02-01  
**Version**: 1.0  
**Status**: Ready for Implementation

---

## 📋 Overview

This migration plan covers the database schema changes required to implement:
1. **System Administration Module**: RBAC, Audit Logs, System Settings, Monitoring
2. **Insurance Module**: Contracts and Claims

---

## 🔧 Migration Steps

### Phase 1: System Administration Tables

#### 1.1 Create Roles and Permissions Tables

```sql
-- Create roles table
CREATE TABLE roles (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    is_system BOOLEAN DEFAULT false,
    created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP(3)
);

-- Create permissions table
CREATE TABLE permissions (
    id VARCHAR(36) PRIMARY KEY,
    module VARCHAR(50) NOT NULL,
    entity VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Create role_permissions junction table
CREATE TABLE role_permissions (
    id VARCHAR(36) PRIMARY KEY,
    role_id VARCHAR(36) NOT NULL,
    permission_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    UNIQUE(role_id, permission_id)
);

-- Add role_id to users table
ALTER TABLE users ADD COLUMN role_id VARCHAR(36);
ALTER TABLE users ADD FOREIGN KEY (role_id) REFERENCES roles(id);
```

#### 1.2 Create Audit Logs Table

```sql
CREATE TABLE activity_logs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(36) NOT NULL,
    old_value JSON,
    new_value JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create index for better query performance
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);
```

#### 1.3 Create System Settings Table

```sql
CREATE TABLE system_settings (
    id VARCHAR(36) PRIMARY KEY,
    key VARCHAR(100) NOT NULL UNIQUE,
    value TEXT,
    type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    category VARCHAR(50) DEFAULT 'general',
    is_public BOOLEAN DEFAULT false,
    is_sensitive BOOLEAN DEFAULT false,
    description TEXT,
    created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(36),
    FOREIGN KEY (updated_by) REFERENCES users(id)
);
```

#### 1.4 Create System Metrics Table (for Monitoring)

```sql
CREATE TABLE system_metrics (
    id VARCHAR(36) PRIMARY KEY,
    metric_type VARCHAR(50) NOT NULL,
    metric_name VARCHAR(50) NOT NULL,
    value DECIMAL(15,4) NOT NULL,
    unit VARCHAR(20),
    timestamp TIMESTAMP(3) NOT NULL,
    metadata JSON,
    created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Create index for metrics queries
CREATE INDEX idx_system_metrics_type_timestamp ON system_metrics(metric_type, timestamp);
```

### Phase 2: Insurance Module Tables

#### 2.1 Create Insurance Contracts Table

```sql
CREATE TABLE insurance_contracts (
    id VARCHAR(36) PRIMARY KEY,
    contract_number VARCHAR(20) NOT NULL UNIQUE,
    customer_id VARCHAR(36) NOT NULL,
    vehicle_id VARCHAR(36) NOT NULL,
    insurance_type ENUM('bao_vien_than', 'bao_vat_chat', 'dung_chung') NOT NULL,
    premium_amount DECIMAL(12,2) NOT NULL,
    coverage_amount DECIMAL(15,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('active', 'expired', 'cancelled', 'pending') DEFAULT 'pending',
    policy_number VARCHAR(50),
    insurance_company VARCHAR(100),
    notes TEXT,
    created_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Create indexes for insurance contracts
CREATE INDEX idx_insurance_contracts_customer ON insurance_contracts(customer_id);
CREATE INDEX idx_insurance_contracts_vehicle ON insurance_contracts(vehicle_id);
CREATE INDEX idx_insurance_contracts_status ON insurance_contracts(status);
CREATE INDEX idx_insurance_contracts_dates ON insurance_contracts(start_date, end_date);
```

#### 2.2 Create Insurance Claims Table

```sql
CREATE TABLE insurance_claims (
    id VARCHAR(36) PRIMARY KEY,
    claim_number VARCHAR(20) NOT NULL UNIQUE,
    contract_id VARCHAR(36) NOT NULL,
    incident_date DATE NOT NULL,
    incident_type VARCHAR(100) NOT NULL,
    incident_description TEXT,
    claim_amount DECIMAL(12,2) NOT NULL,
    approved_amount DECIMAL(12,2),
    status ENUM('submitted', 'reviewing', 'approved', 'rejected', 'paid') DEFAULT 'submitted',
    approval_notes TEXT,
    rejection_reason TEXT,
    payment_date DATE,
    payment_reference VARCHAR(50),
    incident_photos JSON,
    supporting_documents JSON,
    created_by VARCHAR(36) NOT NULL,
    reviewed_by VARCHAR(36),
    approved_by VARCHAR(36),
    created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contract_id) REFERENCES insurance_contracts(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (reviewed_by) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id)
);

-- Create indexes for insurance claims
CREATE INDEX idx_insurance_claims_contract ON insurance_claims(contract_id);
CREATE INDEX idx_insurance_claims_status ON insurance_claims(status);
CREATE INDEX idx_insurance_claims_incident_date ON insurance_claims(incident_date);
```

### Phase 3: Seed Data

#### 3.1 Seed Default Roles

```sql
-- Insert default system roles
INSERT INTO roles (id, name, description, is_system) VALUES
('rol-001', 'SUPER_ADMIN', 'Super Administrator with full access', true),
('rol-002', 'ADMIN', 'System Administrator', true),
('rol-003', 'MANAGER', 'Department Manager', true),
('rol-004', 'SALES_REP', 'Sales Representative', true),
('rol-005', 'SERVICE_ADVISOR', 'Service Advisor', true),
('rol-006', 'TECHNICIAN', 'Technician', true),
('rol-007', 'PARTS_STAFF', 'Parts Staff', true),
('rol-008', 'ACCOUNTANT', 'Accountant', true),
('rol-009', 'INSURANCE_STAFF', 'Insurance Staff', true);
```

#### 3.2 Seed Default Permissions

```sql
-- Insert default permissions
INSERT INTO permissions (id, module, entity, action, description) VALUES
-- Admin permissions
('perm-001', 'admin', 'user', 'read', 'View user information'),
('perm-002', 'admin', 'user', 'create', 'Create new user'),
('perm-003', 'admin', 'user', 'update', 'Update user information'),
('perm-004', 'admin', 'user', 'delete', 'Delete user'),
('perm-005', 'admin', 'role', 'read', 'View role information'),
('perm-006', 'admin', 'role', 'create', 'Create new role'),
('perm-007', 'admin', 'role', 'update', 'Update role information'),
('perm-008', 'admin', 'role', 'delete', 'Delete role'),
('perm-009', 'admin', 'permission', 'read', 'View permission information'),
('perm-010', 'admin', 'audit_log', 'read', 'View audit logs'),
('perm-011', 'admin', 'setting', 'read', 'View system settings'),
('perm-012', 'admin', 'setting', 'update', 'Update system settings'),
('perm-013', 'admin', 'monitoring', 'read', 'View system monitoring data'),

-- Insurance permissions
('perm-014', 'insurance', 'contract', 'read', 'View insurance contracts'),
('perm-015', 'insurance', 'contract', 'create', 'Create insurance contract'),
('perm-016', 'insurance', 'contract', 'update', 'Update insurance contract'),
('perm-017', 'insurance', 'contract', 'delete', 'Delete insurance contract'),
('perm-018', 'insurance', 'claim', 'read', 'View insurance claims'),
('perm-019', 'insurance', 'claim', 'create', 'Create insurance claim'),
('perm-020', 'insurance', 'claim', 'update', 'Update insurance claim'),
('perm-021', 'insurance', 'claim', 'approve', 'Approve insurance claim'),
('perm-022', 'insurance', 'claim', 'reject', 'Reject insurance claim');
```

#### 3.3 Seed Role-Permission Assignments

```sql
-- Assign permissions to SUPER_ADMIN (all permissions)
INSERT INTO role_permissions (id, role_id, permission_id)
SELECT gen_random_uuid(), 'rol-001', id FROM permissions;

-- Assign permissions to ADMIN (most admin permissions, no monitoring)
INSERT INTO role_permissions (id, role_id, permission_id)
SELECT gen_random_uuid(), 'rol-002', id FROM permissions 
WHERE id NOT IN ('perm-013');

-- Assign permissions to MANAGER (read-only admin, some insurance)
INSERT INTO role_permissions (id, role_id, permission_id)
SELECT gen_random_uuid(), 'rol-003', id FROM permissions 
WHERE module IN ('admin', 'insurance') 
AND action IN ('read', 'approve', 'reject')
AND permission_id NOT IN ('perm-004', 'perm-008', 'perm-012');

-- Assign insurance permissions to INSURANCE_STAFF
INSERT INTO role_permissions (id, role_id, permission_id) VALUES
(gen_random_uuid(), 'rol-009', 'perm-014'),
(gen_random_uuid(), 'rol-009', 'perm-015'),
(gen_random_uuid(), 'rol-009', 'perm-016'),
(gen_random_uuid(), 'rol-009', 'perm-018'),
(gen_random_uuid(), 'rol-009', 'perm-019'),
(gen_random_uuid(), 'rol-009', 'perm-020');
```

#### 3.4 Seed Default System Settings

```sql
-- Insert default system settings
INSERT INTO system_settings (id, key, value, type, category, is_public, description) VALUES
('set-001', 'app_name', 'Honda Dealer Management System', 'string', 'general', true, 'Application name'),
('set-002', 'app_version', '2.1.0', 'string', 'general', true, 'Application version'),
('set-003', 'timezone', 'Asia/Ho_Chi_Minh', 'string', 'general', false, 'System timezone'),
('set-004', 'date_format', 'DD/MM/YYYY', 'string', 'general', false, 'Default date format'),
('set-005', 'session_timeout', '3600', 'number', 'security', false, 'Session timeout in seconds'),
('set-006', 'password_min_length', '8', 'number', 'security', false, 'Minimum password length'),
('set-007', 'password_require_complexity', 'true', 'boolean', 'security', false, 'Require complex passwords'),
('set-008', 'audit_log_retention_days', '365', 'number', 'audit', false, 'Audit log retention period'),
('set-009', 'metrics_retention_days', '30', 'number', 'monitoring', false, 'System metrics retention period'),
('set-010', 'smtp_host', '', 'string', 'email', false, 'SMTP server host'),
('set-011', 'smtp_port', '587', 'number', 'email', false, 'SMTP server port'),
('set-012', 'smtp_username', '', 'string', 'email', false, 'SMTP username'),
('set-013', 'smtp_password', '', 'string', 'email', true, 'SMTP password'),
('set-014', 'sms_gateway_url', '', 'string', 'sms', false, 'SMS gateway URL'),
('set-015', 'insurance_claim_auto_approve_limit', '10000000', 'number', 'insurance', false, 'Auto-approve limit for insurance claims');
```

---

## 🔄 Rollback Plan

### Rollback SQL

```sql
-- Drop insurance tables
DROP TABLE IF EXISTS insurance_claims;
DROP TABLE IF EXISTS insurance_contracts;

-- Drop system administration tables
DROP TABLE IF EXISTS system_metrics;
DROP TABLE IF EXISTS system_settings;
DROP TABLE IF EXISTS activity_logs;
DROP TABLE IF EXISTS role_permissions;
DROP TABLE IF EXISTS permissions;
DROP TABLE IF EXISTS roles;

-- Remove role_id from users table
ALTER TABLE users DROP COLUMN IF EXISTS role_id;
```

---

## ✅ Validation Steps

1. **Check Table Creation**: Verify all tables are created with correct columns and constraints
2. **Check Indexes**: Verify all indexes are created for performance
3. **Check Foreign Keys**: Verify all foreign key relationships are properly established
4. **Check Seed Data**: Verify default roles, permissions, and settings are populated
5. **Check Constraints**: Verify all constraints (NOT NULL, UNIQUE, ENUM) are working
6. **Performance Test**: Test queries with sample data to ensure acceptable performance

---

## ⚠️ Important Notes

1. **Execution Order**: Must follow the phase order to maintain referential integrity
2. **Backup**: Always create a full backup before executing migrations
3. **Testing**: Execute in development environment first
4. **Performance**: Monitor performance after migration, especially with large datasets
5. **Data Migration**: If migrating existing data, create separate data migration scripts
6. **Application Downtime**: Plan for appropriate downtime window during production deployment

---

**End of Migration Plan**