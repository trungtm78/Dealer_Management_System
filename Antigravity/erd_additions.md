
## 13. New Entities (Draft v1.3)

### 13.1 Vehicle Configuration
```sql
CREATE TABLE VehicleColor (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  color_code VARCHAR(20) UNIQUE NOT NULL,
  color_name VARCHAR(50) NOT NULL,
  rgb_hex VARCHAR(7),
  status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE'
);

CREATE TABLE VehicleEngine (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  engine_code VARCHAR(50) UNIQUE NOT NULL,
  displacement_cc INT,
  fuel_type ENUM('PETROL','DIESEL','HYBRID','ELECTRIC'),
  power_hp INT,
  torque_nm INT
);
```

### 13.2 Parts Configuration
```sql
CREATE TABLE PartCategory (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  category_code VARCHAR(20) UNIQUE NOT NULL,
  category_name VARCHAR(100) NOT NULL,
  parent_id BIGINT,
  FOREIGN KEY (parent_id) REFERENCES PartCategory(id)
);

CREATE TABLE PartLocation (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  location_code VARCHAR(50) UNIQUE NOT NULL,
  warehouse_id BIGINT NOT NULL,
  zone VARCHAR(20),
  shelf VARCHAR(20),
  bin VARCHAR(20),
  FOREIGN KEY (warehouse_id) REFERENCES Warehouse(id)
);
```

### 13.3 Service Configuration
```sql
CREATE TABLE ServiceType (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  type_code VARCHAR(20) UNIQUE NOT NULL,
  type_name VARCHAR(50) NOT NULL,
  priority INT DEFAULT 1
);

CREATE TABLE WarrantyType (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  warranty_code VARCHAR(20) UNIQUE NOT NULL,
  coverage_months INT,
  coverage_km INT
);
```

### 13.4 Insurance
```sql
CREATE TABLE InsuranceCompany (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  company_code VARCHAR(20) UNIQUE NOT NULL,
  company_name VARCHAR(100) NOT NULL,
  commission_rate DECIMAL(5,2)
);

CREATE TABLE InsuranceProduct (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  product_code VARCHAR(20) UNIQUE,
  company_id BIGINT,
  type ENUM('TNDS','MATERIAL','PERSON'),
  FOREIGN KEY (company_id) REFERENCES InsuranceCompany(id)
);
```

### 13.5 Sales & Finance
```sql
CREATE TABLE PaymentMethod (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  method_code VARCHAR(20) UNIQUE,
  method_name VARCHAR(50),
  fee_percent DECIMAL(5,2) DEFAULT 0
);

CREATE TABLE TaxRate (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  tax_code VARCHAR(20) UNIQUE,
  rate_percent DECIMAL(5,2) NOT NULL,
  is_default BOOLEAN DEFAULT FALSE
);

CREATE TABLE BankAccount (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  bank_name VARCHAR(100),
  account_number VARCHAR(50),
  branch_name VARCHAR(100)
);

CREATE TABLE Promotion (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  promo_code VARCHAR(50) UNIQUE,
  start_date DATE,
  end_date DATE,
  discount_type ENUM('PERCENT','AMOUNT'),
  value DECIMAL(15,2)
);
```

### 13.6 Geographic
```sql
CREATE TABLE Province (
  code VARCHAR(10) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20)
);

CREATE TABLE District (
  code VARCHAR(10) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  province_code VARCHAR(10),
  FOREIGN KEY (province_code) REFERENCES Province(code)
);

CREATE TABLE Ward (
  code VARCHAR(10) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  district_code VARCHAR(10),
  FOREIGN KEY (district_code) REFERENCES District(code)
);
```
