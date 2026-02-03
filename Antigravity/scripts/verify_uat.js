
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const action = process.argv[2];
    const email = process.argv[3];

    if (action === 'check-user') {
        const user = await prisma.user.findUnique({ where: { email } });
        console.log(JSON.stringify(user, null, 2));
    }
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
