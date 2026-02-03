
import { PrismaClient } from '@prisma/client';

// Source DB (Docker/Old)
const sourceUrl = "postgresql://postgres:68%40Love2love68@localhost:5433/Honda_ERP?schema=public";
// Dest DB (Local/New)
const destUrl = "postgresql://hdch:68%40Love2love68@localhost:5432/HD_SYS?schema=public";

const source = new PrismaClient({ datasources: { db: { url: sourceUrl } } });
const dest = new PrismaClient({ datasources: { db: { url: destUrl } } });

async function migrate() {
    console.log("🚀 Starting Data Migration...");
    console.log(`Source: Port 5433`);
    console.log(`Dest:   Port 5432 (HD_SYS)`);

    try {
        // 1. Users (Top priority)
        const users = await source.user.findMany();
        console.log(`Found ${users.length} Users.`);
        for (const u of users) {
            await dest.user.upsert({
                where: { id: u.id },
                update: {},
                create: { ...u }
            });
        }
        console.log("✅ Users migrated.");

        // 2. Customers
        const customers = await source.customer.findMany(); // Assuming schema matches mostly
        console.log(`Found ${customers.length} Customers.`);
        for (const c of customers) {
            // Handle schema diffs if 'type' was missing in source
            const dataToCreate: any = { ...c };
            if (!dataToCreate.type) dataToCreate.type = 'INDIVIDUAL';

            await dest.customer.upsert({
                where: { id: c.id },
                update: {},
                create: dataToCreate
            });
        }
        console.log("✅ Customers migrated.");

        // 3. Leads
        const leads = await source.lead.findMany();
        console.log(`Found ${leads.length} Leads.`);
        for (const l of leads) {
            await dest.lead.upsert({
                where: { id: l.id },
                update: {},
                create: { ...l }
            });
        }
        console.log("✅ Leads migrated.");

        // 4. Interactions
        const interactions = await source.interaction.findMany();
        console.log(`Found ${interactions.length} Interactions.`);
        for (const i of interactions) {
            await dest.interaction.upsert({
                where: { id: i.id },
                update: {},
                create: { ...i }
            });
        }
        console.log("✅ Interactions migrated.");

        console.log("🎉 MIGRATION COMPLETE!");

    } catch (e: any) {
        console.error("❌ Migration Failed:", e);
    } finally {
        await source.$disconnect();
        await dest.$disconnect();
    }
}

migrate();
