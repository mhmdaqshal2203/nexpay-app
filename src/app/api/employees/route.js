import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { createdAt: 'asc' }
    });
    return NextResponse.json(employees);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validate
    if (!data.name || !data.position || data.salary === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Determine ID (e.g. EMP-001)
    const count = await prisma.employee.count();
    const newId = `EMP-${String(count + 1).padStart(3, '0')}`;
    
    // Default avatar
    const randomAvatarId = Math.floor(Math.random() * 70) + 1;
    const avatar = data.avatar || `https://i.pravatar.cc/150?img=${randomAvatarId}`;

    const newEmployee = await prisma.employee.create({
      data: {
        id: newId,
        name: data.name,
        position: data.position,
        salary: parseFloat(data.salary),
        avatar: avatar,
        status: data.status || 'Aktif'
      }
    });

    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 });
  }
}
