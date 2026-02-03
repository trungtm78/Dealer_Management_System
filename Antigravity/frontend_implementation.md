# Frontend Implementation Plan
## CR-20250131-002 Implementation

**Date**: 2026-02-01  
**Version**: 1.0  
**Status**: Ready for Implementation

---

## 📋 Overview

This frontend implementation plan covers the UI components and screens for:
1. **System Administration Module**: User Management, RBAC, Audit Logs, System Settings, Monitoring
2. **Insurance Module**: Contracts and Claims

---

## 🏗️ Project Structure

```
src/
├── components/
│   ├── admin/
│   │   ├── UserTable.tsx
│   │   ├── UserForm.tsx
│   │   ├── RoleTable.tsx
│   │   ├── PermissionMatrix.tsx
│   │   ├── AuditLogViewer.tsx
│   │   ├── SystemSettings.tsx
│   │   └── MonitoringDashboard.tsx
│   ├── insurance/
│   │   ├── InsuranceDashboard.tsx
│   │   ├── InsuranceContractList.tsx
│   │   ├── InsuranceContractDetail.tsx
│   │   ├── InsuranceClaimList.tsx
│   │   └── InsuranceClaimDetail.tsx
│   ├── common/
│   │   ├── DataTable.tsx
│   │   ├── Form.tsx
│   │   ├── Modal.tsx
│   │   ├── Alert.tsx
│   │   ├── Loading.tsx
│   │   └── ErrorBoundary.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useRBAC.ts
│   ├── useApi.ts
│   ├── useDebounce.ts
│   └── useLocalStorage.ts
├── lib/
│   ├── api/
│   │   ├── admin.ts
│   │   ├── insurance.ts
│   │   └── client.ts
│   ├── utils/
│   │   ├── validation.ts
│   │   ├── formatting.ts
│   │   └── helpers.ts
│   └── constants/
│       ├── permissions.ts
│       ├── routes.ts
│       └── settings.ts
└── app/
    ├── admin/
    │   ├── page.tsx
    │   ├── users/
    │   │   ├── page.tsx
    │   │   └── [id]/
    │   ├── roles/
    │   │   ├── page.tsx
    │   │   └── [id]/
    │   ├── audit-logs/
    │   │   └── page.tsx
    │   ├── settings/
    │   │   └── page.tsx
    │   └── monitoring/
    │       └── page.tsx
    └── insurance/
        ├── page.tsx
        ├── contracts/
        │   ├── page.tsx
        │   └── [id]/
        └── claims/
            ├── page.tsx
            └── [id]/
```

---

## 🎨 Core Components

### 1. Data Table Component

```typescript
// src/components/common/DataTable.tsx
import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

interface Column<T> {
  id: string;
  label: string;
  accessor: keyof T | ((row: T) => any);
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
  };
  onRowClick?: (row: T) => void;
  actions?: (row: T) => React.ReactNode;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  pagination,
  onRowClick,
  actions,
  className,
}: DataTableProps<T>) {
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});

  // Sorting logic
  const sortedData = useMemo(() => {
    if (!sortField) return data;

    return [...data].sort((a, b) => {
      const aValue = getNestedValue(a, sortField);
      const bValue = getNestedValue(b, sortField);

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortDirection]);

  // Filtering logic
  const filteredData = useMemo(() => {
    return sortedData.filter((row) => {
      // Global filter
      if (globalFilter) {
        const searchValue = globalFilter.toLowerCase();
        const matches = Object.values(row).some(
          (value) =>
            typeof value === 'string' &&
            value.toLowerCase().includes(searchValue)
        );
        if (!matches) return false;
      }

      // Column filters
      return Object.entries(columnFilters).every(([key, value]) => {
        if (!value) return true;
        const rowValue = getNestedValue(row, key);
        return String(rowValue).toLowerCase().includes(value.toLowerCase());
      });
    });
  }, [sortedData, globalFilter, columnFilters]);

  const handleSort = (columnId: string) => {
    if (sortField === columnId) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(columnId);
      setSortDirection('asc');
    }
  };

  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const getValue = (row: T, column: Column<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    }
    return getNestedValue(row, column.accessor as string);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Data Table</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.id}>
                    <div className="flex items-center gap-1">
                      <span>{column.label}</span>
                      {column.sortable && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort(column.id)}
                          className="h-6 w-6 p-0"
                        >
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </TableHead>
                ))}
                {actions && <TableHead className="w-24">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((row, index) => (
                <TableRow
                  key={index}
                  onClick={() => onRowClick?.(row)}
                  className={onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
                >
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      {column.render
                        ? column.render(getValue(row, column), row)
                        : getValue(row, column)}
                    </TableCell>
                  ))}
                  {actions && <TableCell>{actions(row)}</TableCell>}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {pagination && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} results
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={pagination.limit.toString()}
                onValueChange={(value) => pagination.onLimitChange(parseInt(value))}
              >
                <SelectTrigger className="w-16">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => pagination.onPageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {pagination.page} of{' '}
                  {Math.ceil(pagination.total / pagination.limit)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => pagination.onPageChange(pagination.page + 1)}
                  disabled={
                    pagination.page * pagination.limit >= pagination.total
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

### 2. Form Component

```typescript
// src/components/common/Form.tsx
import React, { useState, useCallback } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'date';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: z.ZodTypeAny;
}

interface FormProps<T extends Record<string, any>> {
  fields: FormField[];
  schema: z.ZodSchema<T>;
  onSubmit: (data: T) => Promise<void> | void;
  defaultValues?: Partial<T>;
  submitText?: string;
  cancelText?: string;
  onCancel?: () => void;
  loading?: boolean;
  className?: string;
}

export function Form<T extends Record<string, any>>({
  fields,
  schema,
  onSubmit,
  defaultValues,
  submitText = 'Submit',
  cancelText = 'Cancel',
  onCancel,
  loading = false,
  className,
}: FormProps<T>) {
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onFormSubmit = useCallback(async (data: T) => {
    try {
      setError(null);
      await onSubmit(data);
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }, [onSubmit, reset]);

  const renderField = (field: FormField) => {
    const commonProps = {
      id: field.name,
      ...register(field.name),
      placeholder: field.placeholder,
      className: errors[field.name] ? 'border-red-500' : '',
    };

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={4}
            className={`w-full p-2 border rounded-md ${commonProps.className}`}
          />
        );
      case 'select':
        return (
          <select
            {...commonProps}
            className={`w-full p-2 border rounded-md ${commonProps.className}`}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'date':
        return (
          <Input
            type="date"
            {...commonProps}
            className={commonProps.className}
          />
        );
      default:
        return (
          <Input
            type={field.type}
            {...commonProps}
            className={commonProps.className}
          />
        );
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Form</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              {renderField(field)}
              {errors[field.name] && (
                <p className="text-sm text-red-500">
                  {errors[field.name]?.message as string}
                </p>
              )}
            </div>
          ))}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submitText}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                {cancelText}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
```

---

## 👥 Admin Components

### 1. User Management

#### User Table Component

```typescript
// src/components/admin/UserTable.tsx
import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Edit, Trash2, Key } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from '@/types/admin';
import { getUsers, updateUserRole, deleteUser } from '@/lib/api/admin';

interface UserTableProps {
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  onResetPassword?: (user: User) => void;
}

export function UserTable({ onEdit, onDelete, onResetPassword }: UserTableProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  });

  const fetchUsers = async (params = {}) => {
    try {
      setLoading(true);
      const response = await getUsers({ ...pagination, ...params });
      setUsers(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.pagination.total,
      }));
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, pagination.limit]);

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleLimitChange = (limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }));
  };

  const handleRoleChange = async (userId: string, newRoleId: string) => {
    try {
      await updateUserRole(userId, { roleId: newRoleId });
      await fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Failed to update user role:', error);
    }
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`Are you sure you want to delete ${user.name}?`)) {
      return;
    }

    try {
      await deleteUser(user.id);
      await fetchUsers(); // Refresh the list
      onDelete?.(user);
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const columns = [
    {
      id: 'name',
      label: 'Name',
      accessor: 'name',
    },
    {
      id: 'email',
      label: 'Email',
      accessor: 'email',
    },
    {
      id: 'role',
      label: 'Role',
      accessor: 'role.name',
      render: (value: string, row: User) => (
        <Badge variant="outline">{value}</Badge>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      accessor: 'status',
      render: (value: string) => (
        <Badge variant={value === 'active' ? 'default' : 'secondary'}>
          {value}
        </Badge>
      ),
    },
    {
      id: 'lastLoginAt',
      label: 'Last Login',
      accessor: 'lastLoginAt',
      render: (value: string) => 
        value ? new Date(value).toLocaleDateString() : 'Never',
    },
    {
      id: 'actions',
      label: 'Actions',
      render: (value: any, row: User) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit?.(row)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onResetPassword?.(row)}>
              <Key className="mr-2 h-4 w-4" />
              Reset Password
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleDelete(row)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DataTable
      data={users}
      columns={columns}
      loading={loading}
      pagination={{
        ...pagination,
        onPageChange: handlePageChange,
        onLimitChange: handleLimitChange,
      }}
    />
  );
}
```

#### User Form Component

```typescript
// src/components/admin/UserForm.tsx
import React, { useEffect } from 'react';
import { Form } from '@/components/common/Form';
import { Modal } from '@/components/common/Modal';
import { User, Role } from '@/types/admin';
import { createUser, updateUser } from '@/lib/api/admin';
import { getRoles } from '@/lib/api/admin';
import { z } from 'zod';

interface UserFormProps {
  user?: User;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  roleId: z.string().min(1, 'Role is required'),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
});

type UserFormData = z.infer<typeof userSchema>;

export function UserForm({ user, isOpen, onClose, onSuccess }: UserFormProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getRoles();
        setRoles(response.data || []);
      } catch (error) {
        console.error('Failed to fetch roles:', error);
      }
    };

    fetchRoles();
  }, []);

  const handleSubmit = async (data: UserFormData) => {
    try {
      setLoading(true);
      
      if (user) {
        // Update existing user
        await updateUser(user.id, {
          name: data.name,
          email: data.email,
          roleId: data.roleId,
        });
      } else {
        // Create new user
        await createUser({
          ...data,
          password: data.password || '',
        });
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save user:', error);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      name: 'name' as const,
      label: 'Name',
      type: 'text' as const,
      required: true,
    },
    {
      name: 'email' as const,
      label: 'Email',
      type: 'email' as const,
      required: true,
    },
    {
      name: 'roleId' as const,
      label: 'Role',
      type: 'select' as const,
      required: true,
      options: roles.map((role) => ({
        value: role.id,
        label: role.name,
      })),
    },
    ...(!user ? [{
      name: 'password' as const,
      label: 'Password',
      type: 'password' as const,
      required: true,
      placeholder: 'Enter password',
    }] : []),
  ];

  const defaultValues = user ? {
    name: user.name,
    email: user.email,
    roleId: user.role.id,
  } : {};

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={user ? 'Edit User' : 'Create User'}>
      <Form
        fields={fields}
        schema={userSchema}
        onSubmit={handleSubmit}
        defaultValues={defaultValues}
        submitText={user ? 'Update' : 'Create'}
        cancelText="Cancel"
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
}
```

### 2. Permission Matrix Component

```typescript
// src/components/admin/PermissionMatrix.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getRoles, getPermissions, updateRolePermissions } from '@/lib/api/admin';
import { Role, Permission } from '@/types/admin';

export function PermissionMatrix() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rolesResponse, permissionsResponse] = await Promise.all([
        getRoles(),
        getPermissions(),
      ]);

      setRoles(rolesResponse.data || []);
      setPermissions(permissionsResponse.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = async (roleId: string, permissionId: string, checked: boolean) => {
    try {
      const role = roles.find(r => r.id === roleId);
      if (!role) return;

      const currentPermissions = role.permissions || [];
      const newPermissions = checked
        ? [...currentPermissions, permissionId]
        : currentPermissions.filter(id => id !== permissionId);

      await updateRolePermissions(roleId, { permissionIds: newPermissions });
      
      // Update local state
      setRoles(prev => prev.map(r => 
        r.id === roleId 
          ? { ...r, permissions: newPermissions }
          : r
      ));
    } catch (error) {
      console.error('Failed to update permissions:', error);
    }
  };

  const groupPermissionsByModule = (permissions: Permission[]) => {
    const grouped: Record<string, Permission[]> = {};
    
    permissions.forEach(permission => {
      if (!grouped[permission.module]) {
        grouped[permission.module] = [];
      }
      grouped[permission.module].push(permission);
    });

    return grouped;
  };

  const permissionGroups = groupPermissionsByModule(permissions);

  if (loading) {
    return <div>Loading permission matrix...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Permission Matrix</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-48">Module / Permission</TableHead>
                {roles.map((role) => (
                  <TableHead key={role.id} className="text-center">
                    {role.name}
                    {role.isSystem && <Badge variant="outline" className="ml-2">System</Badge>}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(permissionGroups).map(([module, modulePermissions]) => (
                <React.Fragment key={module}>
                  <TableRow className="bg-muted/50">
                    <TableCell colSpan={roles.length + 1} className="font-medium">
                      {module}
                    </TableCell>
                  </TableRow>
                  {modulePermissions.map((permission) => (
                    <TableRow key={permission.id}>
                      <TableCell className="font-normal">
                        {permission.entity} - {permission.action}
                      </TableCell>
                      {roles.map((role) => (
                        <TableCell key={role.id} className="text-center">
                          <Checkbox
                            checked={role.permissions?.includes(permission.id) || false}
                            onCheckedChange={(checked) =>
                              handlePermissionChange(role.id, permission.id, checked as boolean)
                            }
                            disabled={role.isSystem}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## 📋 Insurance Components

### 1. Insurance Dashboard

```typescript
// src/components/insurance/InsuranceDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  DollarSign,
  FileText,
  Users,
  Calendar
} from 'lucide-react';
import { 
  getInsuranceContracts, 
  getInsuranceClaims,
  getClaimsSummary 
} from '@/lib/api/insurance';
import { InsuranceContract, InsuranceClaim } from '@/types/insurance';

export function InsuranceDashboard() {
  const [contracts, setContracts] = useState<InsuranceContract[]>([]);
  const [claims, setClaims] = useState<InsuranceClaim[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [contractsResponse, claimsResponse, summaryResponse] = await Promise.all([
        getInsuranceContracts({ limit: 5 }),
        getInsuranceClaims({ limit: 5 }),
        getClaimsSummary(),
      ]);

      setContracts(contractsResponse.data || []);
      setClaims(claimsResponse.data || []);
      setSummary(summaryResponse.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.active || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Claims</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.submitted || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Requires attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${((summary?.totalApprovedAmount || 0) / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground">
              +20% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Claim Ratio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.total ? ((summary?.approved / summary?.total) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Approval rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Contracts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Contracts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contracts.slice(0, 5).map((contract) => (
              <div key={contract.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-medium">{contract.contractNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {contract.customer.name} - {contract.vehicle.model}
                    </p>
                  </div>
                  <Badge variant={contract.status === 'active' ? 'default' : 'secondary'}>
                    {contract.status}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="font-medium">${contract.premiumAmount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(contract.startDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">
            View All Contracts
          </Button>
        </CardContent>
      </Card>

      {/* Recent Claims */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Claims</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {claims.slice(0, 5).map((claim) => (
              <div key={claim.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-medium">{claim.claimNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {claim.contract.customer.name} - {claim.incidentType}
                    </p>
                  </div>
                  <Badge variant={
                    claim.status === 'approved' ? 'default' :
                    claim.status === 'rejected' ? 'destructive' :
                    claim.status === 'reviewing' ? 'secondary' : 'outline'
                  }>
                    {claim.status}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="font-medium">${claim.claimAmount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(claim.incidentDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">
            View All Claims
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

### 2. Insurance Contract List

```typescript
// src/components/insurance/InsuranceContractList.tsx
import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Filter } from 'lucide-react';
import { InsuranceContract } from '@/types/insurance';
import { getInsuranceContracts } from '@/lib/api/insurance';
import { InsuranceContractForm } from './InsuranceContractForm';

export function InsuranceContractList() {
  const [contracts, setContracts] = useState<InsuranceContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    type: '',
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  });

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const response = await getInsuranceContracts({
        page: pagination.page,
        limit: pagination.limit,
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v)),
      });

      setContracts(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.pagination.total,
      }));
    } catch (error) {
      console.error('Failed to fetch contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [pagination.page, pagination.limit, filters]);

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleLimitChange = (limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }));
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchContracts();
  };

  const columns = [
    {
      id: 'contractNumber',
      label: 'Contract No',
      accessor: 'contractNumber',
    },
    {
      id: 'customer',
      label: 'Customer',
      accessor: 'customer.name',
    },
    {
      id: 'vehicle',
      label: 'Vehicle',
      accessor: 'vehicle.model',
    },
    {
      id: 'insuranceType',
      label: 'Type',
      accessor: 'insuranceType',
      render: (value: string) => {
        const typeLabels: Record<string, string> = {
          'bao_vien_than': 'Bảo Viện Thân',
          'bao_vat_chat': 'Bảo Vật Chất',
          'dung_chung': 'Dùng Chung',
        };
        return <Badge variant="outline">{typeLabels[value] || value}</Badge>;
      },
    },
    {
      id: 'premiumAmount',
      label: 'Premium',
      accessor: 'premiumAmount',
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      id: 'status',
      label: 'Status',
      accessor: 'status',
      render: (value: string) => {
        const statusVariants: Record<string, any> = {
          'active': 'default',
          'expired': 'secondary',
          'cancelled': 'destructive',
          'pending': 'outline',
        };
        return <Badge variant={statusVariants[value] || 'outline'}>{value}</Badge>;
      },
    },
    {
      id: 'startDate',
      label: 'Start Date',
      accessor: 'startDate',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      id: 'endDate',
      label: 'End Date',
      accessor: 'endDate',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Insurance Contracts</h1>
          <p className="text-muted-foreground">Manage all insurance contracts</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Contract
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-4 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search contracts..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="bao_vien_than">Bảo Viện Thân</SelectItem>
                <SelectItem value="bao_vat_chat">Bảo Vật Chất</SelectItem>
                <SelectItem value="dung_chung">Dùng Chung</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Data Table */}
      <DataTable
        data={contracts}
        columns={columns}
        loading={loading}
        pagination={{
          ...pagination,
          onPageChange: handlePageChange,
          onLimitChange: handleLimitChange,
        }}
      />

      {/* Form Modal */}
      {showForm && (
        <InsuranceContractForm
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}
```

### 3. Insurance Contract Form

```typescript
// src/components/insurance/InsuranceContractForm.tsx
import React, { useEffect, useState } from 'react';
import { Form } from '@/components/common/Form';
import { Modal } from '@/components/common/Modal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getCustomers, getVehicles } from '@/lib/api/common';
import { createInsuranceContract, updateInsuranceContract } from '@/lib/api/insurance';
import { Customer, Vehicle } from '@/types/common';
import { z } from 'zod';

interface InsuranceContractFormProps {
  contract?: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const contractSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  vehicleId: z.string().min(1, 'Vehicle is required'),
  insuranceType: z.enum(['bao_vien_than', 'bao_vat_chat', 'dung_chung']),
  premiumAmount: z.number().min(0, 'Premium amount must be positive'),
  coverageAmount: z.number().min(0, 'Coverage amount must be positive'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  policyNumber: z.string().optional(),
  insuranceCompany: z.string().optional(),
  notes: z.string().optional(),
});

type ContractFormData = z.infer<typeof contractSchema>;

export function InsuranceContractForm({ 
  contract, 
  isOpen, 
  onClose, 
  onSuccess 
}: InsuranceContractFormProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersResponse, vehiclesResponse] = await Promise.all([
          getCustomers(),
          getVehicles(),
        ]);

        setCustomers(customersResponse.data || []);
        setVehicles(vehiclesResponse.data || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (contract?.customerId) {
      setSelectedCustomer(contract.customerId);
    }
  }, [contract]);

  const handleSubmit = async (data: ContractFormData) => {
    try {
      setLoading(true);
      
      if (contract) {
        await updateInsuranceContract(contract.id, data);
      } else {
        await createInsuranceContract(data);
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save contract:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicles = selectedCustomer
    ? vehicles.filter(v => v.customerId === selectedCustomer)
    : vehicles;

  const fields = [
    {
      name: 'customerId' as const,
      label: 'Customer',
      type: 'select' as const,
      required: true,
      options: customers.map(c => ({ value: c.id, label: `${c.name} (${c.phone})` })),
    },
    {
      name: 'vehicleId' as const,
      label: 'Vehicle',
      type: 'select' as const,
      required: true,
      options: filteredVehicles.map(v => ({ 
        value: v.id, 
        label: `${v.model} (${v.year}) - ${v.vin}` 
      })),
    },
    {
      name: 'insuranceType' as const,
      label: 'Insurance Type',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'bao_vien_than', label: 'Bảo Viện Thân' },
        { value: 'bao_vat_chat', label: 'Bảo Vật Chất' },
        { value: 'dung_chung', label: 'Dùng Chung' },
      ],
    },
    {
      name: 'premiumAmount' as const,
      label: 'Premium Amount',
      type: 'number' as const,
      required: true,
      placeholder: '0.00',
    },
    {
      name: 'coverageAmount' as const,
      label: 'Coverage Amount',
      type: 'number' as const,
      required: true,
      placeholder: '0.00',
    },
    {
      name: 'startDate' as const,
      label: 'Start Date',
      type: 'date' as const,
      required: true,
    },
    {
      name: 'endDate' as const,
      label: 'End Date',
      type: 'date' as const,
      required: true,
    },
    {
      name: 'policyNumber' as const,
      label: 'Policy Number',
      type: 'text' as const,
      placeholder: 'Enter policy number',
    },
    {
      name: 'insuranceCompany' as const,
      label: 'Insurance Company',
      type: 'text' as const,
      placeholder: 'Enter insurance company',
    },
    {
      name: 'notes' as const,
      label: 'Notes',
      type: 'textarea' as const,
      placeholder: 'Additional notes...',
    },
  ];

  const defaultValues = contract ? {
    customerId: contract.customerId,
    vehicleId: contract.vehicleId,
    insuranceType: contract.insuranceType,
    premiumAmount: contract.premiumAmount,
    coverageAmount: contract.coverageAmount,
    startDate: contract.startDate.split('T')[0],
    endDate: contract.endDate.split('T')[0],
    policyNumber: contract.policyNumber || '',
    insuranceCompany: contract.insuranceCompany || '',
    notes: contract.notes || '',
  } : {};

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={contract ? 'Edit Insurance Contract' : 'Create Insurance Contract'}
      size="lg"
    >
      <Form
        fields={fields}
        schema={contractSchema}
        onSubmit={handleSubmit}
        defaultValues={defaultValues}
        submitText={contract ? 'Update' : 'Create'}
        cancelText="Cancel"
        onCancel={onClose}
        loading={loading}
        className="max-h-[80vh] overflow-y-auto"
      />
    </Modal>
  );
}
```

---

## 🎣 Custom Hooks

### 1. useAuth Hook

```typescript
// src/hooks/useAuth.ts
import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/auth';
import { login, logout, getCurrentUser } from '@/lib/api/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        // Token might be expired or invalid
        localStorage.removeItem('auth_token');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await login(email, password);
      localStorage.setItem('auth_token', response.token);
      setUser(response.user);
      router.push('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    router.push('/login');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user?.permissions) return false;
    return user.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login: handleLogin,
      logout: handleLogout,
      hasPermission,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

### 2. useRBAC Hook

```typescript
// src/hooks/useRBAC.ts
import { useAuth } from './useAuth';

export function useRBAC() {
  const { hasPermission, user } = useAuth();

  const requirePermission = (permission: string): boolean => {
    return hasPermission(permission);
  };

  const requireAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  const requireAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  const requireRole = (roleName: string): boolean => {
    return user?.role?.name === roleName;
  };

  const requireAnyRole = (roleNames: string[]): boolean => {
    return roleNames.includes(user?.role?.name || '');
  };

  return {
    hasPermission,
    requirePermission,
    requireAnyPermission,
    requireAllPermissions,
    requireRole,
    requireAnyRole,
    user,
  };
}
```

### 3. useApi Hook

```typescript
// src/hooks/useApi.ts
import { useState, useEffect } from 'react';

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export function useApi<T = any>(
  apiCall: () => Promise<T>,
  options: UseApiOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
      options.onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('API call failed');
      setError(error);
      options.onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options.immediate !== false) {
      execute();
    }
  }, [apiCall]);

  return {
    data,
    loading,
    error,
    refetch: execute,
  };
}
```

---

**End of Frontend Implementation Plan**