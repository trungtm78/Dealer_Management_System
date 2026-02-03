# FRD Insurance v1.2 (DRAFT)
**Target**: `docs/requirements/FRD/frd_insurance_v1.2.md`
**Changes**: Added Functional Logic for placeholders.

---

### SCR-INS-001: Insurance Contract Management
**Logic**:
-   **List**: `GET /api/insurance/contracts`. Columns: Policy No, Customer, Vehicle, Expiry, Status.
-   **Create**: Button "Tạo Mới" -> Modal.
    -   Inputs: Customer (Search), Vehicle (Select), Provider (Dropdown), Start/End Date.
    -   Action: `POST /api/insurance/contracts`.
-   **Validation**: End Date > Start Date. Vehicle must exist.

### SCR-INS-002: Claims Management
**Logic**:
-   **List**: `GET /api/insurance/claims`. Filter by Status (Pending, Approved).
-   **Create**: Button "Tạo Claim" -> Modal.
    -   Inputs: Contract (Search), Date, Amount, Description, Photos.
    -   Action: `POST /api/insurance/claims`.
-   **Approval**: Button "Approve" -> `PATCH /api/insurance/claims/{id}/status` ({status: 'APPROVED'}).
