
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Checking for LeadHistory table...");
        // Attempt to count records. This will throw if table doesn't exist.
        const count = await prisma.leadHistory.count();
        console.log(`Success! LeadHistory table found. Record count: ${count}`);
    } catch (error) {
        console.error("Error accessing LeadHistory table:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
