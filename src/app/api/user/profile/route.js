import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { userId, role, name } = await request.json();

    if (!userId || !role || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (role === 'Admin HR') {
      await prisma.admin.update({
        where: { id: userId },
        data: { name }
      });
    } else {
      await prisma.karyawan.update({
        where: { id: userId },
        data: { name }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
