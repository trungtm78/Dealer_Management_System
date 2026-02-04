# API Specification: Master Data Management
**Version**: 1.3
**Updated**: 2026-02-04 (CR-20260204-001)
**Previous Version**: 1.2

> **IMPORTANT**: This file documents the CHANGES introduced in v1.3. For the complete specification including all v1.2 endpoints, please refer to [api_spec_master_data_v1.2.md](./api_spec_master_data_v1.2.md).

## Change Log
### Version 1.3 - 2026-02-04
#### Added (CR-20260204-001)
- **SelectDataSource Interface**: Standardized search contract.
- **SearchRequest Schema**: Standardized search parameters.

---

<!-- CR-20260204-001: ADDED - Append to Common Schema -->

## Common Schemas (Additions)

### SelectItem
```yaml
type: object
properties:
  id:
    type: string
    description: Unique identifier
  label:
    type: string
    description: Primary display text (Name)
  subtitle:
    type: string
    description: Secondary display text (Code, Phone, etc.)
  meta:
    type: object
    description: Raw entity data
```

### SearchRequest
```yaml
type: object
properties:
  q:
    type: string
    description: Search query
  limit:
    type: integer
    default: 20
  cursor:
    type: string
    description: Pagination cursor
  filter:
    type: object
    description: Dictionary of strict filters
  context:
    type: object
    properties:
      companyId:
        type: string
      onlyActive:
        type: boolean
      preferredIds:
        type: array
        items:
          type: string
```

### SelectDataSource Interface
All Entity APIs implementing Smart Search must provide:
`POST /api/shared/search/:entity`
OR
`GET /api/:entity/select-options`

**Parameters**:
- `q`: string
- `limit`: number
- `cursor`: string
<!-- END CR-20260204-001 -->
