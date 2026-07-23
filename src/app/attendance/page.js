'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useEmployees } from '@/context/EmployeeContext';
import { useActivity } from '@/context/ActivityContext';
import { CalendarCheck, Clock, CheckCircle, MapPin } from '@phosphor-icons/react';

function EmployeeAttendanceView() {
  const { user } = useAuth();
  const { employees } = useEmployees();
  const { attendances, checkIn, checkOut } = useActivity();
  const [time, setTime] = useState(null);

  const initialEmployeeData = user?.employee || {};
  const employeeData = employees?.find(emp => emp.id === initialEmployeeData.id) || initialEmployeeData;
  const isNonaktif = employeeData.status === 'Nonaktif';

  const todayRecord = attendances.find(a =>
    (a.employeeId === user?.id || a.employeeId === user?.employee?.id || a.employeeId === user?.username) &&
    a.date === new Date().toLocaleDateString('id-ID') &&
    a.status !== 'Belum Absen'
  );

  const hasCheckedIn = !!todayRecord;
  const hasCheckedOut = !!todayRecord?.checkOut;

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = () => {
    if (!user) return;
    checkIn(user);
    alert('Absen masuk berhasil!');
  };

  const handleCheckOut = () => {
    if (!user) return;
    checkOut(user);
    alert('Absen keluar berhasil! Selamat beristirahat.');
  };

  const timeStr = time ? time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--';
  const dateStr = time ? time.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Memuat tanggal...';
  const isAfter1700 = time ? time.getHours() >= 17 : false;
  const canCheckOut = hasCheckedIn && !hasCheckedOut && isAfter1700;

  return (
    <div className="page-content animate-fade-in">

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Clock & Action Panel */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{dateStr}</h3>
          <div style={{ fontSize: '4rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '2px', marginBottom: '2rem' }}>
            {timeStr}
          </div>

          {hasCheckedIn && (
            <div style={{ marginTop: '1rem', padding: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', borderRadius: '12px', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--success)', marginBottom: '0.5rem' }}>
                <CheckCircle size={24} weight="fill" />
                <h3 style={{ margin: 0 }}>Anda sudah Absen Masuk hari ini</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.5rem 0 0 2rem' }}>
                Absen Masuk: <strong>{todayRecord?.time}</strong> WIB<br />
                Absen Keluar: <strong>{todayRecord?.checkOut || '-'}</strong> {todayRecord?.checkOut && 'WIB'}<br />
                Status: <strong>{todayRecord?.status}</strong>
              </p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', width: '100%', marginTop: '1.5rem' }}>
            {isNonaktif ? (
              <div style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', textAlign: 'center', fontWeight: 'bold' }}>
                Akun Anda dinonaktifkan. Anda tidak dapat melakukan absensi.
              </div>
            ) : (
              <>
                {!hasCheckedIn && (
                  <button
                    onClick={handleCheckIn}
                style={{
                  flex: 1, padding: '1rem', borderRadius: '12px', border: 'none',
                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                  color: 'white', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  transition: 'all 0.2s', boxShadow: '0 8px 24px var(--primary-glow)'
                }}
              >
                <Clock size={24} weight="bold" />
                Absen Masuk Sekarang
              </button>
            )}

            {hasCheckedIn && !hasCheckedOut && (
              <button
                onClick={handleCheckOut}
                disabled={!canCheckOut}
                style={{
                  flex: 1, padding: '1rem', borderRadius: '12px', border: 'none',
                  background: (!canCheckOut) ? 'var(--surface-2)' : 'var(--danger)',
                  color: (!canCheckOut) ? 'var(--text-muted)' : 'white',
                  fontWeight: 'bold', fontSize: '1.1rem', cursor: (!canCheckOut) ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  transition: 'all 0.2s', boxShadow: (!canCheckOut) ? 'none' : '0 8px 24px var(--danger-glow)'
                }}
              >
                <Clock size={24} weight="bold" />
                {(!isAfter1700) ? 'Bisa Keluar Mulai 17:00' : 'Absen Keluar Sekarang'}
              </button>
            )}
              </>
            )}
          </div>
        </div>

        {/* Info Panel */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={24} color="var(--primary)" weight="fill" />
            Informasi Lokasi & Jadwal
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Jadwal Kerja</span>
              <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Senin - Jumat, 08:00 - 17:00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Lokasi Saat Ini</span>
              <span style={{ fontWeight: '600', color: 'var(--success)' }}>Dalam Radius Kantor (Aman)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Alamat IP</span>
              <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontFamily: 'monospace' }}>192.168.1.18</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Komponen Admin View
function AdminAttendanceView() {
  const { attendances, resetAttendance } = useActivity();

  const handleReset = (id, name) => {
    if (confirm(`Apakah Anda yakin ingin mereset/menghapus data absensi untuk karyawan ${name}?`)) {
      resetAttendance(id);
    }
  };

  return (
    <div className="page-content animate-fade-in">
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <h2 className="section-title">Data Absensi Karyawan</h2>
            <p className="section-subtitle">Pantau kehadiran seluruh karyawan hari ini</p>
          </div>
          <div style={{ padding: '0.5rem 1rem', background: 'var(--surface-2)', border: '1px solid var(--glass-border)', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Tanggal: <strong>19 Juli 2026</strong>
          </div>
        </div>

        <div className="neon-table-wrapper">
          <table className="neon-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Karyawan</th>
                <th>Departemen</th>
                <th>Absen Masuk</th>
                <th>Absen Keluar</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {attendances.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    Belum ada data absensi hari ini.
                  </td>
                </tr>
              ) : (
                attendances.map((emp, i) => (
                  <tr key={i}>
                    <td><code style={{ color: 'var(--primary-light)' }}>{emp.id.substring(0, 8)}</code></td>
                    <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{emp.employee?.name || emp.name || 'Karyawan'}</td>
                    <td>{emp.employee?.position || emp.role || 'Karyawan'}</td>
                    <td><span style={{ padding: '0.2rem 0.5rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '4px' }}>{emp.time}</span></td>
                    <td>{emp.checkOut ? <span style={{ padding: '0.2rem 0.5rem', background: 'rgba(236, 72, 153, 0.1)', color: 'var(--accent)', borderRadius: '4px' }}>{emp.checkOut}</span> : '-'}</td>
                    <td>
                      <span className={`badge ${emp.status === 'Hadir' ? 'active' :
                        emp.status === 'Terlambat' ? 'warning' : 'inactive'
                        }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td>
                      {!emp.date?.includes('(Reset)') ? (
                        <button
                          onClick={() => handleReset(emp.id, emp.employee?.name || emp.name || 'Karyawan')}
                          className="btn-danger"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '6px', cursor: 'pointer' }}
                        >
                          Reset
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Di-reset</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function AttendancePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="page-content">
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Memuat data...</h2>
        </div>
      </div>
    );
  }

  if (user.role === 'Admin HR') {
    return <AdminAttendanceView />;
  }

  return <EmployeeAttendanceView />;
}
