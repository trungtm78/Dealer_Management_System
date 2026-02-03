# CR Impact Analysis: CR-20260202-003

**CR ID**: CR-20260202-003
**Target Document Versions**:
- BRD: v2.4
- FRD: Master Data v1.2
- ERD: Master Data v1.2
- API Spec: v1.0
- UI Spec: v1.5

## 1. Executive Summary
This CR implements the "Missing Master Data" identified in the Gap Analysis. It requires a significant expansion of the Master Data module to include entities for Vehicle Configuration (Color, Engine), Parts (Category, Location), Service (Type, Warranty), Insurance, Sales (Payment, Promo), and System Config.

**Complexity**: HIGH (Large volume of new entities)
**Risk**: LOW (Mostly additive, isolated Master Data module)

## 2. BRD Impact
**File**: `docs/requirements/BRD/brd_honda_dms_v2.4.md`
**Changes**:
- Add **BR-MD-009**: Vehicle Configuration Master (Color, Engine)
- Add **BR-MD-010**: Parts Logistics Master (Category, Location)
- Add **BR-MD-011**: Service Attributes Master (Type, Warranty)
- Add **BR-MD-012**: Insurance Management (Company, Type, Coverage)
- Add **BR-MD-013**: Sales Configuration (Payment, Commission, Interest)
- Add **BR-MD-014**: Financial Master (Account, Tax, Bank)
- Add **BR-MD-015**: System Configuration (Doc Types, Holidays)

## 3. FRD Impact
**File**: `docs/requirements/FRD/frd_master_data_v1.2.md` -> v1.3 (Draft)
**Changes**:
- **New Section 3: Vehicle Configuration**
    - FR-MD-004: Color Management
    - FR-MD-005: Engine Management
- **New Section 4: Parts Configuration**
    - FR-MD-006: Parts Category (Hierarchical)
    - FR-MD-007: Parts Location (Warehouse/Zone/Bin)
- **New Section 5: Service Configuration**
    - FR-MD-008: Service Types
    - FR-MD-009: Warranty Types
- **New Section 6: Insurance Management**
    - FR-MD-010: Insurance Company
    - FR-MD-011: Insurance Type/Coverage
- **New Section 7: Sales Configuration**
    - FR-MD-012: Payment Methods
    - FR-MD-013: Promotion/Campaigns
    - FR-MD-014: Commission Structures
    - FR-MD-015: Interest Rates
- **New Section 8: Financial/Admin**
    - FR-MD-016: Tax Rates
    - FR-MD-017: Bank Accounts
    - FR-MD-018: Geographic (Province/District/Ward)

## 4. ERD Impact
**File**: `docs/design/database/erd/erd_master_data_v1.2.md` -> v1.3 (Draft)
**New Tables**:
1. `VehicleColor`
2. `VehicleEngine`
3. `PartCategory`
4. `PartLocation`
5. `ServiceType`
6. `WarrantyType`
7. `InsuranceCompany`
8. `InsuranceType`
9. `InsuranceCoverage`
10. `PaymentMethod`
11. `Promotion`
12. `CommissionStructure`
13. `InterestRate`
14. `TaxRate`
15. `Bank`
16. `Province`
17. `District`
18. `Ward`
19. `DocumentType`
20. `Holiday`

## 5. API Spec Impact
**File**: `docs/design/api/api_spec_v1.0.md` -> v1.1 (Draft)
**New Endpoints**:
- `GET/POST/PUT/DELETE` for each of the 20 new entities.
- Standardization: All endpoints follow `/master/{entity}` pattern.

## 6. UI Spec Impact
**File**: `docs/design/ui/ui_spec_v1.5.md` -> v1.6 (Draft)
**Changes**:
- **Master Data Dashboard**: Add new menu items/cards for the new categories.
- **Generic Master CRUD**: Define a reusable "Generic Master Data" layout/pattern (List + Drawer Form) to handle these 20+ entities efficiently without creating 20+ unique UI files. Use `Reference #UI-MD-GENERIC`.

## 7. Migration Strategy
- **Seed Data**: Province/District/Ward (preload from standard dataset).
- **Default Data**: Tax Rates (10%, 8%, 0%), Standard Payment Methods.
