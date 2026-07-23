import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    // Cek di tabel Admin dulu
    const admin = await prisma.admin.findUnique({
      where: { username }
    });

    if (admin && admin.password === password) {
      const { password: _, ...adminData } = admin;
      return NextResponse.json({ 
        success: true, 
        user: {
          ...adminData,
          role: 'Admin HR',
          avatar: adminData.avatar || 'https://i.pravatar.cc/150?img=68'
        }
      });
    }

    // Kalau bukan admin, cek di tabel Karyawan (include data Employee)
    const karyawan = await prisma.karyawan.findUnique({
      where: { username },
      include: { employee: true }
    });

    if (karyawan && karyawan.password === password) {
      const { password: _, ...karyawanData } = karyawan;
      return NextResponse.json({ 
        success: true, 
        user: {
          ...karyawanData,
          role: 'Karyawan',
          avatar: karyawanData.avatar || 'https://i.pravatar.cc/150?img=1'
        }
      });
    }

    return NextResponse.json({ error: 'Username atau password salah!' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: `DB Error: ${error.message}` }, { status: 500 });
  }
}
