# FRD Insurance v1.3

**Version**: 1.3
**Date**: 2026-02-01
**Status**: ACTIVE
**Previous**: v1.2

(Includes v1.2 content)

## 4. Functional Specs (Updates)

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
