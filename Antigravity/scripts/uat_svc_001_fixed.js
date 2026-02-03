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
    ro_number: "RO-2026-0001-UAT-FIXED",
    customer_id: customer.id,
    vehicle_info: JSON.stringify({
      model: "CR-V",
      license_plate: "51A-12345",
      current_km: 15000
    }),
    advisor_id: user.id,
    status: 'PENDING'
  };

  try {
    const ro = await prisma.repairOrder.create({
      data: payload
    });

    console.log('Result: PASS');
    console.log('Created Repair Order:', JSON.stringify(ro, null, 2));
  } catch (error) {
    console.log('Result: FAIL');
    console.error(error);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
