
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
