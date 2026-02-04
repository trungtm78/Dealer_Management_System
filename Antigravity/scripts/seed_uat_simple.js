import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding UAT data...');

    try {
        // Delete in correct order (children first, then parents)
        console.log('🗑️  Deleting existing data...');
        
        // Delete child records first
        await prisma.lead.deleteMany({});
        await prisma.serviceQuote.deleteMany({});
        await prisma.serviceAppointment.deleteMany({});
        await prisma.repairOrder.deleteMany({});
        await prisma.testDrive.deleteMany({});
        await prisma.workLog.deleteMany({});
        await prisma.bayAssignment.deleteMany({});
        await prisma.insuranceClaim.deleteMany({});
        await prisma.loyaltyTransaction.deleteMany({});
        await prisma.scoringRule.deleteMany({});
        
        // Delete parent records
        await prisma.customer.deleteMany({});
        await prisma.vehicleModel.deleteMany({});

        console.log('✅ Data cleared successfully');

        // Insert vehicle models (parent)
        console.log('📊 Seeding vehicle models...');
        const vehicleModels = [
            {
                model_code: 'MOD/2026/001',
                model_name: 'Honda City RS',
                category: 'SEDAN',
                base_price: 549000000,
                status: 'ACTIVE'
            },
            {
                model_code: 'MOD/2026/002',
                model_name: 'Honda Civic RS',
                category: 'SEDAN',
                base_price: 499000000,
                status: 'ACTIVE'
            },
            {
                model_code: 'MOD/2026/003',
                model_name: 'Honda Accord',
                category: 'SEDAN',
                base_price: 449000000,
                status: 'ACTIVE'
            },
            {
                model_code: 'MOD/2026/004',
                model_name: 'Honda CR-V',
                category: 'SUV',
                base_price: 599000000,
                status: 'ACTIVE'
            },
            {
                model_code: 'MOD/2026/005',
                model_name: 'Honda HR-V',
                category: 'SUV',
                base_price: 699000000,
                status: 'ACTIVE'
            }
        ];

        for (const model of vehicleModels) {
            await prisma.vehicleModel.create({ data: model });
            console.log(`✅ Created: ${model.model_name}`);
        }

        console.log('✅ Seeded 5 vehicle models');

        // Insert customers (parent for other entities)
        console.log('📊 Seeding customers...');
        const customers = [
            {
                name: 'Nguyễn Văn A',
                phone: '090123456789',
                email: 'nguyena@example.com',
                type: 'INDIVIDUAL',
                tier: 'BRONZE',
                status: 'ACTIVE',
                points: 0,
                total_points: 0,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Trần Thị B',
                phone: '090987654321',
                email: 'tranb@example.com',
                type: 'INDIVIDUAL',
                tier: 'SILVER',
                status: 'ACTIVE',
                points: 0,
                total_points: 0,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Lê Văn C',
                phone: '090555666778',
                email: 'levanc@example.com',
                type: 'INDIVIDUAL',
                tier: 'SILVER',
                status: 'ACTIVE',
                points: 0,
                total_points: 0,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Phạm Thị D',
                phone: '090111222333',
                email: 'phamd@example.com',
                type: 'INDIVIDUAL',
                tier: 'GOLD',
                status: 'ACTIVE',
                points: 0,
                total_points: 0,
                created_at: new Date(),
                updated_at: new Date()
            }
        ];

        const createdCustomers = [];
        for (const customer of customers) {
            const created = await prisma.customer.create({ data: customer });
            createdCustomers.push(created);
            console.log(`✅ Created: ${customer.name}`);
        }

        console.log(`✅ Seeded ${createdCustomers.length} customers`);

        // Create leads (referencing customers)
        console.log('📊 Seeding leads...');
        const leads = [
            {
                name: createdCustomers[0].name,
                phone: createdCustomers[0].phone,
                email: createdCustomers[0].email,
                address: '123 Đường ABC, Quận 1, TP. Hồ Chí Minh',
                type: 'WALK_IN',
                source: 'WALK_IN',
                status: 'NEW',
                score: 10,
                created_at: new Date(),
                updated_at: new Date(),
                model_interest: createdCustomers[0].name, // References vehicle model
                budget: 500000000,
                model_version: 'G',
                color: 'white'
            },
            {
                name: createdCustomers[1].name,
                phone: createdCustomers[1].phone,
                email: createdCustomers[1].email,
                address: '456 Đường XYZ, Quận 9, TP. Đà Nẵng',
                type: 'WALK_IN',
                source: 'WEBSITE',
                status: 'NEW',
                score: 15,
                created_at: new Date(),
                updated_at: new Date(),
                model_interest: 'Honda CR-V', // References vehicle model
                budget: 600000000,
                model_version: 'E',
                color: 'black'
            },
            {
                name: createdCustomers[2].name,
                phone: createdCustomers[2].phone,
                email: createdCustomers[2].email,
                address: '789 Đường EFG, Quận 5, TP. Hà Nội',
                type: 'REFERRAL',
                source: 'REFERRAL',
                status: 'CONTACTED',
                score: 10,
                created_at: new Date(),
                updated_at: new Date(),
                model_interest: 'Honda Accord', // References vehicle model
                budget: 450000000,
                model_version: 'L'
            },
            {
                name: createdCustomers[3].name,
                phone: createdCustomers[3].phone,
                email: createdCustomers[3].email,
                address: '321 Đường HIJ, Quận 8, TP. Hải Phòng',
                type: 'WALK_IN',
                source: 'ADVERTISEMENT',
                status: 'NEW',
                score: 8,
                created_at: new Date(),
                updated_at: new Date()
            }
        ];

        for (const lead of leads) {
            await prisma.lead.create({ data: lead });
            console.log(`✅ Created lead: ${lead.name}`);
        }

        console.log(`✅ Seeded ${leads.length} leads`);

        console.log('\n✅ UAT data seeding completed successfully!');
        console.log(`Summary:`);
        console.log(`  - Vehicle Models: 5`);
        console.log(`  - Customers: ${createdCustomers.length}`);
        console.log(`  - Leads: ${leads.length}`);

    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
