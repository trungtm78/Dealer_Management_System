# Honda DMS API Documentation

**Version**: 1.0.0  
**Last Updated**: 2026-01-28

---

## 📚 Quick Links

- **API Specification Index**: [`api_spec_index.md`](./api_spec_index.md)
- **OpenAPI Spec**: [`openapi.yaml`](./openapi.yaml)
- **Data Mapping**: [`api_data_mapping_v1.0.md`](./api_data_mapping_v1.0.md)
- **Change Log**: [`api_change_log.md`](./api_change_log.md)
- **Project Summary**: [`API_PROJECT_SUMMARY.md`](./API_PROJECT_SUMMARY.md)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (for backend)
- Valid JWT authentication token
- API base URL access

### Base URLs

| Environment | URL |
|-------------|-----|
| Production | `https://api.hondadms.com/v1` |
| Staging | `https://staging-api.hondadms.com/v1` |
| Development | `http://localhost:3000/api` |

### Authentication

All API endpoints require JWT Bearer token authentication.

**Request Header**:
```
Authorization: Bearer <your_jwt_token>
```

**Example**:
```bash
curl -H "Authorization: Bearer eyJhbGc..." https://api.hondadms.com/v1/dashboard/summary
```

---

## 📖 API Documentation

### Module Overview

| Module | APIs | Documentation |
|--------|------|---------------|
| Dashboard | 5 | [`api_spec_01_dashboard.md`](./api_spec_01_dashboard.md) |
| CRM | 40 | [`api_spec_02_crm.md`](./api_spec_02_crm.md) |
| Sales | 35 | [`api_spec_03_sales.md`](./api_spec_03_sales.md) |
| Service | 30 | [`api_spec_04_service.md`](./api_spec_04_service.md) |
| Parts | 25 | [`api_spec_05_parts.md`](./api_spec_05_parts.md) |
| Insurance | 10 | [`api_spec_06_insurance.md`](./api_spec_06_insurance.md) |
| Accounting | 20 | [`api_spec_07_accounting.md`](./api_spec_07_accounting.md) |
| Admin | 10 | [`api_spec_08_admin.md`](./api_spec_08_admin.md) |

**Total**: 175 APIs

---

## 🔧 API Tools

### Swagger UI

View interactive API documentation:

1. **Install Swagger UI**:
   ```bash
   npm install -g swagger-ui-watcher
   ```

2. **Run Swagger UI**:
   ```bash
   swagger-ui-watcher openapi.yaml
   ```

3. **Open in browser**: `http://localhost:8000`

### Postman

Import the Postman collection:

1. Download [`postman_collection.json`](./postman_collection.json)
2. Open Postman → Import → Select file
3. Configure environment variables:
   - `base_url`: API base URL
   - `auth_token`: Your JWT token

---

## 📝 Common Patterns

### Standard Response Format

**Success Response**:
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

**Error Response**:
```json
{
  "success": false,
  "error": {
    "code": "CRM_404",
    "message": "Lead not found",
    "details": { ... }
  }
}
```

### Pagination

All list endpoints support pagination:

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Example**:
```
GET /api/crm/leads?page=2&limit=50
```

### Filtering & Sorting

**Common Filters**:
- `status`: Filter by status
- `date_from`: Start date (YYYY-MM-DD)
- `date_to`: End date (YYYY-MM-DD)
- `search`: Search query

**Sorting**:
- `sort_by`: Field to sort by
- `sort_order`: ASC or DESC

**Example**:
```
GET /api/crm/leads?status=QUALIFIED&sort_by=created_at&sort_order=DESC
```

---

## 🔐 Error Codes

### Format

Error codes follow the pattern: `{MODULE}_{HTTP_CODE}`

**Examples**:
- `CRM_404`: CRM resource not found
- `SAL_400`: Sales bad request
- `SVC_401`: Service unauthorized

### Common Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| XXX_400 | 400 | Bad Request - Invalid input |
| XXX_401 | 401 | Unauthorized - Invalid/missing token |
| XXX_403 | 403 | Forbidden - Insufficient permissions |
| XXX_404 | 404 | Not Found - Resource doesn't exist |
| XXX_409 | 409 | Conflict - Duplicate/constraint violation |
| XXX_500 | 500 | Internal Server Error |

---

## 📊 Rate Limiting

- **Per User**: 1000 requests/hour
- **Per User**: 100 requests/minute

**Rate Limit Headers**:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1643673600
```

---

## 🧪 Testing

### Unit Testing

```bash
npm run test:api
```

### Integration Testing

```bash
npm run test:integration
```

### Postman Collection

Run automated tests:
```bash
newman run postman_collection.json -e environment.json
```

---

## 📚 Examples

### Create Lead

```bash
curl -X POST https://api.hondadms.com/v1/crm/leads \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nguyễn Văn A",
    "phone": "0901234567",
    "email": "nguyenvana@gmail.com",
    "source": "FACEBOOK"
  }'
```

### List Customers

```bash
curl -X GET "https://api.hondadms.com/v1/crm/customers?page=1&limit=20&tier=GOLD" \
  -H "Authorization: Bearer <token>"
```

### Create Quotation

```bash
curl -X POST https://api.hondadms.com/v1/sales/quotations \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Nguyễn Văn A",
    "customer_phone": "0901234567",
    "model": "CR-V",
    "version": "L",
    "color": "White Pearl",
    "base_price": 1029000000,
    "total_price": 1200000000
  }'
```

---

## 🔄 Versioning

Current version: **v1.0**

API versioning strategy:
- **Major version** (v1, v2): Breaking changes
- **Minor version** (v1.1, v1.2): New features, backward compatible
- **Patch version** (v1.0.1): Bug fixes

---

## 📞 Support

**API Issues**: Create issue in project repository  
**Documentation**: Review [`api_spec_index.md`](./api_spec_index.md)  
**Questions**: Contact API team

---

## 📄 License

Proprietary - Honda DMS

---

**Last Updated**: 2026-01-28  
**Maintained by**: Design Authority (Antigravity)
