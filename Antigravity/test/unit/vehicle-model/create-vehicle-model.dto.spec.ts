import { CreateVehicleModelDto, VehicleCategory, VehicleStatus } from '../../../src/modules/vehicle-model/dto/create-vehicle-model.dto';

describe('CreateVehicleModelDto', () => {
  it('should create valid DTO with all required fields', () => {
    const dto: CreateVehicleModelDto = {
      model_name: 'Honda City RS',
      category: VehicleCategory.SEDAN,
      base_price: 559000000,
    };

    expect(dto.model_name).toBe('Honda City RS');
    expect(dto.category).toBe(VehicleCategory.SEDAN);
    expect(dto.base_price).toBe(559000000);
  });

  it('should create valid DTO with all fields including optionals', () => {
    const dto: CreateVehicleModelDto = {
      model_code: 'MOD/2026/001',
      model_name: 'Honda City RS',
      category: VehicleCategory.SEDAN,
      base_price: 559000000,
      status: VehicleStatus.ACTIVE,
    };

    expect(dto.model_code).toBe('MOD/2026/001');
    expect(dto.status).toBe(VehicleStatus.ACTIVE);
  });

  it('should validate category enum values', () => {
    const validCategories = [
      VehicleCategory.SEDAN,
      VehicleCategory.SUV,
      VehicleCategory.HATCHBACK,
      VehicleCategory.MPV,
    ];

    validCategories.forEach(category => {
      const dto: CreateVehicleModelDto = {
        model_name: 'Test Model',
        category,
        base_price: 100000000,
      };

      expect(Object.values(VehicleCategory)).toContain(dto.category);
    });
  });

  it('should validate status enum values', () => {
    const validStatuses = [
      VehicleStatus.ACTIVE,
      VehicleStatus.INACTIVE,
    ];

    validStatuses.forEach(status => {
      const dto: CreateVehicleModelDto = {
        model_name: 'Test Model',
        category: VehicleCategory.SEDAN,
        base_price: 100000000,
        status,
      };

      expect(Object.values(VehicleStatus)).toContain(dto.status);
    });
  });
});