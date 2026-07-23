import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');

    let leaves;
    if (employeeId) {
      leaves = await prisma.leave.findMany({
        where: { employeeId },
        orderBy: { createdAt: 'desc' },
        include: { employee: true }
      });
    } else {
      leaves = await prisma.leave.findMany({
        orderBy: { createdAt: 'desc' },
        include: { employee: true }
      });
    }
    return NextResponse.json(leaves, { status: 200 });
  } catch (error) {
    console.error('Error fetching leaves:', error);
    return NextResponse.json({ error: 'Failed to fetch leaves' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { employeeId, type, startDate, endDate, reason } = data;

    if (!employeeId || !type || !startDate || !endDate || !reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const leave = await prisma.leave.create({
      data: {
        employeeId,
        type,
        startDate,
        endDate,
        reason,
        status: 'Menunggu'
      },
      include: { employee: true }
    });

    return NextResponse.json(leave, { status: 201 });
  } catch (error) {
    console.error('Error creating leave:', error);
    return NextResponse.json({ error: 'Failed to create leave' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const { id, status } = data;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updatedLeave = await prisma.leave.update({
      where: { id },
      data: { status },
      include: { employee: true }
    });

    return NextResponse.json(updatedLeave, { status: 200 });
  } catch (error) {
    console.error('Error updating leave status:', error);
    return NextResponse.json({ error: 'Failed to update leave' }, { status: 500 });
  }
}
