-- Insert test VehicleModels for UAT execution
-- This data is specified in the UAT specification document

-- Clean existing data first
DELETE FROM vehicle_models;

-- Insert 8 sample VehicleModels as per UAT spec
INSERT INTO vehicle_models (id, model_code, model_name, category, base_price, status, created_at, updated_at) VALUES
('vm_001', 'MOD/2026/001', 'Honda City RS', 'SEDAN', 559000000.00, 'ACTIVE', datetime('now'), datetime('now')),
('vm_002', 'MOD/2026/002', 'Honda CR-V L', 'SUV', 1029000000.00, 'ACTIVE', datetime('now'), datetime('now')),
('vm_003', 'MOD/2026/003', 'Honda Civic RS', 'SEDAN', 799000000.00, 'ACTIVE', datetime('now'), datetime('now')),
('vm_004', 'MOD/2026/004', 'Honda Accord', 'SEDAN', 1319000000.00, 'INACTIVE', datetime('now'), datetime('now')),
('vm_005', 'MOD/2026/005', 'Honda BR-V', 'SUV', 661000000.00, 'ACTIVE', datetime('now'), datetime('now')),
('vm_006', 'MOD/2026/006', 'Honda HR-V', 'SUV', 699000000.00, 'ACTIVE', datetime('now'), datetime('now')),
('vm_007', 'MOD/2026/007', 'Honda City Hatchback', 'HATCHBACK', 549000000.00, 'ACTIVE', datetime('now'), datetime('now')),
('vm_008', 'MOD/2026/008', 'Honda Brio', 'HATCHBACK', 418000000.00, 'ACTIVE', datetime('now'), datetime('now'));

-- Verify the data
SELECT 'VehicleModels seeded successfully. Total count: ' || COUNT(*) as result FROM vehicle_models;