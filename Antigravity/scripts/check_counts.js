const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const leadCounts = await prisma.lead.groupBy({
    by: ['status'],
    _count: { _all: true }
  });
  const customerCounts = await prisma.customer.groupBy({
    by: ['status'],
    _count: { _all: true }
  });
  const contractCounts = await prisma.contract.groupBy({
    by: ['status'],
    _count: { _all: true }
  });

  console.log('Lead Counts:', JSON.stringify(leadCounts, null, 2));
  console.log('Customer Counts:', JSON.stringify(customerCounts, null, 2));
  console.log('Contract Counts:', JSON.stringify(contractCounts, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
