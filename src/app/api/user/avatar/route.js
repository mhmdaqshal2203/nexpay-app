import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { userId, role, avatar } = await request.json();

    if (!userId || !role || !avatar) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (role === 'Admin HR') {
      await prisma.admin.update({
        where: { id: userId },
        data: { avatar }
      });
    } else {
      await prisma.karyawan.update({
        where: { id: userId },
        data: { avatar }
      });
    }

    return NextResponse.json({ success: true, message: 'Avatar updated successfully' });
  } catch (error) {
    console.error('Avatar update error:', error);
    return NextResponse.json({ error: `DB Error: ${error.message}` }, { status: 500 });
  }
}
