const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Membaca file dataset.csv...');
  const data = fs.readFileSync('dataset.csv', 'utf8');
  const lines = data.trim().split('\n').slice(1); // Lewati header
  
  console.log(`Ditemukan ${lines.length} baris data. Memulai seeding...`);

  // Hapus semua data sebelumnya agar tidak duplikat
  await prisma.karyawan.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.employee.deleteMany();

  let count = 1;
  for (const line of lines) {
    const cols = line.split(',');
    if (cols.length < 5) continue;
    
    // Kolom CSV: Tahun Pengalaman (X1), Skor Kinerja (X2), Gaji (Y), Pendidikan, Departemen
    const experience = parseFloat(cols[0].trim());
    const performanceScore = parseInt(cols[1].trim(), 10);
    const salary = parseFloat(cols[2].trim());
    const education = cols[3].trim();
    const department = cols[4].trim();
    const position = `${department} (${education})`;
    const name = `Karyawan ${count}`;
    const id = `EMP-${String(count).padStart(3, '0')}`;
    const avatar = `https://i.pravatar.cc/150?img=${count % 70 + 1}`;
    
    // Buat data Employee
    await prisma.employee.create({
      data: {
        id,
        name,
        position,
        salary,
        experience,
        performanceScore,
        education,
        department,
        avatar
      }
    });

    // Buat akun login Karyawan (tabel terpisah) dengan format email
    const userEmail = `karyawan.${count}@nexpay.id`;
    await prisma.karyawan.create({
      data: {
        username: userEmail,
        password: 'password',
        avatar: avatar,
        employeeId: id
      }
    });

    console.log(`  ✓ ${name} → ${userEmail}`);
    count++;
  }
  
  // Buat akun Admin (tabel terpisah)
  console.log('\nMembuat akun Admin...');
  await prisma.admin.create({
    data: {
      username: 'admin',
      password: 'admin',
      avatar: 'https://i.pravatar.cc/150?img=68'
    }
  });

  console.log('\n✅ Seeding selesai!');
  console.log(`   📊 ${count - 1} Employee + ${count - 1} akun Karyawan`);
  console.log('   👤 1 akun Admin (admin / admin)');
  console.log('   📧 Login karyawan: karyawan.1@nexpay.id s/d karyawan.30@nexpay.id (password: password)');
}

main()
  .catch(e => {
    console.error('Error saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
