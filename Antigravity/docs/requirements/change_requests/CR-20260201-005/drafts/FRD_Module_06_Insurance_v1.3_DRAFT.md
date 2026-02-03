# FRD Insurance v1.3 (DRAFT)
**Target**: `docs/requirements/FRD/frd_insurance_v1.3.md`
**Changes**: Added Create Contract/Claim Logic + Fields.

---

### SCR-INS-003: Create Contract Screen
**Route**: `/insurance/contracts/create`
**Elements**:
-   **Customer Info**: Name, Phone, Email (Required).
-   **Vehicle Info**: VIN, Make, Model, Year. (Dropdowns for Make/Model loaded from Master Data).
-   **Policy Info**: Provider, Type, Amount, Premium.
-   **Date**: Start Date, End Date.
**Actions**:
-   **Save**: `POST /api/insurance/contracts`.
-   **Cancel**: Return to List.

### SCR-INS-004: Create Claim Screen
**Route**: `/insurance/claims/create`
**Elements**:
-   **Contract Selection**: Searchable Dropdown.
-   **Incident Date**: Date Picker.
-   **Description**: Text Area.
-   **Photo Upload**: Multi-file uploader.
**Actions**:
-   **Submit**: `POST /api/insurance/claims`.
