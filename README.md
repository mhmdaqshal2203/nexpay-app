# Nexus Payroll & Employee Management

Nexus Payroll adalah aplikasi manajemen sumber daya manusia (HRIS) dan penggajian komprehensif berbasis web, yang dirancang khusus untuk mempermudah pengelolaan data karyawan, absensi, cuti, hingga slip gaji secara digital.

Aplikasi ini dibangun menggunakan teknologi modern untuk memberikan performa dan pengalaman pengguna terbaik (UI/UX yang responsif dan interaktif).

## 🚀 Fitur Utama

- **👥 Manajemen Karyawan (Employee Data)**
  - Sistem pencatatan data karyawan lengkap (Nama, Jabatan, Gaji Pokok, dsb).
  - Penomoran ID Karyawan terstruktur (misal: `EMP-001`).
- **📅 Sistem Absensi (Attendance)**
  - Pencatatan Absen Masuk & Keluar secara real-time.
  - Simulasi validasi lokasi & alamat IP.
  - Tampilan rekap absensi untuk HR Admin.
- **✈️ Pengajuan Cuti (Leave Management)**
  - Fitur pengajuan cuti bagi karyawan (Cuti Tahunan, Sakit, dsb).
  - Proses persetujuan (*Approval/Rejection*) oleh HR Admin.
- **💰 Penggajian & Slip Gaji (Payroll)**
  - Kalkulasi gaji otomatis (Gaji Pokok, Tunjangan, Potongan PPh 21, BPJS).
  - *Take Home Pay* (THP) otomatis dihitung.
  - Ekspor/Cetak Slip Gaji ke dalam format PDF yang rapi.
- **🔐 Role-Based Access Control**
  - **Admin HR:** Memiliki akses kelola penuh ke semua data.
  - **Karyawan:** Hanya dapat mengakses data pribadi, melakukan absensi, mengajukan cuti, dan melihat riwayat slip gaji sendiri.

## 🛠️ Teknologi yang Digunakan

- **Frontend / Framework:** [Next.js (App Router)](https://nextjs.org/) & React
- **Styling:** Vanilla CSS dengan sistem desain responsif (Glassmorphism UI)
- **Icons:** [Phosphor Icons](https://phosphoricons.com/)
- **Database / ORM:** [Prisma](https://www.prisma.io/)
- **Database Engine:** PostgreSQL (Supabase / Neon DB)

## 📦 Cara Instalasi & Menjalankan (Local Development)

Ikuti langkah-langkah berikut untuk menjalankan project ini di komputer Anda:

1. **Clone repository ini**
   ```bash
   git clone https://github.com/mhmdaqshal2203/nexpay-app.git
   cd nexpay-app
   ```

2. **Install dependensi**
   ```bash
   npm install
   ```

3. **Pembuatan Database (Supabase / Neon DB)**
   Karena aplikasi ini menggunakan PostgreSQL, Anda perlu membuat database terlebih dahulu:
   - Buka [Supabase](https://supabase.com/) atau [Neon](https://neon.tech/) dan buat proyek baru.
   - Pergi ke menu **Database** atau **Project Settings** > **Database** untuk menyalin string koneksi (Connection String).

4. **Konfigurasi Environment (`.env`)**
   Buat file `.env` di root folder (bisa dengan mengubah file `.env.example` jika ada) dan masukkan URL koneksi database yang Anda dapatkan di langkah 3:
   ```env
   # Ganti dengan URL dari Supabase / Neon DB Anda
   DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
   ```
   *(Catatan: `DIRECT_URL` biasanya diperlukan oleh Prisma jika Anda menggunakan Supabase dengan koneksi pooler pgbouncer)*

5. **Migrasi Database & Seeding Data Awal**
   Jalankan perintah ini untuk membuat tabel-tabel di database (berdasarkan skema Prisma) dan mengisi data *dummy* awal (Karyawan & Admin HR):
   ```bash
   npx prisma generate
   npm run db:push
   npm run seed
   ```

5. **Jalankan Server Development**
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000).

## 🌍 Deployment

Aplikasi ini dikonfigurasi untuk dapat dideploy dengan sangat mudah ke **Vercel**.
Cukup hubungkan repository GitHub ini ke dashboard Vercel Anda, dan Vercel akan otomatis memproses deployment setiap kali ada pembaruan pada branch `main`.

---
*Dikembangkan untuk mempermudah HR dalam era digital.*
