'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  SquaresFour, 
  Users, 
  Calculator, 
  SignOut,
  Gear,
  CalendarCheck,
  AirplaneTilt,
  Receipt
} from '@phosphor-icons/react';
import styles from './Sidebar.module.css';

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = user?.role === 'Karyawan' 
    ? [
        { name: 'Dashboard', path: '/', icon: SquaresFour, desc: 'Ringkasan data' },
        { name: 'Absen Otomatis', path: '/attendance', icon: CalendarCheck, desc: 'Catat kehadiran' },
        { name: 'Cuti', path: '/leave', icon: AirplaneTilt, desc: 'Pengajuan cuti' },
        { name: 'Slip Gaji', path: '/payslip', icon: Receipt, desc: 'Riwayat slip gaji' },
      ]
    : [
        { name: 'Dashboard', path: '/', icon: SquaresFour, desc: 'Ringkasan data' },
        { name: 'Karyawan', path: '/employees', icon: Users, desc: 'Kelola data SDM' },
        { name: 'Penggajian', path: '/payroll', icon: Calculator, desc: 'Hitung & cetak slip' },
        { name: 'Data Absensi', path: '/attendance', icon: CalendarCheck, desc: 'Kelola kehadiran' },
        { name: 'Kelola Cuti', path: '/leave', icon: AirplaneTilt, desc: 'Persetujuan cuti' },
        { name: 'Arsip Slip', path: '/payslip', icon: Receipt, desc: 'Semua slip gaji' },
      ];

  return (
    <>
      {isOpen && <div className={styles.backdrop} onClick={onClose} />}
      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        {/* Ambient glow effect */}
      <div className={styles.ambientGlow} />

      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
            <rect width="32" height="32" rx="10" fill="url(#sidebarGrad)" />
            <path d="M8 22L12 10L16 18L20 13L24 22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
              <linearGradient id="sidebarGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#7c3aed" />
                <stop offset="1" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div>
          <h2 className={styles.logoText}>NexPay</h2>
          <p className={styles.logoSub}>Payroll System</p>
        </div>
      </div>

      {/* Nav label */}
      <p className={styles.navLabel}>NAVIGASI UTAMA</p>

      {/* Nav Menu */}
      <nav className={styles.navMenu}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={onClose}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              {isActive && <div className={styles.activeIndicator} />}
              <div className={`${styles.navIcon} ${isActive ? styles.navIconActive : ''}`}>
                <Icon size={20} weight={isActive ? 'fill' : 'regular'} />
              </div>
              <div className={styles.navText}>
                <span className={styles.navName}>{item.name}</span>
                <span className={styles.navDesc}>{item.desc}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Settings */}
      <p className={styles.navLabel} style={{ marginTop: '1rem' }}>LAINNYA</p>
      <div className={styles.navMenu}>
        <Link
          href="/settings"
          onClick={onClose}
          className={`${styles.navItem} ${pathname === '/settings' ? styles.active : ''}`}
        >
          {pathname === '/settings' && <div className={styles.activeIndicator} />}
          <div className={`${styles.navIcon} ${pathname === '/settings' ? styles.navIconActive : ''}`}>
            <Gear size={20} weight={pathname === '/settings' ? 'fill' : 'regular'} />
          </div>
          <div className={styles.navText}>
            <span className={styles.navName}>Pengaturan</span>
            <span className={styles.navDesc}>Konfigurasi sistem</span>
          </div>
        </Link>
      </div>

      {/* User Profile */}
      <div className={styles.userSection}>
        <div className={styles.userProfile}>
          <div className={styles.userAvatarWrap}>
            <img
              src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"}
              alt={user?.username || "Admin"}
              className={styles.userAvatar}
            />
            <div className={styles.onlineDot} />
          </div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{user?.name || user?.employee?.name || user?.username || 'Admin HR'}</p>
            <p className={styles.userRole}>{user?.role || 'Administrator'}</p>
          </div>
          <button className={styles.logoutBtn} onClick={logout} title="Logout">
            <SignOut size={16} />
          </button>
        </div>
      </div>
    </aside>
    </>
  );
}
