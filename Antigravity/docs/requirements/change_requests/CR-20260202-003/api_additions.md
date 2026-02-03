
## 10. Master Data Endpoints (Draft v1.3)

### 10.1 Vehicle Configuration
- `GET /api/master/vehicle-colors`
- `POST /api/master/vehicle-colors`
- `PUT /api/master/vehicle-colors/{id}`
- `DELETE /api/master/vehicle-colors/{id}`

- `GET /api/master/vehicle-engines`
- `POST /api/master/vehicle-engines`
... (Standard CRUD for all new entities)

### 10.2 Parts Configuration
- `GET /api/master/part-categories` (Supports `?include_children=true`)
- `GET /api/master/part-locations`

### 10.3 Service Configuration
- `GET /api/master/service-types`
- `GET /api/master/warranty-types`

### 10.4 Insurance
- `GET /api/master/insurance-companies`
- `GET /api/master/insurance-products`

### 10.5 Sales & Finance
- `GET /api/master/payment-methods`
- `GET /api/master/tax-rates`
- `GET /api/master/banks`
- `GET /api/master/promotions`

### 10.6 Geographic
- `GET /api/master/provinces`
- `GET /api/master/districts?province_code={code}`
- `GET /api/master/wards?district_code={code}`
