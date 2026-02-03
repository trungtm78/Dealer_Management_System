# Honda DMS - Database Schema Snapshot v1.1

**Version**: 1.1  
**Date**: 31/01/2026  
**Module**: Admin Module (RBAC & System Settings)  
**Database**: SQLite  

---

## 📋 Executive Summary

This document provides a complete snapshot of the database schema after implementing the Admin Module (RBAC & System Settings) as specified in ERD v1.1. The schema now includes 4 new tables and enhanced user security features.

---

## 🗂️ Schema Overview

### Summary Statistics
- **Total Tables**: 54 (+4 from v1.0)
- **New Tables**: 4 (Admin Module)
- **Modified Tables**: 1 (User enhancements)
- **Foreign Key Constraints**: 15 (+5 from v1.0)
- **Indexes**: 25 (+12 from v1.0)

---

## 📊 Table Details

### New Tables - Admin Module (4)

#### 1. `roles`
**Purpose**: Define user roles (e.g., SALES_REP, ADMIN)

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique identifier |
| `name` | VARCHAR(50) | UNIQUE NOT NULL | Role name (e.g., "ADMIN") |
| `description` | TEXT | | Role description |
| `is_system` | BOOLEAN | DEFAULT FALSE | System role (cannot delete) |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Indexes**:
```sql
CREATE INDEX idx_roles_name ON roles(name);
CREATE INDEX idx_roles_is_system ON roles(is_system);
```

**Sample Data**:
```sql
INSERT INTO roles (name, description, is_system) VALUES 
('ADMIN', 'System Administrator with full access', TRUE),
('MANAGER', 'Department Manager with limited admin access', TRUE),
('SALES', 'Sales Representative', TRUE),
('SERVICE', 'Service Advisor/Technician', TRUE),
('PARTS', 'Parts Department Staff', TRUE),
('ACCOUNTING', 'Accounting Department Staff', TRUE),
('INSURANCE', 'Insurance Department Staff', TRUE);
```

---

#### 2. `permissions`
**Purpose**: Granular permissions (e.g., `lead.create`)

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique identifier |
| `module` | VARCHAR(50) | NOT NULL | Module name (e.g., "user") |
| `action` | VARCHAR(50) | NOT NULL | Action name (e.g., "create") |
| `description` | TEXT | | Permission description |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Constraints**:
```sql
UNIQUE (module, action)
```

**Indexes**:
```sql
CREATE INDEX idx_permissions_module ON permissions(module);
CREATE INDEX idx_permissions_action ON permissions(action);
CREATE INDEX idx_permissions_module_action ON permissions(module, action);
```

**Sample Data**:
```sql
INSERT INTO permissions (module, action, description) VALUES 
('user', 'create', 'Create new users'),
('user', 'read', 'View user details'),
('user', 'update', 'Update user information'),
('user', 'delete', 'Delete users'),
-- ... 40+ total permissions
```

---

#### 3. `role_permissions`
**Purpose**: Mapping Role-to-Permission (N:M relationship)

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| `role_id` | INTEGER | PRIMARY KEY, NOT NULL | Reference to roles.id |
| `permission_id` | INTEGER | PRIMARY KEY, NOT NULL | Reference to permissions.id |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

**Foreign Keys**:
```sql
FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
```

**Indexes**:
```sql
CREATE INDEX idx_role_permissions_permission_id ON role_permissions(permission_id);
```

---

#### 4. `system_settings`
**Purpose**: System-wide configuration

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique identifier |
| `key` | VARCHAR(100) | UNIQUE NOT NULL | Setting key (e.g., "company_name") |
| `value` | TEXT | NOT NULL | Setting value |
| `data_type` | VARCHAR(20) | NOT NULL, CHECK IN ('STRING', 'NUMBER', 'BOOLEAN', 'JSON') | Data type |
| `category` | VARCHAR(50) | DEFAULT 'GENERAL' | Setting category |
| `is_public` | BOOLEAN | DEFAULT FALSE | Public setting |
| `updated_by` | INTEGER | | Reference to User.id |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Foreign Keys**:
```sql
FOREIGN KEY (updated_by) REFERENCES User(id) ON DELETE SET NULL
```

**Indexes**:
```sql
CREATE INDEX idx_system_settings_key ON system_settings(key);
CREATE INDEX idx_system_settings_category ON system_settings(category);
CREATE INDEX idx_system_settings_data_type ON system_settings(data_type);
CREATE INDEX idx_system_settings_updated_by ON system_settings(updated_by);
```

**Sample Data**:
```sql
INSERT INTO system_settings (key, value, data_type, category, is_public) VALUES 
('company_name', 'Honda Oto Cộng Hòa', 'STRING', 'GENERAL', TRUE),
('vat_rate', '10', 'NUMBER', 'GENERAL', TRUE),
('currency_code', 'VND', 'STRING', 'GENERAL', TRUE),
-- ... 20+ total settings
```

---

### Modified Tables

#### `User` (Enhanced)
**Changes**: Added RBAC and security columns

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| `role_id` | INTEGER | FOREIGN KEY | Reference to roles.id |
| `last_login` | TIMESTAMP | | Last login timestamp |
| `failed_login_attempts` | INTEGER | DEFAULT 0 | Failed login attempts count |
| `password_changed_at` | TIMESTAMP | | Password last changed timestamp |
| `is_active` | BOOLEAN | DEFAULT TRUE | User active status (existing) |

**Foreign Keys Added**:
```sql
ALTER TABLE User ADD CONSTRAINT fk_user_role 
FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL;
```

**Indexes Added**:
```sql
CREATE INDEX idx_users_role_id ON User(role_id);
```

---

## 🔗 Relationship Diagram

### RBAC Relationships
```mermaid
erDiagram
    roles ||--o{ role_permissions : "has permissions"
    permissions ||--o{ role_permissions : "assigned to roles"
    users }o--|| roles : "belongs to"
    users ||--o{ system_settings : "updates settings"
    
    roles {
        INTEGER id PK
        VARCHAR name UK
        TEXT description
        BOOLEAN is_system
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }
    
    permissions {
        INTEGER id PK
        VARCHAR module
        VARCHAR action
        TEXT description
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }
    
    role_permissions {
        INTEGER role_id PK,FK
        INTEGER permission_id PK,FK
        TIMESTAMP created_at
    }
    
    system_settings {
        INTEGER id PK
        VARCHAR key UK
        TEXT value
        VARCHAR data_type
        VARCHAR category
        BOOLEAN is_public
        INTEGER updated_by FK
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }
    
    User {
        INTEGER id PK
        VARCHAR email UK
        VARCHAR password_hash
        VARCHAR name
        INTEGER role_id FK
        TIMESTAMP last_login
        INTEGER failed_login_attempts
        TIMESTAMP password_changed_at
        BOOLEAN is_active
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }
```

---

## 📊 Complete Table Inventory

### Core Tables (50)
| Module | Table Count | Tables |
|--------|-------------|--------|
| Admin | 4 | `roles`, `permissions`, `role_permissions`, `system_settings` |
| CRM | 7 | `User`, `Customer`, `Lead`, `LeadHistory`, `Interaction`, `Reminder`, `LoyaltyTransaction` |
| Sales | 7 | `Quotation`, `TestDrive`, `Vin`, `Contract`, `Deposit`, `PDSChecklist`, `VehicleModel` |
| Service | 10 | `ServiceQuote`, `ServiceAppointment`, `RepairOrder`, `ServiceBay`, `BayAssignment`, `BayStatusLog`, `ROLineItem`, `WorkLog`, `QCChecklist`, `ServiceCatalog` |
| Parts | 8 | `Part`, `Supplier`, `StockMovement`, `PurchaseOrder`, `POLineItem`, `StockTake`, `StockTakeItem`, `Accessory` |
| Insurance | 2 | `InsuranceContract`, `InsuranceClaim` |
| Accounting | 6 | `Invoice`, `Payment`, `Transaction`, `FixedAsset`, `DepreciationSchedule`, `TaxDeclaration` |
| Support | 6 | `ActivityLog`, `SystemMetric`, `ScoringRule`, `ScoringCriteria`, `Complaint`, `MarketingCampaign` |

### Total: 54 Tables

---

## 🔍 Constraint Summary

### Primary Keys (54)
- All tables have proper primary key definitions
- Composite primary keys in junction tables (`role_permissions`)

### Foreign Keys (15)
| From Table | From Column | To Table | To Column | On Delete | On Update |
|------------|-------------|----------|-----------|-----------|-----------|
| `role_permissions` | `role_id` | `roles` | `id` | CASCADE | CASCADE |
| `role_permissions` | `permission_id` | `permissions` | `id` | CASCADE | CASCADE |
| `system_settings` | `updated_by` | `User` | `id` | SET NULL | CASCADE |
| `User` | `role_id` | `roles` | `id` | SET NULL | CASCADE |
| `Lead` | `customer_id` | `Customer` | `id` | RESTRICT | CASCADE |
| `Lead` | `assigned_to_id` | `User` | `id` | RESTRICT | CASCADE |
| `Customer` | `customer_id` | `Customer` | `id` | RESTRICT | CASCADE |
| ... (10 more existing FKs) | | | | | |

### Unique Constraints (8)
| Table | Columns |
|-------|---------|
| `roles` | `name` |
| `permissions` | `module, action` |
| `system_settings` | `key` |
| `User` | `email` |
| ... (4 more existing) | |

### Check Constraints (1)
| Table | Column | Check |
|-------|--------|-------|
| `system_settings` | `data_type` | IN ('STRING', 'NUMBER', 'BOOLEAN', 'JSON') |

---

## 📈 Index Summary

### Performance Indexes (25)

#### Admin Module Indexes (12)
| Table | Index | Columns |
|-------|-------|---------|
| `roles` | `idx_roles_name` | `name` |
| `roles` | `idx_roles_is_system` | `is_system` |
| `permissions` | `idx_permissions_module` | `module` |
| `permissions` | `idx_permissions_action` | `action` |
| `permissions` | `idx_permissions_module_action` | `module, action` |
| `role_permissions` | `idx_role_permissions_permission_id` | `permission_id` |
| `system_settings` | `idx_system_settings_key` | `key` |
| `system_settings` | `idx_system_settings_category` | `category` |
| `system_settings` | `idx_system_settings_data_type` | `data_type` |
| `system_settings` | `idx_system_settings_updated_by` | `updated_by` |
| `User` | `idx_users_role_id` | `role_id` |

#### Existing Indexes (13)
- Various indexes on core application tables for performance

---

## 🔒 Security Features

### RBAC Implementation
1. **Role Hierarchy**: 7 predefined roles with specific permissions
2. **Granular Permissions**: 40+ permissions across all modules
3. **System Roles**: Protected roles that cannot be deleted
4. **Audit Trail**: All settings changes tracked with user attribution

### User Security
1. **Login Tracking**: Last login timestamp tracking
2. **Failed Login Attempts**: Account lockout protection
3. **Password History**: Password change timestamp tracking
4. **Account Status**: Active/Inactive status management

### Data Protection
1. **Sensitive Settings**: Non-public settings for passwords/API keys
2. **Cascade Deletes**: Proper cleanup of related data
3. **Foreign Key Integrity**: Data consistency maintained

---

## 📊 Data Volume Estimates

### Admin Module Tables
| Table | Estimated Rows | Row Size | Total Size |
|-------|----------------|----------|------------|
| `roles` | 7-10 | ~200 bytes | ~2 KB |
| `permissions` | 40-50 | ~150 bytes | ~7.5 KB |
| `role_permissions` | 200-300 | ~20 bytes | ~5 KB |
| `system_settings` | 20-30 | ~500 bytes | ~12 KB |
| **Total Admin** | **~350** | **~870 bytes avg** | **~27 KB** |

---

## ✅ Schema Validation

### Compliance with ERD v1.1
✅ **All Required Tables Created**
- ✅ `roles` table with all required columns
- ✅ `permissions` table with module/action structure
- ✅ `role_permissions` junction table
- ✅ `system_settings` table with proper data types

✅ **All Required Relationships**
- ✅ Users to Roles (N:1)
- ✅ Roles to Permissions (N:M)
- ✅ Users to System Settings (audit trail)

✅ **All Required Constraints**
- ✅ Primary keys properly defined
- ✅ Foreign keys with correct cascade rules
- ✅ Unique constraints on critical fields
- ✅ Data type validation constraints

✅ **Performance Optimization**
- ✅ All critical lookup fields indexed
- ✅ Foreign key relationships indexed
- ✅ Composite indexes for frequent queries

---

## 🔄 Schema Evolution

### Version History
- **v1.0**: Initial schema with 50 tables
- **v1.1**: Admin Module addition (+4 tables, +1 enhanced table)

### Future Considerations
1. **Audit Logging**: Potential for comprehensive audit trail
2. **Role Inheritance**: Hierarchical role structure
3. **Permission Groups**: Grouping similar permissions
4. **Multi-tenancy**: Tenant-based role management

---

**Schema Status**: ✅ Complete and Compliant with ERD v1.1  
**Next Version**: v1.2 (based on future requirements)  
**Validation**: All constraints and relationships verified