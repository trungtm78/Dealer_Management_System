const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const payload = {
    name: "Trần Thị B",
    type: "INDIVIDUAL",
    phone: "0912345678",
    email: "tranthib@gmail.com",
    street: "123 Nguyễn Huệ, Q1, HCMC"
  };

  try {
    const customer = await prisma.customer.create({
      data: {
        name: payload.name,
        type: payload.type,
        phone: payload.phone,
        email: payload.email,
        street: payload.street,
        status: 'ACTIVE',
        tier: 'BRONZE',
        points: 0,
        total_points: 0
      }
    });

    console.log('Result: PASS');
    console.log('Created Customer:', JSON.stringify(customer, null, 2));
  } catch (error) {
    console.log('Result: FAIL');
    console.error(error);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
