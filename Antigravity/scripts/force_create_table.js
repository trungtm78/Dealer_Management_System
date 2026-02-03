
const { Client } = require('pg');

// Parse DATABASE_URL from .env manually or use hardcoded for testing if env parsing fails
// Format: postgresql://USER:PASSWORD@HOST:PORT/DB?schema=SCHEMA
const connectionString = "postgresql://hdch:68%40Love2love68@localhost:5432/HD_CH_SYS?schema=public";

const client = new Client({
    connectionString: connectionString,
});

async function main() {
    try {
        console.log("Connecting to database...");
        await client.connect();
        console.log("Connected successfully!");

        console.log("Checking if LeadHistory table exists...");
        const checkRes = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE  table_schema = 'public'
        AND    table_name   = 'LeadHistory'
      );
    `);

        const exists = checkRes.rows[0].exists;
        console.log(`Table exists: ${exists}`);

        if (!exists) {
            console.log("Table does not exist. creating it now...");
            const createTableQuery = `
            CREATE TABLE "LeadHistory" (
                "id" TEXT NOT NULL,
                "leadId" TEXT NOT NULL,
                "changedById" TEXT NOT NULL,
                "field" TEXT NOT NULL,
                "oldValue" TEXT,
                "newValue" TEXT,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

                CONSTRAINT "LeadHistory_pkey" PRIMARY KEY ("id")
            );

            CREATE INDEX "LeadHistory_leadId_idx" ON "LeadHistory"("leadId");
            CREATE INDEX "LeadHistory_createdAt_idx" ON "LeadHistory"("createdAt");

            ALTER TABLE "LeadHistory" ADD CONSTRAINT "LeadHistory_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
            ALTER TABLE "LeadHistory" ADD CONSTRAINT "LeadHistory_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
        `;
            await client.query(createTableQuery);
            console.log("Table created successfully!");
        } else {
            console.log("Table already exists, skipping creation.");
        }

    } catch (err) {
        console.error("Database connection error:", err);
    } finally {
        await client.end();
        console.log("Disconnected.");
    }
}

main();
