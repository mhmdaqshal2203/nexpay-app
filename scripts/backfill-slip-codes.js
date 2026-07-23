// Script to backfill slipCode for existing payslips
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function backfillSlipCodes() {
  // Get all payslips without a slipCode
  const payslips = await prisma.payslip.findMany({
    where: { slipCode: null },
    orderBy: { createdAt: 'asc' }
  });

  console.log(`Found ${payslips.length} payslips without slipCode`);

  // Group by year/month to assign sequential numbers
  const grouped = {};
  for (const slip of payslips) {
    const d = new Date(slip.createdAt);
    const key = `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(slip);
  }

  let updated = 0;
  for (const [key, slips] of Object.entries(grouped)) {
    for (let i = 0; i < slips.length; i++) {
      const seq = String(i + 1).padStart(3, '0');
      const slipCode = `SLP/${key}/${seq}`;
      await prisma.payslip.update({
        where: { id: slips[i].id },
        data: { slipCode }
      });
      console.log(`Updated ${slips[i].id} -> ${slipCode}`);
      updated++;
    }
  }

  console.log(`\nDone! Updated ${updated} payslips.`);
  await prisma.$disconnect();
}

backfillSlipCodes().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
