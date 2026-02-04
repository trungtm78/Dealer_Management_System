const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedUATData() {
    console.log('🌱 Seeding UAT Test Data...');

    // Check existing data
    const existingModels = await prisma.vehicle_models.count();
    console.log(`Existing vehicle models: ${existingModels}`);

    if (existingModels === 0) {
        console.log('Creating 60 vehicle models for UAT...');
        const models = [];
        for (let i = 1; i <= 60; i++) {
            models.push({
                model_code: `VM-${String(i).padStart(3, '0')}`,
                model_name: `Honda Vehicle Model ${i}`,
                category: i <= 20 ? 'Sedan' : i <= 40 ? 'SUV' : 'Crossover',
                base_price: 500000000 + (i * 10000000),
                status: i <= 55 ? 'ACTIVE' : 'INACTIVE'
            });
        }

        await prisma.vehicle_models.createMany({
            data: models
        });

        console.log(`✅ Created ${models.length} vehicle models`);
    } else {
        console.log('Vehicle models already exist, skipping seed');
    }

    console.log('✅ UAT Test Data seeded successfully');
}

seedUATData()
    .catch(e => {
        console.error('Error seeding UAT data:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
