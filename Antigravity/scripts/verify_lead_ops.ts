
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    console.log("Starting Lead Creation Verification...")
    try {
        const phone = "0999888777";

        // Cleanup if exists
        const existing = await prisma.lead.findFirst({ where: { phone } });
        if (existing) {
            await prisma.lead.delete({ where: { id: existing.id } });
        }

        const lead = await prisma.lead.create({
            data: {
                name: "Test Lead Verification",
                phone: phone,
                source: "WALK_IN",
                status: "NEW",
                score: 10,
                // New fields verification
                color: "Red",
                paymentMethod: "Cash",
                timeframe: "1_month",
                tradeInCar: "Old Honda City",
                isTestDrive: true,
                testDriveDate: new Date()
            }
        })
        console.log("SUCCESS: Successfully created lead with new fields. ID:", lead.id)
        console.log("Lead Data:", JSON.stringify(lead, null, 2))

        // Clean up
        await prisma.lead.delete({ where: { id: lead.id } })
        console.log("SUCCESS: Successfully cleaned up test lead")
        process.exit(0)
    } catch (e) {
        console.error("FAILURE: Failed to create lead:", e)
        process.exit(1)
    }
}

main()
