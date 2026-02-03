# Backend Implementation Plan
## CR-20250131-002 Implementation

**Date**: 2026-02-01  
**Version**: 1.0  
**Status**: Ready for Implementation

---

## 📋 Overview

This backend implementation plan covers the server-side components for:
1. **System Administration Module**: RBAC, Audit Logs, System Settings, Monitoring
2. **Insurance Module**: Contracts and Claims

---

## 🏗️ Project Structure

```
src/
├── server/
│   ├── api/
│   │   ├── admin/
│   │   │   ├── users/
│   │   │   │   ├── index.ts
│   │   │   │   ├── service.ts
│   │   │   │   └── types.ts
│   │   │   ├── roles/
│   │   │   │   ├── index.ts
│   │   │   │   ├── service.ts
│   │   │   │   └── types.ts
│   │   │   ├── audit-logs/
│   │   │   │   ├── index.ts
│   │   │   │   ├── service.ts
│   │   │   │   └── types.ts
│   │   │   ├── settings/
│   │   │   │   ├── index.ts
│   │   │   │   ├── service.ts
│   │   │   │   └── types.ts
│   │   │   └── monitoring/
│   │   │       ├── index.ts
│   │   │       ├── service.ts
│   │   │       └── types.ts
│   │   └── insurance/
│   │       ├── contracts/
│   │       │   ├── index.ts
│   │       │   ├── service.ts
│   │       │   └── types.ts
│   │       └── claims/
│   │           ├── index.ts
│   │           ├── service.ts
│   │           └── types.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── rbac.ts
│   │   ├── audit.ts
│   │   └── error.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── rbac.service.ts
│   │   ├── audit.service.ts
│   │   ├── settings.service.ts
│   │   └── monitoring.service.ts
│   ├── utils/
│   │   ├── logger.ts
│   │   ├── validator.ts
│   │   └── helpers.ts
│   └── types/
│       ├── auth.ts
│       ├── admin.ts
│       ├── insurance.ts
│       └── common.ts
```

---

## 🔐 Authentication & Authorization

### 1. JWT Authentication Service

```typescript
// src/server/services/auth.service.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { User } from '@prisma/client';

export interface JWTPayload {
  userId: string;
  email: string;
  roleId: string;
  permissions: string[];
}

export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
    });
  }

  static verifyToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.JWT_SECRET) as JWTPayload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  static async authenticateUser(email: string, password: string): Promise<{
    user: User;
    token: string;
    permissions: string[];
  }> {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!user || !user.password) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await this.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
      throw new Error('User is inactive');
    }

    const permissions = user.role?.rolePermissions.map(
      (rp) => `${rp.permission.module}.${rp.permission.entity}.${rp.permission.action}`
    ) || [];

    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      roleId: user.roleId || '',
      permissions,
    };

    const token = this.generateToken(payload);

    return {
      user,
      token,
      permissions,
    };
  }

  static async createUser(userData: {
    email: string;
    name: string;
    password: string;
    roleId: string;
  }): Promise<User> {
    const hashedPassword = await this.hashPassword(userData.password);

    return prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        password: hashedPassword,
        roleId: userData.roleId,
        isActive: true,
      },
    });
  }
}
```

### 2. RBAC Service

```typescript
// src/server/services/rbac.service.ts
import { prisma } from '@/lib/prisma';

export interface Permission {
  module: string;
  entity: string;
  action: string;
}

export class RBACService {
  static async hasPermission(
    userId: string,
    requiredPermission: string
  ): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!user?.role) {
      return false;
    }

    // Super admin has all permissions
    if (user.role.name === 'SUPER_ADMIN') {
      return true;
    }

    const permissions = user.role.rolePermissions.map(
      (rp) => `${rp.permission.module}.${rp.permission.entity}.${rp.permission.action}`
    );

    return permissions.includes(requiredPermission);
  }

  static async getUserPermissions(userId: string): Promise<string[]> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!user?.role) {
      return [];
    }

    if (user.role.name === 'SUPER_ADMIN') {
      const allPermissions = await prisma.permission.findMany();
      return allPermissions.map(
        (p) => `${p.module}.${p.entity}.${p.action}`
      );
    }

    return user.role.rolePermissions.map(
      (rp) => `${rp.permission.module}.${rp.permission.entity}.${rp.permission.action}`
    );
  }

  static async createRole(data: {
    name: string;
    description: string;
    permissionIds?: string[];
  }) {
    return prisma.$transaction(async (tx) => {
      const role = await tx.role.create({
        data: {
          name: data.name,
          description: data.description,
          isSystem: false,
        },
      });

      if (data.permissionIds && data.permissionIds.length > 0) {
        await tx.rolePermission.createMany({
          data: data.permissionIds.map((permissionId) => ({
            roleId: role.id,
            permissionId,
          })),
        });
      }

      return role;
    });
  }

  static async updateRolePermissions(
    roleId: string,
    permissionIds: string[]
  ) {
    return prisma.$transaction(async (tx) => {
      // Remove existing permissions
      await tx.rolePermission.deleteMany({
        where: { roleId },
      });

      // Add new permissions
      if (permissionIds.length > 0) {
        await tx.rolePermission.createMany({
          data: permissionIds.map((permissionId) => ({
            roleId,
            permissionId,
          })),
        });
      }

      return tx.role.findUnique({
        where: { id: roleId },
        include: {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
        },
      });
    });
  }
}
```

### 3. Auth Middleware

```typescript
// src/server/middleware/auth.ts
import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/server/services/auth.service';

export async function authMiddleware(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const payload = AuthService.verifyToken(token);

    // Add user info to request headers for downstream use
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId);
    requestHeaders.set('x-user-email', payload.email);
    requestHeaders.set('x-user-role-id', payload.roleId);
    requestHeaders.set('x-user-permissions', JSON.stringify(payload.permissions));

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }
}
```

### 4. RBAC Middleware

```typescript
// src/server/middleware/rbac.ts
import { NextRequest, NextResponse } from 'next/server';
import { RBACService } from '@/server/services/rbac.service';

export function requirePermission(permission: string) {
  return async (request: NextRequest) => {
    try {
      const userId = request.headers.get('x-user-id');
      if (!userId) {
        return NextResponse.json(
          { error: 'User not authenticated' },
          { status: 401 }
        );
      }

      const hasPermission = await RBACService.hasPermission(userId, permission);
      if (!hasPermission) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      return NextResponse.next();
    } catch (error) {
      return NextResponse.json(
        { error: 'Authorization check failed' },
        { status: 500 }
      );
    }
  };
}

export function requireRole(roleName: string) {
  return async (request: NextRequest) => {
    try {
      const userRoleId = request.headers.get('x-user-role-id');
      if (!userRoleId) {
        return NextResponse.json(
          { error: 'User not authenticated' },
          { status: 401 }
        );
      }

      // In a real implementation, you'd query the database to get the role name
      // For now, we'll check against a hardcoded list or use a cache
      const userRole = await prisma.role.findUnique({
        where: { id: userRoleId },
      });

      if (!userRole || userRole.name !== roleName) {
        return NextResponse.json(
          { error: 'Insufficient role permissions' },
          { status: 403 }
        );
      }

      return NextResponse.next();
    } catch (error) {
      return NextResponse.json(
        { error: 'Role check failed' },
        { status: 500 }
      );
    }
  };
}
```

---

## 📝 Audit Logging Service

```typescript
// src/server/services/audit.service.ts
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

export interface AuditLogData {
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValue?: any;
  newValue?: any;
  request?: NextRequest;
}

export class AuditService {
  static async logAction(data: AuditLogData) {
    try {
      const ipAddress = data.request?.headers.get('x-forwarded-for') || 
                       data.request?.headers.get('x-real-ip') || 
                       'unknown';
      
      const userAgent = data.request?.headers.get('user-agent') || 'unknown';

      await prisma.activityLog.create({
        data: {
          userId: data.userId,
          action: data.action,
          entityType: data.entityType,
          entityId: data.entityId,
          oldValue: data.oldValue ? JSON.stringify(data.oldValue) : null,
          newValue: data.newValue ? JSON.stringify(data.newValue) : null,
          ipAddress,
          userAgent,
        },
      });
    } catch (error) {
      // Log audit failure but don't block the main operation
      console.error('Failed to create audit log:', error);
    }
  }

  static async getAuditLogs(params: {
    userId?: string;
    action?: string;
    entityType?: string;
    entityId?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }) {
    const {
      userId,
      action,
      entityType,
      entityId,
      startDate,
      endDate,
      page = 1,
      limit = 20,
    } = params;

    const where: any = {};
    
    if (userId) where.userId = userId;
    if (action) where.action = action;
    if (entityType) where.entityType = entityType;
    if (entityId) where.entityId = entityId;
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.activityLog.count({ where }),
    ]);

    return {
      data: logs.map((log) => ({
        ...log,
        oldValue: log.oldValue ? JSON.parse(log.oldValue) : null,
        newValue: log.newValue ? JSON.parse(log.newValue) : null,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async cleanupOldLogs(retentionDays: number = 365) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const result = await prisma.activityLog.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });

    return result.count;
  }
}
```

### Audit Middleware

```typescript
// src/server/middleware/audit.ts
import { NextResponse } from 'next/server';
import { AuditService } from '@/server/services/audit.service';

export function auditMiddleware(entityType: string) {
  return async (request: NextRequest, context: any) => {
    const response = await NextResponse.next();
    
    // Only audit successful requests
    if (response.status < 400) {
      const userId = request.headers.get('x-user-id');
      const entityId = context.params?.id;
      
      if (userId) {
        await AuditService.logAction({
          userId,
          action: getActionFromMethod(request.method),
          entityType,
          entityId: entityId || 'unknown',
          request,
        });
      }
    }
    
    return response;
  };
}

function getActionFromMethod(method: string): string {
  switch (method.toUpperCase()) {
    case 'GET': return 'read';
    case 'POST': return 'create';
    case 'PUT': return 'update';
    case 'DELETE': return 'delete';
    default: return method.toLowerCase();
  }
}
```

---

## ⚙️ System Settings Service

```typescript
// src/server/services/settings.service.ts
import { prisma } from '@/lib/prisma';

export class SettingsService {
  static async getSettings(category?: string) {
    const where = category ? { category } : {};
    
    const settings = await prisma.systemSetting.findMany({
      where,
      orderBy: { category: 'asc' },
    });

    // Convert to key-value map
    const settingsMap: Record<string, any> = {};
    
    settings.forEach((setting) => {
      let value = setting.value;
      
      // Type conversion
      switch (setting.type) {
        case 'number':
          value = parseFloat(setting.value);
          break;
        case 'boolean':
          value = setting.value === 'true';
          break;
        case 'json':
          try {
            value = JSON.parse(setting.value);
          } catch {
            value = null;
          }
          break;
      }
      
      settingsMap[setting.key] = value;
    });

    return settingsMap;
  }

  static async updateSettings(updates: Array<{ key: string; value: any }>) {
    return prisma.$transaction(async (tx) => {
      const results = [];
      
      for (const update of updates) {
        const existing = await tx.systemSetting.findUnique({
          where: { key: update.key },
        });

        if (!existing) {
          throw new Error(`Setting ${update.key} not found`);
        }

        // Value validation and conversion
        const processedValue = this.processSettingValue(update.value, existing.type);

        const updated = await tx.systemSetting.update({
          where: { key: update.key },
          data: {
            value: processedValue,
            updatedAt: new Date(),
          },
        });

        results.push(updated);
      }

      return results;
    });
  }

  private static processSettingValue(value: any, type: string): string {
    switch (type) {
      case 'string':
        return String(value);
      case 'number':
        const num = parseFloat(value);
        if (isNaN(num)) {
          throw new Error(`Invalid number value: ${value}`);
        }
        return num.toString();
      case 'boolean':
        return value === true || value === 'true' ? 'true' : 'false';
      case 'json':
        try {
          return JSON.stringify(value);
        } catch {
          throw new Error(`Invalid JSON value: ${value}`);
        }
      default:
        return String(value);
    }
  }

  static async getSettingValue(key: string): Promise<any> {
    const setting = await prisma.systemSetting.findUnique({
      where: { key },
    });

    if (!setting) {
      throw new Error(`Setting ${key} not found`);
    }

    return this.processSettingValue(setting.value, setting.type);
  }

  static async createSetting(data: {
    key: string;
    value: any;
    type: 'string' | 'number' | 'boolean' | 'json';
    category: string;
    isPublic: boolean;
    description: string;
  }) {
    const processedValue = this.processSettingValue(data.value, data.type);

    return prisma.systemSetting.create({
      data: {
        ...data,
        value: processedValue,
        isSensitive: false,
      },
    });
  }
}
```

---

## 📊 System Monitoring Service

```typescript
// src/server/services/monitoring.service.ts
import { prisma } from '@/lib/prisma';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface SystemMetrics {
  cpu: {
    usage: number;
    cores: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  disk: {
    used: number;
    total: number;
    percentage: number;
  };
  database: {
    status: 'healthy' | 'warning' | 'critical';
    connectionCount: number;
    queryTime: number;
  };
  application: {
    uptime: number;
    activeUsers: number;
    requestRate: number;
  };
}

export class MonitoringService {
  private static readonly SERVER_START_TIME = Date.now();

  static async collectMetrics(): Promise<SystemMetrics> {
    const [cpu, memory, disk, database, application] = await Promise.all([
      this.getCpuMetrics(),
      this.getMemoryMetrics(),
      this.getDiskMetrics(),
      this.getDatabaseMetrics(),
      this.getApplicationMetrics(),
    ]);

    return {
      cpu,
      memory,
      disk,
      database,
      application,
    };
  }

  private static async getCpuMetrics() {
    try {
      // This is a simplified version - in production, you'd use a proper system monitoring library
      const { stdout } = await execAsync('wmic cpu get loadpercentage /value');
      const loadMatch = stdout.match(/LoadPercentage=(\d+)/);
      const usage = loadMatch ? parseInt(loadMatch[1]) : 0;

      return {
        usage,
        cores: require('os').cpus().length,
      };
    } catch {
      return { usage: 0, cores: 0 };
    }
  }

  private static async getMemoryMetrics() {
    try {
      const { stdout } = await execAsync('wmic OS get TotalVisibleMemorySize,FreePhysicalMemory /value');
      const totalMatch = stdout.match(/TotalVisibleMemorySize=(\d+)/);
      const freeMatch = stdout.match(/FreePhysicalMemory=(\d+)/);
      
      const total = totalMatch ? parseInt(totalMatch[1]) * 1024 : 0; // Convert KB to bytes
      const free = freeMatch ? parseInt(freeMatch[1]) * 1024 : 0;
      const used = total - free;

      return {
        used,
        total,
        percentage: total > 0 ? Math.round((used / total) * 100) : 0,
      };
    } catch {
      return { used: 0, total: 0, percentage: 0 };
    }
  }

  private static async getDiskMetrics() {
    try {
      const { stdout } = await execAsync('wmic logicaldisk get size,freespace /value');
      const sizeMatch = stdout.match(/Size=(\d+)/);
      const freeMatch = stdout.match(/FreeSpace=(\d+)/);
      
      const total = sizeMatch ? parseInt(sizeMatch[1]) : 0;
      const free = freeMatch ? parseInt(freeMatch[1]) : 0;
      const used = total - free;

      return {
        used,
        total,
        percentage: total > 0 ? Math.round((used / total) * 100) : 0,
      };
    } catch {
      return { used: 0, total: 0, percentage: 0 };
    }
  }

  private static async getDatabaseMetrics() {
    try {
      const startTime = Date.now();
      
      // Test database connection
      await prisma.$queryRaw`SELECT 1`;
      
      const queryTime = Date.now() - startTime;
      
      // Get connection count (PostgreSQL specific)
      const connections = await prisma.$queryRaw<{ count: number }[]>`
        SELECT count(*) as count 
        FROM pg_stat_activity 
        WHERE state = 'active'
      `;

      const connectionCount = connections[0]?.count || 0;

      let status: 'healthy' | 'warning' | 'critical' = 'healthy';
      
      if (queryTime > 1000) status = 'warning';
      if (queryTime > 5000 || connectionCount > 100) status = 'critical';

      return {
        status,
        connectionCount,
        queryTime,
      };
    } catch {
      return {
        status: 'critical' as const,
        connectionCount: 0,
        queryTime: 0,
      };
    }
  }

  private static async getApplicationMetrics() {
    try {
      const uptime = Date.now() - this.SERVER_START_TIME;
      
      // Get active users in last 5 minutes
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      
      const activeUsers = await prisma.user.count({
        where: {
          lastLoginAt: {
            gte: fiveMinutesAgo,
          },
        },
      });

      // Calculate request rate (you'd need to implement request logging)
      const requestRate = 0; // Placeholder

      return {
        uptime,
        activeUsers,
        requestRate,
      };
    } catch {
      return {
        uptime: 0,
        activeUsers: 0,
        requestRate: 0,
      };
    }
  }

  static async saveMetrics(metrics: SystemMetrics) {
    const timestamp = new Date();

    await prisma.systemMetric.createMany({
      data: [
        {
          metricType: 'cpu',
          metricName: 'usage',
          value: metrics.cpu.usage,
          unit: 'percent',
          timestamp,
        },
        {
          metricType: 'memory',
          metricName: 'usage',
          value: metrics.memory.percentage,
          unit: 'percent',
          timestamp,
        },
        {
          metricType: 'disk',
          metricName: 'usage',
          value: metrics.disk.percentage,
          unit: 'percent',
          timestamp,
        },
        {
          metricType: 'database',
          metricName: 'query_time',
          value: metrics.database.queryTime,
          unit: 'ms',
          timestamp,
        },
        {
          metricType: 'application',
          metricName: 'active_users',
          value: metrics.application.activeUsers,
          unit: 'count',
          timestamp,
        },
      ],
    });
  }

  static async getMetricsHistory(params: {
    metricType: string;
    metricName: string;
    startTime: Date;
    endTime: Date;
  }) {
    const { metricType, metricName, startTime, endTime } = params;

    return prisma.systemMetric.findMany({
      where: {
        metricType,
        metricName,
        timestamp: {
          gte: startTime,
          lte: endTime,
        },
      },
      orderBy: { timestamp: 'asc' },
    });
  }

  static async cleanupOldMetrics(retentionDays: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const result = await prisma.systemMetric.deleteMany({
      where: {
        timestamp: {
          lt: cutoffDate,
        },
      },
    });

    return result.count;
  }
}
```

---

## 📋 Insurance Services

### 1. Insurance Contract Service

```typescript
// src/server/services/insurance/contract.service.ts
import { prisma } from '@/lib/prisma';

export class InsuranceContractService {
  static async createContract(data: {
    customerId: string;
    vehicleId: string;
    insuranceType: 'bao_vien_than' | 'bao_vat_chat' | 'dung_chung';
    premiumAmount: number;
    coverageAmount: number;
    startDate: Date;
    endDate: Date;
    policyNumber?: string;
    insuranceCompany?: string;
    notes?: string;
    createdBy: string;
  }) {
    // Generate contract number
    const contractNumber = await this.generateContractNumber();

    return prisma.insuranceContract.create({
      data: {
        contractNumber,
        customerId: data.customerId,
        vehicleId: data.vehicleId,
        insuranceType: data.insuranceType,
        premiumAmount: data.premiumAmount,
        coverageAmount: data.coverageAmount,
        startDate: data.startDate,
        endDate: data.endDate,
        policyNumber: data.policyNumber,
        insuranceCompany: data.insuranceCompany,
        notes: data.notes,
        createdBy: data.createdBy,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        vehicle: {
          select: {
            id: true,
            vin: true,
            model: true,
            year: true,
          },
        },
      },
    });
  }

  static async getContracts(params: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    customerId?: string;
    vehicleId?: string;
    search?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const {
      page = 1,
      limit = 20,
      status,
      type,
      customerId,
      vehicleId,
      search,
      startDate,
      endDate,
    } = params;

    const where: any = {};
    
    if (status) where.status = status;
    if (type) where.insuranceType = type;
    if (customerId) where.customerId = customerId;
    if (vehicleId) where.vehicleId = vehicleId;
    
    if (search) {
      where.OR = [
        { contractNumber: { contains: search } },
        { policyNumber: { contains: search } },
        { insuranceCompany: { contains: search } },
      ];
    }
    
    if (startDate || endDate) {
      where.AND = [];
      if (startDate) {
        where.AND.push({ startDate: { gte: startDate } });
      }
      if (endDate) {
        where.AND.push({ endDate: { lte: endDate } });
      }
    }

    const [contracts, total] = await Promise.all([
      prisma.insuranceContract.findMany({
        where,
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
          vehicle: {
            select: {
              id: true,
              vin: true,
              model: true,
              year: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.insuranceContract.count({ where }),
    ]);

    return {
      data: contracts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getContractById(id: string) {
    const contract = await prisma.insuranceContract.findUnique({
      where: { id },
      include: {
        customer: true,
        vehicle: true,
        claims: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!contract) {
      throw new Error('Contract not found');
    }

    return contract;
  }

  static async updateContract(id: string, data: {
    customerId?: string;
    vehicleId?: string;
    insuranceType?: string;
    premiumAmount?: number;
    coverageAmount?: number;
    startDate?: Date;
    endDate?: Date;
    status?: string;
    policyNumber?: string;
    insuranceCompany?: string;
    notes?: string;
  }) {
    return prisma.insuranceContract.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        customer: true,
        vehicle: true,
      },
    });
  }

  static async generateContractNumber(): Promise<string> {
    const prefix = 'BH';
    const date = new Date();
    const dateStr = date.getFullYear().toString().slice(-2) + 
                   (date.getMonth() + 1).toString().padStart(2, '0');
    
    // Get the latest contract number for today
    const latestContract = await prisma.insuranceContract.findFirst({
      where: {
        contractNumber: {
          startsWith: `${prefix}${dateStr}`,
        },
      },
      orderBy: {
        contractNumber: 'desc',
      },
    });

    let sequence = 1;
    if (latestContract) {
      const sequenceStr = latestContract.contractNumber.slice(-4);
      sequence = parseInt(sequenceStr) + 1;
    }

    return `${prefix}${dateStr}${sequence.toString().padStart(4, '0')}`;
  }

  static async checkExpiringContracts(daysAhead: number = 30) {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + daysAhead);

    return prisma.insuranceContract.findMany({
      where: {
        status: 'active',
        endDate: {
          lte: endDate,
        },
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });
  }
}
```

### 2. Insurance Claim Service

```typescript
// src/server/services/insurance/claim.service.ts
import { prisma } from '@/lib/prisma';

export class InsuranceClaimService {
  static async createClaim(data: {
    contractId: string;
    incidentDate: Date;
    incidentType: string;
    incidentDescription: string;
    claimAmount: number;
    createdBy: string;
    incidentPhotos?: string[];
    supportingDocuments?: string[];
  }) {
    // Generate claim number
    const claimNumber = await this.generateClaimNumber();

    // Check auto-approval limit
    const autoApproveLimit = await this.getAutoApproveLimit();
    let status = 'submitted';
    
    if (data.claimAmount <= autoApproveLimit) {
      status = 'approved';
    }

    return prisma.insuranceClaim.create({
      data: {
        claimNumber,
        contractId: data.contractId,
        incidentDate: data.incidentDate,
        incidentType: data.incidentType,
        incidentDescription: data.incidentDescription,
        claimAmount: data.claimAmount,
        approvedAmount: status === 'approved' ? data.claimAmount : null,
        status,
        incidentPhotos: data.incidentPhotos || [],
        supportingDocuments: data.supportingDocuments || [],
        createdBy: data.createdBy,
      },
      include: {
        contract: {
          include: {
            customer: {
              select: {
                id: true,
                name: true,
                phone: true,
              },
            },
          },
        },
      },
    });
  }

  static async getClaims(params: {
    page?: number;
    limit?: number;
    status?: string;
    contractId?: string;
    customerId?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const {
      page = 1,
      limit = 20,
      status,
      contractId,
      customerId,
      startDate,
      endDate,
    } = params;

    const where: any = {};
    
    if (status) where.status = status;
    if (contractId) where.contractId = contractId;
    if (customerId) {
      where.contract = {
        customerId: customerId,
      };
    }
    
    if (startDate || endDate) {
      where.incidentDate = {};
      if (startDate) where.incidentDate.gte = startDate;
      if (endDate) where.incidentDate.lte = endDate;
    }

    const [claims, total] = await Promise.all([
      prisma.insuranceClaim.findMany({
        where,
        include: {
          contract: {
            include: {
              customer: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.insuranceClaim.count({ where }),
    ]);

    return {
      data: claims,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getClaimById(id: string) {
    const claim = await prisma.insuranceClaim.findUnique({
      where: { id },
      include: {
        contract: {
          include: {
            customer: true,
            vehicle: true,
          },
        },
      },
    });

    if (!claim) {
      throw new Error('Claim not found');
    }

    return claim;
  }

  static async updateClaimStatus(id: string, data: {
    status: string;
    approvedAmount?: number;
    approvalNotes?: string;
    rejectionReason?: string;
    paymentDate?: Date;
    paymentReference?: string;
    reviewedBy?: string;
    approvedBy?: string;
  }) {
    return prisma.insuranceClaim.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        contract: {
          include: {
            customer: true,
          },
        },
      },
    });
  }

  static async processClaimWorkflow(claimId: string, newStatus: string, processedBy: string) {
    const claim = await prisma.insuranceClaim.findUnique({
      where: { id: claimId },
    });

    if (!claim) {
      throw new Error('Claim not found');
    }

    // Validate workflow transitions
    const validTransitions: Record<string, string[]> = {
      'submitted': ['reviewing', 'approved', 'rejected'],
      'reviewing': ['approved', 'rejected'],
      'approved': ['paid'],
      'rejected': [],
      'paid': [],
    };

    if (!validTransitions[claim.status].includes(newStatus)) {
      throw new Error(`Cannot transition from ${claim.status} to ${newStatus}`);
    }

    const updateData: any = {
      status: newStatus,
      updatedAt: new Date(),
    };

    // Set appropriate fields based on status
    switch (newStatus) {
      case 'reviewing':
        updateData.reviewedBy = processedBy;
        break;
      case 'approved':
        updateData.approvedBy = processedBy;
        if (!updateData.approvedAmount) {
          updateData.approvedAmount = claim.claimAmount;
        }
        break;
      case 'rejected':
        updateData.reviewedBy = processedBy;
        updateData.approvedBy = processedBy;
        break;
      case 'paid':
        updateData.paymentDate = new Date();
        break;
    }

    return this.updateClaimStatus(claimId, updateData);
  }

  static async generateClaimNumber(): Promise<string> {
    const prefix = 'QC';
    const date = new Date();
    const dateStr = date.getFullYear().toString().slice(-2) + 
                   (date.getMonth() + 1).toString().padStart(2, '0');
    
    const latestClaim = await prisma.insuranceClaim.findFirst({
      where: {
        claimNumber: {
          startsWith: `${prefix}${dateStr}`,
        },
      },
      orderBy: {
        claimNumber: 'desc',
      },
    });

    let sequence = 1;
    if (latestClaim) {
      const sequenceStr = latestClaim.claimNumber.slice(-4);
      sequence = parseInt(sequenceStr) + 1;
    }

    return `${prefix}${dateStr}${sequence.toString().padStart(4, '0')}`;
  }

  static async getAutoApproveLimit(): Promise<number> {
    try {
      const setting = await prisma.systemSetting.findUnique({
        where: { key: 'insurance_claim_auto_approve_limit' },
      });

      if (setting) {
        return parseFloat(setting.value);
      }
    } catch {
      // Fallback to default
    }

    return 10000000; // 10 million VND default
  }

  static async getClaimsSummary() {
    const [total, submitted, reviewing, approved, rejected, paid] = await Promise.all([
      prisma.insuranceClaim.count(),
      prisma.insuranceClaim.count({ where: { status: 'submitted' } }),
      prisma.insuranceClaim.count({ where: { status: 'reviewing' } }),
      prisma.insuranceClaim.count({ where: { status: 'approved' } }),
      prisma.insuranceClaim.count({ where: { status: 'rejected' } }),
      prisma.insuranceClaim.count({ where: { status: 'paid' } }),
    ]);

    const totalAmount = await prisma.insuranceClaim.aggregate({
      _sum: { claimAmount: true },
      where: { status: { not: 'rejected' } },
    });

    const approvedAmount = await prisma.insuranceClaim.aggregate({
      _sum: { approvedAmount: true },
      where: { status: { in: ['approved', 'paid'] } },
    });

    return {
      total,
      submitted,
      reviewing,
      approved,
      rejected,
      paid,
      totalClaimAmount: totalAmount._sum.claimAmount || 0,
      totalApprovedAmount: approvedAmount._sum.approvedAmount || 0,
    };
  }
}
```

---

## 🚀 API Route Implementations

### 1. User Management API Routes

```typescript
// src/server/api/admin/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/server/middleware/auth';
import { requirePermission } from '@/server/middleware/rbac';
import { auditMiddleware } from '@/server/middleware/audit';
import { UserService } from '@/server/services/user.service';

export async function GET(request: NextRequest) {
  // Apply middleware
  const authResponse = await authMiddleware(request);
  if (authResponse.status !== 200) return authResponse;

  const permissionResponse = await requirePermission('admin.user.read')(request);
  if (permissionResponse.status !== 200) return permissionResponse;

  try {
    const { searchParams } = new URL(request.url);
    const params = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
      role: searchParams.get('role') || undefined,
      status: searchParams.get('status') || undefined,
      search: searchParams.get('search') || undefined,
    };

    const users = await UserService.getUsers(params);
    
    return NextResponse.json({
      success: true,
      data: users,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Apply middleware
  const authResponse = await authMiddleware(request);
  if (authResponse.status !== 200) return authResponse;

  const permissionResponse = await requirePermission('admin.user.create')(request);
  if (permissionResponse.status !== 200) return permissionResponse;

  try {
    const body = await request.json();
    const user = await UserService.createUser(body);

    // Log audit
    await AuditService.logAction({
      userId: request.headers.get('x-user-id')!,
      action: 'create',
      entityType: 'user',
      entityId: user.id,
      newValue: body,
      request,
    });

    return NextResponse.json({
      success: true,
      data: user,
      timestamp: new Date().toISOString(),
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
```

### 2. Insurance Contract API Routes

```typescript
// src/server/api/insurance/contracts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/server/middleware/auth';
import { requirePermission } from '@/server/middleware/rbac';
import { InsuranceContractService } from '@/server/services/insurance/contract.service';

export async function GET(request: NextRequest) {
  // Apply middleware
  const authResponse = await authMiddleware(request);
  if (authResponse.status !== 200) return authResponse;

  const permissionResponse = await requirePermission('insurance.contract.read')(request);
  if (permissionResponse.status !== 200) return permissionResponse;

  try {
    const { searchParams } = new URL(request.url);
    const params = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
      status: searchParams.get('status') || undefined,
      type: searchParams.get('type') || undefined,
      customerId: searchParams.get('customerId') || undefined,
      vehicleId: searchParams.get('vehicleId') || undefined,
      search: searchParams.get('search') || undefined,
      startDate: searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined,
      endDate: searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined,
    };

    const contracts = await InsuranceContractService.getContracts(params);
    
    return NextResponse.json({
      success: true,
      data: contracts,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Apply middleware
  const authResponse = await authMiddleware(request);
  if (authResponse.status !== 200) return authResponse;

  const permissionResponse = await requirePermission('insurance.contract.create')(request);
  if (permissionResponse.status !== 200) return permissionResponse;

  try {
    const body = await request.json();
    const createdBy = request.headers.get('x-user-id')!;
    
    const contract = await InsuranceContractService.createContract({
      ...body,
      createdBy,
    });

    return NextResponse.json({
      success: true,
      data: contract,
      timestamp: new Date().toISOString(),
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
```

---

**End of Backend Implementation Plan**