
<!-- CR-20260202-001: ADDED -->
---

### FR-MD-005: Employee Management

**Source**: CR-20260202-001
**Priority**: CRITICAL
**Actors**: Admin, HR Manager

#### FR-MD-005-01: Manage Employees
- **Goal**: Create/Update employee profiles linked to User accounts.
- **Fields**: Employee Code (EMP-XXX), Full Name, Department (Ref), Position (Ref), Level, Join Date, Status.
- **Rules**: Employee Code unique. User account optional (for non-system users).

#### FR-MD-005-02: Manage Structure
- **Goal**: Manage Key Lists: Departments, Positions, Levels.

---

### FR-MD-006: Supplier Management

**Source**: CR-20260202-001
**Priority**: CRITICAL
**Actors**: Admin, Procurement

#### FR-MD-006-01: Manage Suppliers
- **Goal**: Manage supplier database for Parts/Sales.
- **Fields**: Supplier Code (SUP-XXX), Name, Tax ID, Address, Contact Person, Phone, Email, Status.
- **Rules**: Tax ID unique.

#### FR-MD-006-02: Supplier Contacts
- **Goal**: Multiple contacts per supplier.

---

### FR-MD-007: Warehouse Management

**Source**: CR-20260202-001
**Priority**: CRITICAL

#### FR-MD-007-01: Manage Warehouses
- **Goal**: Define physical storage locations.
- **Fields**: Warehouse Code (WH-XXX), Name, Location/Address, Manager (Ref Employee).

---

### FR-MD-008: UOM Management

**Source**: CR-20260202-001
**Priority**: CRITICAL

#### FR-MD-008-01: Manage UOMs
- **Goal**: Define standard Units of Measure.
- **Fields**: Code (PCS, KG, L), Name (Piece, Kilogram, Liter), Description.

<!-- END CR-20260202-001 -->
