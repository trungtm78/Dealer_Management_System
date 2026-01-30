const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding Database HD_CH_SYS...\n')

    // 0. Cleanup - Skip for fresh installation
    console.log('Skipping cleanup for fresh installation...')

    // Hash password securely
    const hashedPassword = await bcrypt.hash('admin123', 10)

    // 1. Create Users
    console.log('Creating users...')
    const admin = await prisma.user.upsert({
        where: { email: 'admin@honda.com.vn' },
        update: {},
        create: {
            id: 'usr-admin',
            email: 'admin@honda.com.vn',
            password_hash: hashedPassword,
            name: 'Admin User',
            role: 'ADMIN',
            status: 'ACTIVE'
        }
    })

    const sale = await prisma.user.upsert({
        where: { email: 'sale@honda.com.vn' },
        update: {},
        create: {
            id: 'usr-sale',
            email: 'sale@honda.com.vn',
            password_hash: hashedPassword,
            name: 'Sales User',
            role: 'SALES',
            status: 'ACTIVE'
        }
    })
    console.log('✅ Users created\n')

    // 2. Create Leads
    console.log('Creating leads...')
    await prisma.lead.createMany({
        data: [
            {
                name: 'Trần Văn A',
                phone: '0901234567',
                email: 'trana@example.com',
                source: 'FACEBOOK',
                status: 'NEW',
                score: 85,
                model_interest: 'Honda City',
                budget: 600000000,
                assigned_to_id: 'usr-sale'
            },
            {
                name: 'Nguyễn Thị B',
                phone: '0912345678',
                email: 'nguyenb@example.com',
                source: 'HOTLINE',
                status: 'QUALIFIED',
                score: 92,
                model_interest: 'Honda CR-V',
                budget: 1200000000,
                assigned_to_id: 'usr-sale'
            }
        ]
    })
    console.log('✅ Leads created\n')

    // 3. Create Customers
    console.log('Creating customers...')
    await prisma.customer.createMany({
        data: [
            {
                id: 'cus-001',
                name: 'Phạm Thị D',
                phone: '0988776655',
                email: 'phamd@example.com',
                type: 'INDIVIDUAL',
                tier: 'PLATINUM',
                points: 15000,
                total_points: 15000,
                tags: JSON.stringify(['VIP', 'Loyal']),
                street: '123 Nguyễn Huệ',
                district: 'Quận 1',
                city: 'TP.HCM'
            }
        ]
    })
    console.log('✅ Customers created\n')

    // 4. Create Marketing Campaigns
    console.log('Creating marketing campaigns...')
    await prisma.marketingCampaign.createMany({
        data: [
            {
                name: 'Khuyến Mãi Tết 2026',
                type: 'SMS',
                status: 'ACTIVE',
                start_date: new Date('2026-01-01'),
                end_date: new Date('2026-02-15'),
                budget: 50000000,
                sent_count: 1500,
                created_by_id: 'usr-admin',
                description: 'Chiến dịch khuyến mãi dịp Tết Nguyên Đán 2026'
            }
        ]
    })
    console.log('✅ Marketing campaigns created\n')

    console.log('🎉 Seeding finished successfully!')
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
