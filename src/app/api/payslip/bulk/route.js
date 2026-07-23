import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const data = await request.json();
    const { month, payslips } = data; // payslips is an array of objects

    if (!month || !payslips || !Array.isArray(payslips)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Hapus semua payslip untuk bulan tersebut agar mengulang dari 1
    await prisma.payslip.deleteMany({
      where: { month: month }
    });

    // 2. Generate slip baru secara berurutan
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');

    const createdPayslips = [];
    
    // Sort employees implicitly by their order in the array (which is mapped from UI)
    let seqNumber = 1;
    for (const slipData of payslips) {
      const seq = String(seqNumber).padStart(3, '0');
      const slipCode = `SLP/${yyyy}/${mm}/${seq}`;

      const created = await prisma.payslip.create({
        data: {
          employeeId: slipData.employeeId,
          month: month,
          gross: slipData.gross,
          deduction: slipData.deduction,
          net: slipData.net,
          status: 'Dibayar',
          slipCode: slipCode,
        },
        include: { employee: true }
      });

      createdPayslips.push(created);
      seqNumber++;
    }

    return NextResponse.json({ success: true, count: createdPayslips.length, payslips: createdPayslips }, { status: 201 });
  } catch (error) {
    console.error('Error creating bulk payslips:', error);
    return NextResponse.json({ error: 'Failed to create payslips' }, { status: 500 });
  }
}
