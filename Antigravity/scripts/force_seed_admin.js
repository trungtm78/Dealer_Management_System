
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Force Seeding Admin...');
    const adminEmail = 'admin@honda.com.vn';

    try {
        const admin = await prisma.user.upsert({
            where: { email: adminEmail },
            update: {
                password: 'admin123',
                role: 'ADMIN',
                fullName: 'Admin User'
            },
            create: {
                email: adminEmail,
                password: 'admin123',
                role: 'ADMIN',
                fullName: 'Admin User'
            }
        });
        console.log('✅ Admin User ensured:', admin);
    } catch (e) {
        console.error('❌ Error seeding:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
