const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing data to avoid conflicts
  await prisma.lead.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.quotation.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const user = await prisma.user.create({
    data: {
      email: 'sales_mgr@honda.com',
      password_hash: 'hashed_password',
      name: 'Sales Manager',
      role: 'MANAGER',
      status: 'ACTIVE'
    }
  });

  // Create Customers
  for (let i = 0; i < 3; i++) {
    await prisma.customer.create({
      data: {
        name: `Active Customer ${i+1}`,
        type: 'INDIVIDUAL',
        phone: `098765432${i}`,
        status: 'ACTIVE',
        tier: 'BRONZE'
      }
    });
  }
  for (let i = 0; i < 2; i++) {
    await prisma.customer.create({
      data: {
        name: `Inactive Customer ${i+1}`,
        type: 'INDIVIDUAL',
        phone: `098765433${i}`,
        status: 'INACTIVE',
        tier: 'BRONZE'
      }
    });
  }

  const customers = await prisma.customer.findMany();

  // Create Leads
  const leadStatuses = ['NEW', 'NEW', 'NEW', 'NEW', 'NEW', 'QUALIFIED', 'QUALIFIED', 'QUALIFIED', 'WON', 'WON'];
  for (let i = 0; i < leadStatuses.length; i++) {
    await prisma.lead.create({
      data: {
        name: `Lead ${i+1}`,
        phone: `090123456${i}`,
        source: 'FACEBOOK',
        status: leadStatuses[i],
        score: 50,
        assigned_to_id: user.id,
        customer_id: leadStatuses[i] === 'WON' ? customers[i % 5].id : null
      }
    });
  }

  // Create Quotations (needed for contracts)
  for (let i = 0; i < 3; i++) {
    await prisma.quotation.create({
      data: {
        quote_number: `QT-2026-000${i+1}`,
        customer_id: customers[i].id,
        customer_name: customers[i].name,
        customer_phone: customers[i].phone,
        model: 'CR-V',
        version: 'L',
        color: 'White',
        base_price: 1000000000,
        total_price: 1000000000,
        status: 'APPROVED',
        created_by_id: user.id
      }
    });
  }

  const quotations = await prisma.quotation.findMany();

  // Create Contracts
  const contractStatuses = ['ACTIVE', 'ACTIVE', 'COMPLETED'];
  for (let i = 0; i < 3; i++) {
    await prisma.contract.create({
      data: {
        contract_number: `CT-2026-000${i+1}`,
        quotation_id: quotations[i].id,
        customer_id: customers[i].id,
        total_amount: 1000000000,
        deposit_amount: 50000000,
        remaining_amount: 950000000,
        contract_date: new Date(),
        status: contractStatuses[i],
        created_by_id: user.id
      }
    });
  }

  console.log('Seeding completed.');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
