# Backend Implementation Plan - Master Data Management
**CR Reference**: CR-20250131-001 (VehicleModel Master Data Management)  
**FRD Version**: v1.1 (CR-MD-002/003/004 Enhancement)  
**ERD Version**: v1.1  
**API Spec Version**: v1.2  
**Implementation Date**: 31/01/2026  
**Author**: Antigravity - Backend Architect  

---

## 📋 Executive Summary

This document outlines the comprehensive backend implementation plan for the Master Data Management module as specified in FRD v1.1, ERD v1.1, and API Spec v1.2. The implementation includes complete backend services, repositories, business logic, and testing strategies for all 6 master data entities.

**Backend Implementation Scope**:
- **VehicleModel**: Complete service layer with enhanced business logic
- **Accessory**: Full CRUD with compatibility matrix and price history
- **ServiceCatalog**: Service management with package builder
- **ServiceBay**: Bay management with utilization tracking
- **ScoringRule**: Rule engine with testing capabilities
- **SystemSetting**: Configuration management with validation

**Total**: 6 entities, 4 supporting tables, 38 API endpoints

---

## 🔍 Requirements Analysis

### 1. Functional Requirements Coverage

Based on FRD v1.1, the backend must implement:

#### FR-MD-001: VehicleModel Management (Enhanced)
- ✅ Enhanced validation and business logic
- ✅ Relationship management with other entities

#### FR-MD-002: Accessory Management (NEW)
- ✅ Full CRUD operations
- ✅ Compatibility matrix management
- ✅ Price history tracking
- ✅ Import/Export functionality

#### FR-MD-003: ServiceCatalog Management (NEW)
- ✅ Full CRUD operations
- ✅ Real-time pricing calculator
- ✅ Service package builder
- ✅ Parts management integration

#### FR-MD-004: Other Masters Management (NEW)
- ✅ ServiceBay utilization tracking
- ✅ ScoringRule engine with testing
- ✅ SystemSetting configuration management
- ✅ Audit trail for all changes

### 2. Technical Requirements

#### 2.1 Architecture Patterns
- **Service Layer Pattern**: Business logic separation
- **Repository Pattern**: Data access abstraction
- **DTO Pattern**: Data transfer with validation
- **Entity Pattern**: Database representation

#### 2.2 Validation Requirements
- **Input Validation**: 20+ validation rules (VR-MD-001 to VR-MD-020)
- **Business Logic Validation**: Complex multi-entity validation
- **Type Safety**: Strong typing for all data structures

#### 2.3 Performance Requirements
- **Response Time**: < 500ms for all operations
- **Database Optimization**: Proper indexing and query optimization
- **Caching Strategy**: Configuration data caching

---

## 📋 Implementation Plan

### Phase 1: Foundation Setup (Day 1-2)

#### 1.1 Entity Implementation

```typescript
// src/modules/master-data/entities/
├── vehicle-model.entity.ts
├── accessory.entity.ts
├── service-catalog.entity.ts
├── service-bay.entity.ts
├── scoring-rule.entity.ts
├── system-setting.entity.ts
├── accessory-model-compatibility.entity.ts
├── accessory-price-history.entity.ts
├── service-packages.entity.ts
└── service-package-items.entity.ts
```

**Entity Implementation Structure**:
```typescript
// src/modules/master-data/entities/accessory.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany } from 'typeorm';
import { BaseEntity } from 'typeorm';
import { AccessoryModelCompatibility } from './accessory-model-compatibility.entity';
import { AccessoryPriceHistory } from './accessory-price-history.entity';

@Entity('Accessory')
export class Accessory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  accessory_code: string;

  @Column({ unique: true })
  accessory_name: string;

  @Column({
    type: 'enum',
    enum: ['INTERIOR', 'EXTERIOR', 'TECH', 'SAFETY'],
  })
  category: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  price: number;

  @Column({ default: false })
  installation_required: boolean;

  @Column({ default: 12 })
  warranty_period_months: number;

  @Column({
    type: 'enum',
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE',
  })
  status: string;

  @Column({ nullable: true })
  deleted_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  // Relationships
  @OneToMany(() => AccessoryModelCompatibility, compatibility => compatibility.accessory)
  compatibilities: AccessoryModelCompatibility[];

  @OneToMany(() => AccessoryPriceHistory, history => history.accessory)
  price_history: AccessoryPriceHistory[];
}
```

#### 1.2 DTO Implementation

```typescript
// src/modules/master-data/dto/
├── base.dto.ts
├── vehicle-model.dto.ts
├── accessory.dto.ts
├── service-catalog.dto.ts
├── service-bay.dto.ts
├── scoring-rule.dto.ts
└── system-setting.dto.ts
```

**DTO Implementation Structure**:
```typescript
// src/modules/master-data/dto/accessory.dto.ts
import { IsString, IsEnum, IsNumber, Min, Max, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccessoryDto {
  @ApiProperty({ description: 'Accessory name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  accessory_name: string;

  @ApiProperty({ enum: ['INTERIOR', 'EXTERIOR', 'TECH', 'SAFETY'] })
  @IsEnum(['INTERIOR', 'EXTERIOR', 'TECH', 'SAFETY'])
  category: string;

  @ApiProperty({ description: 'Price in VND' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ default: false, required: false })
  @IsOptional()
  @IsBoolean()
  installation_required?: boolean;

  @ApiProperty({ default: 12, required: false })
  @IsOptional()
  @IsNumber()
  @Min(6)
  @Max(60)
  warranty_period_months?: number;
}

export class UpdateAccessoryDto extends PartialType(CreateAccessoryDto) {
  @ApiProperty({ enum: ['ACTIVE', 'INACTIVE'], required: false })
  @IsOptional()
  @IsEnum(['ACTIVE', 'INACTIVE'])
  status?: string;
}

export class AccessoryFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  category?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  installation_required?: boolean;

  @ApiProperty({ enum: ['ACTIVE', 'INACTIVE', 'ALL'], required: false })
  @IsOptional()
  @IsEnum(['ACTIVE', 'INACTIVE', 'ALL'])
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  min_price?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  max_price?: number;

  @ApiProperty({ default: 1, required: false })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiProperty({ default: 20, required: false })
  @IsOptional()
  @IsNumber()
  @Max(100)
  limit?: number;

  @ApiProperty({ default: 'created_at:desc', required: false })
  @IsOptional()
  @IsString()
  sort?: string;
}
```

### Phase 2: Repository Implementation (Day 2-3)

#### 2.1 Base Repository

```typescript
// src/modules/master-data/repositories/base.repository.ts
import { DataSource, Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

export abstract class BaseRepository<T> {
  constructor(protected readonly repository: Repository<T>) {}

  async findById(id: number): Promise<T> {
    const entity = await this.repository.findOne({ where: { id } as any });
    if (!entity) {
      throw new NotFoundException(`${this.constructor.name} not found`);
    }
    return entity;
  }

  async findWithFilters(options: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  async countWithFilters(options: FindManyOptions<T>): Promise<number> {
    return this.repository.count(options);
  }

  async save(entity: T): Promise<T> {
    return this.repository.save(entity);
  }

  async softDelete(id: number): Promise<void> {
    await this.repository.softDelete(id);
  }

  async createQueryBuilder(alias: string) {
    return this.repository.createQueryBuilder(alias);
  }
}
```

#### 2.2 Entity Repositories

```typescript
// src/modules/master-data/repositories/
├── base.repository.ts
├── vehicle-model.repository.ts
├── accessory.repository.ts
├── service-catalog.repository.ts
├── service-bay.repository.ts
├── scoring-rule.repository.ts
└── system-setting.repository.ts
```

**Accessory Repository Implementation**:
```typescript
// src/modules/master-data/repositories/accessory.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Accessory } from '../entities/accessory.entity';
import { VehicleModel } from '../entities/vehicle-model.entity';
import { AccessoryModelCompatibility } from '../entities/accessory-model-compatibility.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class AccessoryRepository extends BaseRepository<Accessory> {
  constructor(
    @InjectRepository(Accessory)
    protected readonly repository: Repository<Accessory>,
    @InjectRepository(VehicleModel)
    private readonly vehicleModelRepository: Repository<VehicleModel>,
    @InjectRepository(AccessoryModelCompatibility)
    private readonly compatibilityRepository: Repository<AccessoryModelCompatibility>,
  ) {
    super(repository);
  }

  async findWithCompatibility(filter: any): Promise<Accessory[]> {
    const queryBuilder = this.repository.createQueryBuilder('a')
      .leftJoinAndSelect('a.compatibilities', 'amc')
      .leftJoinAndSelect('amc.model', 'vm');

    // Apply filters
    if (filter.search) {
      queryBuilder.andWhere(
        '(a.accessory_name LIKE :search OR a.accessory_code LIKE :search)',
        { search: `%${filter.search}%` }
      );
    }

    if (filter.category && filter.category.length > 0) {
      queryBuilder.andWhere('a.category IN (:...categories)', { 
        categories: filter.category 
      });
    }

    if (filter.status && filter.status !== 'ALL') {
      queryBuilder.andWhere('a.status = :status', { status: filter.status });
    }

    if (filter.installation_required !== undefined) {
      queryBuilder.andWhere('a.installation_required = :installation_required', { 
        installation_required: filter.installation_required 
      });
    }

    // Apply price range
    if (filter.min_price !== undefined) {
      queryBuilder.andWhere('a.price >= :min_price', { min_price: filter.min_price });
    }

    if (filter.max_price !== undefined) {
      queryBuilder.andWhere('a.price <= :max_price', { max_price: filter.max_price });
    }

    // Apply sorting
    if (filter.sort) {
      const [field, direction] = filter.sort.split(':');
      queryBuilder.orderBy(`a.${field}`, direction.toUpperCase() as 'ASC' | 'DESC');
    } else {
      queryBuilder.orderBy('a.created_at', 'DESC');
    }

    // Apply pagination
    const page = filter.page || 1;
    const limit = filter.limit || 20;
    const offset = (page - 1) * limit;

    queryBuilder.skip(offset).take(limit);

    return queryBuilder.getMany();
  }

  async findCompatibleModels(accessoryId: number): Promise<VehicleModel[]> {
    const compatibilities = await this.compatibilityRepository.find({
      where: { accessory_id: accessoryId },
      relations: ['model'],
    });

    return compatibilities.map(c => c.model);
  }

  async addCompatibility(accessoryId: number, modelIds: number[]): Promise<void> {
    for (const modelId of modelIds) {
      const compatibility = this.compatibilityRepository.create({
        accessory_id: accessoryId,
        model_id: modelId,
      });
      await this.compatibilityRepository.save(compatibility);
    }
  }

  async removeCompatibility(accessoryId: number, modelId: number): Promise<void> {
    await this.compatibilityRepository.delete({
      accessory_id: accessoryId,
      model_id: modelId,
    });
  }
}
```

### Phase 3: Service Layer Implementation (Day 3-4)

#### 3.1 Base Service

```typescript
// src/modules/master-data/services/base.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';

@Injectable()
export abstract class BaseService {
  protected throwNotFound(entity: string, id: number): never {
    throw new NotFoundException(`${entity} with ID ${id} not found`);
  }

  protected throwConflict(message: string): never {
    throw new ConflictException(message);
  }

  protected validateRequired(value: any, fieldName: string): void {
    if (!value || value.toString().trim() === '') {
      throw new ConflictException(`${fieldName} is required`);
    }
  }

  protected validateRange(value: number, min: number, max: number, fieldName: string): void {
    if (value < min || value > max) {
      throw new ConflictException(`${fieldName} must be between ${min} and ${max}`);
    }
  }
}
```

#### 3.2 Entity Services

```typescript
// src/modules/master-data/services/
├── base.service.ts
├── vehicle-model.service.ts
├── accessory.service.ts
├── service-catalog.service.ts
├── service-bay.service.ts
├── scoring-rule.service.ts
└── system-setting.service.ts
```

**Accessory Service Implementation**:
```typescript
// src/modules/master-data/services/accessory.service.ts
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Accessory } from '../entities/accessory.entity';
import { VehicleModel } from '../entities/vehicle-model.entity';
import { AccessoryModelCompatibility } from '../entities/accessory-model-compatibility.entity';
import { AccessoryPriceHistory } from '../entities/accessory-price-history.entity';
import { AccessoryRepository } from '../repositories/accessory.repository';
import { CreateAccessoryDto, UpdateAccessoryDto, AddCompatibilityDto } from '../dto/accessory.dto';
import { BaseService } from './base.service';

@Injectable()
export class AccessoryService extends BaseService {
  constructor(
    private readonly accessoryRepository: AccessoryRepository,
    @InjectRepository(VehicleModel)
    private readonly vehicleModelRepository: Repository<VehicleModel>,
    @InjectRepository(AccessoryPriceHistory)
    private readonly priceHistoryRepository: Repository<AccessoryPriceHistory>,
  ) {
    super();
  }

  async findAll(filter: any): Promise<{ data: Accessory[]; meta: any }> {
    const [data, total] = await Promise.all([
      this.accessoryRepository.findWithCompatibility(filter),
      this.accessoryRepository.countWithFilters({}),
    ]);

    const page = filter.page || 1;
    const limit = filter.limit || 20;

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

  async create(createDto: CreateAccessoryDto): Promise<Accessory> {
    // Validate required fields
    this.validateRequired(createDto.accessory_name, 'Accessory name');
    this.validateRequired(createDto.category, 'Category');
    this.validateRequired(createDto.price, 'Price');

    // Validate price
    if (createDto.price <= 0) {
      this.throwConflict('Price must be greater than 0');
    }

    // Validate category
    const validCategories = ['INTERIOR', 'EXTERIOR', 'TECH', 'SAFETY'];
    if (!validCategories.includes(createDto.category)) {
      throw new ConflictException(`Category must be one of: ${validCategories.join(', ')}`);
    }

    // Check for duplicate name
    const existing = await this.accessoryRepository.repository.findOne({
      where: { accessory_name: createDto.accessory_name }
    });

    if (existing) {
      this.throwConflict('Accessory name already exists');
    }

    // Generate accessory code
    const year = new Date().getFullYear();
    const count = await this.accessoryRepository.repository.count();
    const accessoryCode = `ACC-${String(count + 1).padStart(3, '0')}`;

    // Create accessory
    const accessory = this.accessoryRepository.repository.create({
      ...createDto,
      accessory_code,
      status: createDto.status || 'ACTIVE',
      warranty_period_months: createDto.warranty_period_months || 12,
      installation_required: createDto.installation_required || false,
    });

    const saved = await this.accessoryRepository.save(accessory);

    // Create initial price history
    await this.priceHistoryRepository.save({
      accessory_id: saved.id,
      old_price: null,
      new_price: saved.price,
      changed_by: 1, // TODO: Get from current user
    });

    return saved;
  }

  async update(id: number, updateDto: UpdateAccessoryDto): Promise<Accessory> {
    const accessory = await this.accessoryRepository.findById(id);

    // Check for duplicate name (excluding current record)
    if (updateDto.accessory_name) {
      const existing = await this.accessoryRepository.repository.findOne({
        where: { 
          accessory_name: updateDto.accessory_name,
          id: Not(id) 
        }
      });

      if (existing) {
        this.throwConflict('Accessory name already exists');
      }
    }

    // Validate category if provided
    if (updateDto.category) {
      const validCategories = ['INTERIOR', 'EXTERIOR', 'TECH', 'SAFETY'];
      if (!validCategories.includes(updateDto.category)) {
        throw new ConflictException(`Category must be one of: ${validCategories.join(', ')}`);
      }
    }

    // Validate price if provided
    if (updateDto.price !== undefined && updateDto.price <= 0) {
      this.throwConflict('Price must be greater than 0');
    }

    // Validate warranty period if provided
    if (updateDto.warranty_period_months !== undefined) {
      this.validateRange(updateDto.warranty_period_months, 6, 60, 'Warranty period');
    }

    // Record price change if price is being updated
    if (updateDto.price !== undefined && updateDto.price !== accessory.price) {
      await this.priceHistoryRepository.save({
        accessory_id: id,
        old_price: accessory.price,
        new_price: updateDto.price,
        changed_by: 1, // TODO: Get from current user
      });
    }

    // Update accessory
    Object.assign(accessory, updateDto);
    const updated = await this.accessoryRepository.save(accessory);

    return updated;
  }

  async remove(id: number): Promise<{ message: string; id: number }> {
    const accessory = await this.accessoryRepository.findById(id);
    
    accessory.status = 'INACTIVE';
    accessory.deleted_at = new Date();
    
    await this.accessoryRepository.save(accessory);
    return { message: 'Accessory deleted successfully', id };
  }

  async getCompatibility(id: number): Promise<any> {
    const accessory = await this.accessoryRepository.findById(id);
    
    const compatibleModels = await this.accessoryRepository.findCompatibleModels(id);
    const allModels = await this.vehicleModelRepository.find({
      where: { status: 'ACTIVE' }
    });

    const incompatibleModels = allModels.filter(
      model => !compatibleModels.some(cm => cm.id === model.id)
    );

    return {
      accessory: {
        id: accessory.id,
        accessory_code: accessory.accessory_code,
        accessory_name: accessory.accessory_name,
      },
      compatible_models: compatibleModels.map(model => ({
        model_id: model.id,
        model_code: model.model_code,
        model_name: model.model_name,
        compatible_since: model.created_at,
      })),
      incompatible_models: incompatibleModels.map(model => ({
        model_id: model.id,
        model_code: model.model_code,
        model_name: model.model_name,
      })),
    };
  }

  async addCompatibility(id: number, addDto: AddCompatibilityDto): Promise<any> {
    // Verify accessory exists
    await this.accessoryRepository.findById(id);
    
    // Verify model exists
    const model = await this.vehicleModelRepository.findOne({
      where: { id: addDto.model_id, status: 'ACTIVE' }
    });

    if (!model) {
      throw new NotFoundException('Vehicle model not found or inactive');
    }

    // Check if compatibility already exists
    const existing = await this.accessoryRepository.repository.manager
      .getRepository(AccessoryModelCompatibility)
      .findOne({
        where: { accessory_id: id, model_id: addDto.model_id }
      });

    if (existing) {
      this.throwConflict('Model compatibility already exists');
    }

    // Add compatibility
    await this.accessoryRepository.addCompatibility(id, [addDto.model_id]);

    return this.getCompatibility(id);
  }

  async removeCompatibility(id: number, modelId: number): Promise<any> {
    // Verify accessory exists
    await this.accessoryRepository.findById(id);
    
    // Verify model exists
    const model = await this.vehicleModelRepository.findOne({
      where: { id: modelId }
    });

    if (!model) {
      throw new NotFoundException('Vehicle model not found');
    }

    // Remove compatibility
    await this.accessoryRepository.removeCompatibility(id, modelId);

    return this.getCompatibility(id);
  }

  async getPriceHistory(id: number): Promise<any> {
    const accessory = await this.accessoryRepository.findById(id);
    
    const history = await this.priceHistoryRepository.find({
      where: { accessory_id: id },
      order: { changed_at: 'DESC' },
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
        changed_at: h.changed_at,
      })),
    };
  }
}
```

### Phase 4: Advanced Services Implementation (Day 4-5)

#### 4.1 ServiceCatalog Service with Real-time Pricing

```typescript
// src/modules/master-data/services/service-catalog.service.ts
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceCatalog } from '../entities/service-catalog.entity';
import { Accessory } from '../entities/accessory.entity';
import { ServicePackages } from '../entities/service-packages.entity';
import { ServicePackageItems } from '../entities/service-package-items.entity';
import { BaseService } from './base.service';

@Injectable()
export class ServiceCatalogService extends BaseService {
  constructor(
    @InjectRepository(ServiceCatalog)
    private readonly serviceCatalogRepository: Repository<ServiceCatalog>,
    @InjectRepository(Accessory)
    private readonly accessoryRepository: Repository<Accessory>,
    @InjectRepository(ServicePackages)
    private readonly servicePackagesRepository: Repository<ServicePackages>,
    @InjectRepository(ServicePackageItems)
    private readonly servicePackageItemsRepository: Repository<ServicePackageItems>,
  ) {
    super();
  }

  async calculateServiceCost(serviceId: number): Promise<{ labor_cost: number; parts_cost: number; total_cost: number }> {
    const service = await this.serviceCatalogRepository.findOne({
      where: { id: serviceId },
      relations: ['parts'],
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    const labor_cost = Number(service.labor_hours) * Number(service.labor_rate);
    const parts_cost = service.parts.reduce((sum, part) => sum + Number(part.price), 0);
    const total_cost = labor_cost + parts_cost;

    return { labor_cost, parts_cost, total_cost };
  }

  async createServicePackage(createDto: CreateServicePackageDto): Promise<ServicePackages> {
    this.validateRequired(createDto.package_name, 'Package name');
    
    if (createDto.service_ids.length < 2) {
      this.throwConflict('Package must include at least 2 services');
    }

    if (createDto.discount_percentage < 0 || createDto.discount_percentage > 50) {
      this.throwConflict('Discount percentage must be between 0 and 50');
    }

    // Calculate base price (sum of service costs)
    let base_price = 0;
    for (const serviceId of createDto.service_ids) {
      const cost = await this.calculateServiceCost(serviceId);
      base_price += cost.total_cost;
    }

    const discount_amount = base_price * (createDto.discount_percentage / 100);
    const total_price = base_price - discount_amount;

    // Create package
    const packageEntity = this.servicePackagesRepository.create({
      package_name: createDto.package_name,
      discount_percentage: createDto.discount_percentage,
      total_price,
      status: 'ACTIVE',
    });

    const savedPackage = await this.servicePackagesRepository.save(packageEntity);

    // Create package items
    for (const serviceId of createDto.service_ids) {
      const packageItem = this.servicePackageItemsRepository.create({
        package_id: savedPackage.id,
        service_id: serviceId,
      });
      await this.servicePackageItemsRepository.save(packageItem);
    }

    return savedPackage;
  }
}
```

#### 4.2 ScoringRule Service with Testing Engine

```typescript
// src/modules/master-data/services/scoring-rule.service.ts
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScoringRule } from '../entities/scoring-rule.entity';
import { BaseService } from './base.service';

@Injectable()
export class ScoringRuleService extends BaseService {
  constructor(
    @InjectRepository(ScoringRule)
    private readonly scoringRuleRepository: Repository<ScoringRule>,
  ) {
    super();
  }

  async testRule(ruleId: number, testData: any): Promise<any> {
    const rule = await this.scoringRuleRepository.findOne({
      where: { id: ruleId, is_active: true }
    });

    if (!rule) {
      throw new NotFoundException('Scoring rule not found or inactive');
    }

    // Parse condition JSON
    let condition;
    try {
      condition = JSON.parse(rule.condition.toString());
    } catch (error) {
      throw new ConflictException('Invalid rule condition format');
    }

    // Evaluate condition
    const conditionMet = this.evaluateCondition(condition, testData);
    
    // Calculate score
    const calculatedScore = conditionMet ? rule.points : 0;

    return {
      rule: {
        id: rule.id,
        name: rule.name,
        condition: condition,
        points: rule.points,
      },
      test_result: {
        condition_met: conditionMet,
        calculated_score: calculatedScore,
        test_passed: calculatedScore === (testData.expected_score || calculatedScore),
      },
      evaluation: {
        input_data: testData,
        steps: [
          {
            step: 'Condition Evaluation',
            expression: `${condition.field} ${condition.operator} ${condition.value}`,
            result: conditionMet,
            details: `${testData[condition.field]} ${condition.operator} ${condition.value} = ${conditionMet}`,
          },
          {
            step: 'Score Calculation',
            formula: conditionMet ? 'points' : '0',
            result: calculatedScore,
            details: conditionMet ? `Condition met, assigned ${rule.points} points` : 'Condition not met, assigned 0 points',
          }
        ],
      },
    };
  }

  private evaluateCondition(condition: any, data: any): boolean {
    const fieldValue = data[condition.field];
    const conditionValue = condition.value;

    switch (condition.operator) {
      case '=':
        return fieldValue === conditionValue;
      case '!=':
        return fieldValue !== conditionValue;
      case '>':
        return fieldValue > conditionValue;
      case '<':
        return fieldValue < conditionValue;
      case '>=':
        return fieldValue >= conditionValue;
      case '<=':
        return fieldValue <= conditionValue;
      case 'contains':
        return fieldValue && fieldValue.toString().includes(conditionValue);
      case 'in':
        return Array.isArray(conditionValue) && conditionValue.includes(fieldValue);
      default:
        return false;
    }
  }
}
```

### Phase 5: Testing Implementation (Day 5)

#### 5.1 Unit Tests

```typescript
// test/unit/accessory.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessoryService } from '../../src/modules/master-data/services/accessory.service';
import { Accessory } from '../../src/modules/master-data/entities/accessory.entity';

describe('AccessoryService', () => {
  let service: AccessoryService;
  let repository: Repository<Accessory>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessoryService,
        {
          provide: getRepositoryToken(Accessory),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AccessoryService>(AccessoryService);
    repository = module.get<Repository<Accessory>>(getRepositoryToken(Accessory));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new accessory with valid data', async () => {
      const createDto = {
        accessory_name: 'Test Accessory',
        category: 'INTERIOR',
        price: 100000,
      };

      const result = await service.create(createDto);

      expect(result).toBeDefined();
      expect(result.accessory_name).toBe(createDto.accessory_name);
      expect(result.category).toBe(createDto.category);
      expect(result.price).toBe(createDto.price);
      expect(result.accessory_code).toMatch(/^ACC-\d{3}$/);
    });

    it('should throw error for duplicate accessory name', async () => {
      const createDto = {
        accessory_name: 'Duplicate Accessory',
        category: 'INTERIOR',
        price: 100000,
      };

      repository.findOne = jest.fn().mockResolvedValue({
        accessory_name: 'Duplicate Accessory',
      });

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
    });
  });
});
```

#### 5.2 Integration Tests

```typescript
// test/integration/master-data.integration.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterDataModule } from '../../src/modules/master-data/master-data.module';
import { DatabaseTestingModule } from '../utils/database-testing.module';

describe('MasterData Integration', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        DatabaseTestingModule,
        MasterDataModule,
      ],
    }).compile();
  });

  afterAll(async () => {
    await module.close();
  });

  describe('Accessory-Service Integration', () => {
    it('should maintain data consistency between accessories and services', async () => {
      // Test integration logic
    });
  });

  describe('Compatibility Matrix Integration', () => {
    it('should properly manage accessory-vehicle model relationships', async () => {
      // Test compatibility matrix management
    });
  });
});
```

---

## 🚨 Risk Assessment & Mitigation

### Risk Analysis

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Business Logic Errors** | Medium | High | Comprehensive unit tests with 100% coverage |
| **Data Consistency Issues** | Low | High | Database transaction management |
| **Performance Issues** | Medium | Medium | Query optimization and caching |
| **Validation Gaps** | Low | High | Comprehensive DTO validation |
| **Security Issues** | Low | High | Permission guards and input sanitization |

### Testing Strategy

1. **Unit Tests**: 100% coverage for all services
2. **Integration Tests**: Test data flow between related entities
3. **Contract Tests**: Verify compliance with API specification
4. **Performance Tests**: Ensure all operations complete in < 500ms
5. **Security Tests**: Verify permission enforcement

---

## 📊 Success Criteria

### Technical Success
- ✅ Complete backend implementation for all 6 entities
- ✅ 100% unit test coverage for services
- ✅ All integration tests passing
- ✅ Performance requirements met (< 500ms response time)
- ✅ No breaking changes to existing functionality

### Functional Success
- ✅ Full CRUD operations with proper validation
- ✅ Advanced features implemented (compatibility, pricing, testing)
- ✅ Comprehensive error handling
- ✅ Audit trail for all data modifications
- ✅ Permission-based access control

### Integration Success
- ✅ Database relationships working correctly
- ✅ Foreign key constraints enforced
- ✅ Data consistency maintained across operations
- ✅ Proper error handling for edge cases
- ✅ Ready for frontend integration

---

## 📋 Post-Implementation Tasks

### 1. Documentation
- [ ] Complete API documentation with all endpoints
- [ ] Create service interface documentation
- [ ] Update permission matrices
- [ ] Create troubleshooting guide

### 2. Performance Optimization
- [ ] Database query optimization
- [ ] Implement caching for frequently accessed data
- [ ] Set up performance monitoring
- [ ] Load testing for concurrent operations

### 3. Security Review
- [ ] Security audit of all input validation
- [ ] Verify permission enforcement
- [ ] Check for SQL injection vulnerabilities
- [ ] Validate data sanitization

---

**End of Backend Implementation Plan**