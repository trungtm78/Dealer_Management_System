const { PrismaClient } = require('@prisma/client');

async function resetDatabase() {
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: process.env.DATABASE_URL
            }
        }
    });

    try {
        console.log('========================================');
        console.log('  Resetting Database HD_SYS');
        console.log('========================================\n');

        console.log('Dropping all tables...\n');

        // Drop all tables using raw SQL
        await prisma.$executeRawUnsafe(`
            DO $$ 
            DECLARE
                r RECORD;
            BEGIN
                -- Drop all tables
                FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
                    EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
                END LOOP;
                
                -- Drop all sequences
                FOR r IN (SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = 'public') LOOP
                    EXECUTE 'DROP SEQUENCE IF EXISTS public.' || quote_ident(r.sequence_name) || ' CASCADE';
                END LOOP;
                
                -- Drop all views
                FOR r IN (SELECT table_name FROM information_schema.views WHERE table_schema = 'public') LOOP
                    EXECUTE 'DROP VIEW IF EXISTS public.' || quote_ident(r.table_name) || ' CASCADE';
                END LOOP;
            END $$;
        `);

        console.log('[SUCCESS] All tables dropped!\n');
        console.log('Database is now clean and ready for Honda SPICE schema.\n');
        console.log('Next steps:');
        console.log('1. Run: npx prisma db push --accept-data-loss');
        console.log('2. Run: npx prisma generate');
        console.log('3. Run: npx prisma db seed');
        console.log('\nOr simply run: QUICK_START.bat\n');

    } catch (error) {
        console.error('[ERROR] Failed to reset database:', error.message);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

resetDatabase();
