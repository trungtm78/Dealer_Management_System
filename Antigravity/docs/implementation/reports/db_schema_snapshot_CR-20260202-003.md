# DB Schema Snapshot - CR-20260202-003
**CR ID**: CR-20260202-003
**Mission**: Implement Missing Master Data (Gap Analysis)
**Generated**: 2025-02-02
**Database**: SQLite

## Overview
This document captures the current database schema after implementing the missing master data tables as specified in CR-20260202-003.

## Master Data Tables

### Vehicle Configuration

#### 1. vehicle_colors
```prisma
model vehicle_colors {
  id          String    @id
  color_code  String    @unique
  color_name  String
  hex_code    String
  status      String    @default("ACTIVE")
  created_at  DateTime  @default(now())
  updated_at  DateTime
  deleted_at  DateTime?
}
```
**Fields**: id, color_code, color_name, hex_code, status, created_at, updated_at, deleted_at
**Constraints**: PRIMARY KEY (id), UNIQUE (color_code)
**Indexes**: Implicit on id and color_code

#### 2. vehicle_engines
```prisma
model vehicle_engines {
  id              String    @id
  engine_code     String    @unique
  engine_name     String
  engine_capacity String?
  fuel_type       String?
  status          String    @default("ACTIVE")
  created_at      DateTime  @default(now())
  updated_at      DateTime
  deleted_at      DateTime?
}
```
**Fields**: id, engine_code, engine_name, engine_capacity, fuel_type, status, created_at, updated_at, deleted_at
**Constraints**: PRIMARY KEY (id), UNIQUE (engine_code)
**Indexes**: Implicit on id and engine_code

### Parts Configuration

#### 3. part_categories
```prisma
model part_categories {
  id                 String    @id
  category_code      String    @unique
  category_name      String
  parent_category_id String?
  description        String?
  status             String    @default("ACTIVE")
  created_at         DateTime  @default(now())
  updated_at         DateTime
  deleted_at         DateTime?
}
```
**Fields**: id, category_code, category_name, parent_category_id, description, status, created_at, updated_at, deleted_at
**Constraints**: PRIMARY KEY (id), UNIQUE (category_code), FK (parent_category_id → part_categories.id)
**Indexes**: Implicit on id and category_code
**Note**: Self-referencing foreign key for hierarchical structure

#### 4. part_locations
```prisma
model part_locations {
  id            String    @id
  location_code String    @unique
  location_name String
  warehouse_id  String?
  bay_id        String?
  shelf_id      String?
  description   String?
  status        String    @default("ACTIVE")
  created_at    DateTime  @default(now())
  updated_at    DateTime
  deleted_at    DateTime?
}
```
**Fields**: id, location_code, location_name, warehouse_id, bay_id, shelf_id, description, status, created_at, updated_at, deleted_at
**Constraints**: PRIMARY KEY (id), UNIQUE (location_code)
**Indexes**: Implicit on id and location_code
**Note**: warehouse_id references warehouses table

### Service Configuration

#### 5. service_types
```prisma
model service_types {
  id                    String    @id
  service_type_code     String    @unique
  service_type_name     String
  category              String
  default_duration_hours Decimal   @default(1.0)
  base_price            Decimal?
  description           String?
  status                String    @default("ACTIVE")
  created_at            DateTime  @default(now())
  updated_at            DateTime
  deleted_at            DateTime?
}
```
**Fields**: id, service_type_code, service_type_name, category, default_duration_hours, base_price, description, status, created_at, updated_at, deleted_at
**Constraints**: PRIMARY KEY (id), UNIQUE (service_type_code)
**Indexes**: Implicit on id and service_type_code

#### 6. warranty_types
```prisma
model warranty_types {
  id              String    @id
  warranty_code   String    @unique
  warranty_name   String
  warranty_type   String
  duration_months Int
  max_kilometers  Int?
  description     String?
  status          String    @default("ACTIVE")
  created_at      DateTime  @default(now())
  updated_at      DateTime
  deleted_at      DateTime?
}
```
**Fields**: id, warranty_code, warranty_name, warranty_type, duration_months, max_kilometers, description, status, created_at, updated_at, deleted_at
**Constraints**: PRIMARY KEY (id), UNIQUE (warranty_code)
**Indexes**: Implicit on id and warranty_code

### Insurance Management

#### 7. insurance_companies
```prisma
model insurance_companies {
  id             String    @id
  company_code   String    @unique
  company_name   String
  contact_person String?
  phone          String?
  email          String?
  address        String?
  status         String    @default("ACTIVE")
  created_at     DateTime  @default(now())
  updated_at     DateTime
  deleted_at     DateTime?
}
```
**Fields**: id, company_code, company_name, contact_person, phone, email, address, status, created_at, updated_at, deleted_at
**Constraints**: PRIMARY KEY (id), UNIQUE (company_code)
**Indexes**: Implicit on id and company_code

#### 8. insurance_products
```prisma
model insurance_products {
  id                String    @id
  product_code      String    @unique
  product_name      String
  insurance_type    String
  premium_amount    Decimal
  coverage_amount   Decimal
  deductible_amount Decimal?
  max_claim_amount  Decimal?
  status            String    @default("ACTIVE")
  created_at        DateTime  @default(now())
  updated_at        DateTime
  deleted_at        DateTime?
}
```
**Fields**: id, product_code, product_name, insurance_type, premium_amount, coverage_amount, deductible_amount, max_claim_amount, status, created_at, updated_at, deleted_at
**Constraints**: PRIMARY KEY (id), UNIQUE (product_code)
**Indexes**: Implicit on id and product_code

### Sales & Finance

#### 9. payment_methods
```prisma
model payment_methods {
  id            String    @id
  method_code   String    @unique
  method_name   String
  method_type   String
  description   String?
  processing_fee Decimal  @default(0)
  status        String    @default("ACTIVE")
  created_at    DateTime  @default(now())
  updated_at    DateTime
  deleted_at    DateTime?
}
```
**Fields**: id, method_code, method_name, method_type, description, processing_fee, status, created_at, updated_at, deleted_at
**Constraints**: PRIMARY KEY (id), UNIQUE (method_code)
**Indexes**: Implicit on id and method_code

#### 10. tax_rates
```prisma
model tax_rates {
  id             String    @id
  tax_code       String    @unique
  tax_name       String
  tax_type       String
  rate_percent   Decimal
  effective_from String
  effective_to   String?
  description    String?
  status         String    @default("ACTIVE")
  created_at     DateTime  @default(now())
  updated_at     DateTime
  deleted_at     DateTime?
}
```
**Fields**: id, tax_code, tax_name, tax_type, rate_percent, effective_from, effective_to, description, status, created_at, updated_at, deleted_at
**Constraints**: PRIMARY KEY (id), UNIQUE (tax_code)
**Indexes**: Implicit on id and tax_code

#### 11. bank_accounts
```prisma
model bank_accounts {
  id            String    @id
  account_code  String    @unique
  account_name  String
  bank_name     String
  account_number String    @unique
  branch_name   String?
  account_type  String?
  currency      String    @default("VND")
  status        String    @default("ACTIVE")
  created_at    DateTime  @default(now())
  updated_at    DateTime
  deleted_at    DateTime?
}
```
**Fields**: id, account_code, account_name, bank_name, account_number, branch_name, account_type, currency, status, created_at, updated_at, deleted_at
**Constraints**: PRIMARY KEY (id), UNIQUE (account_code), UNIQUE (account_number)
**Indexes**: Implicit on id, account_code, and account_number

#### 12. promotions
```prisma
model promotions {
  id                  String    @id
  promotion_code      String    @unique
  promotion_name      String
  promotion_type      String
  start_date          DateTime
  end_date            DateTime
  discount_percent    Decimal?
  discount_amount     Decimal?
  min_purchase_amount Decimal?
  max_discount_amount Decimal?
  description         String?
  status              String    @default("ACTIVE")
  created_at          DateTime  @default(now())
  updated_at          DateTime
  deleted_at          DateTime?
}
```
**Fields**: id, promotion_code, promotion_name, promotion_type, start_date, end_date, discount_percent, discount_amount, min_purchase_amount, max_discount_amount, description, status, created_at, updated_at, deleted_at
**Constraints**: PRIMARY KEY (id), UNIQUE (promotion_code)
**Indexes**: Implicit on id and promotion_code

#### 13. commission_structures
```prisma
model commission_structures {
  id                  String    @id
  commission_code     String    @unique
  commission_name     String
  type                String
  role_id             String?
  target              Decimal?
  rate_percent        Decimal?
  applicable_products String?
  status              String    @default("ACTIVE")
  created_at          DateTime  @default(now())
  updated_at          DateTime
  deleted_at          DateTime?
}
```
**Fields**: id, commission_code, commission_name, type, role_id, target, rate_percent, applicable_products, status, created_at, updated_at, deleted_at
**Constraints**: PRIMARY KEY (id), UNIQUE (commission_code)
**Indexes**: Implicit on id and commission_code

#### 14. interest_rates
```prisma
model interest_rates {
  id             String    @id
  rate_code      String    @unique
  rate_name      String
  rate_type      String
  rate_percent   Decimal
  min_amount     Decimal?
  max_amount     Decimal?
  effective_from String
  effective_to   String?
  status         String    @default("ACTIVE")
  created_at     DateTime  @default(now())
  updated_at     DateTime
  deleted_at     DateTime?
}
```
**Fields**: id, rate_code, rate_name, rate_type, rate_percent, min_amount, max_amount, effective_from, effective_to, status, created_at, updated_at, deleted_at
**Constraints**: PRIMARY KEY (id), UNIQUE (rate_code)
**Indexes**: Implicit on id and rate_code

### Financial Administration

#### 15. account_codes
```prisma
model account_codes {
  id           String    @id
  account_code String    @unique
  account_name String
  account_type String
  parent_code  String?
  description  String?
  status       String    @default("ACTIVE")
  created_at   DateTime  @default(now())
  updated_at   DateTime
  deleted_at   DateTime?
}
```
**Fields**: id, account_code, account_name, account_type, parent_code, description, status, created_at, updated_at, deleted_at
**Constraints**: PRIMARY KEY (id), UNIQUE (account_code)
**Indexes**: Implicit on id and account_code
**Note**: parent_code is a self-referencing field (not enforced as FK)

### Geographic

#### 16. provinces
```prisma
model provinces {
  id            String     @id
  province_code String     @unique
  province_name String
  status        String     @default("ACTIVE")
  created_at    DateTime   @default(now())
  updated_at    DateTime
  deleted_at    DateTime?
  districts     districts[]
}
```
**Fields**: id, province_code, province_name, status, created_at, updated_at, deleted_at
**Constraints**: PRIMARY KEY (id), UNIQUE (province_code)
**Indexes**: Implicit on id and province_code

#### 17. districts
```prisma
model districts {
  id                        String      @id
  district_code             String      @unique
  district_name             String
  province_code             String
  distance_from_showroom_km Decimal?
  service_zone              String?
  status                    String      @default("ACTIVE")
  created_at                DateTime    @default(now())
  updated_at                DateTime
  deleted_at                DateTime?
  provinces                 provinces   @relation(fields: [province_code], references: [province_code])
  wards                     wards[]
}
```
**Fields**: id, district_code, district_name, province_code, distance_from_showroom_km, service_zone, status, created_at, updated_at, deleted_at
**Constraints**: PRIMARY KEY (id), UNIQUE (district_code), FK (province_code → provinces.province_code)
**Indexes**: Implicit on id and district_code

#### 18. wards
```prisma
model wards {
  id          String     @id
  ward_code   String     @unique
  ward_name   String
  district_code String
  postal_code String?
  status      String     @default("ACTIVE")
  created_at  DateTime   @default(now())
  updated_at  DateTime
  deleted_at  DateTime?
  districts   districts  @relation(fields: [district_code], references: [district_code])
}
```
**Fields**: id, ward_code, ward_name, district_code, postal_code, status, created_at, updated_at, deleted_at
**Constraints**: PRIMARY KEY (id), UNIQUE (ward_code), FK (district_code → districts.district_code)
**Indexes**: Implicit on id and ward_code

### System Configuration

#### 19. holidays
```prisma
model holidays {
  id           String    @id
  holiday_code String    @unique
  holiday_name String
  holiday_date String
  is_recurring Boolean   @default(false)
  status        String    @default("ACTIVE")
  created_at    DateTime  @default(now())
  updated_at    DateTime
  deleted_at    DateTime?
}
```
**Fields**: id, holiday_code, holiday_name, holiday_date, is_recurring, status, created_at, updated_at, deleted_at
**Constraints**: PRIMARY KEY (id), UNIQUE (holiday_code)
**Indexes**: Implicit on id and holiday_code

## Summary Statistics
- **Total Master Data Tables**: 19
- **Total Fields**: ~200
- **Foreign Key Relationships**: 3 (part_categories self-ref, districts→provinces, wards→districts)
- **Unique Constraints**: 19 (one per table)
- **Default Values**: Applied consistently (status = 'ACTIVE', timestamps, etc.)

## Notes
1. All tables use String-based primary keys (UUID pattern)
2. Soft delete pattern implemented via `deleted_at` field
3. Standard audit fields: `created_at`, `updated_at`, `deleted_at`
4. Status field follows pattern: ACTIVE/INACTIVE
5. Code fields follow pattern: {ENTITY}_CODE with UNIQUE constraint
