// Script to re-number slipCodes so newest slip = 001 (top of table)
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function reorderSlipCodes() {
  // Get all payslips ordered newest first (as shown in the table)
  const payslips = await prisma.payslip.findMany({
    orderBy: { createdAt: 'desc' }
  });

  console.log(`Re-numbering ${payslips.length} payslips (newest = 001)...`);

  // Group by year/month
  const grouped = {};
  for (const slip of payslips) {
    const d = new Date(slip.createdAt);
    const key = `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(slip);
  }

  let updated = 0;
  for (const [key, slips] of Object.entries(grouped)) {
    // slips are already in desc order (newest first), assign 001 to first
    for (let i = 0; i < slips.length; i++) {
      const seq = String(i + 1).padStart(3, '0');
      const slipCode = `SLP/${key}/${seq}`;
      await prisma.payslip.update({
        where: { id: slips[i].id },
        data: { slipCode }
      });
      console.log(`${slips[i].id} -> ${slipCode}`);
      updated++;
    }
  }

  console.log(`\nDone! Re-numbered ${updated} payslips.`);
  await prisma.$disconnect();
}

reorderSlipCodes().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
