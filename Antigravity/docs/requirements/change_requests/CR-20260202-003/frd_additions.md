
## 3. Vehicle Configuration

### FR-MD-004: Color Management
**Priority**: HIGH
**Actors**: Admin (CRUD)

#### FR-MD-004-01: Manage Vehicle Colors
- **Goal**: Manage standard vehicle colors.
- **Fields**: Color Code, Color Name, RGB Hex, Status.
- **Rules**: Code unique.

### FR-MD-005: Engine Management
**Priority**: MEDIUM
**Actors**: Admin (CRUD)

#### FR-MD-005-01: Manage Vehicle Engines
- **Goal**: Manage engine specifications.
- **Fields**: Engine Code, Displacement, Fuel Type, Power, Torque.

---

## 4. Parts Configuration

### FR-MD-006: Parts Category
**Priority**: CRITICAL
**Actors**: Admin, Parts Manager

#### FR-MD-006-01: Manage Categories
- **Goal**: Manage hierarchical parts categories.
- **Fields**: Category Code, Name, Parent Category (Ref self).
- **Rules**: Prevent circular references.

### FR-MD-007: Parts Location
**Priority**: CRITICAL
**Actors**: Admin, Warehouse Manager

#### FR-MD-007-01: Manage Locations
- **Goal**: Define storage locations within warehouse.
- **Fields**: Location Code, Warehouse (Ref), Zone, Shelf, Bin.

---

## 5. Service Configuration

### FR-MD-008: Service Types
- **Goal**: Define types like Maintenance, Warranty, Recall.
- **Fields**: Type Code, Name, Priority.

### FR-MD-009: Warranty Types
- **Goal**: Define warranty coverage policies.
- **Fields**: Warranty Code, Name, Duration (Months/Km).

---

## 6. Insurance Management

### FR-MD-010: Insurance Company
**Priority**: CRITICAL

#### FR-MD-010-01: Manage Insurance Companies
- **Goal**: Manage insurance partners.
- **Fields**: Company Code, Name, Contact, Commission %.

### FR-MD-011: Insurance Coverage
- **Goal**: Define products (TNDS, Material).
- **Fields**: Product Code, Type, Limit, Deductible.

---

## 7. Sales Configuration

### FR-MD-012: Payment Methods
**Priority**: HIGH

#### FR-MD-012-01: Manage Payment Methods
- **Goal**: Define accepted payment types.
- **Fields**: Method Code, Name, Fee %.

### FR-MD-013: Promotion Management
- **Goal**: Manage sales campaigns.
- **Fields**: Promo Code, Start/End Date, Discount Logic.

### FR-MD-014: Commission Structure
- **Goal**: Define sales incentive rules.
- **Fields**: Structure Code, Role, Target, Rate %.

### FR-MD-015: Interest Rates
- **Goal**: Manage bank financing rates.
- **Fields**: Bank (Ref), Term, Rate %.

---

## 8. Financial Administration

### FR-MD-016: Tax Rates
**Priority**: CRITICAL
- **Goal**: Manage VAT/Registration taxes.
- **Fields**: Tax Code, Name, Rate %.

### FR-MD-017: Bank Accounts
- **Goal**: Company bank accounts for transfers.
- **Fields**: Bank Name, Account Number, Branch.

### FR-MD-018: Geographic Master
**Priority**: MEDIUM
- **Goal**: Manage Province/District/Ward.
- **Fields**: Code, Name, Parent, Type.

---

## 9. System Configuration (Enhanced)

### FR-MD-019: Document Types
- **Goal**: Classification for uploaded docs.

### FR-MD-020: Holiday Management
- **Goal**: Define non-working days for scheduling.
