import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding VehicleModel test data...');

  // Clean existing data (optional)
  await prisma.vehicleModel.deleteMany();

  // Insert test VehicleModels as specified in UAT specification
  const vehicleModels = [
    {
      model_code: 'MOD/2026/001',
      model_name: 'Honda City RS',
      category: 'SEDAN',
      base_price: 559000000.00,
      status: 'ACTIVE',
    },
    {
      model_code: 'MOD/2026/002',
      model_name: 'Honda CR-V L',
      category: 'SUV',
      base_price: 1029000000.00,
      status: 'ACTIVE',
    },
    {
      model_code: 'MOD/2026/003',
      model_name: 'Honda Civic RS',
      category: 'SEDAN',
      base_price: 799000000.00,
      status: 'ACTIVE',
    },
    {
      model_code: 'MOD/2026/004',
      model_name: 'Honda Accord',
      category: 'SEDAN',
      base_price: 1319000000.00,
      status: 'INACTIVE',
    },
    {
      model_code: 'MOD/2026/005',
      model_name: 'Honda BR-V',
      category: 'SUV',
      base_price: 661000000.00,
      status: 'ACTIVE',
    },
    {
      model_code: 'MOD/2026/006',
      model_name: 'Honda HR-V',
      category: 'SUV',
      base_price: 699000000.00,
      status: 'ACTIVE',
    },
    {
      model_code: 'MOD/2026/007',
      model_name: 'Honda City Hatchback',
      category: 'HATCHBACK',
      base_price: 549000000.00,
      status: 'ACTIVE',
    },
    {
      model_code: 'MOD/2026/008',
      model_name: 'Honda Brio',
      category: 'HATCHBACK',
      base_price: 418000000.00,
      status: 'ACTIVE',
    },
  ];

  for (const model of vehicleModels) {
    await prisma.vehicleModel.create({
      data: model,
    });
    console.log(`Created: ${model.model_name} (${model.model_code})`);
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });