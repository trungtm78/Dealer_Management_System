# Database Migration Plan: CR-001

## 1. Overview
This plan details the database changes required to implement the Permissions System and System Settings for CR-001.

## 2. Changes
- **New Tables**: `roles`, `permissions`, `role_permissions`, `system_settings`
- **Modified Tables**: `users` (add security fields)

## 3. Migration Steps (Prisma)

### Step 1: Update schema.prisma

```prisma
model Role {
  id          String   @id @default(uuid())
  code        String   @unique
  name        String
  description String?
  isSystem    Boolean  @default(false)
  permissions RolePermission[]
  users       User[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("roles")
}

model Permission {
  id          String   @id @default(uuid())
  code        String   @unique // e.g., "admin.users.view"
  module      String
  action      String
  description String?
  roles       RolePermission[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("permissions")
}

model RolePermission {
  roleId       String
  permissionId String
  role         Role       @relation(fields: [roleId], references: [id])
  permission   Permission @relation(fields: [permissionId], references: [id])

  @@id([roleId, permissionId])
  @@map("role_permissions")
}

model SystemSetting {
  key         String   @id
  value       String
  type        String   // STRING, NUMBER, BOOLEAN, JSON
  category    String
  isPublic    Boolean  @default(false)
  updatedAt   DateTime @updatedAt
  
  @@map("system_settings")
}

// Update User model
model User {
  // ... existing fields
  roleId      String?
  role        Role?    @relation(fields: [roleId], references: [id])
  
  lastLogin           DateTime?
  failedLoginAttempts Int       @default(0)
  passwordChangedAt   DateTime?
  isActive            Boolean   @default(true)
  deletedAt           DateTime?
  
  // Relations...
}
```

### Step 2: Seed Data

**Initial Roles**:
- `ADMIN`: Full Access
- `MANAGER`: View All, Edit Operational
- `SALES`: Sales module access
- `SERVICE`: Service module access

**Initial Permissions**:
- `admin.*`
- `sales.*`
- `service.*`
- `insurance.*`

## 4. Verification
- Verify tables created in Postgres.
- Verify relationship constraints (FKs).
- Verify seed data loaded.
