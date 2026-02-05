import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding admin user...');

    // Check if admin exists
    const existingAdmin = await prisma.user.findUnique({
        where: { email: 'admin@honda.com.vn' }
    });

    if (existingAdmin) {
        console.log('✅ Admin user already exists');
        return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user
    const admin = await prisma.user.create({
        data: {
            email: 'admin@honda.com.vn',
            name: 'Administrator',
            password_hash: hashedPassword,
            role: 'ADMIN',
            status: 'ACTIVE'
        }
    });

    console.log('✅ Admin user created:', admin.email);
    console.log('📧 Email: admin@honda.com.vn');
    console.log('🔑 Password: admin123');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding admin:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
