const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const sqlFile = path.join(process.cwd(), 'prisma/migrations/20260129_add_rbac_tables/migration.sql');
  const sql = fs.readFileSync(sqlFile, 'utf8');
  
  // Split statements by semicolon
  const statements = sql.split(';').map(s => s.trim()).filter(Boolean);
  
  for (const statement of statements) {
    try {
      console.log(`Executing: ${statement}`);
      await prisma.$executeRawUnsafe(statement);
    } catch (error) {
      console.warn(`Statement failed (might already exist): ${error.message}`);
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
