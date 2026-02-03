# UAT SPECIFICATION: Master Data Management
**Run ID**: UAT-20260202-MD-01
**Module**: Master Data
**Version**: 1.3
**Related CR**: CR-20260202-002 (Functionality) & CR-20260201-005 (Navigation Structure)

## 1. OBJECTIVES
Verify the functional correctness and usability of the Master Data module, specifically focusing on the new secondary master data management screens and the correct navigation structure within the global menu.

## 2. SCOPE
- **Menu Navigation**: Verify "Master Data" is in position 8 (after Accounting, before Admin).
- **Vehicle Masters**: Models, Versions, Colors.
- **Employee Masters**: Departments, Positions.
- **System Masters**: Locations, Banks.

## 3. TEST SCENARIOS

| TC ID | Scenario | Pre-conditions | Test Steps | Expected Result |
|-------|----------|----------------|------------|-----------------|
| **TC-MD-001** | Verify Master Data Menu Position | User logged in. | 1. Observe Sidebar Menu. | "Master Data" item exists at position 8. |
| **TC-MD-002** | Create Vehicle Version | Admin logged in. | 1. Nav to `/master/versions`.<br>2. Click "New".<br>3. Select Model "City".<br>4. Enter Version "RS".<br>5. Click Save. | Version "RS" created and listed. |
| **TC-MD-003** | Create Vehicle Color | Admin logged in. | 1. Nav to `/master/colors`.<br>2. Click "New".<br>3. Select Model "CR-V".<br>4. Enter Color "White Pearl", Hex "#FFFFFF".<br>5. Click Save. | Color "White Pearl" created and listed. |
| **TC-MD-004** | Create Department Hierarchy | Admin logged in. | 1. Nav to `/master/departments`.<br>2. Click "New".<br>3. Create Parent "Sales".<br>4. Create Child "Sales Team A" (Parent="Sales"). | Hierarchy displayed correctly (Tree or Parent column). |
| **TC-MD-005** | Verify Location Filtering | Admin logged in. | 1. Nav to `/master/locations`.<br>2. Select Province "Hanoi".<br>3. Check District dropdown. | District dropdown only shows districts in Hanoi. |

## 4. TRACEABILITY MATRIX
- **TC-MD-001** ↔ CR-20260201-005 (Menu Order 8)
- **TC-MD-002** ↔ FR-MD-009 (Vehicle Version)
- **TC-MD-003** ↔ FR-MD-010 (Vehicle Color)
- **TC-MD-004** ↔ FR-MD-012 (Department)
- **TC-MD-005** ↔ FR-MD-017 (Location)
