
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugUser() {
    console.log("=== DEBUG USER QUERY ===");
    try {
        const testEmail = "admin@honda.com.vn"; // Assuming this is a valid user from seed
        console.log(`Querying for: ${testEmail}`);

        const user = await prisma.user.findUnique({
            where: { email: testEmail }
        });

        if (user) {
            console.log("✅ User found:", user.name, user.role);
        } else {
            console.log("⚠️ User NOT found (Query valid, but no data?)");
        }

        // Check if table is empty
        const count = await prisma.user.count();
        console.log(`Total Users in DB: ${count}`);

    } catch (e: any) {
        console.error("❌ QUERY FAILED:", e.message);
    } finally {
        await prisma.$disconnect();
    }
}

debugUser();
