# Integration Test Plan: CR-001

## 1. Test Strategy
Focus on End-to-End flows involving the new Permissions System and Insurance workflows.

## 2. Test Scenarios

### 2.1 Admin / Security (Priority: Critical)
- **TC-ADM-001**: User with `admin.*` permission can view all menus.
- **TC-ADM-002**: User with `sales.*` permission CANNOT access Admin Settings.
- **TC-ADM-003**: Accessing `/admin/users` without permission redirects to 403/Login.
- **TC-ADM-004**: System Settings change reflects immediately (or after reload).
- **TC-ADM-005**: All sensitive actions create an Audit Log entry.

### 2.2 Insurance Module
- **TC-INS-001**: Creating an Insurance Contract links correctly to Customer and Vehicle.
- **TC-INS-002**: Submitting a Claim changes status to SUBMITTED.
- **TC-INS-003**: Approving a Claim (Manager) updates status to APPROVED.

### 2.3 Master Data
- **TC-MD-001**: Admin can create new Vehicle Model.
- **TC-MD-002**: New Vehicle Model appears in Sales Quotation form.
- **TC-MD-003**: Deleting a Master Data item (Soft Delete) removes it from dropdowns but keeps history.

## 3. Data Setup
- Seed Database with standard Roles (Admin, Manager, Staff).
- Create Test Users for each Role.

## 4. Execution Logic
- Run `npm test:integration` (Hypothetical command using Jest/Supertest).
- Manual UAT session following `uat_plan_v1.1.md`.
