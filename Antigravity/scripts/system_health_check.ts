
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
    console.log("=== SYSTEM HEALTH CHECK ===");
    let hasErrors = false;

    // 1. Check User (Admin)
    try {
        const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
        if (admin) {
            console.log("✅ [User] Admin found:", admin.email);
        } else {
            console.error("❌ [User] No Admin user found! (Seeding required)");
            hasErrors = true;
        }
    } catch (e: any) {
        console.error("❌ [User] Connection failed:", e.message);
        hasErrors = true;
    }

    // 2. Check Customer Schema (createdAt check)
    try {
        const testCustomer = await prisma.customer.create({
            data: {
                name: "Health Check User",
                phone: "00011122299", // High number to avoid collision
                type: 'INDIVIDUAL',
                email: "healthcheck@test.com"
            }
        });

        // Check if createdAt exists (it's auto-generated, so if creation succeeds, it's likely fine, but let's access it)
        if (testCustomer.createdAt) {
            console.log("✅ [Customer] Table schema OK (createdAt exists).");
        } else {
            console.error("❌ [Customer] 'createdAt' is missing!");
            hasErrors = true;
        }

        // Cleanup
        await prisma.customer.delete({ where: { id: testCustomer.id } });

    } catch (e: any) {
        console.error("❌ [Customer] Schema check failed.");
        console.error("Error details:", e.message);
        if (e.message.includes("createdAt")) {
            console.error("👉 DIAGNOSIS: 'createdAt' column is MISSING. Run `npx prisma db push`.");
        }
        hasErrors = true;
    }

    // 3. Check Lead Schema
    try {
        const leadCount = await prisma.lead.count();
        console.log(`✅ [Lead] Table accessible (Count: ${leadCount})`);
    } catch (e: any) {
        console.error("❌ [Lead] Table access failed:", e.message);
        hasErrors = true;
    }

    console.log("===========================");
    if (hasErrors) {
        console.log("⛔ SYSTEM HEALTH: UNSTABLE - Fix errors before UAT.");
        process.exit(1);
    } else {
        console.log("🟢 SYSTEM HEALTH: STABLE - Ready for UAT.");
        process.exit(0);
    }
}

checkDatabase()
    .catch(e => {
        console.error("Critical script error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
