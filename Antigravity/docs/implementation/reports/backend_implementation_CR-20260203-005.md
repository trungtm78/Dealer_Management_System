# Backend Implementation: CR-20260203-005 - Part-Vehicle Compatibility

## Document Information
- **CR ID**: CR-20260203-005
- **Title**: Add Part-Vehicle Compatibility Feature
- **Date**: 03/02/2026
- **Author**: OpenCode - Backend Implementation Authority

---

## 1. Architecture Overview

**Pattern**: NestJS + Prisma ORM + Service Layer Pattern

**Module Structure**:
```
src/modules/part-compatibility/
├── part-compatibility.controller.ts
├── part-compatibility.service.ts
├── part-compatibility.repository.ts
├── dto/
│   ├── create-compatibility.dto.ts
│   ├── update-compatibility.dto.ts
│   ├── matrix-update.dto.ts
│   └── get-compatibility.response.dto.ts
└── part-compatibility.module.ts
```

**Technology**:
- Framework: NestJS
- ORM: Prisma
- Language: TypeScript
- Validation: class-validator

---

## 2. Business Logic Implementation

### 2.1 Service Layer

#### Service: PartCompatibilityService

**File**: `src/modules/part-compatibility/part-compatibility.service.ts`

**Responsibilities**:
1. Validate business rules (FR-MD-009)
2. Query compatibility records
3. Manage compatibility CRUD operations
4. Handle universal parts logic
5. Audit logging

**Key Methods**:

```typescript
@Injectable()
export class PartCompatibilityService {
  constructor(
    private partCompatibilityRepository: PartCompatibilityRepository,
    private partRepository: PartRepository,
    private vehicleModelRepository: VehicleModelRepository,
  ) {}

  // API: GET /api/part-compatibility/:part_id
  // FRD: FR-MD-009-01 (Manage Part Compatibility)
  // ERD: part_vehicle_compatibility table
  async getPartCompatibility(partId: string): Promise<GetPartCompatibilityResponse> {
    // FRD: Load current compatibility for a part
    const part = await this.partRepository.findById(partId);
    if (!part) {
      throw new NotFoundException('Part not found');
    }

    // ERD: Query compatibility records for this part
    const compatibilities = await this.partCompatibilityRepository.findByPartId(partId);

    // FRD: If no compatibility records → part is universal
    const isUniversal = compatibilities.length === 0;

    if (isUniversal) {
      return {
        part_id: partId,
        part_name: part.name,
        part_number: part.partNumber,
        compatible_models: [],
        is_universal: true,
      };
    }

    // ERD: Join with vehicle_models to get model details
    const compatibleModels = await Promise.all(
      compatibilities.map(async (comp) => {
        const model = await this.vehicleModelRepository.findById(comp.vehicleModelId);
        return {
          model_id: model.id,
          model_code: model.modelCode,
          model_name: model.modelName,
          category: model.category,
          compatible_since: comp.createdAt.toISOString(),
        };
      })
    );

    return {
      part_id: partId,
      part_name: part.name,
      part_number: part.partNumber,
      compatible_models: compatibleModels,
      is_universal: false,
    };
  }

  // API: POST /api/part-compatibility
  // FRD: FR-MD-009-01 (Manage Part Compatibility)
  // ERD: part_vehicle_compatibility table
  async createPartCompatibility(
    dto: CreatePartCompatibilityDto
  ): Promise<CreatePartCompatibilityResponse> {
    // FRD: Validate part exists
    const part = await this.partRepository.findById(dto.partId);
    if (!part) {
      throw new NotFoundException('Part not found');
    }

    // BR-PRT-011: Empty array = universal part
    const isUniversal = dto.vehicleModelIds.length === 0;

    // FRD: Validate all models exist and are ACTIVE
    if (!isUniversal) {
      for (const modelId of dto.vehicleModelIds) {
        const model = await this.vehicleModelRepository.findById(modelId);
        if (!model) {
          throw new NotFoundException(`Vehicle model not found: ${modelId}`);
        }
        if (model.status !== 'ACTIVE') {
          throw new BadRequestException(`Vehicle model is not ACTIVE: ${model.modelName}`);
        }
      }
    }

    // FRD: Delete existing compatibility records
    await this.partCompatibilityRepository.deleteByPartId(dto.partId);

    // ERD: Insert new compatibility records (if not universal)
    let compatibleModelsCount = 0;
    if (!isUniversal) {
      const compatibilities = dto.vehicleModelIds.map((modelId) => ({
        partId: dto.partId,
        vehicleModelId: modelId,
        createdBy: dto.createdBy,
      }));
      await this.partCompatibilityRepository.createMany(compatibilities);
      compatibleModelsCount = dto.vehicleModelIds.length;
    }

    // FRD: Log activity (audit trail)
    await this.logActivity({
      action: 'UPDATE_COMPATIBILITY',
      entityType: 'Part',
      entityId: dto.partId,
      details: {
        isUniversal,
        compatibleModelsCount,
      },
      userId: dto.createdBy,
    });

    return {
      success: true,
      part_id: dto.partId,
      compatible_models_count: compatibleModelsCount,
      is_universal: isUniversal,
      message: isUniversal
        ? 'Part set to universal (compatible with all models)'
        : 'Compatibility updated successfully',
      created_at: new Date().toISOString(),
    };
  }

  // API: DELETE /api/part-compatibility/:part_id/:model_id
  // FRD: FR-MD-009-01 (Manage Part Compatibility)
  // ERD: part_vehicle_compatibility table
  async deletePartCompatibility(
    partId: string,
    modelId: string
  ): Promise<DeletePartCompatibilityResponse> {
    // FRD: Validate part exists
    const part = await this.partRepository.findById(partId);
    if (!part) {
      throw new NotFoundException('Part not found');
    }

    // FRD: Validate model exists
    const model = await this.vehicleModelRepository.findById(modelId);
    if (!model) {
      throw new NotFoundException('Vehicle model not found');
    }

    // ERD: Delete compatibility record
    const deleted = await this.partCompatibilityRepository.delete(partId, modelId);
    if (!deleted) {
      throw new NotFoundException('Compatibility record not found');
    }

    // FRD: Log activity (audit trail)
    await this.logActivity({
      action: 'DELETE_COMPATIBILITY',
      entityType: 'Part',
      entityId: partId,
      details: {
        modelId,
        modelName: model.modelName,
      },
      userId: null, // From JWT
    });

    return {
      success: true,
      part_id: partId,
      model_id: modelId,
      message: 'Compatibility removed successfully',
      deleted_at: new Date().toISOString(),
    };
  }

  // API: GET /api/part-compatibility/matrix
  // FRD: FR-MD-009-02 (Compatibility Matrix)
  // ERD: part_vehicle_compatibility table
  async getCompatibilityMatrix(
    page: number = 1,
    limit: number = 20
  ): Promise<GetCompatibilityMatrixResponse> {
    // FRD: Load all active parts (paginated)
    const parts = await this.partRepository.findAllActive(page, limit);
    const totalParts = await this.partRepository.countActive();

    // FRD: Load all active vehicle models
    const vehicleModels = await this.vehicleModelRepository.findAllActive();

    // ERD: Load compatibility for all parts
    const partsWithCompatibility = await Promise.all(
      parts.map(async (part) => {
        const compatibilities = await this.partCompatibilityRepository.findByPartId(part.id);
        return {
          part_id: part.id,
          part_number: part.partNumber,
          part_name: part.name,
          category: part.category,
          compatible_model_ids: compatibilities.map((c) => c.vehicleModelId),
          is_universal: compatibilities.length === 0,
        };
      })
    );

    return {
      parts: partsWithCompatibility,
      vehicle_models: vehicleModels.map((vm) => ({
        model_id: vm.id,
        model_code: vm.modelCode,
        model_name: vm.modelName,
        category: vm.category,
        status: vm.status,
      })),
      pagination: {
        page,
        limit,
        total_parts: totalParts,
        total_pages: Math.ceil(totalParts / limit),
        has_next: page * limit < totalParts,
        has_prev: page > 1,
      },
    };
  }

  // API: POST /api/part-compatibility/matrix
  // FRD: FR-MD-009-02 (Compatibility Matrix)
  // ERD: part_vehicle_compatibility table
  async updateCompatibilityMatrix(
    dto: UpdateCompatibilityMatrixDto
  ): Promise<UpdateCompatibilityMatrixResponse> {
    let createdCount = 0;
    let deletedCount = 0;

    // FRD: Validate and process each update
    for (const update of dto.updates) {
      // Validate part exists
      const part = await this.partRepository.findById(update.partId);
      if (!part) {
        throw new NotFoundException(`Part not found: ${update.partId}`);
      }

      // BR-PRT-011: Empty array = universal part
      const isUniversal = update.vehicleModelIds.length === 0;

      // FRD: Validate all models exist and are ACTIVE
      if (!isUniversal) {
        for (const modelId of update.vehicleModelIds) {
          const model = await this.vehicleModelRepository.findById(modelId);
          if (!model) {
            throw new NotFoundException(`Vehicle model not found: ${modelId}`);
          }
          if (model.status !== 'ACTIVE') {
            throw new BadRequestException(`Vehicle model is not ACTIVE: ${model.modelName}`);
          }
        }
      }

      // ERD: Delete existing compatibility records
      const existingCount = await this.partCompatibilityRepository.countByPartId(update.partId);
      await this.partCompatibilityRepository.deleteByPartId(update.partId);
      deletedCount += existingCount;

      // ERD: Insert new compatibility records (if not universal)
      if (!isUniversal) {
        const compatibilities = update.vehicleModelIds.map((modelId) => ({
          partId: update.partId,
          vehicleModelId: modelId,
          createdBy: null, // From JWT
        }));
        await this.partCompatibilityRepository.createMany(compatibilities);
        createdCount += update.vehicleModelIds.length;
      }
    }

    // FRD: Log activity (audit trail)
    await this.logActivity({
      action: 'UPDATE_COMPATIBILITY_MATRIX',
      entityType: 'Part',
      entityId: null,
      details: {
        updatedPartsCount: dto.updates.length,
        createdCount,
        deletedCount,
      },
      userId: null, // From JWT
    });

    return {
      success: true,
      updated_parts_count: dto.updates.length,
      created_compatibility_records: createdCount,
      deleted_compatibility_records: deletedCount,
      message: 'Compatibility matrix updated successfully',
      updated_at: new Date().toISOString(),
    };
  }

  // API: GET /api/parts (Updated)
  // FRD: SCR-PRT-001 (Tổng Quan Tồn Kho)
  // ERD: parts + part_vehicle_compatibility tables
  async getPartsWithCompatibilityFilter(
    filters: GetPartsFilters
  ): Promise<GetPartsResponse> {
    // FRD: If vehicle_model_id provided, apply compatibility filter
    if (filters.vehicle_model_id) {
      // Validate model exists
      const model = await this.vehicleModelRepository.findById(filters.vehicle_model_id);
      if (!model) {
        throw new NotFoundException('Vehicle model not found');
      }

      // BR-PRT-012: Filter logic includes universal parts
      const parts = await this.partRepository.findByVehicleModel(
        filters.vehicle_model_id,
        filters.page,
        filters.limit,
        filters.sort
      );
      const total = await this.partRepository.countByVehicleModel(filters.vehicle_model_id);

      return {
        data: parts.map((part) => ({
          ...part,
          compatible_models: part.compatible_models || [],
          is_universal: part.compatible_models === null,
        })),
        meta: {
          page: filters.page,
          limit: filters.limit,
          total,
          total_pages: Math.ceil(total / filters.limit),
          has_next: filters.page * filters.limit < total,
          has_prev: filters.page > 1,
        },
      };
    }

    // FRD: If no vehicle_model_id, return all parts (existing behavior)
    const parts = await this.partRepository.findAll(
      filters.page,
      filters.limit,
      filters.sort
    );
    const total = await this.partRepository.count();

    return {
      data: parts,
      meta: {
        page: filters.page,
        limit: filters.limit,
        total,
        total_pages: Math.ceil(total / filters.limit),
        has_next: filters.page * filters.limit < total,
        has_prev: filters.page > 1,
      },
    };
  }

  // API: PUT /api/parts/:id (Updated)
  // FRD: SCR-PRT-001 (Tổng Quan Tồn Kho)
  // ERD: parts + part_vehicle_compatibility tables
  async updatePartWithCompatibility(
    partId: string,
    dto: UpdatePartDto
  ): Promise<UpdatePartResponse> {
    // FRD: Validate part exists
    const part = await this.partRepository.findById(partId);
    if (!part) {
      throw new NotFoundException('Part not found');
    }

    // Update part fields (existing logic)
    const updatedPart = await this.partRepository.update(partId, dto);

    // FRD: If vehicle_model_ids provided, update compatibility
    if (dto.vehicleModelIds !== undefined) {
      // BR-PRT-011: Empty array = universal part
      const isUniversal = dto.vehicleModelIds.length === 0;

      // FRD: Validate all models exist and are ACTIVE
      if (!isUniversal) {
        for (const modelId of dto.vehicleModelIds) {
          const model = await this.vehicleModelRepository.findById(modelId);
          if (!model) {
            throw new NotFoundException(`Vehicle model not found: ${modelId}`);
          }
          if (model.status !== 'ACTIVE') {
            throw new BadRequestException(`Vehicle model is not ACTIVE: ${model.modelName}`);
          }
        }
      }

      // ERD: Delete existing compatibility records
      await this.partCompatibilityRepository.deleteByPartId(partId);

      // ERD: Insert new compatibility records (if not universal)
      if (!isUniversal) {
        const compatibilities = dto.vehicleModelIds.map((modelId) => ({
          partId,
          vehicleModelId: modelId,
          createdBy: null, // From JWT
        }));
        await this.partCompatibilityRepository.createMany(compatibilities);
      }
    }

    // FRD: Reload part with compatibility
    const compatibilities = await this.partCompatibilityRepository.findByPartId(partId);
    const compatibleModels = await Promise.all(
      compatibilities.map(async (comp) => {
        const model = await this.vehicleModelRepository.findById(comp.vehicleModelId);
        return {
          model_id: model.id,
          model_name: model.modelName,
        };
      })
    );

    return {
      ...updatedPart,
      compatible_models: compatibleModels,
      is_universal: compatibilities.length === 0,
      updated_at: new Date().toISOString(),
    };
  }

  // Helper: Log activity
  private async logActivity(activity: ActivityLog) {
    // Implementation depends on existing activity logging mechanism
    // TODO: Integrate with existing activity logging service
  }
}
```

---

## 3. Repository Layer

### 3.1 Repository: PartCompatibilityRepository

**File**: `src/modules/part-compatibility/part-compatibility.repository.ts`

```typescript
@Injectable()
export class PartCompatibilityRepository {
  constructor(private prisma: PrismaService) {}

  // Create single compatibility record
  async create(data: CreatePartCompatibilityInput): Promise<PartVehicleCompatibility> {
    return this.prisma.partVehicleCompatibility.create({
      data,
    });
  }

  // Create multiple compatibility records (batch)
  async createMany(data: CreatePartCompatibilityInput[]): Promise<void> {
    await this.prisma.partVehicleCompatibility.createMany({
      data,
      skipDuplicates: true, // Ignore duplicates (UNIQUE constraint)
    });
  }

  // Find compatibility records by part_id
  async findByPartId(partId: string): Promise<PartVehicleCompatibility[]> {
    return this.prisma.partVehicleCompatibility.findMany({
      where: { partId },
      include: {
        vehicleModel: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Delete compatibility records by part_id
  async deleteByPartId(partId: string): Promise<void> {
    await this.prisma.partVehicleCompatibility.deleteMany({
      where: { partId },
    });
  }

  // Delete single compatibility record (part + model)
  async delete(partId: string, vehicleModelId: string): Promise<boolean> {
    const result = await this.prisma.partVehicleCompatibility.deleteMany({
      where: {
        partId,
        vehicleModelId,
      },
    });
    return result.count > 0;
  }

  // Count compatibility records by part_id
  async countByPartId(partId: string): Promise<number> {
    return this.prisma.partVehicleCompatibility.count({
      where: { partId },
    });
  }
}
```

---

## 4. Controller Layer

### 4.1 Controller: PartCompatibilityController

**File**: `src/modules/part-compatibility/part-compatibility.controller.ts`

```typescript
@Controller('api/part-compatibility')
export class PartCompatibilityController {
  constructor(private partCompatibilityService: PartCompatibilityService) {}

  // GET /api/part-compatibility/:part_id
  @Get(':part_id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PARTS.READ')
  async getPartCompatibility(@Param('part_id') partId: string) {
    return this.partCompatibilityService.getPartCompatibility(partId);
  }

  // POST /api/part-compatibility
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('MASTER_DATA.UPDATE')
  async createPartCompatibility(@Body() dto: CreatePartCompatibilityDto) {
    return this.partCompatibilityService.createPartCompatibility(dto);
  }

  // DELETE /api/part-compatibility/:part_id/:model_id
  @Delete(':part_id/:model_id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('MASTER_DATA.UPDATE')
  async deletePartCompatibility(
    @Param('part_id') partId: string,
    @Param('model_id') modelId: string
  ) {
    return this.partCompatibilityService.deletePartCompatibility(partId, modelId);
  }

  // GET /api/part-compatibility/matrix
  @Get('matrix')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('MASTER_DATA.READ')
  async getCompatibilityMatrix(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20
  ) {
    return this.partCompatibilityService.getCompatibilityMatrix(page, limit);
  }

  // POST /api/part-compatibility/matrix
  @Post('matrix')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('MASTER_DATA.UPDATE')
  async updateCompatibilityMatrix(@Body() dto: UpdateCompatibilityMatrixDto) {
    return this.partCompatibilityService.updateCompatibilityMatrix(dto);
  }
}
```

---

## 5. DTO Definitions

### 5.1 Create Compatibility DTO

**File**: `src/modules/part-compatibility/dto/create-compatibility.dto.ts`

```typescript
export class CreatePartCompatibilityDto {
  @IsUUID()
  @IsNotEmpty()
  part_id: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsNotEmpty()
  vehicle_model_ids: string[];

  @IsUUID()
  @IsOptional()
  created_by?: string;
}
```

### 5.2 Matrix Update DTO

**File**: `src/modules/part-compatibility/dto/matrix-update.dto.ts`

```typescript
export class MatrixUpdate {
  @IsUUID()
  @IsNotEmpty()
  part_id: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsNotEmpty()
  vehicle_model_ids: string[];
}

export class UpdateCompatibilityMatrixDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => MatrixUpdate)
  updates: MatrixUpdate[];
}
```

### 5.3 Get Parts Filters DTO

**File**: `src/modules/parts/dto/get-parts-filters.dto.ts`

```typescript
export class GetPartsFilters {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  category?: string[];

  @IsOptional()
  @IsEnum(['ACTIVE', 'INACTIVE', 'ALL'])
  status?: string;

  @IsOptional()
  @IsUUID()
  vehicle_model_id?: string; // NEW FIELD

  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  sort?: string = 'created_at:desc';
}
```

---

## 6. Unit Tests

### 6.1 Service Unit Tests

**File**: `src/modules/part-compatibility/part-compatibility.service.spec.ts`

```typescript
describe('PartCompatibilityService', () => {
  let service: PartCompatibilityService;
  let repository: PartCompatibilityRepository;

  beforeEach(async () => {
    // Setup test database and dependencies
  });

  describe('getPartCompatibility', () => {
    it('should return compatible models for a part', async () => {
      // Test: Part with 2 compatible models
      const result = await service.getPartCompatibility('part-uuid-1');
      expect(result.is_universal).toBe(false);
      expect(result.compatible_models).toHaveLength(2);
    });

    it('should return universal part with no compatibility records', async () => {
      // Test: Part with NO compatibility records
      const result = await service.getPartCompatibility('part-uuid-2');
      expect(result.is_universal).toBe(true);
      expect(result.compatible_models).toHaveLength(0);
    });

    it('should throw NotFoundException for invalid part', async () => {
      // Test: Invalid part ID
      await expect(
        service.getPartCompatibility('invalid-uuid')
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('createPartCompatibility', () => {
    it('should create compatibility records', async () => {
      // Test: Create compatibility with 2 models
      const dto = new CreatePartCompatibilityDto();
      dto.part_id = 'part-uuid-1';
      dto.vehicle_model_ids = ['model-uuid-1', 'model-uuid-2'];

      const result = await service.createPartCompatibility(dto);
      expect(result.success).toBe(true);
      expect(result.compatible_models_count).toBe(2);
      expect(result.is_universal).toBe(false);
    });

    it('should set part to universal with empty array', async () => {
      // Test: Empty array = universal part
      const dto = new CreatePartCompatibilityDto();
      dto.part_id = 'part-uuid-1';
      dto.vehicle_model_ids = [];

      const result = await service.createPartCompatibility(dto);
      expect(result.success).toBe(true);
      expect(result.compatible_models_count).toBe(0);
      expect(result.is_universal).toBe(true);
    });

    it('should throw BadRequestException for inactive model', async () => {
      // Test: Inactive model validation
      const dto = new CreatePartCompatibilityDto();
      dto.part_id = 'part-uuid-1';
      dto.vehicle_model_ids = ['inactive-model-uuid'];

      await expect(
        service.createPartCompatibility(dto)
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateCompatibilityMatrix', () => {
    it('should batch update compatibility matrix', async () => {
      // Test: Update 2 parts
      const dto = new UpdateCompatibilityMatrixDto();
      dto.updates = [
        {
          part_id: 'part-uuid-1',
          vehicle_model_ids: ['model-uuid-1', 'model-uuid-2'],
        },
        {
          part_id: 'part-uuid-2',
          vehicle_model_ids: [], // Universal
        },
      ];

      const result = await service.updateCompatibilityMatrix(dto);
      expect(result.success).toBe(true);
      expect(result.updated_parts_count).toBe(2);
      expect(result.created_compatibility_records).toBe(2);
      expect(result.deleted_compatibility_records).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getPartsWithCompatibilityFilter', () => {
    it('should filter parts by vehicle model including universal', async () => {
      // Test: Filter by vehicle_model_id
      const filters = new GetPartsFilters();
      filters.vehicle_model_id = 'model-uuid-1';
      filters.page = 1;
      filters.limit = 20;

      const result = await service.getPartsWithCompatibilityFilter(filters);
      expect(result.data.length).toBeGreaterThan(0);
      // Verify: Universal parts are included
      const universalParts = result.data.filter((p) => p.is_universal);
      expect(universalParts.length).toBeGreaterThan(0);
    });

    it('should return all parts without vehicle_model_id filter', async () => {
      // Test: No filter = existing behavior
      const filters = new GetPartsFilters();
      filters.page = 1;
      filters.limit = 20;

      const result = await service.getPartsWithCompatibilityFilter(filters);
      expect(result.data.length).toBeGreaterThan(0);
    });
  });
});
```

---

## 7. Business Rules Enforcement

### 7.1 BR-PRT-011: Universal Parts Rule

**Rule**: Parts with ZERO compatibility records are UNIVERSAL (fit ALL models)

**Implementation**:
```typescript
// In service methods:
const isUniversal = compatibilities.length === 0;
if (isUniversal) {
  // Part is universal (fits all models)
  return { ...part, is_universal: true };
}
```

**Test Coverage**:
- ✅ Part with NO compatibility records → Universal
- ✅ Part WITH compatibility records → Not universal
- ✅ Empty array in update → Part becomes universal

---

### 7.2 BR-PRT-012: Compatibility Filtering

**Rule**: Filter includes parts with NO compatibility records

**Implementation**:
```typescript
// In PartRepository:
async findByVehicleModel(modelId: string) {
  return this.prisma.part.findMany({
    where: {
      OR: [
        { compatibility: { some: { vehicleModelId } } },
        { compatibility: { none: {} } }, // Universal parts
      ],
      status: 'ACTIVE',
    },
  });
}
```

**Test Coverage**:
- ✅ Filter by model → Returns compatible + universal parts
- ✅ No filter → Returns all parts
- ✅ Universal parts always included in results

---

### 7.3 Validation: Active Models Only

**Rule**: All selected models must be ACTIVE

**Implementation**:
```typescript
// In service:
for (const modelId of dto.vehicleModelIds) {
  const model = await this.vehicleModelRepository.findById(modelId);
  if (model.status !== 'ACTIVE') {
    throw new BadRequestException(`Vehicle model is not ACTIVE: ${model.modelName}`);
  }
}
```

**Test Coverage**:
- ✅ Create with ACTIVE model → Success
- ✅ Create with INACTIVE model → BadRequestException
- ✅ Matrix update with ACTIVE models → Success
- ✅ Matrix update with INACTIVE model → BadRequestException

---

## 8. Error Handling

### 8.1 Error Code Mapping

| Error Type | Error Code | HTTP Status |
|------------|------------|--------------|
| Part not found | PART_NOT_FOUND | 404 |
| Model not found | MODEL_NOT_FOUND | 404 |
| Compatibility not found | COMPATIBILITY_NOT_FOUND | 404 |
| Model inactive | MODEL_INACTIVE | 400 |
| Invalid UUID | INVALID_UUID | 400 |
| Unauthorized | UNAUTHORIZED | 401 |
| Forbidden | FORBIDDEN | 403 |

### 8.2 Error Response Format

```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: {
      [key: string]: any;
    };
    timestamp: string;
  };
}
```

---

## 9. Database Operations

### 9.1 Query Patterns

**Pattern 1: Get Compatibility by Part**
```sql
SELECT * FROM part_vehicle_compatibility
WHERE part_id = ?
ORDER BY created_at DESC;
```

**Pattern 2: Filter Parts by Vehicle Model**
```sql
SELECT DISTINCT p.* FROM parts p
LEFT JOIN part_vehicle_compatibility pvc ON p.id = pvc.part_id
WHERE (pvc.vehicle_model_id = ? OR pvc.part_id IS NULL)
  AND p.status = 'ACTIVE';
```

**Pattern 3: Delete Compatibility by Part**
```sql
DELETE FROM part_vehicle_compatibility
WHERE part_id = ?;
```

---

## 10. Audit Trail

### 10.1 Activity Logging

**Activities Logged**:
1. UPDATE_COMPATIBILITY
2. DELETE_COMPATIBILITY
3. UPDATE_COMPATIBILITY_MATRIX

**Activity Log Structure**:
```typescript
interface ActivityLog {
  action: string;
  entityType: string;
  entityId: string;
  details: {
    [key: string]: any;
  };
  userId: string | null;
  timestamp: Date;
  ipAddress: string;
}
```

---

## 11. Performance Considerations

### 11.1 Optimizations

1. **Batch Operations**:
   - Use `createMany` for multiple compatibility records
   - Use `deleteMany` for cleanup

2. **Index Usage**:
   - All queries use indexed columns (`part_id`, `vehicle_model_id`)
   - Efficient JOIN operations

3. **Pagination**:
   - Matrix view limited to 20 parts per page
   - Prevents loading excessive data

4. **Caching** (Future):
   - Consider caching vehicle models (rarely change)
   - Consider caching part compatibility (frequently accessed)

---

**END OF BACKEND IMPLEMENTATION**
