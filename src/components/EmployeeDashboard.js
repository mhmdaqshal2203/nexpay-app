'use client';

import { useEmployees } from '@/context/EmployeeContext';
import { useAuth } from '@/context/AuthContext';
import { useActivity } from '@/context/ActivityContext';
import { 
  UserCircle, 
  CalendarCheck, 
  Clock, 
  Money,
  CheckCircle,
  WarningCircle
} from '@phosphor-icons/react';
import styles from './EmployeeDashboard.module.css';

export default function EmployeeDashboard() {
  const { employees, formatIDR } = useEmployees();
  const { user } = useAuth();
  
  // Use logged in user
  const currentUser = user || {
    username: 'Karyawan',
    role: 'Staff',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi',
  };

  // Employee data comes from the login response (Karyawan -> Employee relation)
  const employeeData = currentUser.employee || {
    salary: 5000000,
    position: 'Staff',
    id: 'EMP-000',
    name: currentUser.username
  };

  const { attendances } = useActivity();
  
  // Get real-time attendances for this employee
  const myAttendances = attendances
    .filter(att => att.employeeId === employeeData.id || att.employee?.id === employeeData.id)
    .slice(0, 5);

  const displayAttendances = myAttendances.length > 0 ? myAttendances : [
    { date: '-', time: '-', status: 'Belum ada data' }
  ];

  return (
    <div className={`page-content ${styles.dashboard}`}>
      {/* Welcome Section */}
      <div className={`${styles.welcomeBanner} animate-fade-in`}>
        <div className={styles.welcomeLeft}>
          <img src={currentUser.avatar} alt={employeeData.name} className={styles.avatarLarge} />
          <div>
            <h2 className={styles.welcomeTitle}>Halo, {employeeData.name}!</h2>
            <p className={styles.welcomeSub}>{employeeData.position} • {employeeData.id}</p>
          </div>
        </div>
        <div className={`${styles.statusBadge} ${employeeData.status === 'Nonaktif' ? styles.statusBadgeNonaktif : ''}`}>
          <div className={`${styles.statusDot} ${employeeData.status === 'Nonaktif' ? styles.statusDotNonaktif : ''}`}></div>
          Status: {employeeData.status === 'Nonaktif' ? 'Nonaktif' : 'Aktif Bekerja'}
        </div>
      </div>

      {/* Overview Cards */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} animate-fade-in-delay-1`}>
          <div className={styles.statIcon}><CalendarCheck size={24} color="var(--primary)" weight="fill" /></div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>18 Hari</div>
            <div className={styles.statLabel}>Kehadiran Bulan Ini</div>
          </div>
        </div>
        <div className={`${styles.statCard} animate-fade-in-delay-2`}>
          <div className={styles.statIcon}><Clock size={24} color="var(--accent)" weight="fill" /></div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>12 Jam</div>
            <div className={styles.statLabel}>Total Lembur</div>
          </div>
        </div>
        <div className={`${styles.statCard} animate-fade-in-delay-3`}>
          <div className={styles.statIcon}><Money size={24} color="var(--success)" weight="fill" /></div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{formatIDR(employeeData.salary)}</div>
            <div className={styles.statLabel}>Gaji Pokok</div>
          </div>
        </div>
      </div>

      {/* Neon Table Section */}
      <div className={`${styles.tableSection} animate-fade-in-delay-4`}>
        <div className={styles.sectionHeader}>
          <h3 className="section-title">Riwayat Absensi Terakhir</h3>
          <p className="section-subtitle">Data kehadiran dalam 5 hari kerja terakhir</p>
        </div>
        
        <div className={styles.neonTableWrapper}>
          <table className="neon-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Absen Masuk</th>
                <th>Absen Keluar</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {displayAttendances.map((log, i) => (
                <tr key={i}>
                  <td>{log.date}</td>
                  <td>{log.time || '-'}</td>
                  <td>{log.checkOut || '-'}</td>
                  <td>
                    {log.status === 'Hadir' && <span style={{color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '5px'}}><CheckCircle size={16} /> Hadir</span>}
                    {log.status === 'Terlambat' && <span style={{color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '5px'}}><WarningCircle size={16} /> Terlambat</span>}
                    {log.status === 'Cuti' && <span style={{color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '5px'}}><UserCircle size={16} /> Cuti</span>}
                    {log.status === 'Belum ada data' && <span style={{color: 'var(--text-secondary)'}}>Belum ada data</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
