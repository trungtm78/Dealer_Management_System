# DB Migration Plan - Master Data Enhancement
**CR Reference**: CR-20250131-001 (VehicleModel Management)  
**ERD Version**: v1.1 (CR-MD-002/003/004 Enhancement)  
**Implementation Date**: 31/01/2026  
**Author**: Antigravity - Database Architect  

---

## 📋 Executive Summary

This document outlines the database migration plan for implementing the Master Data Enhancement as specified in ERD v1.1. The migration focuses on adding 4 new supporting tables to enhance the existing 6 master data entities.

**Migration Scope**:
- **Existing Tables**: 6 tables (VehicleModel, Accessory, ServiceCatalog, ServiceBay, ScoringRule, SystemSetting)
- **New Tables**: 4 supporting tables
- **Total Changes**: 4 new tables, no existing table modifications
- **Risk Level**: LOW (only new tables, no existing data affected)

---

## 🔍 Current State Analysis

### 1. Existing Tables (Already in Database)

All 6 master data tables exist with current schema:

| Table | Status | Columns | Primary Key | Current Data |
|-------|--------|---------|-------------|---------------|
| VehicleModel | ✅ Active | 8 columns | id | 8 sample records |
| Accessory | ✅ Active | 8 columns | id | 8 sample records |
| ServiceCatalog | ✅ Active | 8 columns | id | 10 sample records |
| ServiceBay | ✅ Active | 6 columns | id | 5 sample records |
| ScoringRule | ✅ Active | 6 columns | id | 8 sample records |
| SystemSetting | ✅ Active | 5 columns | id | 21 sample records |

### 2. Data Dependencies

No foreign key dependencies that would be affected by this migration. All new tables will reference existing tables.

---

## 📊 Migration Details

### 1. New Tables to Create (CR-MD-002/003/004)

#### 1.1 accessory_model_compatibility (CR-MD-002)

**Purpose**: Track which accessories are compatible with which vehicle models  
**Relationship**: Many-to-many between Accessory and VehicleModel

```sql
-- Migration: CR-MD-002-001
CREATE TABLE accessory_model_compatibility (
  accessory_id BIGINT NOT NULL COMMENT 'Reference to Accessory table',
  model_id BIGINT NOT NULL COMMENT 'Reference to VehicleModel table',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation timestamp',
  
  PRIMARY KEY (accessory_id, model_id) COMMENT 'Composite primary key',
  
  FOREIGN KEY (accessory_id) REFERENCES Accessory(id) 
    ON DELETE CASCADE COMMENT 'Delete compatibility when accessory is deleted',
    
  FOREIGN KEY (model_id) REFERENCES VehicleModel(id) 
    ON DELETE CASCADE COMMENT 'Delete compatibility when model is deleted'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Accessory-VehicleModel compatibility matrix (CR-MD-002)';
```

**Indexes**:
- Primary key index on (accessory_id, model_id)
- Foreign key indexes automatically created

**Data Migration**: Populate from historical quotation data
```sql
-- Migration Data: CR-MD-002-DATA-001
INSERT INTO accessory_model_compatibility (accessory_id, model_id)
SELECT DISTINCT qa.accessory_id, q.vehicle_model_id
FROM QuotationAccessory qa
JOIN Quotation q ON qa.quotation_id = q.id
JOIN VehicleModel vm ON q.vehicle_model_id = vm.id
WHERE vm.status = 'ACTIVE' AND qa.accessory_id IS NOT NULL;
```

#### 1.2 accessory_price_history (CR-MD-002)

**Purpose**: Track price changes for accessories with audit trail  
**Relationship**: One-to-many from Accessory

```sql
-- Migration: CR-MD-002-002
CREATE TABLE accessory_price_history (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'History record ID',
  accessory_id BIGINT NOT NULL COMMENT 'Reference to Accessory table',
  old_price DECIMAL(15,2) COMMENT 'Previous price before change',
  new_price DECIMAL(15,2) NOT NULL COMMENT 'New price after change',
  changed_by BIGINT COMMENT 'User who made the change',
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp of price change',
  
  FOREIGN KEY (accessory_id) REFERENCES Accessory(id) 
    ON DELETE CASCADE COMMENT 'Delete history when accessory is deleted',
    
  FOREIGN KEY (changed_by) REFERENCES User(id)
    ON DELETE SET NULL COMMENT 'Keep history even if user is deleted'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Accessory price change history with audit trail (CR-MD-002)';
```

**Indexes**:
```sql
-- Performance indexes
CREATE INDEX idx_price_history_accessory_id ON accessory_price_history(accessory_id);
CREATE INDEX idx_price_history_changed_at ON accessory_price_history(changed_at);
CREATE INDEX idx_price_history_changed_by ON accessory_price_history(changed_by);
```

**Data Migration**: Capture current accessory prices as initial history
```sql
-- Migration Data: CR-MD-002-DATA-002
INSERT INTO accessory_price_history (accessory_id, old_price, new_price, changed_by)
SELECT id, NULL, price, 1 -- Admin user ID
FROM Accessory
WHERE status = 'ACTIVE';
```

#### 1.3 service_packages (CR-MD-003)

**Purpose**: Define bundled service packages with discounted pricing  
**Relationship**: Parent table for service_package_items

```sql
-- Migration: CR-MD-003-001
CREATE TABLE service_packages (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'Package ID',
  package_code VARCHAR(20) UNIQUE NOT NULL COMMENT 'Format: PKG-XXX',
  package_name VARCHAR(200) UNIQUE NOT NULL COMMENT 'Package display name',
  description TEXT COMMENT 'Package description (optional)',
  discount_percentage DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Discount percentage 0-50',
  total_price DECIMAL(15,2) COMMENT 'Calculated total price (updated via trigger)',
  status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE' COMMENT 'Package availability',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Package creation timestamp',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Package update timestamp'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Service packages for bundled offerings (CR-MD-003)';
```

**Indexes**:
```sql
-- Unique constraint on package_code is already defined
CREATE INDEX idx_package_status ON service_packages(status);
CREATE INDEX idx_package_created_at ON service_packages(created_at);
```

**Data Migration**: Create initial service packages based on common service combinations
```sql
-- Migration Data: CR-MD-003-DATA-001
-- Create service packages from common service combinations
INSERT INTO service_packages (package_code, package_name, description, discount_percentage, total_price, status)
SELECT 
  CONCAT('PKG-', ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC)) as package_code,
  CONCAT(CONCAT_WS(' + ', GROUP_CONCAT(DISTINCT sc.service_name SEPARATOR ' + ')), ' Package') as package_name,
  CONCAT('Bundle includes: ', GROUP_CONCAT(DISTINCT sc.service_name SEPARATOR ', ')) as description,
  10.00 as discount_percentage,
  -- Calculate total price (labor cost only for now)
  SUM(sc.labor_hours * sc.labor_rate) as total_price,
  'ACTIVE' as status
FROM RepairOrderService ros
JOIN ServiceCatalog sc ON ros.service_id = sc.id
WHERE sc.status = 'ACTIVE'
GROUP BY sc.category
HAVING COUNT(DISTINCT sc.id) >= 2
LIMIT 3;
```

#### 1.4 service_package_items (CR-MD-003)

**Purpose**: Define which services are included in each package  
**Relationship**: Many-to-many between service_packages and ServiceCatalog

```sql
-- Migration: CR-MD-003-002
CREATE TABLE service_package_items (
  package_id BIGINT NOT NULL COMMENT 'Reference to service_packages table',
  service_id BIGINT NOT NULL COMMENT 'Reference to ServiceCatalog table',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation timestamp',
  
  PRIMARY KEY (package_id, service_id) COMMENT 'Composite primary key',
  
  FOREIGN KEY (package_id) REFERENCES service_packages(id) 
    ON DELETE CASCADE COMMENT 'Delete items when package is deleted',
    
  FOREIGN KEY (service_id) REFERENCES ServiceCatalog(id) 
    ON DELETE CASCADE COMMENT 'Delete package references when service is deleted'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Service package items - many-to-many relationship (CR-MD-003)';
```

**Indexes**:
- Primary key index on (package_id, service_id)
- Foreign key indexes automatically created

**Data Migration**: Populate package items based on the packages created above
```sql
-- Migration Data: CR-MD-003-DATA-002
-- This would be populated based on actual package definitions
-- For now, we'll create sample data for the packages created above
```

---

## 🔄 Migration Execution Plan

### Phase 1: Pre-Migration (Day 1 - Morning)

1. **Backup Database**
```sql
-- Create backup before migration
CREATE DATABASE honda_spice_erp_backup_20260131;
-- Export all data using mysqldump
mysqldump -u root -p honda_spice_erp > backup_before_migration.sql
```

2. **Verify Current State**
```sql
-- Check existing tables exist
SHOW TABLES LIKE 'VehicleModel';
SHOW TABLES LIKE 'Accessory';
SHOW TABLES LIKE 'ServiceCatalog';
SHOW TABLES LIKE 'ServiceBay';
SHOW TABLES LIKE 'ScoringRule';
SHOW TABLES LIKE 'SystemSetting';

-- Check table structures
DESCRIBE VehicleModel;
DESCRIBE Accessory;
DESCRIBE ServiceCatalog;
DESCRIBE ServiceBay;
DESCRIBE ScoringRule;
DESCRIBE SystemSetting;
```

3. **Review Foreign Key Constraints**
```sql
-- Check for any existing constraints that might interfere
SELECT TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'honda_spice_erp' AND REFERENCED_TABLE_NAME IS NOT NULL;
```

### Phase 2: Migration Execution (Day 1 - Afternoon)

1. **Execute Migration Scripts in Order**

```sql
-- Step 1: Create accessory_model_compatibility table
-- Migration: CR-MD-002-001
CREATE TABLE accessory_model_compatibility (...);

-- Step 2: Create accessory_price_history table
-- Migration: CR-MD-002-002
CREATE TABLE accessory_price_history (...);

-- Step 3: Create service_packages table
-- Migration: CR-MD-003-001
CREATE TABLE service_packages (...);

-- Step 4: Create service_package_items table
-- Migration: CR-MD-003-002
CREATE TABLE service_package_items (...);
```

2. **Execute Data Migration Scripts**

```sql
-- Step 5: Migrate compatibility matrix data
-- Migration Data: CR-MD-002-DATA-001
INSERT INTO accessory_model_compatibility (...);

-- Step 6: Migrate initial price history
-- Migration Data: CR-MD-002-DATA-002
INSERT INTO accessory_price_history (...);

-- Step 7: Create initial service packages
-- Migration Data: CR-MD-003-DATA-001
INSERT INTO service_packages (...);

-- Step 8: Migrate package items data
-- Migration Data: CR-MD-003-DATA-002
-- (This will be populated based on actual package definitions)
```

3. **Create Performance Indexes**

```sql
-- Create additional performance indexes
CREATE INDEX idx_price_history_accessory_id ON accessory_price_history(accessory_id);
CREATE INDEX idx_price_history_changed_at ON accessory_price_history(changed_at);
CREATE INDEX idx_price_history_changed_by ON accessory_price_history(changed_by);
CREATE INDEX idx_package_status ON service_packages(status);
CREATE INDEX idx_package_created_at ON service_packages(created_at);
```

### Phase 3: Post-Migration Verification (Day 1 - Evening)

1. **Verify Table Creation**
```sql
-- Check all new tables exist
SHOW TABLES LIKE 'accessory_model_compatibility';
SHOW TABLES LIKE 'accessory_price_history';
SHOW TABLES LIKE 'service_packages';
SHOW TABLES LIKE 'service_package_items';

-- Verify table structures
DESCRIBE accessory_model_compatibility;
DESCRIBE accessory_price_history;
DESCRIBE service_packages;
DESCRIBE service_package_items;
```

2. **Verify Data Integrity**
```sql
-- Check compatibility matrix data
SELECT COUNT(*) as total_compatibility_records FROM accessory_model_compatibility;
SELECT accessory_id, COUNT(*) as compatible_models FROM accessory_model_compatibility GROUP BY accessory_id;

-- Check price history data
SELECT COUNT(*) as total_price_records FROM accessory_price_history;
SELECT accessory_id, COUNT(*) as price_changes FROM accessory_price_history GROUP BY accessory_id;

-- Check service packages data
SELECT COUNT(*) as total_packages FROM service_packages WHERE status = 'ACTIVE';
SELECT * FROM service_packages;

-- Check package items data
SELECT COUNT(*) as total_package_items FROM service_package_items;
```

3. **Test Foreign Key Constraints**
```sql
-- Test foreign key constraints by trying to insert invalid data
-- This should fail
INSERT INTO accessory_model_compatibility (accessory_id, model_id) VALUES (999999, 999999);

-- Test cascade delete by creating test data and deleting parent
```

4. **Performance Test**
```sql
-- Test basic query performance
EXPLAIN SELECT * FROM accessory_model_compatibility WHERE accessory_id = 1;
EXPLAIN SELECT * FROM accessory_price_history WHERE accessory_id = 1 ORDER BY changed_at DESC LIMIT 10;
EXPLAIN SELECT * FROM service_packages WHERE status = 'ACTIVE';
```

---

## 🚨 Risk Assessment & Mitigation

### Low Risk Factors

1. **No Existing Schema Changes**: Only new tables are created, no existing tables are modified
2. **No Data Loss**: New tables only, no existing data is affected
3. **Simple Foreign Keys**: Foreign key relationships are straightforward
4. **Cascading Deletes**: Proper cascade delete rules ensure data consistency

### Potential Risks & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Foreign key constraint errors | Low | Medium | Verify all referenced data exists before migration |
| Performance impact on queries | Low | Low | Proper indexing strategy implemented |
| Data migration script errors | Low | Medium | Test scripts on staging environment first |
| Incomplete backup | Low | High | Verify backup integrity before migration |

---

## 🔄 Rollback Plan

### Immediate Rollback (If Migration Fails)

1. **Drop New Tables**
```sql
DROP TABLE IF EXISTS service_package_items;
DROP TABLE IF EXISTS service_packages;
DROP TABLE IF EXISTS accessory_price_history;
DROP TABLE IF EXISTS accessory_model_compatibility;
```

2. **Restore from Backup**
```sql
-- Restore database from backup
mysql -u root -p honda_spice_erp < backup_before_migration.sql
```

### Verification After Rollback

1. **Verify Original State**
```sql
-- Ensure only original tables exist
SHOW TABLES;
-- Ensure data is intact
SELECT COUNT(*) FROM VehicleModel;
SELECT COUNT(*) FROM Accessory;
-- etc.
```

---

## 📊 Migration Success Criteria

### Technical Success
- ✅ All 4 new tables created successfully
- ✅ All foreign key constraints working
- ✅ All indexes created successfully
- ✅ Data migration completed without errors
- ✅ No existing functionality broken

### Data Quality Success
- ✅ Compatibility matrix populated with historical data
- ✅ Initial price history captured for all accessories
- ✅ Service packages created based on common combinations
- ✅ All foreign key relationships validated
- ✅ Data integrity checks passed

### Performance Success
- ✅ Query performance meets requirements (< 500ms for standard queries)
- ✅ Index usage optimized
- ✅ No blocking of existing operations
- ✅ Memory usage within expected limits

---

## 📋 Post-Migration Tasks

### 1. Update Documentation
- [ ] Update ERD documentation with new tables
- [ ] Update data dictionary with new table schemas
- [ ] Update API specification documentation
- [ ] Update application configuration if needed

### 2. Monitor Performance
- [ ] Monitor query performance on new tables
- [ ] Check index usage statistics
- [ ] Monitor database connection pool usage
- [ ] Set up alerts for performance degradation

### 3. Team Communication
- [ ] Notify development team about new tables
- [ ] Provide data access guidelines
- [ ] Schedule code integration planning
- [ ] Plan UAT testing inclusion

---

## 📝 Appendix

### A. Migration Scripts

All migration scripts are available in:
- `/docs/implementation/database/migrations/`
- File naming convention: `CR-MD-XXX-YYY.sql`
- Data migration files: `CR-MD-XXX-DATA-YYY.sql`

### B. Verification Scripts

Verification scripts are available in:
- `/docs/implementation/database/verification/`
- File naming convention: `verify_XXX.sql`

### C. Change Log

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 31/01/2026 | Initial migration plan created | Antigravity |
| 1.1 | 31/01/2026 | Added CR-MD-002/003/004 enhancements | Antigravity |

---

**End of Migration Plan**