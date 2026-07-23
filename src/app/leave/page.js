'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useEmployees } from '@/context/EmployeeContext';
import { useActivity } from '@/context/ActivityContext';
import { AirplaneTilt, CalendarPlus, WarningCircle, CheckCircle, Clock } from '@phosphor-icons/react';

function EmployeeLeaveView() {
  const { user } = useAuth();
  const { leaves, submitLeave } = useActivity();
  
  const [form, setForm] = useState({
    type: 'Cuti Tahunan',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.startDate || !form.endDate || !form.reason) return alert('Lengkapi semua data!');
    
    submitLeave(user, form);
    alert('Pengajuan berhasil dikirim!');
    
    setForm({ type: 'Cuti Tahunan', startDate: '', endDate: '', reason: '' });
  };

  return (
    <div className="page-content animate-fade-in">
      
      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '12px', color: 'var(--success)' }}>
            <CalendarPlus size={28} weight="fill" />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sisa Cuti Tahunan</p>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>10 Hari</h3>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.15)', borderRadius: '12px', color: 'var(--warning)' }}>
            <Clock size={28} weight="fill" />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Menunggu Persetujuan</p>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>{leaves.filter(r => r.status === 'Menunggu' && (r.employeeId === user?.id || r.employeeId === user?.employee?.id || r.employeeId === user?.username)).length} Pengajuan</h3>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(6, 182, 212, 0.15)', borderRadius: '12px', color: 'var(--accent)' }}>
            <CheckCircle size={28} weight="fill" />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Cuti Diambil</p>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>2 Hari</h3>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
        
        {/* Form Ajukan Cuti */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 className="section-title">Form Pengajuan Cuti</h3>
          <p className="section-subtitle" style={{ marginBottom: '1.5rem' }}>Isi form berikut untuk mengajukan cuti.</p>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Jenis Cuti</label>
              <select 
                value={form.type} onChange={(e) => setForm({...form, type: e.target.value})}
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--surface-2)', color: 'white', outline: 'none' }}
              >
                <option>Cuti Tahunan</option>
                <option>Izin Sakit</option>
                <option>Cuti Melahirkan</option>
                <option>Izin Keperluan Pribadi</option>
              </select>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Tanggal Mulai</label>
                <input 
                  type="date" 
                  value={form.startDate} onChange={(e) => setForm({...form, startDate: e.target.value})}
                  style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--surface-2)', color: 'white', outline: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Tanggal Selesai</label>
                <input 
                  type="date" 
                  value={form.endDate} onChange={(e) => setForm({...form, endDate: e.target.value})}
                  style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--surface-2)', color: 'white', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Keterangan / Alasan</label>
              <textarea 
                rows="3"
                value={form.reason} onChange={(e) => setForm({...form, reason: e.target.value})}
                placeholder="Tuliskan alasan pengajuan cuti Anda..."
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--surface-2)', color: 'white', outline: 'none', resize: 'none' }}
              />
            </div>

            <button type="submit" style={{ 
              marginTop: '1rem', padding: '0.75rem', borderRadius: '8px', border: 'none',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white', fontWeight: 'bold',
              cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 15px var(--primary-glow)'
            }}>
              Ajukan Sekarang
            </button>
          </form>
        </div>

        {/* Riwayat Cuti */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 className="section-title">Riwayat Pengajuan</h3>
          
          <div className="neon-table-wrapper" style={{ marginTop: '1rem' }}>
            <table className="neon-table">
              <thead>
                <tr>
                  <th>Jenis</th>
                  <th>Tanggal</th>
                  <th>Alasan</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
              {leaves.filter(l => l.employeeId === user?.id || l.employeeId === user?.employee?.id || l.employeeId === user?.username).length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Belum ada riwayat cuti</td>
                </tr>
              ) : (
                leaves.filter(l => l.employeeId === user?.id || l.employeeId === user?.employee?.id || l.employeeId === user?.username).map((req, i) => (
                  <tr key={i}>
                    <td>{req.type}</td>
                    <td>{req.startDate} s/d {req.endDate}</td>
                    <td>{req.reason}</td>
                    <td>
                      {req.status === 'Disetujui' && <span style={{ padding: '0.2rem 0.6rem', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', fontSize: '0.8rem', fontWeight: '600' }}>Disetujui</span>}
                      {req.status === 'Menunggu' && <span style={{ padding: '0.2rem 0.6rem', borderRadius: '20px', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)', fontSize: '0.8rem', fontWeight: '600' }}>Menunggu</span>}
                      {req.status === 'Ditolak' && <span style={{ padding: '0.2rem 0.6rem', borderRadius: '20px', background: 'rgba(244, 63, 94, 0.15)', color: 'var(--danger)', fontSize: '0.8rem', fontWeight: '600' }}>Ditolak</span>}
                    </td>
                  </tr>
                ))
              )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

// Komponen Admin View
function AdminLeaveView() {
  const { leaves, updateLeaveStatus } = useActivity();

  const handleAction = (id, newStatus) => {
    updateLeaveStatus(id, newStatus);
  };

  return (
    <div className="page-content animate-fade-in">
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 className="section-title">Kelola Pengajuan Cuti</h2>
        <p className="section-subtitle" style={{ marginBottom: '1.5rem' }}>Daftar semua pengajuan cuti karyawan</p>

        <div className="neon-table-wrapper">
          <table className="neon-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Karyawan</th>
                <th>Jenis Cuti</th>
                <th>Tanggal</th>
                <th>Alasan</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Belum ada pengajuan cuti</td>
                </tr>
              ) : (
                leaves.map((req, i) => (
                  <tr key={i}>
                    <td><span style={{ color: 'var(--text-secondary)' }}>{req.id.substring(0, 8)}</span></td>
                    <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{req.employee?.name || req.name || 'Karyawan'}</td>
                    <td>{req.type}</td>
                    <td>{req.startDate} s/d {req.endDate}</td>
                    <td>{req.reason}</td>
                    <td>
                      {req.status === 'Disetujui' && <span style={{ padding: '0.2rem 0.6rem', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', fontSize: '0.8rem', fontWeight: '600' }}>Disetujui</span>}
                      {req.status === 'Menunggu' && <span style={{ padding: '0.2rem 0.6rem', borderRadius: '20px', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)', fontSize: '0.8rem', fontWeight: '600' }}>Menunggu</span>}
                      {req.status === 'Ditolak' && <span style={{ padding: '0.2rem 0.6rem', borderRadius: '20px', background: 'rgba(244, 63, 94, 0.15)', color: 'var(--danger)', fontSize: '0.8rem', fontWeight: '600' }}>Ditolak</span>}
                    </td>
                    <td>
                      {req.status === 'Menunggu' ? (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => handleAction(req.id, 'Disetujui')} style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', border: 'none', background: 'var(--success)', color: 'white', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}>Setujui</button>
                          <button onClick={() => handleAction(req.id, 'Ditolak')} style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', border: 'none', background: 'var(--danger)', color: 'white', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}>Tolak</button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Selesai</span>
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

export default function LeavePage() {
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
    return <AdminLeaveView />;
  }

  return <EmployeeLeaveView />;
}
