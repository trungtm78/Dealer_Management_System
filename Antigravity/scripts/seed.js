import PrismaClient from '@prisma/client';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database for UAT testing...');

    // Clean existing data to avoid conflicts
    console.log('�  Cleaning existing data...');
    await prisma.$executeRaw`
`DELETE FROM Lead`;
    await prisma.$executeRaw
`DELETE FROM "Customer`;
    await prisma.$executeRaw`
`DELETE FROM "vehicle_models"`;
    await prisma.$executeRaw
`DELETE FROM "accessories"`;
    await prisma.$executeRaw
`DELETE FROM "services"`;
    await prisma.$executeRaw
`DELETE FROM "employees"`;
    await prisma.$executeRaw
`DELETE FROM "warehouses"`;
    await prisma.$executeRaw
`DELETE FROM "uoms"`;

    try {
        // Seed Master Data
        await seedMasterData();

        // Seed Business Data
        await seedBusinessData();

        // Seed Supporting Data
        await seedSupportingData();

        console.log('✅ Seeding completed successfully!');
        console.log('📊 Database Statistics:');
        
        // Print counts for verification
        const customerCount = await prisma.customer.count();
        const leadCount = await prisma.lead.count();
        const vehicleModelCount = await prisma.vehicle_models.count();
        const employeeCount = await prisma.employee.count();
        const quotationCount = await prisma.quotation.count();
        const contractCount = await prisma.insuranceContract.count();
        const vehicleCount = await prisma.vin.count();
        const workLogCount = await prisma.workLog.count();

        console.log('  Customers:', customerCount);
        console.log('  Leads:', leadCount);
        console.log('  Vehicle Models:', vehicleModelCount);
        console.log('  Employees:', employeeCount);
        console.log('  Quotations:', quotationCount);
        console.log('  Insurance Contracts:', contractCount);
        console.log('  Vehicles:', vehicleCount);
        console.log('  Work Logs:', workLogCount);

    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

async function seedMasterData() {
    console.log('📦 Seeding Master Data...');

    // Vehicle Models
    const vehicleModels = [
        { model_code: 'MOD/2026/001', model_name: 'Honda City RS', category: 'SEDAN', base_price: 950000000, status: 'ACTIVE' },
        { model_code: 'MOD/2026/002', model_name: 'Honda Civic RS', category: 'HATCHBACK', base_price: 785000000, status: 'ACTIVE' },
        { model_code: 'MOD/2026/003', model_name: 'Honda Accord', category: 'SEDAN', base_price: 820000000, status: 'ACTIVE' },
        { model_code: 'MOD/2026/004', model_name: 'Honda CR-V', category: 'SUV', base_price: 965000000, status: 'ACTIVE' },
        { model_code: 'MOD/2026/005', model_name: 'Honda CR-V', category: 'SUV', base_price: 985000000, status: 'INACTIVE' },
        { model_code: 'MOD/2026/006', model_name: 'Honda City RS', category: 'SEDAN', base_price: 965000000, status: 'ACTIVE' },
        { model_code: 'MOD/2026/007', model_name: 'Honda Civic RS', category: 'HATCHBACK', base_price: 820000000, status: 'ACTIVE' },
        { model_code: 'MOD/2026/008', model_name: 'Honda Accord', category: 'HATCHBACK', base_price: 820000000, status: 'ACTIVE' },
        { model_code: 'MOD/2026/009', model_name: 'Honda CR-V', category: 'SUV', base_price: 965000000, status: 'ACTIVE' },
        { model_code: 'MOD/2026/010', model_name: 'Honda HR-V', category: 'HATCHBACK', base_price: 620000000, status: 'ACTIVE' },
    ];

    for (const model of vehicleModels) {
        await prisma.vehicleModel.create({ data: model });
    }

    console.log(`  ✅ Created ${vehicleModels.length} vehicle models`);
}

async function seedBusinessData() {
    console.log('📊 Seeding Business Data...');

    // Customers
    const customers = [
        {
            name: 'Nguyễn Văn A',
            phone: '090123456789',
            email: 'nguyena@example.com',
            type: 'INDIVIDUAL',
            status: 'ACTIVE',
            tier: 'SILVER',
            points: 0,
            address: '123 Đường ABC, Quận 1, TP. Hồ Chí Minh',
            street: '123 Đường ABC, Quận 1, TP. Hồ Chí Minh',
            city: 'Hà Nội',
            district: 'Hà Đông',
            ward: 'Phường Tràng Đức',
            created_at: '2024-01-01T00:00:00',
            updated_at: '2024-01-01T00:00:00'
        },
        {
            name: 'Trần Thị B',
            phone: '090123456790',
            email: 'tranthib@example.com',
            type: 'INDIVIDUAL',
            status: 'ACTIVE',
            tier: 'BRONZE',
            points: 0,
            address: '456 Đường 7, P. Nghệ 9, Quận 1, TP. Hồ Chí Minh',
            created_at: '2024-01-01T00:00:00',
            updated_at: '2024-01-01T00:00:00'
        },
        {
            name: 'Lê Minh C',
            phone: '090123456788',
            email: 'leminhc@example.com',
            type: 'INDIVIDUAL',
            status: 'INACTIVE',
            tier: 'BRONZE',
            points: 0,
            address: '789 Đường 9, P. Nghệ 9, Quận 2, TP. Hồ Chí Minh',
            city: 'HCM',
            district: 'TP. Hồ Chí Minh',
            ward: 'P. Nghệ 9, Quận 2',
            created_at: '2024-01-01T00:00:00',
            updated_at: '2024-01-01T00:00:00'
        },
        {
            name: 'Hoàng Văn D',
            phone: '090123456791',
            email: 'hoangvd@example.com',
            type: 'INDIVIDUAL',
            status: 'ACTIVE',
            tier: 'GOLD',
            points: 500,
            address: '321 Đường Kim Ngân, Tân Bình, TP. Hồ Chí Minh',
            street: '321 Đường Kim Ngân, Tân Bình, TP. Hồ Chí Minh',
            city: 'Hà Nội',
            district: 'Hà Tây',
            ward: 'Phường Mỹ Đình 2',
            created_at: '2024-01-01T00:00:00',
            updated_at: '2024-01-01T00:00:00'
        }
    ];

    for (const customer of customers) {
        await prisma.customer.create({ data: customer });
    }

    console.log(`  ✅ Created ${customers.length} customers`);

    // Leads
    const leads = [
        {
            name: 'Trần Văn A',
            phone: '090123456789',
            email: 'tranvana@example.com',
            source: 'WALK_IN',
            status: 'NEW',
            score: 10,
            model_interest: null,
            budget: null,
            created_at: '2024-01-01T00:00:00',
            updated_at: '2024-01-01T00:00:00'
        },
        {
            name: 'Lê Minh C',
            phone: '090123456788',
            email: 'leminhc@example.com',
            source: 'WEBSITE',
            status: 'CONTACTED',
            score: 25,
            model_interest: 'Honda CR-V',
            budget: 980000000,
            created_at: '2024-01-01T00:00:00',
            updated_at: '2024-01-01T00:00:00'
        },
        {
            name: 'Hoàng Văn D',
            phone: '090123456791',
            email: 'hoangvd@example.com',
            source: 'REFERRAL',
            status: 'QUALIFIED',
            score: 15,
            model_interest: 'Honda HR-V',
            budget: 620000000,
            created_at: '2024-01-01T00:00:00',
            updated_at: '2024-01-01T00:00:00'
        }
    ];

    for (const lead of leads) {
        await prisma.lead.create({ data: lead });
    }

    console.log(`  ✅ Created ${leads.length} leads`);

    // Quotations
    const quotations = [
        {
            id: 'QTM-2026-0001',
            quote_number: 'Báo giá QTM-001',
            customer_name: 'Trần Văn A',
            customer_phone: '090123456789',
            vehicle_model: 'MOD/2026/001',
            base_price: 950000000,
            discount: 0,
            net_price: 950000000,
            total_price: 950000000,
            deposit: 475000000,
            status: 'DRAFT',
            created_at: '2024-01-01T00:00:00',
            updated_at: '2024-01-01T00:00:00'
        },
        {
            id: 'QTM-2026-0002',
            quote_number: 'Báo giá QTM-002',
            customer_name: 'Lê Minh C',
            customer_phone: '090123456788',
            vehicle_model: 'MOD/2026/002',
            base_price: 785000000,
            discount: 50000000,
            net_price: 735000000,
            total_price: 785000000,
            deposit: 392500000,
            status: 'SENT',
            created_at: '2024-01-01T00:00:00',
            updated_at: '2024-01-01T00:00:00'
        },
        {
            id: 'QTM-2026-0003',
            quote_number: 'Báo giá QTM-003',
            customer_name: 'Hoàng Văn D',
            customer_phone: '090123456791',
            vehicle_model: 'MOD/2026/005',
            base_price: 965000000,
            discount: 0,
            net_price: 965000000,
            total_price: 965000000,
            deposit: 482500000,
            status: 'APPROVED',
            created_at: '2024-01-01T00:00:00',
            updated_at: '2024-01-01T00:00:00'
        }
    ];

    for (const quotation of quotations) {
        await prisma.quotation.create({ data: quotation });
    }

    console.log(`  ✅ Created ${quotations.length} quotations`);

    // Insurance Contracts
    const contracts = [
        {
            id: 'CTR-2026-0001',
            contract_number: 'HĐBH-2026-001',
            customer_name: 'Trần Văn A',
            customer_phone: '090123456789',
            vehicle_model: 'MOD/2026/001',
            start_date: '2024-01-01',
            end_date: '2024-12-31',
            base_premium: 45000000',
            premium: 52250000,
            premium_frequency: 'ANNUAL',
            total_premium: 52250000,
            status: 'ACTIVE',
            created_at: '2024-01-01T00:00:00',
            updated_at: '2024-01-01T00:00:00'
        },
        {
            id: 'CTR-2026-0002',
            contract_number: 'HĐBH-2026-002',
            customer_name: 'Hoàng Văn D',
            customer_phone: '090123456791',
            vehicle_model: 'MOD/2026/005',
            start_date: '2024-02-01',
            end_date: '2024-04-30',
            base_premium: 51500000,
            premium_frequency: 'MONTHLY',
            total_premium: 61800000,
            status: 'ACTIVE',
            created_at: '2024-02-01T00:00:00',
            updated_at: '2024-02-01T00:00:00'
        }
    ];

    for (const contract of contracts) {
        await prisma.insuranceContract.create({ data: contract });
    }

    console.log(`  ✅ Created ${contracts.length} contracts`);

    console.log('📊 Business data seeded!');
}

async function seedSupportingData() {
    console.log('📁 Seeding Supporting Data...');

    // Employees
    const employees = [
        {
            employee_code: 'NV001',
            full_name: 'Nguyễn Văn A',
            email: 'nguyena@example.com',
            phone: '090123456789',
            department_id: '1', // Department: HR
            position_id: '2', // Position: IT Staff
            level_id: '1', // Level: Junior
            status: 'ACTIVE',
            hire_date: '2024-01-01',
            salary: 15000000,
            created_at: '2024-01-01T00:00:00',
            updated_at: '2024-01-01T00:00:00'
        },
        {
            employee_code: 'NV002',
            full_name: 'Trần Thị B',
            email: 'tranthib@example.com',
            phone: '090123456788',
            department_id: '1',
            position_id: '3', // Position: Sales
            level_id: '2', // Level: Mid
            status: 'ACTIVE',
            hire_date: '2024-01-01',
            salary: 20000000,
            created_at: '2024-01-01T00:00:00',
            updated_at: '2024-01-01T00:00:00'
        },
        {
            employee_code: 'NV003',
            full_name: 'Lê Minh C',
            email: 'leminhc@example.com',
            phone: '090123456788',
            department_id: '2', // Department: Service
            position_id: '4', // Position: Technician
            level_id: '1', // Level: Junior
            status: 'ACTIVE',
            hire_date: '2024-01-01',
            salary: 18000000,
            created_at: '2024-01-01T00:00:00',
            updated_at: '2024-01-01T00:00:00'
        }
    ];

    for (const employee of employees) {
        await prisma.employee.create({ data: employee });
    }

    console.log(`  ✅ Created ${employees.length} employees`);
    console.log('✅ Supporting data seeded!');
    console.log('✅ Seed script completed successfully!');
}

main();
