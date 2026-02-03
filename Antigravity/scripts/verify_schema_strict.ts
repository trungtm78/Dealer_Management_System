
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("=== SCHEMA VERIFICATION START ===");
    try {
        console.log("1. Attempting to create Customer with 'type' field...");
        const customer = await prisma.customer.create({
            data: {
                name: "Schema Type Check",
                phone: "0000111222",
                type: 'INDIVIDUAL', // This is the field causing the error
                email: "schema_check@example.com"
            }
        });
        console.log("✅ SUCCESS: Customer created. Column 'type' EXISTS.");

        await prisma.customer.delete({ where: { id: customer.id } });
        console.log("=== SCHEMA VERIFICATION PASSED ===");
        process.exit(0);

    } catch (e: any) {
        console.error("❌ FAILURE: Schema mismatch detected.");
        console.error(e.message);
        if (e.message.includes("type")) {
            console.log("DIAGNOSIS: The 'type' column is definitely missing.");
        }
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
