'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useEmployees } from '@/context/EmployeeContext';
import { useActivity } from '@/context/ActivityContext';
import { Receipt, DownloadSimple, Printer, Money, Info, Eye } from '@phosphor-icons/react';

function EmployeePayslipView() {
  const { user } = useAuth();
  const { payslips } = useActivity();
  
  const employeePayslips = payslips.filter(p => p.employeeId === user?.id || p.employeeId === user?.employee?.id || p.employeeId === user?.username);
  
  const [selectedSlip, setSelectedSlip] = useState(null);

  useEffect(() => {
    if (employeePayslips.length > 0 && !selectedSlip) {
      setSelectedSlip(employeePayslips[0]);
    }
  }, [employeePayslips, selectedSlip]);

  const formatIDR = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

  if (employeePayslips.length === 0 || !selectedSlip) {
    return (
      <div className="page-content">
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Belum ada riwayat slip gaji.</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content animate-fade-in">
      
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        
        {/* Latest Payslip Preview */}
        <div className="glass-panel payslip-preview" style={{ padding: '2rem' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '2px solid var(--glass-border)' }} className="print-border">
            <div>
              <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: 'var(--primary-light)', letterSpacing: '-0.05em', margin: 0 }} className="print-color">NEXUS PAYROLL</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }} className="print-text-gray">Dokumen Resmi Penggajian</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }} className="print-text-dark">Periode: {selectedSlip.month}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }} className="print-text-gray">No. Slip: {selectedSlip.slipCode || selectedSlip.id.substring(0, 8).toUpperCase()}</p>
            </div>
          </div>

          {/* Action Buttons (Hidden on Print) */}
          <div className="no-print" style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem', justifyContent: 'flex-end' }}>
            <button 
              onClick={() => window.print()}
              style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: '1px solid var(--primary-light)', background: 'transparent', color: 'var(--primary-light)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: '600' }}
            >
              <Printer size={18} weight="bold" /> Cetak
            </button>
            <button 
              onClick={() => window.print()}
              style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: '600', boxShadow: '0 4px 15px rgba(124, 58, 237, 0.3)' }}
            >
              <DownloadSimple size={18} weight="bold" /> Simpan PDF
            </button>
          </div>

          {/* Employee Info Block */}
          <div style={{ marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', background: 'rgba(124, 58, 237, 0.05)', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid rgba(124, 58, 237, 0.15)' }} className="print-bg">
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }} className="print-text-gray">Nama Karyawan</p>
              <p style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }} className="print-text-dark">{user?.employee?.name || user?.username || 'Karyawan'}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }} className="print-text-gray">Posisi / Departemen</p>
              <p style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }} className="print-text-dark">{user?.employee?.position || user?.employee?.department || 'Staff'}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }} className="print-text-gray">Status Karyawan</p>
              <p style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--success)' }} className="print-color">Full-Time (Tetap)</p>
            </div>
          </div>

          {/* Calculations based on Indonesian Law */}
          {(() => {
            const gajiPokok = selectedSlip.employee?.salary || Math.round(selectedSlip.gross / 1.1);
            const tunjangan = selectedSlip.gross - gajiPokok;
            
            const bpjsKes = Math.round(gajiPokok * 0.01); // 1%
            const jht = Math.round(gajiPokok * 0.02); // 2%
            const jp = Math.round(gajiPokok * 0.01); // 1%
            const pph21 = selectedSlip.deduction - (bpjsKes + jht + jp); // Sisa dari potongan
            
            return (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                
                {/* Pendapatan */}
                <div>
                  <h4 style={{ color: 'var(--success)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', paddingBottom: '0.5rem', borderBottom: '2px solid rgba(16, 185, 129, 0.2)' }} className="print-color print-border">
                    <Money size={22} weight="duotone" /> Rincian Pendapatan
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }} className="print-text-gray">Gaji Pokok</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: '600' }} className="print-text-dark">{formatIDR(gajiPokok)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }} className="print-text-gray">Tunjangan Jabatan & Kehadiran</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: '600' }} className="print-text-dark">{formatIDR(tunjangan)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '2px dashed var(--glass-border)' }} className="print-border">
                      <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '1.1rem' }} className="print-text-dark">Total Pendapatan (A)</span>
                      <span style={{ fontWeight: '800', color: 'var(--success)', fontSize: '1.1rem' }} className="print-color">{formatIDR(selectedSlip.gross)}</span>
                    </div>
                  </div>
                </div>

                {/* Potongan */}
                <div>
                  <h4 style={{ color: 'var(--danger)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', paddingBottom: '0.5rem', borderBottom: '2px solid rgba(244, 63, 94, 0.2)' }} className="print-color print-border">
                    <Info size={22} weight="duotone" /> Rincian Potongan (Sesuai UU)
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }} className="print-text-gray">BPJS Kesehatan (1%)</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: '600' }} className="print-text-dark">{formatIDR(bpjsKes)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }} className="print-text-gray">Jamsostek JHT (2%)</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: '600' }} className="print-text-dark">{formatIDR(jht)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }} className="print-text-gray">Jamsostek JP (1%)</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: '600' }} className="print-text-dark">{formatIDR(jp)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }} className="print-text-gray">Pajak PPh 21</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: '600' }} className="print-text-dark">{formatIDR(pph21)}</span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.6rem', paddingTop: '1rem', borderTop: '2px dashed var(--glass-border)' }} className="print-border">
                      <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '1.1rem' }} className="print-text-dark">Total Potongan (B)</span>
                      <span style={{ fontWeight: '800', color: 'var(--danger)', fontSize: '1.1rem' }} className="print-color">{formatIDR(selectedSlip.deduction)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Take Home Pay */}
          <div style={{ marginTop: '1.5rem', padding: '1.5rem 2rem', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="print-bg print-color">
            <div>
              <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '0.2rem', fontWeight: '500' }}>Penerimaan Bersih (Take Home Pay)</p>
              <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>Ditransfer ke Rekening BCA a.n {user?.employee?.name || user?.username || 'Karyawan'}</p>
            </div>
            <span style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.02em', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>{formatIDR(selectedSlip.net)}</span>
          </div>

          {/* Footer Signatures */}
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: '1.5' }} className="print-text-gray">
              Dokumen ini diterbitkan secara otomatis oleh sistem Nexus Payroll.<br/>
              Sah dan valid tanpa memerlukan tanda tangan basah.
            </p>
            <div style={{ textAlign: 'center', width: '200px' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '3rem' }} className="print-text-gray">Jakarta, 25 {selectedSlip.month.split(' ')[0] || ''} {selectedSlip.month.split(' ')[1] || ''}<br/>Mengetahui,</p>
              <p style={{ fontWeight: '700', color: 'var(--text-primary)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.3rem', marginBottom: '0.3rem' }} className="print-text-dark print-border">Amanda Caroline</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }} className="print-text-gray">HR Manager</p>
            </div>
          </div>

        </div>

        {/* History List */}
        <div className="glass-panel no-print" style={{ padding: '2rem' }}>
          <h3 className="section-title">Riwayat Slip Gaji</h3>
          <p className="section-subtitle" style={{ marginBottom: '1.5rem' }}>12 bulan terakhir</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '600px', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {employeePayslips.map((slip, i) => (
              <div key={i} style={{ 
                padding: '1.25rem', 
                background: 'var(--surface-2)', 
                border: '1px solid var(--glass-border)', 
                borderRadius: '12px',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }} className="hover:border-primary">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{slip.month}</span>
                  <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '4px' }}>{slip.status}</span>
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                  {formatIDR(slip.net)}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSlip(slip);
                    }}
                    style={{ flex: 1, padding: '0.4rem', borderRadius: '6px', border: selectedSlip.id === slip.id ? 'none' : '1px solid var(--glass-border)', background: selectedSlip.id === slip.id ? 'var(--primary-light)' : 'transparent', color: selectedSlip.id === slip.id ? 'white' : 'var(--text-primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    <Eye size={16} /> Lihat
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSlip(slip);
                      setTimeout(() => window.print(), 300);
                    }}
                    style={{ flex: 1, padding: '0.4rem', borderRadius: '6px', border: 'none', background: 'var(--primary)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    <DownloadSimple size={16} /> Unduh
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// Komponen Admin View
function AdminPayslipView() {
  const { payslips, generatePayslip } = useActivity();
  const { employees } = useEmployees();

  // Button to generate dummy payslip for all employees to test Neon DB
  const handleGenerateAll = () => {
    employees.forEach(emp => {
      generatePayslip({
        employeeId: emp.id,
        month: 'Juli 2026',
        gross: emp.salary + (emp.salary * 0.1), // Salary + 10% allowance
        deduction: Math.round(emp.salary * 0.05), // BPJS Kes(1%) + JHT(2%) + JP(1%) + PPh21(1%) = 5%
        net: (emp.salary + (emp.salary * 0.1)) - Math.round(emp.salary * 0.05)
      });
    });
    alert('Memproses Slip Gaji Juli 2026 untuk semua karyawan ke Neon DB...');
  };

  const formatIDR = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

  return (
    <div className="page-content animate-fade-in">
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <h2 className="section-title">Arsip Slip Gaji Karyawan</h2>
            <p className="section-subtitle">Akses dan kelola seluruh arsip slip gaji</p>
          </div>
          <button 
            onClick={handleGenerateAll}
            style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 'bold' }}
          >
            <Printer size={18} /> Generate Slip Juli 2026
          </button>
        </div>

        <div className="neon-table-wrapper">
          <table className="neon-table">
            <thead>
              <tr>
                <th>Bulan</th>
                <th>ID Slip</th>
                <th>Karyawan</th>
                <th>Total Bersih (THP)</th>
                <th>Status Email</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {payslips.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Belum ada data slip gaji di database.</td>
                </tr>
              ) : (
                payslips.map((slip, i) => (
                  <tr key={i}>
                    <td><span style={{ fontWeight: '600' }}>{slip.month}</span></td>
                    <td><code style={{ color: 'var(--primary-light)', fontSize: '0.85rem', letterSpacing: '0.02em' }}>{slip.slipCode || `SLP/${new Date(slip.createdAt).getFullYear()}/${String(new Date(slip.createdAt).getMonth()+1).padStart(2,'0')}/—`}</code></td>
                    <td>{slip.employee?.name}</td>
                    <td style={{ fontWeight: '700', color: 'var(--success)' }}>{formatIDR(slip.net)}</td>
                    <td>
                      <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', fontSize: '0.8rem' }}>
                        {slip.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => alert('Fitur lihat PDF admin segera hadir')}
                          style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                        >
                          <Eye size={14} /> Lihat PDF
                        </button>
                      </div>
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

export default function PayslipPage() {
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
    return <AdminPayslipView />;
  }

  return <EmployeePayslipView />;
}
