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

    // 2. Siapkan data untuk insert massal
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');

    const payslipsToInsert = payslips.map((slipData, index) => {
      const seq = String(index + 1).padStart(3, '0');
      const slipCode = `SLP/${yyyy}/${mm}/${seq}`;

      return {
        employeeId: slipData.employeeId,
        month: month,
        gross: slipData.gross,
        deduction: slipData.deduction,
        net: slipData.net,
        status: 'Dibayar',
        slipCode: slipCode,
      };
    });

    // 3. Insert sekaligus untuk menghindari timeout
    const created = await prisma.payslip.createMany({
      data: payslipsToInsert,
      skipDuplicates: true,
    });

    return NextResponse.json({ success: true, count: created.count }, { status: 201 });
  } catch (error) {
    console.error('Error creating bulk payslips:', error);
    return NextResponse.json({ error: 'Failed to create payslips' }, { status: 500 });
  }
}
