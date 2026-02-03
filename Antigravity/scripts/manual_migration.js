const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Manually creating system_settings table via raw query...');
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS system_settings (
        id TEXT PRIMARY KEY,
        "key" TEXT UNIQUE NOT NULL,
        value TEXT NOT NULL,
        data_type TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        is_public BOOLEAN DEFAULT 0,
        updated_by TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (updated_by) REFERENCES User(id)
      )
    `);
    console.log('Success!');
  } catch (e) {
    console.error('Failed:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
