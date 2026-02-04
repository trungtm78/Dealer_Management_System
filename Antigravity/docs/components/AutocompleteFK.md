# AutocompleteFK - Developer Guide

## Overview

AutocompleteFK là một React component được thiết kế để thay thế `<select>` components cho các Foreign Key (FK) fields. Nó cung cấp:
- Real-time search với debounce
- Infinite scroll pagination (5 items/page)
- Quick create navigation flow
- Keyboard navigation
- Performance tối ưu

## Installation

Dependencies đã được cài đặt:
- `@tanstack/react-query` - cho API fetching + infinite queries
- `use-debounce` - cho search debounce

## Component Location

```
components/AutocompleteFK/index.tsx
```

## Basic Usage

```tsx
import { AutocompleteFK } from "@/components/AutocompleteFK";

function MyForm() {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    return (
        <AutocompleteFK
            resource="vehicle-models"
            value={selectedId}
            onChange={(id, item) => {
                setSelectedId(id);
                console.log("Selected item:", item);
            }}
            label="Dòng xe"
            placeholder="Chọn dòng xe..."
            required
        />
    );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `resource` | `string` | - | **Required**. API resource path (e.g., 'vehicle-models') |
| `value` | `number \| null` | `null` | **Required**. Selected item ID |
| `onChange` | `(id: number \| null, item: ResourceItem \| null) => void` | - | **Required**. Callback khi chọn item |
| `label` | `string` | - | **Required**. Field label (hiển thị) |
| `placeholder` | `string` | `Chọn {label}...` | Placeholder text |
| `displayField` | `string` | `'name'` | Field name để hiển thị trong dropdown |
| `searchFields` | `string[]` | `['name', 'code']` | Fields để search |
| `required` | `boolean` | `false` | Mark field as required |
| `disabled` | `boolean` | `false` | Disable the dropdown |
| `pageSize` | `number` | `5` | Số items per page |
| `debounceMs` | `number` | `300` | Debounce delay (ms) |
| `canCreate` | `boolean` | `false` | Hiển thị "Tạo mới..." option |
| `createRoute` | `string` | `/master/{resource}/new` | Route cho create form |
| `createPermission` | `string` | `{RESOURCE}.CREATE` | Permission check (chưa implement) |
| `filters` | `Record<string, any>` | `{}` | Additional filters (e.g., `{status: 'ACTIVE'}`) |
| `className` | `string` | `""` | Additional CSS classes |
| `error` | `string` | `""` | Error message để hiển thị |

## API Requirements

### Response Format

API endpoints phải trả về format sau:

```json
{
    "data": [
        {
            "id": 1,
            "name": "Item Name",
            "code": "ITEM-001",
            ...
        }
    ],
    "meta": {
        "total": 100,
        "page": 1,
        "limit": 5,
        "total_pages": 20,
        "has_next": true,
        "has_prev": false
    }
}
```

### Query Parameters

API endpoints phải hỗ trợ các params:

| Parameter | Type | Default | Description |
|----------|------|---------|-------------|
| `search` | `string` | - | Search keyword (partial match) |
| `page` | `number` | `1` | Page number |
| `limit` | `number` | `5` | Items per page (max: 100) |

### Search Implementation

Search phải áp dụng trên `name` và `code` fields (case-insensitive):

```sql
WHERE LOWER(name) LIKE '%{keyword}%' 
   OR LOWER(code) LIKE '%{keyword}%'
```

## Examples

### Example 1: Basic Dropdown

```tsx
<AutocompleteFK
    resource="customers"
    value={customerId}
    onChange={(id, item) => setCustomerId(id)}
    label="Khách hàng"
    placeholder="Tìm khách hàng..."
/>
```

### Example 2: With Filters

```tsx
<AutocompleteFK
    resource="vehicle-models"
    value={vehicleModelId}
    onChange={(id, item) => setVehicleModelId(id)}
    label="Dòng xe"
    filters={{ status: "ACTIVE" }}
    required
/>
```

### Example 3: With Quick Create

```tsx
<AutocompleteFK
    resource="parts"
    value={partId}
    onChange={(id, item) => setPartId(id)}
    label="Phụ tùng"
    canCreate={hasPermission('PARTS.PART.CREATE')}
    createRoute="/master/parts/new"
    createPermission="PARTS.PART.CREATE"
/>
```

### Example 4: Custom Display Field

```tsx
<AutocompleteFK
    resource="employees"
    value={employeeId}
    onChange={(id, item) => setEmployeeId(id)}
    label="Nhân viên"
    displayField="full_name"
    searchFields={["full_name", "employee_code"]}
/>
```

## Integration với react-hook-form

```tsx
import { Controller } from "react-hook-form";

function FormWithAutocompleteFK() {
    const { control } = useForm();

    return (
        <Controller
            name="vehicleModelId"
            control={control}
            render={({ field }) => (
                <AutocompleteFK
                    resource="vehicle-models"
                    value={field.value}
                    onChange={(id) => field.onChange(id)}
                    label="Dòng xe"
                    required
                    error={errors.vehicleModelId?.message}
                />
            )}
        />
    );
}
```

## Quick Create Flow

Khi user click "+ Tạo mới...":

1. **Save Form Draft**: Form state được lưu vào localStorage:
   ```json
   {
     "formId": "autocomplete-fk-{resource}-{timestamp}",
     "resource": "{resource}",
     "returnField": "{displayField}",
     "timestamp": 1234567890
   }
   ```

2. **Open New Tab**: Navigate đến create form trong new tab

3. **User Creates Item**: User hoàn thành form và save

4. **Auto-Select**: Original tab nhận được new item thông qua `storage` event và auto-select

## Keyboard Navigation

- **↑/↓**: Navigate giữa items
- **Enter**: Select item
- **Esc**: Close dropdown
- **Tab**: Close dropdown + move đến next field

## States

Component có các states sau:

| State | Description |
|-------|-------------|
| `IDLE` | Dropdown closed |
| `OPEN` | Dropdown mở với default 5 items |
| `SEARCHING` | Đang tìm kiếm (loading spinner hiển thị) |
| `RESULTS` | Hiển thị filtered items |
| `NO_RESULTS` | Không có kết quả (hiển thị "Tạo mới...") |
| `ERROR` | Lỗi API (hiển thị error message) |

## Performance

- **Search debounce**: 300ms
- **API cache**: 5 minutes (staleTime)
- **Pagination trigger**: 90% scroll
- **Page size**: 5 items

## Troubleshooting

### Dropdown không mở

Kiểm tra:
1. `disabled` prop được set?
2. API endpoint accessible?
3. Console errors?

### Search không hoạt động

Kiểm tra:
1. `searchFields` prop có đúng?
2. API có hỗ trợ `search` parameter?
3. Network request được gửi?

### Pagination không hoạt động

Kiểm tra:
1. `meta.has_next` được trả về?
2. `getNextPageParam` function trả về đúng page?
3. React Query được setup đúng?

### Quick create không hoạt động

Kiểm tra:
1. `canCreate` prop được set?
2. `createRoute` có đúng?
3. Browser block popup?
4. Console errors?

## Resource List

Các resources đã được cập nhật để hỗ trợ AutocompleteFK:

### Admin
- `/api/users`
- `/api/admin/roles`
- `/api/admin/permissions`
- `/api/master/departments`
- `/api/master/positions`

### CRM
- `/api/crm/customers`
- `/api/crm/leads`
- `/api/crm/scoring-rules`
- `/api/crm/marketing-campaigns`

### Sales
- `/api/sales/quotations`
- `/api/sales/contracts`
- `/api/inventory/vehicles`

### Service
- `/api/service/quotations`
- `/api/service/appointments`
- `/api/service/bays`

### Parts
- `/api/master/parts`
- `/api/master/suppliers`
- `/api/master/warehouses`
- `/api/parts/purchase-orders`

### Insurance
- `/api/insurance/contracts`
- `/api/insurance/claims`

### Accounting
- `/api/accounting/invoices`
- `/api/accounting/payments`
- `/api/accounting/transactions`

### Master Data
- `/api/master/vehicle-models`
- `/api/accessories`
- `/api/service-catalogs`
- `/api/master/employees`

---

**Last Updated**: 03/02/2026
