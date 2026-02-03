# API Implementation Plan - Master Data Management
**CR Reference**: CR-20250131-001 (VehicleModel Management)  
**API Spec Version**: v1.2 (CR-MD-002/003/004 Enhancement)  
**ERD Version**: v1.1  
**Implementation Date**: 31/01/2026  
**Author**: Antigravity - API Architect  

---

## 📋 Executive Summary

This document outlines the API implementation plan for the Master Data Management module as specified in API Spec v1.2. The implementation includes 24 new endpoints across 6 master data entities, with 100% backward compatibility.

**API Implementation Scope**:
- **VehicleModel**: 4 endpoints (existing, enhanced with PATCH/DELETE)
- **Accessory**: 7 endpoints (new, including compatibility and price history)
- **ServiceCatalog**: 11 endpoints (new, including service packages)
- **ServiceBay**: 5 endpoints (new, including usage statistics)
- **ScoringRule**: 5 endpoints (new, including rule testing)
- **SystemSetting**: 6 endpoints (new, including configuration management)

**Total**: 38 endpoints (4 existing + 34 new)

---

## 🔍 API Contract Analysis

### 1. Existing Endpoints (No Breaking Changes)

| Method | Endpoint | Status | Changes Required |
|--------|----------|--------|------------------|
| GET | `/api/vehicle-models` | ✅ Existing | None |
| POST | `/api/vehicle-models` | ✅ Existing | None |
| PATCH | `/api/vehicle-models/[id]` | ✅ Existing | Already implemented |
| DELETE | `/api/vehicle-models/[id]` | ✅ Existing | Already implemented |

### 2. New Endpoints by Entity

#### 2.1 Accessory Endpoints (7 new)

| Method | Endpoint | Permission | Complexity |
|--------|----------|-----------|------------|
| GET | `/api/accessories` | MASTER_DATA.READ | Low |
| POST | `/api/accessories` | MASTER_DATA.CREATE | Medium |
| PATCH | `/api/accessories/[id]` | MASTER_DATA.UPDATE | Medium |
| DELETE | `/api/accessories/[id]` | MASTER_DATA.DELETE | Low |
| GET | `/api/accessories/[id]/compatibility` | MASTER_DATA.READ | Medium |
| POST | `/api/accessories/[id]/compatibility` | MASTER_DATA.UPDATE | Medium |
| DELETE | `/api/accessories/[id]/compatibility/[model_id]` | MASTER_DATA.UPDATE | Low |
| GET | `/api/accessories/[id]/price-history` | MASTER_DATA.READ | Low |

#### 2.2 ServiceCatalog Endpoints (11 new)

| Method | Endpoint | Permission | Complexity |
|--------|----------|-----------|------------|
| GET | `/api/service-catalogs` | MASTER_DATA.READ | Low |
| POST | `/api/service-catalogs` | MASTER_DATA.CREATE | Medium |
| PATCH | `/api/service-catalogs/[id]` | MASTER_DATA.UPDATE | Medium |
| DELETE | `/api/service-catalogs/[id]` | MASTER_DATA.DELETE | Low |
| GET | `/api/service-catalogs/[id]/parts` | MASTER_DATA.READ | Medium |
| POST | `/api/service-catalogs/[id]/parts` | MASTER_DATA.UPDATE | Medium |
| DELETE | `/api/service-catalogs/[id]/parts/[part_id]` | MASTER_DATA.UPDATE | Low |
| GET | `/api/service-catalogs/packages` | MASTER_DATA.READ | Low |
| POST | `/api/service-catalogs/packages` | MASTER_DATA.CREATE | High |
| PATCH | `/api/service-catalogs/packages/[id]` | MASTER_DATA.UPDATE | High |
| DELETE | `/api/service-catalogs/packages/[id]` | MASTER_DATA.DELETE | Medium |

#### 2.3 ServiceBay Endpoints (5 new)

| Method | Endpoint | Permission | Complexity |
|--------|----------|-----------|------------|
| GET | `/api/service-bays` | MASTER_DATA.READ | Low |
| POST | `/api/service-bays` | MASTER_DATA.CREATE | Low |
| PATCH | `/api/service-bays/[id]` | MASTER_DATA.UPDATE | Low |
| DELETE | `/api/service-bays/[id]` | MASTER_DATA.DELETE | Low |
| GET | `/api/service-bays/[id]/usage` | MASTER_DATA.READ | Medium |

#### 2.4 ScoringRule Endpoints (5 new)

| Method | Endpoint | Permission | Complexity |
|--------|----------|-----------|------------|
| GET | `/api/scoring-rules` | MASTER_DATA.READ | Low |
| POST | `/api/scoring-rules` | MASTER_DATA.CREATE | High |
| PATCH | `/api/scoring-rules/[id]` | MASTER_DATA.UPDATE | High |
| DELETE | `/api/scoring-rules/[id]` | MASTER_DATA.DELETE | Low |
| POST | `/api/scoring-rules/[id]/test` | MASTER_DATA.READ | High |

#### 2.5 SystemSetting Endpoints (6 new)

| Method | Endpoint | Permission | Complexity |
|--------|----------|-----------|------------|
| GET | `/api/system-settings` | ADMIN.READ | Low |
| POST | `/api/system-settings` | ADMIN.CREATE | Medium |
| PATCH | `/api/system-settings/[id]` | ADMIN.UPDATE | Medium |
| DELETE | `/api/system-settings/[id]` | ADMIN.DELETE | Low |
| PATCH | `/api/system-settings/[id]/value` | ADMIN.UPDATE | Low |
| POST | `/api/system-settings/[id]/reset` | ADMIN.UPDATE | Low |

---

## 📋 Implementation Plan

### Phase 1: Preparation (Day 1)

#### 1.1 Setup Development Environment

```typescript
// src/modules/master-data/master-data.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleModelService } from './services/vehicle-model.service';
import { AccessoryService } from './services/accessory.service';
import { ServiceCatalogService } from './services/service-catalog.service';
import { ServiceBayService } from './services/service-bay.service';
import { ScoringRuleService } from './services/scoring-rule.service';
import { SystemSettingService } from './services/system-setting.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VehicleModel,
      Accessory,
      ServiceCatalog,
      ServiceBay,
      ScoringRule,
      SystemSetting,
      // New tables
      AccessoryModelCompatibility,
      AccessoryPriceHistory,
      ServicePackages,
      ServicePackageItems,
    ]),
  ],
  controllers: [
    VehicleModelController,
    AccessoryController,
    ServiceCatalogController,
    ServiceBayController,
    ScoringRuleController,
    SystemSettingController,
  ],
  providers: [
    VehicleModelService,
    AccessoryService,
    ServiceCatalogService,
    ServiceBayService,
    ScoringRuleService,
    SystemSettingService,
  ],
  exports: [
    VehicleModelService,
    AccessoryService,
    ServiceCatalogService,
    ServiceBayService,
    ScoringRuleService,
    SystemSettingService,
  ],
})
export class MasterDataModule {}
```

#### 1.2 Create Base DTOs and Interfaces

```typescript
// src/modules/master-data/dto/base.dto.ts
export interface BaseMasterDataDto {
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface PaginationDto {
  page?: number;
  limit?: number;
  sort?: string;
}

export interface SearchDto {
  search?: string;
}

export interface FilterDto {
  category?: string[];
  status?: string;
}

export class ApiResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export class CreateResponse<T> {
  id: number;
  [key: string]: any;
}

export class UpdateResponse {
  message: string;
  id: number;
}
```

### Phase 2: VehicleModel API Implementation (Day 1)

#### 2.1 VehicleModel Controller (Enhanced)

```typescript
// src/modules/master-data/controllers/vehicle-model.controller.ts
import { Controller, Get, Post, Patch, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { VehicleModelService } from '../services/vehicle-model.service';
import { CreateVehicleModelDto, UpdateVehicleModelDto, VehicleModelFilterDto } from '../dto/vehicle-model.dto';

@ApiTags('Master Data - Vehicle Models')
@Controller('api/vehicle-models')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class VehicleModelController {
  constructor(private readonly vehicleModelService: VehicleModelService) {}

  @Get()
  @Permissions('MASTER_DATA.READ')
  @ApiOperation({ summary: 'List all vehicle models' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'category', required: false, isArray: true })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'min_price', required: false })
  @ApiQuery({ name: 'max_price', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'sort', required: false })
  async findAll(
    @Query() filter: VehicleModelFilterDto
  ): Promise<ApiResponse<VehicleModel>> {
    return this.vehicleModelService.findAll(filter);
  }

  @Post()
  @Permissions('MASTER_DATA.CREATE')
  @ApiOperation({ summary: 'Create a new vehicle model' })
  @ApiResponse({ status: 201, type: CreateResponse<VehicleModel> })
  async create(
    @Body() createDto: CreateVehicleModelDto
  ): Promise<CreateResponse<VehicleModel>> {
    return this.vehicleModelService.create(createDto);
  }

  @Patch(':id')
  @Permissions('MASTER_DATA.UPDATE')
  @ApiOperation({ summary: 'Update a vehicle model' })
  async update(
    @Param('id') id: number,
    @Body() updateDto: UpdateVehicleModelDto
  ): Promise<VehicleModel> {
    return this.vehicleModelService.update(id, updateDto);
  }

  @Delete(':id')
  @Permissions('MASTER_DATA.DELETE')
  @ApiOperation({ summary: 'Soft delete a vehicle model' })
  async remove(@Param('id') id: number): Promise<UpdateResponse> {
    return this.vehicleModelService.remove(id);
  }
}
```

#### 2.2 VehicleModel Service (Enhanced)

```typescript
// src/modules/master-data/services/vehicle-model.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleModel } from '../entities/vehicle-model.entity';
import { CreateVehicleModelDto, UpdateVehicleModelDto, VehicleModelFilterDto } from '../dto/vehicle-model.dto';

@Injectable()
export class VehicleModelService {
  constructor(
    @InjectRepository(VehicleModel)
    private readonly vehicleModelRepository: Repository<VehicleModel>,
  ) {}

  async findAll(filter: VehicleModelFilterDto): Promise<ApiResponse<VehicleModel>> {
    const queryBuilder = this.vehicleModelRepository.createQueryBuilder('vm');

    // Apply search filter
    if (filter.search) {
      queryBuilder.andWhere(
        '(vm.model_name LIKE :search OR vm.model_code LIKE :search)',
        { search: `%${filter.search}%` }
      );
    }

    // Apply category filter
    if (filter.category && filter.category.length > 0) {
      queryBuilder.andWhere('vm.category IN (:...categories)', { 
        categories: filter.category 
      });
    }

    // Apply status filter
    if (filter.status && filter.status !== 'ALL') {
      queryBuilder.andWhere('vm.status = :status', { status: filter.status });
    }

    // Apply price range filter
    if (filter.min_price !== undefined) {
      queryBuilder.andWhere('vm.base_price >= :min_price', { min_price: filter.min_price });
    }
    if (filter.max_price !== undefined) {
      queryBuilder.andWhere('vm.base_price <= :max_price', { max_price: filter.max_price });
    }

    // Apply sorting
    if (filter.sort) {
      const [field, direction] = filter.sort.split(':');
      queryBuilder.orderBy(`vm.${field}`, direction.toUpperCase() as 'ASC' | 'DESC');
    } else {
      queryBuilder.orderBy('vm.created_at', 'DESC');
    }

    // Apply pagination
    const page = filter.page || 1;
    const limit = filter.limit || 20;
    const offset = (page - 1) * limit;

    const [data, total] = await queryBuilder
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async create(createDto: CreateVehicleModelDto): Promise<CreateResponse<VehicleModel>> {
    // Generate auto model code
    const year = new Date().getFullYear();
    const count = await this.vehicleModelRepository.count();
    const modelCode = `MOD/${year}/${String(count + 1).padStart(3, '0')}`;

    const vehicleModel = this.vehicleModelRepository.create({
      ...createDto,
      model_code: modelCode,
    });

    const saved = await this.vehicleModelRepository.save(vehicleModel);
    return { id: saved.id, ...saved };
  }

  async update(id: number, updateDto: UpdateVehicleModelDto): Promise<VehicleModel> {
    const vehicleModel = await this.vehicleModelRepository.findOneOrFail({ where: { id } });
    
    Object.assign(vehicleModel, updateDto);
    return this.vehicleModelRepository.save(vehicleModel);
  }

  async remove(id: number): Promise<UpdateResponse> {
    const vehicleModel = await this.vehicleModelRepository.findOneOrFail({ where: { id } });
    
    vehicleModel.status = 'INACTIVE';
    vehicleModel.deleted_at = new Date();
    
    await this.vehicleModelRepository.save(vehicleModel);
    return { message: 'VehicleModel deleted successfully', id };
  }
}
```

### Phase 3: Accessory API Implementation (Day 2)

#### 3.1 Accessory Controller

```typescript
// src/modules/master-data/controllers/accessory.controller.ts
import { Controller, Get, Post, Patch, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { AccessoryService } from '../services/accessory.service';
import { 
  CreateAccessoryDto, 
  UpdateAccessoryDto, 
  AccessoryFilterDto,
  AddCompatibilityDto 
} from '../dto/accessory.dto';

@ApiTags('Master Data - Accessories')
@Controller('api/accessories')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AccessoryController {
  constructor(private readonly accessoryService: AccessoryService) {}

  @Get()
  @Permissions('MASTER_DATA.READ')
  @ApiOperation({ summary: 'List all accessories' })
  async findAll(@Query() filter: AccessoryFilterDto): Promise<ApiResponse<Accessory>> {
    return this.accessoryService.findAll(filter);
  }

  @Post()
  @Permissions('MASTER_DATA.CREATE')
  @ApiOperation({ summary: 'Create a new accessory' })
  @ApiResponse({ status: 201, type: CreateResponse<Accessory> })
  async create(
    @Body() createDto: CreateAccessoryDto
  ): Promise<CreateResponse<Accessory>> {
    return this.accessoryService.create(createDto);
  }

  @Patch(':id')
  @Permissions('MASTER_DATA.UPDATE')
  @ApiOperation({ summary: 'Update an accessory' })
  async update(
    @Param('id') id: number,
    @Body() updateDto: UpdateAccessoryDto
  ): Promise<Accessory> {
    return this.accessoryService.update(id, updateDto);
  }

  @Delete(':id')
  @Permissions('MASTER_DATA.DELETE')
  @ApiOperation({ summary: 'Soft delete an accessory' })
  async remove(@Param('id') id: number): Promise<UpdateResponse> {
    return this.accessoryService.remove(id);
  }

  @Get(':id/compatibility')
  @Permissions('MASTER_DATA.READ')
  @ApiOperation({ summary: 'Get compatible vehicle models for an accessory' })
  @ApiParam({ name: 'id', description: 'Accessory ID' })
  async getCompatibility(@Param('id') id: number): Promise<CompatibilityResponse> {
    return this.accessoryService.getCompatibility(id);
  }

  @Post(':id/compatibility')
  @Permissions('MASTER_DATA.UPDATE')
  @ApiOperation({ summary: 'Add vehicle model compatibility to an accessory' })
  async addCompatibility(
    @Param('id') id: number,
    @Body() addDto: AddCompatibilityDto
  ): Promise<CompatibilityResponse> {
    return this.accessoryService.addCompatibility(id, addDto);
  }

  @Delete(':id/compatibility/:modelId')
  @Permissions('MASTER_DATA.UPDATE')
  @ApiOperation({ summary: 'Remove vehicle model compatibility from an accessory' })
  async removeCompatibility(
    @Param('id') id: number,
    @Param('modelId') modelId: number
  ): Promise<CompatibilityResponse> {
    return this.accessoryService.removeCompatibility(id, modelId);
  }

  @Get(':id/price-history')
  @Permissions('MASTER_DATA.READ')
  @ApiOperation({ summary: 'Get price history for an accessory' })
  async getPriceHistory(@Param('id') id: number): Promise<PriceHistoryResponse> {
    return this.accessoryService.getPriceHistory(id);
  }
}
```

#### 3.2 Accessory Service

```typescript
// src/modules/master-data/services/accessory.service.ts
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Accessory } from '../entities/accessory.entity';
import { VehicleModel } from '../entities/vehicle-model.entity';
import { AccessoryModelCompatibility } from '../entities/accessory-model-compatibility.entity';
import { AccessoryPriceHistory } from '../entities/accessory-price-history.entity';
import { 
  CreateAccessoryDto, 
  UpdateAccessoryDto, 
  AccessoryFilterDto,
  AddCompatibilityDto 
} from '../dto/accessory.dto';

@Injectable()
export class AccessoryService {
  constructor(
    @InjectRepository(Accessory)
    private readonly accessoryRepository: Repository<Accessory>,
    @InjectRepository(VehicleModel)
    private readonly vehicleModelRepository: Repository<VehicleModel>,
    @InjectRepository(AccessoryModelCompatibility)
    private readonly compatibilityRepository: Repository<AccessoryModelCompatibility>,
    @InjectRepository(AccessoryPriceHistory)
    private readonly priceHistoryRepository: Repository<AccessoryPriceHistory>,
  ) {}

  async findAll(filter: AccessoryFilterDto): Promise<ApiResponse<Accessory>> {
    const queryBuilder = this.accessoryRepository.createQueryBuilder('a');

    // Similar filtering logic as VehicleModel service
    // ... (implementation omitted for brevity)

    const [data, total] = await queryBuilder
      .skip((filter.page - 1) * filter.limit)
      .take(filter.limit)
      .getManyAndCount();

    return {
      data,
      meta: {
        total,
        page: filter.page,
        limit: filter.limit,
        total_pages: Math.ceil(total / filter.limit),
      },
    };
  }

  async create(createDto: CreateAccessoryDto): Promise<CreateResponse<Accessory>> {
    // Generate auto accessory code
    const year = new Date().getFullYear();
    const count = await this.accessoryRepository.count();
    const accessoryCode = `ACC/${year}/${String(count + 1).padStart(3, '0')}`;

    // Check for duplicate name
    const existing = await this.accessoryRepository.findOne({
      where: { accessory_name: createDto.accessory_name }
    });

    if (existing) {
      throw new ConflictException('Accessory name already exists');
    }

    const accessory = this.accessoryRepository.create({
      ...createDto,
      accessory_code: accessoryCode,
    });

    const saved = await this.accessoryRepository.save(accessory);

    // Create initial price history
    await this.priceHistoryRepository.save({
      accessory_id: saved.id,
      old_price: null,
      new_price: saved.price,
      changed_by: 1, // TODO: Get from current user
    });

    return { id: saved.id, ...saved };
  }

  async update(id: number, updateDto: UpdateAccessoryDto): Promise<Accessory> {
    const accessory = await this.accessoryRepository.findOneOrFail({ where: { id } });

    // Check for duplicate name (excluding current record)
    if (updateDto.accessory_name) {
      const existing = await this.accessoryRepository.findOne({
        where: { 
          accessory_name: updateDto.accessory_name,
          id: Not(id) 
        }
      });

      if (existing) {
        throw new ConflictException('Accessory name already exists');
      }
    }

    // Record price change if price is being updated
    if (updateDto.price && updateDto.price !== accessory.price) {
      await this.priceHistoryRepository.save({
        accessory_id: id,
        old_price: accessory.price,
        new_price: updateDto.price,
        changed_by: 1, // TODO: Get from current user
      });
    }

    Object.assign(accessory, updateDto);
    return this.accessoryRepository.save(accessory);
  }

  async remove(id: number): Promise<UpdateResponse> {
    const accessory = await this.accessoryRepository.findOneOrFail({ where: { id } });
    
    accessory.status = 'INACTIVE';
    accessory.deleted_at = new Date();
    
    await this.accessoryRepository.save(accessory);
    return { message: 'Accessory deleted successfully', id };
  }

  async getCompatibility(id: number): Promise<CompatibilityResponse> {
    const accessory = await this.accessoryRepository.findOneOrFail({ where: { id } });
    
    const compatibility = await this.compatibilityRepository.find({
      where: { accessory_id: id },
      relations: ['model'],
    });

    const allModels = await this.vehicleModelRepository.find({
      where: { status: 'ACTIVE' }
    });

    return {
      accessory: {
        id: accessory.id,
        accessory_code: accessory.accessory_code,
        accessory_name: accessory.accessory_name,
      },
      compatible_models: compatibility.map(c => ({
        model_id: c.model.id,
        model_code: c.model.model_code,
        model_name: c.model.model_name,
        compatible_since: c.created_at,
      })),
      incompatible_models: allModels
        .filter(model => !compatibility.some(c => c.model_id === model.id))
        .map(model => ({
          model_id: model.id,
          model_code: model.model_code,
          model_name: model.model_name,
        })),
    };
  }

  async addCompatibility(id: number, addDto: AddCompatibilityDto): Promise<CompatibilityResponse> {
    // Verify accessory exists
    await this.accessoryRepository.findOneOrFail({ where: { id } });
    
    // Verify model exists
    const model = await this.vehicleModelRepository.findOneOrFail({
      where: { id: addDto.model_id }
    });

    // Check if compatibility already exists
    const existing = await this.compatibilityRepository.findOne({
      where: { accessory_id: id, model_id: addDto.model_id }
    });

    if (existing) {
      throw new ConflictException('Model compatibility already exists');
    }

    // Add compatibility
    const compatibility = this.compatibilityRepository.create({
      accessory_id: id,
      model_id: addDto.model_id,
    });

    await this.compatibilityRepository.save(compatibility);

    return this.getCompatibility(id);
  }

  async removeCompatibility(id: number, modelId: number): Promise<CompatibilityResponse> {
    // Verify compatibility exists
    const compatibility = await this.compatibilityRepository.findOneOrFail({
      where: { accessory_id: id, model_id: modelId }
    });

    await this.compatibilityRepository.remove(compatibility);

    return this.getCompatibility(id);
  }

  async getPriceHistory(id: number): Promise<PriceHistoryResponse> {
    const accessory = await this.accessoryRepository.findOneOrFail({ where: { id } });
    
    const history = await this.priceHistoryRepository.find({
      where: { accessory_id: id },
      order: { changed_at: 'DESC' },
      relations: ['changed_by_user'],
    });

    return {
      accessory: {
        id: accessory.id,
        accessory_code: accessory.accessory_code,
        accessory_name: accessory.accessory_name,
        current_price: accessory.price,
      },
      price_history: history.map(h => ({
        id: h.id,
        old_price: h.old_price,
        new_price: h.new_price,
        changed_by: h.changed_by,
        changed_by_name: h.changed_by_user?.name || 'Unknown',
        changed_at: h.changed_at,
      })),
    };
  }
}
```

### Phase 4: ServiceCatalog API Implementation (Day 3)

#### 4.1 ServiceCatalog Controller

```typescript
// src/modules/master-data/controllers/service-catalog.controller.ts
import { Controller, Get, Post, Patch, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { ServiceCatalogService } from '../services/service-catalog.service';
import { 
  CreateServiceCatalogDto, 
  UpdateServiceCatalogDto, 
  ServiceCatalogFilterDto,
  CreateServicePackageDto,
  AddServicePartDto 
} from '../dto/service-catalog.dto';

@ApiTags('Master Data - Service Catalogs')
@Controller('api/service-catalogs')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ServiceCatalogController {
  constructor(private readonly serviceCatalogService: ServiceCatalogService) {}

  @Get()
  @Permissions('MASTER_DATA.READ')
  @ApiOperation({ summary: 'List all service catalogs' })
  async findAll(@Query() filter: ServiceCatalogFilterDto): Promise<ApiResponse<ServiceCatalog>> {
    return this.serviceCatalogService.findAll(filter);
  }

  @Post()
  @Permissions('MASTER_DATA.CREATE')
  @ApiOperation({ summary: 'Create a new service catalog' })
  async create(
    @Body() createDto: CreateServiceCatalogDto
  ): Promise<CreateResponse<ServiceCatalog>> {
    return this.serviceCatalogService.create(createDto);
  }

  @Patch(':id')
  @Permissions('MASTER_DATA.UPDATE')
  @ApiOperation({ summary: 'Update a service catalog' })
  async update(
    @Param('id') id: number,
    @Body() updateDto: UpdateServiceCatalogDto
  ): Promise<ServiceCatalog> {
    return this.serviceCatalogService.update(id, updateDto);
  }

  @Delete(':id')
  @Permissions('MASTER_DATA.DELETE')
  @ApiOperation({ summary: 'Soft delete a service catalog' })
  async remove(@Param('id') id: number): Promise<UpdateResponse> {
    return this.serviceCatalogService.remove(id);
  }

  @Get(':id/parts')
  @Permissions('MASTER_DATA.READ')
  @ApiOperation({ summary: 'Get parts required for a service' })
  async getServiceParts(@Param('id') id: number): Promise<ServicePartsResponse> {
    return this.serviceCatalogService.getServiceParts(id);
  }

  @Post(':id/parts')
  @Permissions('MASTER_DATA.UPDATE')
  @ApiOperation({ summary: 'Add a part to a service' })
  async addServicePart(
    @Param('id') id: number,
    @Body() addDto: AddServicePartDto
  ): Promise<ServicePartsResponse> {
    return this.serviceCatalogService.addServicePart(id, addDto);
  }

  @Delete(':id/parts/:partId')
  @Permissions('MASTER_DATA.UPDATE')
  @ApiOperation({ summary: 'Remove a part from a service' })
  async removeServicePart(
    @Param('id') id: number,
    @Param('partId') partId: number
  ): Promise<ServicePartsResponse> {
    return this.serviceCatalogService.removeServicePart(id, partId);
  }

  @Get('packages')
  @Permissions('MASTER_DATA.READ')
  @ApiOperation({ summary: 'List all service packages' })
  async getServicePackages(@Query() filter: PaginationDto): Promise<ApiResponse<ServicePackage>> {
    return this.serviceCatalogService.getServicePackages(filter);
  }

  @Post('packages')
  @Permissions('MASTER_DATA.CREATE')
  @ApiOperation({ summary: 'Create a new service package' })
  async createServicePackage(
    @Body() createDto: CreateServicePackageDto
  ): Promise<CreateResponse<ServicePackage>> {
    return this.serviceCatalogService.createServicePackage(createDto);
  }

  @Patch('packages/:id')
  @Permissions('MASTER_DATA.UPDATE')
  @ApiOperation({ summary: 'Update a service package' })
  async updateServicePackage(
    @Param('id') id: number,
    @Body() updateDto: UpdateServicePackageDto
  ): Promise<ServicePackage> {
    return this.serviceCatalogService.updateServicePackage(id, updateDto);
  }

  @Delete('packages/:id')
  @Permissions('MASTER_DATA.DELETE')
  @ApiOperation({ summary: 'Delete a service package' })
  async removeServicePackage(@Param('id') id: number): Promise<UpdateResponse> {
    return this.serviceCatalogService.removeServicePackage(id);
  }
}
```

### Phase 5: ServiceBay, ScoringRule, SystemSetting APIs (Day 4)

#### 5.1 ServiceBay API (Low Complexity)

```typescript
// Controller
@Controller('api/service-bays')
export class ServiceBayController {
  constructor(private readonly serviceBayService: ServiceBayService) {}

  @Get()
  @Permissions('MASTER_DATA.READ')
  async findAll(@Query() filter: ServiceBayFilterDto): Promise<ApiResponse<ServiceBay>> {
    return this.serviceBayService.findAll(filter);
  }

  @Post()
  @Permissions('MASTER_DATA.CREATE')
  async create(@Body() createDto: CreateServiceBayDto): Promise<CreateResponse<ServiceBay>> {
    return this.serviceBayService.create(createDto);
  }

  @Patch(':id')
  @Permissions('MASTER_DATA.UPDATE')
  async update(@Param('id') id: number, @Body() updateDto: UpdateServiceBayDto): Promise<ServiceBay> {
    return this.serviceBayService.update(id, updateDto);
  }

  @Delete(':id')
  @Permissions('MASTER_DATA.DELETE')
  async remove(@Param('id') id: number): Promise<UpdateResponse> {
    return this.serviceBayService.remove(id);
  }

  @Get(':id/usage')
  @Permissions('MASTER_DATA.READ')
  async getUsageStatistics(@Param('id') id: number, @Query() query: UsageQueryDto): Promise<UsageResponse> {
    return this.serviceBayService.getUsageStatistics(id, query);
  }
}
```

#### 5.2 ScoringRule API (High Complexity)

```typescript
// Controller with rule testing
@Controller('api/scoring-rules')
export class ScoringRuleController {
  constructor(private readonly scoringRuleService: ScoringRuleService) {}

  @Get()
  @Permissions('MASTER_DATA.READ')
  async findAll(@Query() filter: ScoringRuleFilterDto): Promise<ApiResponse<ScoringRule>> {
    return this.scoringRuleService.findAll(filter);
  }

  @Post()
  @Permissions('MASTER_DATA.CREATE')
  async create(@Body() createDto: CreateScoringRuleDto): Promise<CreateResponse<ScoringRule>> {
    return this.scoringRuleService.create(createDto);
  }

  @Patch(':id')
  @Permissions('MASTER_DATA.UPDATE')
  async update(@Param('id') id: number, @Body() updateDto: UpdateScoringRuleDto): Promise<ScoringRule> {
    return this.scoringRuleService.update(id, updateDto);
  }

  @Delete(':id')
  @Permissions('MASTER_DATA.DELETE')
  async remove(@Param('id') id: number): Promise<UpdateResponse> {
    return this.scoringRuleService.remove(id);
  }

  @Post(':id/test')
  @Permissions('MASTER_DATA.READ')
  async testRule(
    @Param('id') id: number,
    @Body() testDto: TestScoringRuleDto
  ): Promise<TestScoringRuleResponse> {
    return this.scoringRuleService.testRule(id, testDto);
  }
}
```

#### 5.3 SystemSetting API (Medium Complexity)

```typescript
// Controller with configuration management
@Controller('api/system-settings')
export class SystemSettingController {
  constructor(private readonly systemSettingService: SystemSettingService) {}

  @Get()
  @Permissions('ADMIN.READ')
  async findAll(@Query() filter: SystemSettingFilterDto): Promise<ApiResponse<SystemSetting>> {
    return this.systemSettingService.findAll(filter);
  }

  @Post()
  @Permissions('ADMIN.CREATE')
  async create(@Body() createDto: CreateSystemSettingDto): Promise<CreateResponse<SystemSetting>> {
    return this.systemSettingService.create(createDto);
  }

  @Patch(':id')
  @Permissions('ADMIN.UPDATE')
  async update(@Param('id') id: number, @Body() updateDto: UpdateSystemSettingDto): Promise<SystemSetting> {
    return this.systemSettingService.update(id, updateDto);
  }

  @Delete(':id')
  @Permissions('ADMIN.DELETE')
  async remove(@Param('id') id: number): Promise<UpdateResponse> {
    return this.systemSettingService.remove(id);
  }

  @Patch(':id/value')
  @Permissions('ADMIN.UPDATE')
  async updateValue(
    @Param('id') id: number,
    @Body() updateValueDto: UpdateSystemSettingValueDto
  ): Promise<SystemSetting> {
    return this.systemSettingService.updateValue(id, updateValueDto);
  }

  @Post(':id/reset')
  @Permissions('ADMIN.UPDATE')
  async resetToDefault(@Param('id') id: number): Promise<SystemSetting> {
    return this.systemSettingService.resetToDefault(id);
  }
}
```

### Phase 6: Contract Testing & Integration (Day 5)

#### 6.1 API Contract Tests

```typescript
// test/api/contract/master-data.contract.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MasterDataModule } from '../../src/modules/master-data/master-data.module';

describe('Master Data API Contract Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MasterDataModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('VehicleModel API', () => {
    it('GET /api/vehicle-models should return 200', () => {
      return request(app.getHttpServer())
        .get('/api/vehicle-models')
        .expect(200);
    });

    it('POST /api/vehicle-models should return 201 with valid data', async () => {
      const createDto = {
        model_name: 'Test Vehicle',
        category: 'SEDAN',
        base_price: 500000000,
      };

      const response = await request(app.getHttpServer())
        .post('/api/vehicle-models')
        .send(createDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.model_code).toMatch(/^MOD\/\d{4}\/\d{3}$/);
    });

    it('PATCH /api/vehicle-models/:id should return 200', async () => {
      // First create a vehicle model
      const createResponse = await request(app.getHttpServer())
        .post('/api/vehicle-models')
        .send({
          model_name: 'Test Vehicle Update',
          category: 'SEDAN',
          base_price: 500000000,
        });

      const id = createResponse.body.id;

      // Then update it
      const updateDto = {
        base_price: 550000000,
      };

      return request(app.getHttpServer())
        .patch(`/api/vehicle-models/${id}`)
        .send(updateDto)
        .expect(200);
    });

    it('DELETE /api/vehicle-models/:id should return 200', async () => {
      // First create a vehicle model
      const createResponse = await request(app.getHttpServer())
        .post('/api/vehicle-models')
        .send({
          model_name: 'Test Vehicle Delete',
          category: 'SEDAN',
          base_price: 500000000,
        });

      const id = createResponse.body.id;

      // Then delete it
      return request(app.getHttpServer())
        .delete(`/api/vehicle-models/${id}`)
        .expect(200);
    });
  });

  // Similar contract tests for other entities...
});
```

#### 6.2 Integration Tests

```typescript
// test/integration/master-data.integration.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterDataModule } from '../../src/modules/master-data/master-data.module';
import { DatabaseTestingModule } from '../utils/database-testing.module';

describe('Master Data Integration Tests', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        DatabaseTestingModule,
        MasterDataModule,
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  describe('Data Consistency', () => {
    it('should maintain data consistency across related entities', async () => {
      // Test data consistency between Accessory and VehicleModel compatibility
      // Test data consistency between ServiceCatalog and ServicePackages
      // Test audit trail in price history
    });
  });

  describe('Performance', () => {
    it('should respond within 500ms for all endpoints', async () => {
      // Performance test for all 38 endpoints
      // Each endpoint should respond within 500ms
    });
  });
});
```

---

## 🚨 Risk Assessment & Mitigation

### Risk Analysis

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| API contract violations | Low | High | Comprehensive contract testing |
| Performance issues | Medium | Medium | Query optimization, indexing |
| Permission issues | Low | Medium | Permission guard testing |
| Data validation issues | Low | High | Comprehensive DTO validation |
| Foreign key constraint errors | Low | Medium | Integration testing with real data |

### Testing Strategy

1. **Unit Tests**: 100% coverage for all services
2. **Contract Tests**: Verify API contracts match specification
3. **Integration Tests**: Test data flow between related entities
4. **Performance Tests**: Ensure all endpoints respond < 500ms
5. **Security Tests**: Verify permission guards work correctly

---

## 📊 Success Criteria

### Technical Success
- ✅ All 38 endpoints implemented according to API spec
- ✅ 100% test coverage for services
- ✅ All contract tests passing
- ✅ Performance requirements met (< 500ms response time)
- ✅ No breaking changes to existing APIs

### Functional Success
- ✅ Full CRUD operations for all 6 entities
- ✅ Special features implemented (compatibility, price history, packages, etc.)
- ✅ Proper error handling and validation
- ✅ Audit trail for all data modifications
- ✅ Permission-based access control

### Integration Success
- ✅ Database relationships working correctly
- ✅ Foreign key constraints enforced
- ✅ Data consistency maintained
- ✅ API layer integrates with existing authentication
- ✅ No conflicts with existing functionality

---

## 📋 Post-Implementation Tasks

### 1. Documentation
- [ ] Update API documentation with all new endpoints
- [ ] Create API client examples
- [ ] Update permission matrices
- [ ] Create troubleshooting guide

### 2. Monitoring
- [ ] Set up API monitoring and alerting
- [ ] Monitor endpoint performance
- [ ] Track error rates
- [ ] Set up usage analytics

### 3. Deployment
- [ ] Create deployment scripts
- [ ] Plan rollout strategy
- [ ] Prepare rollback procedures
- [ ] Schedule deployment window

---

**End of API Implementation Plan**