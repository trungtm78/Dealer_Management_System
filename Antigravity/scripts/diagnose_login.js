
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();
const logFile = 'diagnosis_log_js.txt';

function log(msg) {
    console.log(msg);
    fs.appendFileSync(logFile, msg + '\n');
}

async function diagnose() {
    fs.writeFileSync(logFile, "=== LOGIN DIAGNOSIS (JS) START ===\n");

    try {
        const url = process.env.DATABASE_URL || 'UNDEFINED';
        log(`ENV DATABASE_URL: ${url.replace(/:[^:]*@/, ':****@')}`);

        log("1. Connecting to Prisma...");
        await prisma.$connect();
        log("✅ Connected.");

        log("2. Checking User Table Count...");
        const count = await prisma.user.count();
        log(`Total Users: ${count}`);

        log("3. Searching for 'admin@honda.com.vn'...");
        const admin = await prisma.user.findUnique({
            where: { email: 'admin@honda.com.vn' }
        });

        if (admin) {
            log(`✅ FOUND ADMIN: ID=${admin.id}, Role=${admin.role}`);
            log(`   Password: ${admin.password}`);
        } else {
            log("❌ ADMIN USER NOT FOUND!");
        }

    } catch (e) {
        log("❌ CRITICAL ERROR:");
        log(e.message);
        log(e.stack);
    } finally {
        await prisma.$disconnect();
        log("=== END ===");
    }
}

diagnose();
