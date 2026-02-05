const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Creating admin user...');

    try {
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

        console.log('✅ Admin user created successfully!');
        console.log('📧 Email: admin@honda.com.vn');
        console.log('🔑 Password: admin123');
    } catch (error) {
        console.error('❌ Error:', error.message);
        throw error;
    }
}

main()
    .then(() => {
        console.log('\n✨ Done! You can now login.');
        process.exit(0);
    })
    .catch((e) => {
        console.error('\n❌ Fatal error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
