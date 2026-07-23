'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MagnifyingGlass, Bell, CaretRight, SignOut, Sun, Moon, X, CheckCircle, Clock, Warning, Receipt, List } from '@phosphor-icons/react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useActivity } from '@/context/ActivityContext';
import styles from './Header.module.css';

export default function Header({ toggleSidebar }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { leaves, attendances, payslips } = useActivity();

  const [time, setTime] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [readIds, setReadIds] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('nexpay-read-notifs') || '[]');
    }
    return [];
  });
  const notifRef = useRef(null);

  // Build notifications from real data
  const notifications = useMemo(() => {
    const list = [];

    // Admin Notifications
    if (user?.role !== 'Karyawan') {
      // Pending leave requests (admin only)
      leaves
        .filter(l => l.status === 'Menunggu')
        .slice(0, 5)
        .forEach(l => {
          list.push({
            id: `leave-${l.id}`,
            type: 'warning',
            title: 'Pengajuan Cuti Menunggu',
            desc: `${l.employeeName || 'Karyawan'} mengajukan cuti ${l.type}`,
            time: l.createdAt || l.startDate,
            link: '/leave',
          });
        });

      // Late attendance
      attendances
        .filter(a => a.status === 'Terlambat')
        .slice(0, 3)
        .forEach(a => {
          list.push({
            id: `att-${a.id}`,
            type: 'danger',
            title: 'Absensi Terlambat',
            desc: `${a.employeeName || 'Karyawan'} check-in pukul ${a.time}`,
            time: a.date,
            link: '/attendance',
          });
        });

      // New payslips
      payslips
        .slice(0, 3)
        .forEach(p => {
          list.push({
            id: `pay-${p.id}`,
            type: 'success',
            title: 'Slip Gaji Dibuat',
            desc: `Slip gaji ${p.employeeName || 'Karyawan'} — ${p.period || p.month || ''}`,
            time: p.createdAt || p.period,
            link: '/payslip',
          });
        });
    } else {
      // Employee Notifications
      const empId = user?.employee?.id || user?.id || user?.username;

      // Leave updates (approved or rejected)
      leaves
        .filter(l => (l.status === 'Disetujui' || l.status === 'Ditolak') && (l.employeeId === empId || l.employee?.id === empId))
        .slice(0, 3)
        .forEach(l => {
          list.push({
            id: `leave-${l.id}-${l.status}`,
            type: l.status === 'Disetujui' ? 'success' : 'danger',
            title: `Cuti ${l.status}`,
            desc: `Pengajuan cuti tanggal ${l.startDate} telah ${l.status.toLowerCase()}`,
            time: l.updatedAt || l.createdAt || l.startDate,
            link: '/leave',
          });
        });

      // Own Late attendance
      attendances
        .filter(a => a.status === 'Terlambat' && (a.employeeId === empId || a.employee?.id === empId))
        .slice(0, 3)
        .forEach(a => {
          list.push({
            id: `att-${a.id}`,
            type: 'danger',
            title: 'Anda Terlambat',
            desc: `Anda tercatat check-in pukul ${a.time}`,
            time: a.date,
            link: '/attendance',
          });
        });

      // Own Payslips
      payslips
        .filter(p => p.employeeId === empId || p.employee?.id === empId)
        .slice(0, 3)
        .forEach(p => {
          list.push({
            id: `pay-${p.id}`,
            type: 'success',
            title: 'Slip Gaji Diterbitkan',
            desc: `Slip gaji Anda periode ${p.period || p.month || ''} tersedia`,
            time: p.createdAt || p.period,
            link: '/payslip',
          });
        });
    }

    return list;
  }, [leaves, attendances, payslips, user]);

  const unreadCount = notifications.filter(n => !readIds.includes(n.id)).length;

  const markAllRead = () => {
    const allIds = notifications.map(n => n.id);
    setReadIds(allIds);
    localStorage.setItem('nexpay-read-notifs', JSON.stringify(allIds));
  };

  const dismissOne = (id, e) => {
    e.stopPropagation();
    const next = [...readIds, id];
    setReadIds(next);
    localStorage.setItem('nexpay-read-notifs', JSON.stringify(next));
  };

  const handleNotifClick = (notif) => {
    const next = [...readIds, notif.id];
    setReadIds(next);
    localStorage.setItem('nexpay-read-notifs', JSON.stringify(next));
    setNotifOpen(false);
    router.push(notif.link);
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dateStr = time ? time.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '';
  const timeStr = time ? time.toLocaleTimeString('id-ID') : '';

  const getBreadcrumb = () => {
    switch (pathname) {
      case '/': return [{ label: 'Dashboard' }];
      case '/employees': return [{ label: 'SDM' }, { label: 'Data Karyawan' }];
      case '/payroll': return [{ label: 'Keuangan' }, { label: 'Kalkulasi Gaji' }];
      case '/settings': return [{ label: 'Sistem' }, { label: 'Pengaturan' }];
      case '/attendance': return [{ label: 'Karyawan' }, { label: 'Absen Otomatis' }];
      case '/leave': return [{ label: 'Karyawan' }, { label: 'Pengajuan Cuti' }];
      case '/payslip': return [{ label: 'Karyawan' }, { label: 'Slip Gaji' }];
      default: return [{ label: 'NexPay' }];
    }
  };

  const getPageTitle = () => {
    switch (pathname) {
      case '/': return 'Dashboard';
      case '/employees': return 'Data Karyawan';
      case '/payroll': return 'Kalkulasi Gaji';
      case '/settings': return 'Pengaturan';
      case '/attendance': return 'Absen Otomatis';
      case '/leave': return 'Pengajuan Cuti';
      case '/payslip': return 'Slip Gaji';
      default: return 'NexPay';
    }
  };

  const typeIcon = (type) => {
    if (type === 'warning') return <Warning size={14} weight="fill" />;
    if (type === 'danger')  return <Clock size={14} weight="fill" />;
    if (type === 'success') return <Receipt size={14} weight="fill" />;
    return <Bell size={14} />;
  };

  const breadcrumb = getBreadcrumb();

  return (
    <header className={styles.header}>
      <div className={styles.leftWrapper}>
        <button className={styles.mobileMenuBtn} onClick={toggleSidebar}>
          <List size={24} weight="bold" />
        </button>
        <div className={styles.headerLeft}>
          <div className={styles.breadcrumb}>
            <span className={styles.breadcrumbHome}>NexPay</span>
            {breadcrumb.map((crumb, i) => (
              <span key={i} className={styles.breadcrumbItem}>
                <CaretRight size={12} className={styles.breadcrumbSep} />
                <span className={i === breadcrumb.length - 1 ? styles.breadcrumbActive : styles.breadcrumbLink}>
                  {crumb.label}
                </span>
              </span>
            ))}
          </div>
          <h1 className={styles.pageTitle}>{getPageTitle()}</h1>
          <p className={styles.pageDate}>{time ? `${dateStr} • ${timeStr}` : 'Memuat waktu...'}</p>
        </div>
      </div>

      <div className={styles.headerActions}>
        {/* Search */}
        <div className={styles.searchWrapper}>
          <MagnifyingGlass size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Cari karyawan, jabatan..."
            className={styles.searchInput}
            id="global-search"
          />
          <kbd className={styles.searchKbd}>⌘K</kbd>
        </div>

        {/* Theme Toggle */}
        <button
          className={`btn-icon ${styles.themeToggle}`}
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
          id="theme-toggle-btn"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} weight="fill" /> : <Moon size={18} weight="fill" />}
        </button>

        {/* Notification */}
        <div className={styles.notifWrapper} ref={notifRef}>
          <button
            className={`btn-icon ${styles.notifBtn} ${notifOpen ? styles.notifBtnActive : ''} ${unreadCount > 0 ? styles.hasUnread : ''}`}
            id="notif-btn"
            onClick={() => setNotifOpen(o => !o)}
            aria-label="Notifikasi"
          >
            <Bell size={18} weight={notifOpen ? 'fill' : 'regular'} />
          </button>
          {unreadCount > 0 && (
            <span className={styles.notifBadge}>{unreadCount > 9 ? '9+' : unreadCount}</span>
          )}

          {/* Dropdown */}
          {notifOpen && (
            <div className={styles.notifDropdown}>
              <div className={styles.notifHeader}>
                <span className={styles.notifTitle}>Notifikasi</span>
                {unreadCount > 0 && (
                  <button className={styles.markAllBtn} onClick={markAllRead}>
                    <CheckCircle size={13} weight="fill" /> Tandai semua dibaca
                  </button>
                )}
              </div>

              <div className={styles.notifList}>
                {notifications.length === 0 ? (
                  <div className={styles.notifEmpty}>
                    <Bell size={32} weight="thin" />
                    <p>Tidak ada notifikasi</p>
                  </div>
                ) : (
                  notifications.map(notif => {
                    const isRead = readIds.includes(notif.id);
                    return (
                      <div
                        key={notif.id}
                        className={`${styles.notifItem} ${styles[`notif_${notif.type}`]} ${isRead ? styles.notifRead : ''}`}
                        onClick={() => handleNotifClick(notif)}
                      >
                        <div className={`${styles.notifIcon} ${styles[`notifIcon_${notif.type}`]}`}>
                          {typeIcon(notif.type)}
                        </div>
                        <div className={styles.notifBody}>
                          <p className={styles.notifItemTitle}>{notif.title}</p>
                          <p className={styles.notifItemDesc}>{notif.desc}</p>
                          {notif.time && (
                            <p className={styles.notifItemTime}>{notif.time}</p>
                          )}
                        </div>
                        {!isRead && <span className={styles.notifDot} />}
                        <button
                          className={styles.notifDismiss}
                          onClick={(e) => dismissOne(notif.id, e)}
                          title="Tutup"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {notifications.length > 0 && (
                <div className={styles.notifFooter}>
                  <button onClick={() => { setNotifOpen(false); router.push('/leave'); }} className={styles.notifFooterBtn}>
                    Lihat semua aktivitas
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile */}
        {user && (
          <Link href="/settings" className={styles.userProfile} title="Lihat Profil">
            <img src={user.avatar} alt={user.username} className={styles.userAvatar} />
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user.name || user.employee?.name || user.username}</span>
              <span className={styles.userRole}>{user.role}</span>
            </div>
          </Link>
        )}

        {/* Logout */}
        <button className={styles.logoutBtn} onClick={logout} title="Keluar" id="logout-btn">
          <SignOut size={18} weight="bold" />
        </button>
      </div>
    </header>
  );
}
