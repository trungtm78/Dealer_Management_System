# API Spec Update: Master Data (CR-20260202-002)

## 1. New Endpoints Overview
Based on best practices, all new masters will follow standard RESTful CRUD patterns.

### 1.1 Vehicle Sub-Masters
- `GET /api/master/models/[id]/versions`: List versions for a model.
- `POST /api/master/models/[id]/versions`: Create version.
- `PUT /api/master/versions/[id]`: Update version.
- `DELETE /api/master/versions/[id]`: Delete version.
- `GET /api/master/models/[id]/colors`: List colors for a model.
- `POST /api/master/models/[id]/colors`: Add color.

### 1.2 Employee Sub-Masters
- `GET /api/master/departments`: List (hierarchical).
- `POST /api/master/departments`: Create dept.
- `PUT /api/master/departments/[id]`: Update.
- `DELETE /api/master/departments/[id]`: Soft delete.
- `GET /api/master/positions`: List positions.
- `POST /api/master/positions`: Create.
- `GET /api/master/levels`: List levels.
- `POST /api/master/levels`: Create.

### 1.3 Supplier Sub-Masters
- `GET /api/master/suppliers/[id]/contacts`: List contacts.
- `POST /api/master/suppliers/[id]/contacts`: Add contact.
- `GET /api/master/suppliers/[id]/contracts`: List contracts.
- `POST /api/master/suppliers/[id]/contracts`: Add contract.

### 1.4 System Masters
- `GET /api/master/locations/provinces`: List all provinces.
- `GET /api/master/locations/districts?province_code=X`: List districts.
- `GET /api/master/locations/wards?district_code=Y`: List wards.
- `GET /api/master/banks`: List banks.
- `POST /api/master/banks`: Create bank.
- `GET /api/master/payment-methods`: List methods.
- `POST /api/master/payment-methods`: Create method.

## 2. Updated Endpoints
- **Employee Detail (`GET /api/master/employees/[id]`)**: Response object now includes expanded `department` and `position` objects (id, name, code) instead of just IDs/strings.

## 3. General Specs
- **Pagination**: All `List` endpoints support `?page=1&limit=20`.
- **Search**: All `List` endpoints support `?search=term`.
- **Status**: All `List` endpoints support `?status=ACTIVE` default filter.
