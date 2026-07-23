import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');

    let payslips;
    if (employeeId) {
      payslips = await prisma.payslip.findMany({
        where: { employeeId },
        orderBy: { createdAt: 'desc' },
        include: { employee: true }
      });
    } else {
      payslips = await prisma.payslip.findMany({
        orderBy: { createdAt: 'desc' },
        include: { employee: true }
      });
    }
    return NextResponse.json(payslips, { status: 200 });
  } catch (error) {
    console.error('Error fetching payslips:', error);
    return NextResponse.json({ error: 'Failed to fetch payslips' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { employeeId, month, gross, deduction, net } = data;

    if (!employeeId || !month || gross === undefined || deduction === undefined || net === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate proper slip ID format: SLP/YYYY/MM/NNN
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');

    const startOfMonth = new Date(yyyy, now.getMonth(), 1);
    const endOfMonth = new Date(yyyy, now.getMonth() + 1, 0, 23, 59, 59);
    const countThisMonth = await prisma.payslip.count({
      where: { createdAt: { gte: startOfMonth, lte: endOfMonth } }
    });
    const seq = String(countThisMonth + 1).padStart(3, '0');
    const slipCode = `SLP/${yyyy}/${mm}/${seq}`;

    const payslip = await prisma.payslip.create({
      data: {
        employeeId,
        month,
        gross,
        deduction,
        net,
        status: 'Dibayar',
        slipCode,
      },
      include: { employee: true }
    });

    return NextResponse.json(payslip, { status: 201 });
  } catch (error) {
    console.error('Error creating payslip:', error);
    return NextResponse.json({ error: 'Failed to create payslip' }, { status: 500 });
  }
}
