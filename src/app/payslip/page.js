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
  const [previewSlip, setPreviewSlip] = useState(null);

  const handleGenerateAll = () => {
    employees.forEach(emp => {
      generatePayslip({
        employeeId: emp.id,
        month: 'Juli 2026',
        gross: emp.salary + (emp.salary * 0.1),
        deduction: Math.round(emp.salary * 0.05),
        net: (emp.salary + (emp.salary * 0.1)) - Math.round(emp.salary * 0.05)
      });
    });
    alert('Memproses Slip Gaji Juli 2026 untuk semua karyawan ke Neon DB...');
  };

  const formatIDR = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

  const handlePrint = () => {
    const printWin = window.open('', '_blank', 'width=900,height=700');
    const slip = previewSlip;
    const gajiPokok = slip.employee?.salary || Math.round(slip.gross / 1.1);
    const tunjangan = slip.gross - gajiPokok;
    const bpjsKes = Math.round(gajiPokok * 0.01);
    const jht = Math.round(gajiPokok * 0.02);
    const jp = Math.round(gajiPokok * 0.01);
    const pph21 = slip.deduction - (bpjsKes + jht + jp);
    const fmtIDR = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v);

    printWin.document.write(`
      <!DOCTYPE html><html><head><meta charset="utf-8">
      <title>Slip Gaji - ${slip.employee?.name}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; color: #1a1a2e; padding: 40px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 20px; border-bottom: 3px solid #7c3aed; margin-bottom: 24px; }
        .brand { font-size: 28px; font-weight: 900; color: #7c3aed; letter-spacing: -1px; }
        .brand-sub { color: #888; font-size: 13px; margin-top: 4px; }
        .ref { text-align: right; }
        .ref h3 { font-size: 16px; font-weight: 700; }
        .ref p { color: #888; font-size: 13px; margin-top: 4px; }
        .info-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; background: #f5f3ff; padding: 16px 20px; border-radius: 10px; border: 1px solid #e0d9ff; margin-bottom: 24px; }
        .info-label { font-size: 12px; color: #888; margin-bottom: 4px; }
        .info-value { font-size: 15px; font-weight: 700; }
        .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 24px; }
        h4 { font-size: 14px; font-weight: 700; padding-bottom: 8px; border-bottom: 2px solid; margin-bottom: 14px; }
        h4.income { color: #10b981; border-color: rgba(16,185,129,0.3); }
        h4.deduct { color: #f43f5e; border-color: rgba(244,63,94,0.3); }
        .row { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 10px; }
        .row span:first-child { color: #555; }
        .row span:last-child { font-weight: 600; }
        .total-row { display: flex; justify-content: space-between; font-size: 15px; font-weight: 800; padding-top: 12px; border-top: 2px dashed #ccc; margin-top: 4px; }
        .thp { background: linear-gradient(135deg, #7c3aed, #ec4899); color: white; border-radius: 12px; padding: 20px 28px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .thp-label { font-size: 14px; opacity: 0.9; margin-bottom: 4px; }
        .thp-sub { font-size: 12px; opacity: 0.75; }
        .thp-amount { font-size: 32px; font-weight: 900; letter-spacing: -1px; }
        .footer { display: flex; justify-content: space-between; align-items: flex-end; padding-top: 20px; border-top: 1px solid #eee; }
        .footer-note { font-size: 12px; color: #888; line-height: 1.6; font-style: italic; }
        .sig { text-align: center; width: 180px; }
        .sig-name { font-weight: 700; font-size: 14px; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-bottom: 4px; }
        .sig-title { font-size: 12px; color: #888; }
        .sig-space { height: 50px; }
        @media print { body { padding: 20px; } }
      </style></head><body>
      <div class="header">
        <div><div class="brand">NEXUS PAYROLL</div><div class="brand-sub">Dokumen Resmi Penggajian</div></div>
        <div class="ref"><h3>Periode: ${slip.month}</h3><p>No. Slip: ${slip.slipCode || slip.id.substring(0,8).toUpperCase()}</p></div>
      </div>
      <div class="info-grid">
        <div><div class="info-label">Nama Karyawan</div><div class="info-value">${slip.employee?.name || '-'}</div></div>
        <div><div class="info-label">Posisi / Departemen</div><div class="info-value">${slip.employee?.position || slip.employee?.department || 'Staff'}</div></div>
        <div><div class="info-label">Status Karyawan</div><div class="info-value" style="color:#10b981">Full-Time (Tetap)</div></div>
      </div>
      <div class="grid2">
        <div>
          <h4 class="income">💰 Rincian Pendapatan</h4>
          <div class="row"><span>Gaji Pokok</span><span>${fmtIDR(gajiPokok)}</span></div>
          <div class="row"><span>Tunjangan Jabatan & Kehadiran</span><span>${fmtIDR(tunjangan)}</span></div>
          <div class="total-row"><span>Total Pendapatan (A)</span><span style="color:#10b981">${fmtIDR(slip.gross)}</span></div>
        </div>
        <div>
          <h4 class="deduct">📋 Rincian Potongan (UU)</h4>
          <div class="row"><span>BPJS Kesehatan (1%)</span><span>${fmtIDR(bpjsKes)}</span></div>
          <div class="row"><span>Jamsostek JHT (2%)</span><span>${fmtIDR(jht)}</span></div>
          <div class="row"><span>Jamsostek JP (1%)</span><span>${fmtIDR(jp)}</span></div>
          <div class="row"><span>Pajak PPh 21</span><span>${fmtIDR(pph21)}</span></div>
          <div class="total-row"><span>Total Potongan (B)</span><span style="color:#f43f5e">${fmtIDR(slip.deduction)}</span></div>
        </div>
      </div>
      <div class="thp">
        <div><div class="thp-label">Penerimaan Bersih (Take Home Pay)</div><div class="thp-sub">Ditransfer ke Rekening a.n ${slip.employee?.name || '-'}</div></div>
        <div class="thp-amount">${fmtIDR(slip.net)}</div>
      </div>
      <div class="footer">
        <div class="footer-note">Dokumen ini diterbitkan otomatis oleh sistem Nexus Payroll.<br/>Sah dan valid tanpa memerlukan tanda tangan basah.</div>
        <div class="sig"><div class="sig-space"></div><div class="sig-name">Amanda Caroline</div><div class="sig-title">HR Manager</div></div>
      </div>
      <script>window.onload = function(){ window.print(); }<\/script>
      </body></html>
    `);
    printWin.document.close();
  };

  return (
    <div className="page-content animate-fade-in">

      {/* ── PDF Preview Modal ── */}
      {previewSlip && (() => {
        const slip = previewSlip;
        const gajiPokok = slip.employee?.salary || Math.round(slip.gross / 1.1);
        const tunjangan = slip.gross - gajiPokok;
        const bpjsKes = Math.round(gajiPokok * 0.01);
        const jht = Math.round(gajiPokok * 0.02);
        const jp = Math.round(gajiPokok * 0.01);
        const pph21 = slip.deduction - (bpjsKes + jht + jp);
        return (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
          }} onClick={() => setPreviewSlip(null)}>
            <div style={{
              background: '#fff', color: '#1a1a2e', borderRadius: '16px',
              width: '100%', maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto',
              boxShadow: '0 32px 80px rgba(0,0,0,0.6)', padding: '2.5rem',
              fontFamily: "'Segoe UI', Arial, sans-serif", animation: 'dropIn 0.3s ease'
            }} onClick={e => e.stopPropagation()}>

              {/* Modal Header Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <button onClick={handlePrint} style={{ padding: '0.5rem 1.2rem', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #7c3aed, #ec4899)', color: 'white', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <Printer size={16} weight="bold" /> Cetak / Simpan PDF
                </button>
                <button onClick={() => setPreviewSlip(null)} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #ddd', background: 'transparent', color: '#555', cursor: 'pointer', fontWeight: '600' }}>
                  ✕ Tutup
                </button>
              </div>

              {/* Slip Document */}
              <div style={{ borderBottom: '3px solid #7c3aed', paddingBottom: '1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '26px', fontWeight: '900', color: '#7c3aed', letterSpacing: '-1px' }}>NEXUS PAYROLL</div>
                  <div style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>Dokumen Resmi Penggajian</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '700', fontSize: '15px' }}>Periode: {slip.month}</div>
                  <div style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>No. Slip: {slip.slipCode || slip.id.substring(0,8).toUpperCase()}</div>
                </div>
              </div>

              {/* Employee Info */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', background: '#f5f3ff', padding: '14px 18px', borderRadius: '10px', border: '1px solid #e0d9ff', marginBottom: '1.5rem' }}>
                <div><div style={{ fontSize: '11px', color: '#888', marginBottom: '3px' }}>Nama Karyawan</div><div style={{ fontWeight: '700' }}>{slip.employee?.name || '-'}</div></div>
                <div><div style={{ fontSize: '11px', color: '#888', marginBottom: '3px' }}>Posisi</div><div style={{ fontWeight: '700' }}>{slip.employee?.position || 'Staff'}</div></div>
                <div><div style={{ fontSize: '11px', color: '#888', marginBottom: '3px' }}>Status</div><div style={{ fontWeight: '700', color: '#10b981' }}>Full-Time (Tetap)</div></div>
              </div>

              {/* Income & Deductions */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1.5rem' }}>
                <div>
                  <h4 style={{ color: '#10b981', fontSize: '13px', fontWeight: '700', paddingBottom: '8px', borderBottom: '2px solid rgba(16,185,129,0.3)', marginBottom: '12px' }}>💰 Rincian Pendapatan</h4>
                  {[['Gaji Pokok', gajiPokok], ['Tunjangan Jabatan & Kehadiran', tunjangan]].map(([label, val]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                      <span style={{ color: '#555' }}>{label}</span><span style={{ fontWeight: '600' }}>{formatIDR(val)}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '14px', paddingTop: '10px', borderTop: '2px dashed #ddd', marginTop: '4px' }}>
                    <span>Total Pendapatan (A)</span><span style={{ color: '#10b981' }}>{formatIDR(slip.gross)}</span>
                  </div>
                </div>
                <div>
                  <h4 style={{ color: '#f43f5e', fontSize: '13px', fontWeight: '700', paddingBottom: '8px', borderBottom: '2px solid rgba(244,63,94,0.3)', marginBottom: '12px' }}>📋 Rincian Potongan (UU)</h4>
                  {[['BPJS Kesehatan (1%)', bpjsKes], ['Jamsostek JHT (2%)', jht], ['Jamsostek JP (1%)', jp], ['Pajak PPh 21', pph21]].map(([label, val]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                      <span style={{ color: '#555' }}>{label}</span><span style={{ fontWeight: '600' }}>{formatIDR(val)}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '14px', paddingTop: '10px', borderTop: '2px dashed #ddd', marginTop: '4px' }}>
                    <span>Total Potongan (B)</span><span style={{ color: '#f43f5e' }}>{formatIDR(slip.deduction)}</span>
                  </div>
                </div>
              </div>

              {/* THP */}
              <div style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)', borderRadius: '12px', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '3px', fontWeight: '500' }}>Penerimaan Bersih (Take Home Pay)</div>
                  <div style={{ fontSize: '12px', opacity: 0.75 }}>Ditransfer ke Rekening a.n {slip.employee?.name || '-'}</div>
                </div>
                <div style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '-1px' }}>{formatIDR(slip.net)}</div>
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                <div style={{ fontSize: '11px', color: '#999', fontStyle: 'italic', lineHeight: '1.6' }}>
                  Dokumen ini diterbitkan otomatis oleh sistem Nexus Payroll.<br/>
                  Sah dan valid tanpa memerlukan tanda tangan basah.
                </div>
                <div style={{ textAlign: 'center', width: '160px' }}>
                  <div style={{ fontSize: '12px', color: '#888', marginBottom: '40px' }}>Jakarta, {slip.month}<br/>Mengetahui,</div>
                  <div style={{ fontWeight: '700', fontSize: '13px', borderBottom: '1px solid #ccc', paddingBottom: '3px', marginBottom: '3px' }}>Amanda Caroline</div>
                  <div style={{ fontSize: '11px', color: '#888' }}>HR Manager</div>
                </div>
              </div>

            </div>
          </div>
        );
      })()}

      {/* ── Main Table ── */}
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
                <th>Status</th>
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
                          onClick={() => setPreviewSlip(slip)}
                          style={{ padding: '0.3rem 0.8rem', borderRadius: '6px', border: '1px solid var(--primary-light)', background: 'rgba(124,58,237,0.08)', color: 'var(--primary-light)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: '600', transition: 'all 0.2s' }}
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
