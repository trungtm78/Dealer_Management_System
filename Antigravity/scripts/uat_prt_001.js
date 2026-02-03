const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const parts = await prisma.part.findMany({
      take: 50
    });

    console.log('Result: PASS');
    console.log('Parts count:', parts.length);
    if (parts.length > 0) {
      console.log('Sample Part:', JSON.stringify(parts[0], null, 2));
    }
  } catch (error) {
    console.log('Result: FAIL');
    console.error(error);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
