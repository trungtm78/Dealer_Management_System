import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VehicleModelService } from '../../../src/modules/vehicle-model/vehicle-model.service';
import { PrismaService } from '../../../src/common/prisma.service';
import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { VehicleCategory, VehicleStatus } from '../../../src/modules/vehicle-model/dto/create-vehicle-model.dto';

describe('VehicleModelService', () => {
  let service: VehicleModelService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    vehicleModel: {
      findFirst: vi.fn(),
      create: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    activityLog: {
      create: vi.fn(),
    },
  };

  const mockVehicleModel = {
    id: 'vm_001',
    model_code: 'MOD/2026/001',
    model_name: 'Honda City RS',
    category: 'SEDAN',
    base_price: 559000000,
    status: 'ACTIVE',
    created_at: '2026-01-31T00:00:00.000Z',
    updated_at: '2026-01-31T00:00:00.000Z',
  };

  beforeEach(() => {
    service = new VehicleModelService(mockPrismaService as any);
    prismaService = mockPrismaService as any;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should create a vehicle model successfully', async () => {
      const createDto = {
        model_name: 'Honda City RS',
        category: VehicleCategory.SEDAN,
        base_price: 559000000,
      };

      mockPrismaService.vehicleModel.findFirst.mockResolvedValue(null);
      mockPrismaService.vehicleModel.create.mockResolvedValue(mockVehicleModel);

      const result = await service.create(createDto, 'user_123', '192.168.1.1');

      expect(result).toEqual(mockVehicleModel);
      expect(mockPrismaService.vehicleModel.findFirst).toHaveBeenCalledWith({
        where: {
          model_name: {
            equals: createDto.model_name,
            mode: 'insensitive',
          },
        },
      });
      expect(mockPrismaService.vehicleModel.create).toHaveBeenCalledWith({
        data: {
          model_code: expect.any(String),
          model_name: createDto.model_name,
          category: createDto.category,
          base_price: createDto.base_price,
          status: 'ACTIVE',
        },
      });
    });

    it('should throw ConflictException when model name already exists', async () => {
      const createDto = {
        model_name: 'Honda City RS',
        category: VehicleCategory.SEDAN,
        base_price: 559000000,
      };

      mockPrismaService.vehicleModel.findFirst.mockResolvedValue(mockVehicleModel);

      await expect(service.create(createDto, 'user_123', '192.168.1.1')).rejects.toThrow(ConflictException);
    });

    it('should use provided model code when available', async () => {
      const createDto = {
        model_code: 'CUSTOM/001',
        model_name: 'Honda City RS',
        category: VehicleCategory.SEDAN,
        base_price: 559000000,
      };

      mockPrismaService.vehicleModel.findFirst.mockResolvedValue(null);
      mockPrismaService.vehicleModel.create.mockResolvedValue({
        ...mockVehicleModel,
        model_code: createDto.model_code,
      });

      const result = await service.create(createDto, 'user_123', '192.168.1.1');

      expect(result.model_code).toBe(createDto.model_code);
    });
  });

  describe('findAll', () => {
    it('should return paginated vehicle models', async () => {
      const filterDto = {
        page: 1,
        limit: 20,
        search: 'Honda',
        category: 'SEDAN',
        status: 'ACTIVE',
      };

      const mockData = [mockVehicleModel];
      const mockTotal = 1;

      mockPrismaService.vehicleModel.findMany.mockResolvedValue(mockData);
      mockPrismaService.vehicleModel.count.mockResolvedValue(mockTotal);

      const result = await service.findAll(filterDto);

      expect(result).toEqual({
        data: mockData,
        meta: {
          total: mockTotal,
          page: 1,
          limit: 20,
          totalPages: 1,
        },
      });
    });

    it('should apply search filter correctly', async () => {
      const filterDto = {
        search: 'Honda',
      };

      mockPrismaService.vehicleModel.findMany.mockResolvedValue([]);
      mockPrismaService.vehicleModel.count.mockResolvedValue(0);

      await service.findAll(filterDto);

      expect(mockPrismaService.vehicleModel.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { model_code: { contains: 'Honda', mode: 'insensitive' } },
            { model_name: { contains: 'Honda', mode: 'insensitive' } },
          ],
        },
        skip: 0,
        take: 20,
        orderBy: { created_at: 'desc' },
      });
    });

    it('should apply category filter correctly', async () => {
      const filterDto = {
        category: 'SEDAN',
      };

      mockPrismaService.vehicleModel.findMany.mockResolvedValue([]);
      mockPrismaService.vehicleModel.count.mockResolvedValue(0);

      await service.findAll(filterDto);

      expect(mockPrismaService.vehicleModel.findMany).toHaveBeenCalledWith({
        where: { category: 'SEDAN' },
        skip: 0,
        take: 20,
        orderBy: { created_at: 'desc' },
      });
    });

    it('should apply status filter correctly', async () => {
      const filterDto = {
        status: 'ACTIVE',
      };

      mockPrismaService.vehicleModel.findMany.mockResolvedValue([]);
      mockPrismaService.vehicleModel.count.mockResolvedValue(0);

      await service.findAll(filterDto);

      expect(mockPrismaService.vehicleModel.findMany).toHaveBeenCalledWith({
        where: { status: 'ACTIVE' },
        skip: 0,
        take: 20,
        orderBy: { created_at: 'desc' },
      });
    });

    it('should apply price range filter correctly', async () => {
      const filterDto = {
        minPrice: 500000000,
        maxPrice: 1000000000,
      };

      mockPrismaService.vehicleModel.findMany.mockResolvedValue([]);
      mockPrismaService.vehicleModel.count.mockResolvedValue(0);

      await service.findAll(filterDto);

      expect(mockPrismaService.vehicleModel.findMany).toHaveBeenCalledWith({
        where: {
          base_price: {
            gte: 500000000,
            lte: 1000000000,
          },
        },
        skip: 0,
        take: 20,
        orderBy: { created_at: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a vehicle model by id', async () => {
      mockPrismaService.vehicleModel.findUnique.mockResolvedValue(mockVehicleModel);

      const result = await service.findOne('vm_001');

      expect(result).toEqual(mockVehicleModel);
      expect(mockPrismaService.vehicleModel.findUnique).toHaveBeenCalledWith({
        where: { id: 'vm_001' },
      });
    });

    it('should throw NotFoundException when vehicle model not found', async () => {
      mockPrismaService.vehicleModel.findUnique.mockResolvedValue(null);

      await expect(service.findOne('invalid_id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a vehicle model successfully', async () => {
      const updateDto = {
        model_name: 'Honda City RS Updated',
        category: VehicleCategory.SEDAN,
        base_price: 569000000,
        status: VehicleStatus.ACTIVE,
      };

      const updatedVehicleModel = {
        ...mockVehicleModel,
        ...updateDto,
      };

      mockPrismaService.vehicleModel.findUnique.mockResolvedValue(mockVehicleModel);
      mockPrismaService.vehicleModel.findFirst.mockResolvedValue(null);
      mockPrismaService.vehicleModel.update.mockResolvedValue(updatedVehicleModel);

      const result = await service.update('vm_001', updateDto, 'user_123', '192.168.1.1');

      expect(result).toEqual(updatedVehicleModel);
    });

    it('should throw NotFoundException when vehicle model not found', async () => {
      const updateDto = {
        model_name: 'Honda City RS Updated',
        category: VehicleCategory.SEDAN,
        base_price: 569000000,
        status: VehicleStatus.ACTIVE,
      };

      mockPrismaService.vehicleModel.findUnique.mockResolvedValue(null);

      await expect(service.update('invalid_id', updateDto, 'user_123', '192.168.1.1')).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException when model name already exists', async () => {
      const updateDto = {
        model_name: 'Existing Model',
        category: VehicleCategory.SEDAN,
        base_price: 569000000,
        status: VehicleStatus.ACTIVE,
      };

      mockPrismaService.vehicleModel.findUnique.mockResolvedValue(mockVehicleModel);
      mockPrismaService.vehicleModel.findFirst.mockResolvedValue({
        ...mockVehicleModel,
        id: 'different_id',
      });

      await expect(service.update('vm_001', updateDto, 'user_123', '192.168.1.1')).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should soft delete a vehicle model successfully', async () => {
      const updatedVehicleModel = {
        ...mockVehicleModel,
        status: 'INACTIVE',
        deleted_at: '2026-01-31T00:00:00.000Z',
      };

      mockPrismaService.vehicleModel.findUnique.mockResolvedValue(mockVehicleModel);
      mockPrismaService.vehicleModel.update.mockResolvedValue(updatedVehicleModel);

      const result = await service.remove('vm_001', 'user_123', '192.168.1.1');

      expect(result).toEqual(updatedVehicleModel);
      expect(mockPrismaService.vehicleModel.update).toHaveBeenCalledWith({
        where: { id: 'vm_001' },
        data: {
          status: 'INACTIVE',
          deleted_at: expect.any(Date),
        },
      });
    });

    it('should throw NotFoundException when vehicle model not found', async () => {
      mockPrismaService.vehicleModel.findUnique.mockResolvedValue(null);

      await expect(service.remove('invalid_id', 'user_123', '192.168.1.1')).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when vehicle model is already inactive', async () => {
      const inactiveVehicleModel = {
        ...mockVehicleModel,
        status: 'INACTIVE',
      };

      mockPrismaService.vehicleModel.findUnique.mockResolvedValue(inactiveVehicleModel);

      await expect(service.remove('vm_001', 'user_123', '192.168.1.1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('generateModelCode', () => {
    it('should generate correct model code for new year', async () => {
      vi.spyOn(Date, 'now').mockReturnValue(new Date('2026-01-01').getTime());

      mockPrismaService.vehicleModel.findFirst.mockResolvedValue(null);

      const result = await service['generateModelCode']();

      expect(result).toBe('MOD/2026/001');
    });

    it('should increment model code correctly', async () => {
      vi.spyOn(Date, 'now').mockReturnValue(new Date('2026-01-01').getTime());

      mockPrismaService.vehicleModel.findFirst.mockResolvedValue({
        ...mockVehicleModel,
        model_code: 'MOD/2026/001',
      });

      const result = await service['generateModelCode']();

      expect(result).toBe('MOD/2026/002');
    });
  });
});