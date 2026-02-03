-- Honda DMS - Database Migration for Admin Module (RBAC & System Settings)
-- ERD Version: 1.1
-- CR: CR-20250131-002
-- Date: 31/01/2026

-- Migration: Add Admin Module Tables (roles, permissions, role_permissions, system_settings)
-- This migration implements the RBAC (Role-Based Access Control) and System Settings functionality

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- 1. Create 'roles' table
-- Purpose: Define user roles (e.g., SALES_REP, ADMIN)
CREATE TABLE roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for roles table
CREATE INDEX idx_roles_name ON roles(name);
CREATE INDEX idx_roles_is_system ON roles(is_system);

-- 2. Create 'permissions' table
-- Purpose: Granular permissions (e.g., 'lead.create')
CREATE TABLE permissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    module VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (module, action)
);

-- Create indexes for permissions table
CREATE INDEX idx_permissions_module ON permissions(module);
CREATE INDEX idx_permissions_action ON permissions(action);
CREATE INDEX idx_permissions_module_action ON permissions(module, action);

-- 3. Create 'role_permissions' table
-- Purpose: Mapping Role-to-Permission (N:M relationship)
CREATE TABLE role_permissions (
    role_id INTEGER NOT NULL,
    permission_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- Create index for role_permissions table
CREATE INDEX idx_role_permissions_permission_id ON role_permissions(permission_id);

-- 4. Create 'system_settings' table
-- Purpose: System-wide configuration
CREATE TABLE system_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    data_type VARCHAR(20) NOT NULL CHECK (data_type IN ('STRING', 'NUMBER', 'BOOLEAN', 'JSON')),
    category VARCHAR(50) DEFAULT 'GENERAL',
    is_public BOOLEAN DEFAULT FALSE,
    updated_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by) REFERENCES User(id) ON DELETE SET NULL
);

-- Create indexes for system_settings table
CREATE INDEX idx_system_settings_key ON system_settings(key);
CREATE INDEX idx_system_settings_category ON system_settings(category);
CREATE INDEX idx_system_settings_data_type ON system_settings(data_type);
CREATE INDEX idx_system_settings_updated_by ON system_settings(updated_by);

-- 5. Update 'users' table to add new columns
-- Add role_id foreign key
ALTER TABLE User ADD COLUMN role_id INTEGER;

-- Add new columns for security and audit
ALTER TABLE User ADD COLUMN last_login TIMESTAMP;
ALTER TABLE User ADD COLUMN failed_login_attempts INTEGER DEFAULT 0;
ALTER TABLE User ADD COLUMN password_changed_at TIMESTAMP;

-- Note: is_active column already exists in User table
-- If it doesn't exist, uncomment the following line:
-- ALTER TABLE User ADD COLUMN is_active BOOLEAN DEFAULT TRUE;

-- Add foreign key constraint for role_id
-- Note: This is added after the column to ensure the roles table exists
ALTER TABLE User ADD CONSTRAINT fk_user_role 
FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL;

-- Create index for users.role_id
CREATE INDEX idx_users_role_id ON User(role_id);

-- Insert default roles
INSERT INTO roles (name, description, is_system) VALUES 
('ADMIN', 'System Administrator with full access', TRUE),
('MANAGER', 'Department Manager with limited admin access', TRUE),
('SALES', 'Sales Representative', TRUE),
('SERVICE', 'Service Advisor/Technician', TRUE),
('PARTS', 'Parts Department Staff', TRUE),
('ACCOUNTING', 'Accounting Department Staff', TRUE),
('INSURANCE', 'Insurance Department Staff', TRUE);

-- Insert default permissions
INSERT INTO permissions (module, action, description) VALUES 
-- User Management
('user', 'create', 'Create new users'),
('user', 'read', 'View user details'),
('user', 'update', 'Update user information'),
('user', 'delete', 'Delete users'),
-- Role Management
('role', 'create', 'Create new roles'),
('role', 'read', 'View role details'),
('role', 'update', 'Update role information'),
('role', 'delete', 'Delete roles'),
-- Permission Management
('permission', 'create', 'Create new permissions'),
('permission', 'read', 'View permission details'),
('permission', 'update', 'Update permission information'),
('permission', 'delete', 'Delete permissions'),
-- Lead Management
('lead', 'create', 'Create new leads'),
('lead', 'read', 'View lead details'),
('lead', 'update', 'Update lead information'),
('lead', 'delete', 'Delete leads'),
-- Customer Management
('customer', 'create', 'Create new customers'),
('customer', 'read', 'View customer details'),
('customer', 'update', 'Update customer information'),
('customer', 'delete', 'Delete customers'),
-- Sales Management
('quotation', 'create', 'Create quotations'),
('quotation', 'read', 'View quotation details'),
('quotation', 'update', 'Update quotation information'),
('quotation', 'delete', 'Delete quotations'),
('contract', 'create', 'Create contracts'),
('contract', 'read', 'View contract details'),
('contract', 'update', 'Update contract information'),
('contract', 'delete', 'Delete contracts'),
-- Service Management
('service', 'create', 'Create service appointments'),
('service', 'read', 'View service details'),
('service', 'update', 'Update service information'),
('service', 'delete', 'Delete service appointments'),
-- Parts Management
('part', 'create', 'Create parts'),
('part', 'read', 'View part details'),
('part', 'update', 'Update part information'),
('part', 'delete', 'Delete parts'),
-- System Settings
('system', 'read', 'View system settings'),
('system', 'update', 'Update system settings'),
-- Reports
('report', 'read', 'View reports'),
('report', 'export', 'Export reports');

-- Insert default role-permission mappings
-- Admin gets all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'ADMIN';

-- Manager gets most permissions except user/role/permission management
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'MANAGER' 
AND p.module NOT IN ('user', 'role', 'permission')
AND p.action NOT IN ('delete');

-- Sales gets sales-related permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'SALES'
AND p.module IN ('lead', 'customer', 'quotation', 'contract', 'report')
AND p.action IN ('create', 'read', 'update');

-- Service gets service-related permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'SERVICE'
AND p.module IN ('service', 'customer', 'report')
AND p.action IN ('create', 'read', 'update');

-- Parts gets parts-related permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'PARTS'
AND p.module IN ('part', 'report')
AND p.action IN ('create', 'read', 'update');

-- Accounting gets accounting-related permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'ACCOUNTING'
AND p.module IN ('quotation', 'contract', 'report')
AND p.action IN ('read');

-- Insurance gets insurance-related permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'INSURANCE'
AND p.module IN ('customer', 'report')
AND p.action IN ('read');

-- Insert default system settings
INSERT INTO system_settings (key, value, data_type, category, is_public) VALUES 
-- General Settings
('company_name', 'Honda Oto Cộng Hòa', 'STRING', 'GENERAL', TRUE),
('vat_rate', '10', 'NUMBER', 'GENERAL', TRUE),
('currency_code', 'VND', 'STRING', 'GENERAL', TRUE),
('max_upload_size', '10485760', 'NUMBER', 'GENERAL', TRUE),
('timezone', 'Asia/Ho_Chi_Minh', 'STRING', 'GENERAL', TRUE),

-- Email Settings
('smtp_host', 'smtp.gmail.com', 'STRING', 'EMAIL', FALSE),
('smtp_port', '587', 'NUMBER', 'EMAIL', FALSE),
('smtp_username', 'noreply@honda.com', 'STRING', 'EMAIL', FALSE),
('smtp_password', 'encrypted_password_here', 'STRING', 'EMAIL', FALSE),
('use_tls', 'true', 'BOOLEAN', 'EMAIL', FALSE),
('from_email', 'noreply@honda.com', 'STRING', 'EMAIL', FALSE),

-- Security Settings
('password_min_length', '8', 'NUMBER', 'SECURITY', FALSE),
('password_require_special', 'true', 'BOOLEAN', 'SECURITY', FALSE),
('password_require_number', 'true', 'BOOLEAN', 'SECURITY', FALSE),
('password_require_uppercase', 'true', 'BOOLEAN', 'SECURITY', FALSE),
('max_login_attempts', '5', 'NUMBER', 'SECURITY', FALSE),
('session_timeout_minutes', '60', 'NUMBER', 'SECURITY', FALSE),

-- Feature Settings
('lead_scoring_enabled', 'true', 'BOOLEAN', 'FEATURES', TRUE),
('quotation_expiry_days', '7', 'NUMBER', 'FEATURES', TRUE),
('deposit_percentage_min', '10', 'NUMBER', 'FEATURES', TRUE),
('max_discount_percentage', '10', 'NUMBER', 'FEATURES', TRUE),
('notifications_enabled', 'true', 'BOOLEAN', 'FEATURES', TRUE),

-- Service Settings
('default_labor_rate', '200000', 'NUMBER', 'SERVICE', TRUE),
('service_bay_count', '5', 'NUMBER', 'SERVICE', TRUE),
('appointment_reminder_hours', '24', 'NUMBER', 'SERVICE', TRUE);

-- Migration completed successfully
-- This migration adds RBAC functionality and system settings to the database
-- All tables have proper foreign key constraints and indexes for performance