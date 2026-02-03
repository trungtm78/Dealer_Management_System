
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();
const logFile = 'diagnosis_log.txt';

function log(msg: string) {
    console.log(msg);
    fs.appendFileSync(logFile, msg + '\n');
}

async function diagnose() {
    fs.writeFileSync(logFile, "=== LOGIN DIAGNOSIS START ===\n");

    try {
        const url = process.env.DATABASE_URL || 'UNDEFINED';
        log(`ENV DATABASE_URL: ${url.replace(/:[^:]*@/, ':****@')}`); // Mask password

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
            log(`   Password Hash (First 10 chars): ${admin.password.substring(0, 10)}...`);
        } else {
            log("❌ ADMIN USER NOT FOUND!");
            log("   This is likely the cause. The seeding step might have failed or not run on HD_SYS.");
        }

        log("4. Sample Users (Limit 5):");
        const users = await prisma.user.findMany({ take: 5 });
        users.forEach(u => log(`   - ${u.email} (${u.role})`));

    } catch (e: any) {
        log("❌ CRITICAL ERROR:");
        log(e.message);
        log(e.stack);
    } finally {
        await prisma.$disconnect();
        log("=== END ===");
    }
}

diagnose();
