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

3. **Konfigurasi Environment**
   Pastikan Anda sudah memiliki file `.env` di root folder dengan variabel koneksi database:
   ```env
   DATABASE_URL="postgres://user:password@host:port/database"
   DIRECT_URL="postgres://user:password@host:port/database"
   ```

4. **Migrasi Database & Seeding Data Awal**
   Jalankan perintah ini untuk menyinkronkan skema database dan mengisi data *dummy* karyawan & admin:
   ```bash
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
