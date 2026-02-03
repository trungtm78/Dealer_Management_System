const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Simulate API Call logic from createLead action
  const payload = {
    name: "Nguyễn Văn A",
    phone: "0909999999",
    email: "nguyenvana@gmail.com",
    source: "FACEBOOK",
    model_interest: "CR-V",
    budget: "1200000000"
  };

  try {
    const lead = await prisma.lead.create({
      data: {
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        source: payload.source,
        model_interest: payload.model_interest,
        budget: parseFloat(payload.budget),
        status: 'NEW',
        score: 50
      }
    });

    console.log('Result: PASS');
    console.log('Created Lead:', JSON.stringify(lead, null, 2));
  } catch (error) {
    console.log('Result: FAIL');
    console.error(error);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
