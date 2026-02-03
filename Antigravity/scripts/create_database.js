const { PrismaClient } = require('@prisma/client');

async function createDatabase() {
    // Connect to postgres database to create HD_CH_SYS
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: 'postgresql://hdch:68@Love2love68@localhost:5432/postgres?schema=public'
            }
        }
    });

    try {
        console.log('Creating database HD_CH_SYS...\n');

        await prisma.$executeRawUnsafe(`CREATE DATABASE "HD_CH_SYS";`);

        console.log('[SUCCESS] Database HD_CH_SYS created!\n');
    } catch (error) {
        if (error.message.includes('already exists')) {
            console.log('[INFO] Database HD_CH_SYS already exists, continuing...\n');
        } else {
            console.error('[ERROR] Failed to create database:', error.message);
            process.exit(1);
        }
    } finally {
        await prisma.$disconnect();
    }
}

createDatabase();
