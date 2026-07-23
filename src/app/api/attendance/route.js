import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');

    let attendances;
    if (employeeId) {
      attendances = await prisma.attendance.findMany({
        where: { employeeId },
        orderBy: { createdAt: 'desc' },
        include: { employee: true }
      });
    } else {
      attendances = await prisma.attendance.findMany({
        orderBy: { createdAt: 'desc' },
        include: { employee: true }
      });
    }
    return NextResponse.json(attendances, { status: 200 });
  } catch (error) {
    console.error('Error fetching attendances:', error);
    return NextResponse.json({ error: 'Failed to fetch attendances' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { employeeId, date, time, status } = data;

    if (!employeeId || !date || !time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existing = await prisma.attendance.findFirst({
      where: {
        employeeId,
        date
      }
    });

    let attendance;
    if (existing) {
      attendance = await prisma.attendance.update({
        where: { id: existing.id },
        data: {
          time,
          status: status || 'Hadir',
          checkOut: null
        },
        include: { employee: true }
      });
    } else {
      attendance = await prisma.attendance.create({
        data: {
          employeeId,
          date,
          time,
          status: status || 'Hadir'
        },
        include: { employee: true }
      });
    }

    return NextResponse.json(attendance, { status: 201 });
  } catch (error) {
    console.error('Error creating attendance:', error);
    return NextResponse.json({ error: 'Failed to create attendance' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const { employeeId, date, checkOut } = data;

    if (!employeeId || !date || !checkOut) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find the attendance record for this employee on this date
    const attendance = await prisma.attendance.findFirst({
      where: {
        employeeId,
        date
      }
    });

    if (!attendance) {
      return NextResponse.json({ error: 'Attendance record not found for today' }, { status: 404 });
    }

    const updatedAttendance = await prisma.attendance.update({
      where: { id: attendance.id },
      data: { checkOut },
      include: { employee: true }
    });

    return NextResponse.json(updatedAttendance, { status: 200 });
  } catch (error) {
    console.error('Error updating checkout:', error);
    return NextResponse.json({ error: 'Failed to update checkout' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const attendance = await prisma.attendance.findUnique({ where: { id } });
      if (!attendance) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      
      const updated = await prisma.attendance.update({
        where: { id },
        data: { date: attendance.date + ' (Reset)' },
        include: { employee: true }
      });
      return NextResponse.json({ message: 'Data absensi karyawan berhasil direset', data: updated }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'ID tidak ditemukan' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error resetting attendance:', error);
    return NextResponse.json({ error: 'Failed to reset attendance' }, { status: 500 });
  }
}
