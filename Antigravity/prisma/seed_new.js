const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding Database HD_CH_SYS...\n')

    // Hash password securely
    const hashedPassword = await bcrypt.hash('admin123', 10)

    // 0.5. Create Roles (Issue #002 Fix - Need roles for FK validation)
    console.log('Creating roles...')
    const adminRole = await prisma.role.upsert({
        where: { name: 'ADMIN' },
        update: {},
        create: {
            name: 'ADMIN',
            description: 'System Administrator'
        }
    })

    const salesRole = await prisma.role.upsert({
        where: { name: 'SALES' },
        update: {},
        create: {
            name: 'SALES',
            description: 'Sales Staff'
        }
    })

    const serviceRole = await prisma.role.upsert({
        where: { name: 'SERVICE' },
        update: {},
        create: {
            name: 'SERVICE',
            description: 'Service Staff'
        }
    })

    const financeRole = await prisma.role.upsert({
        where: { name: 'FINANCE' },
        update: {},
        create: {
            name: 'FINANCE',
            description: 'Finance Staff'
        }
    })
    console.log('✅ Roles created\n')

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
            role_id: adminRole.id,
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
            role_id: salesRole.id,
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
