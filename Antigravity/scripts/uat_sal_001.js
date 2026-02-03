const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const customer = await prisma.customer.findFirst();
  const user = await prisma.user.findFirst();

  if (!customer || !user) {
    console.log('Result: FAIL (Precondition not met: No customer or user)');
    return;
  }

  const payload = {
    quote_number: "QT-2026-0001-UAT",
    customer_id: customer.id,
    customer_name: customer.name,
    customer_phone: customer.phone,
    model: "CR-V",
    version: "L",
    color: "White Pearl",
    base_price: 1029000000,
    total_price: 1034000000, // 1,029,000,000 + 5,000,000
    status: 'DRAFT',
    created_by_id: user.id
  };

  try {
    const quotation = await prisma.quotation.create({
      data: payload
    });

    console.log('Result: PASS');
    console.log('Created Quotation:', JSON.stringify(quotation, null, 2));
  } catch (error) {
    console.log('Result: FAIL');
    console.error(error);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
