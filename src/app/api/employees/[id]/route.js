import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    // Check if employee exists
    const existing = await prisma.employee.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    try {
      const updatedEmployee = await prisma.employee.update({
        where: { id },
        data: {
          name: data.name !== undefined ? data.name : undefined,
          position: data.position !== undefined ? data.position : undefined,
          salary: data.salary !== undefined ? parseFloat(data.salary) : undefined,
          status: data.status !== undefined ? data.status : undefined,
        }
      });

      // If name changed, update the associated Karyawan's username (email)
      if (data.name) {
      const newEmail = `${data.name.toLowerCase().replace(/\s+/g, '.')}@nexpay.id`;
      try {
        const associatedKaryawan = await prisma.karyawan.findUnique({ where: { employeeId: id } });
        if (associatedKaryawan && associatedKaryawan.username !== newEmail) {
          await prisma.karyawan.update({
            where: { employeeId: id },
            data: { username: newEmail }
          });
        }
      } catch (e) {
        console.error('Failed to update Karyawan username', e);
      }
    }

      return NextResponse.json(updatedEmployee);
    } catch (dbError) {
      console.error('Database update failed:', dbError);
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    // Check if employee exists
    const existing = await prisma.employee.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    await prisma.employee.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 });
  }
}
