const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const lead = await prisma.lead.findFirst({
    where: { status: 'QUALIFIED' }
  });

  if (!lead) {
    console.log('Result: FAIL (Precondition not met: No QUALIFIED lead)');
    return;
  }

  console.log('Lead to convert:', lead.id);

  try {
    // Transaction logic from convertLeadToCustomer action
    const result = await prisma.$transaction(async (tx) => {
      const newCustomer = await tx.customer.create({
        data: {
          name: lead.name,
          phone: lead.phone,
          email: lead.email,
          type: 'INDIVIDUAL',
          tier: 'BRONZE',
          points: 0,
          total_points: 0,
          status: 'ACTIVE'
        }
      });

      await tx.lead.update({
        where: { id: lead.id },
        data: {
          status: 'WON',
          customer_id: newCustomer.id
        }
      });

      return newCustomer;
    });

    console.log('Result: PASS');
    console.log('New Customer:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.log('Result: FAIL');
    console.error(error);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
