
import projectId from '../lib/prisma'; // or direct import
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Verifying Database Schema...");
    try {
        console.log("1. Checking Customer creation with 'type'...");
        const customer = await prisma.customer.create({
            data: {
                name: "Schema Verify User",
                phone: "0999888777", // Unique phone
                type: 'INDIVIDUAL', // Check if enum/field works
                email: "schema_verify@example.com"
            }
        });
        console.log("SUCCESS: Customer created with ID:", customer.id);

        console.log("2. Cleaning up...");
        await prisma.customer.delete({ where: { id: customer.id } });
        console.log("Cleanup done.");

    } catch (e: any) {
        console.error("FAILURE: Database Schema Verification Failed.");
        console.error(e);
        console.log("ERROR_MESSAGE:", e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
