'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  UserCircle,
  Lock,
  Buildings,
  Percent,
  Bell,
  Palette,
  ShieldCheck,
  FloppyDisk,
  Eye,
  EyeSlash,
  CheckCircle,
  WarningCircle,
  Info,
  CurrencyDollar,
  Clock
} from '@phosphor-icons/react';
import styles from './Settings.module.css';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const isAdmin = user?.role === 'Admin HR';

  // Tab state
  const [activeTab, setActiveTab] = useState('profil');

  // Profile form
  const [profileForm, setProfileForm] = useState({
    displayName: user?.username || '',
    email: user?.username || '',
    avatar: user?.avatar || '',
  });
  
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1 * 1024 * 1024) {
      showToast('Ukuran file maksimal 1MB', 'error');
      return;
    }

    try {
      setIsUploading(true);
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        const base64String = reader.result;
        
        const res = await fetch('/api/user/avatar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            role: user.role,
            avatar: base64String
          })
        });

        if (res.ok) {
          setProfileForm(prev => ({ ...prev, avatar: base64String }));
          updateUser({ avatar: base64String });
          showToast('Foto profil berhasil diperbarui!');
        } else {
          showToast('Gagal memperbarui foto profil', 'error');
        }
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
      showToast('Terjadi kesalahan', 'error');
      setIsUploading(false);
    }
  };

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Company settings (admin only)
  const [companyForm, setCompanyForm] = useState({
    name: 'NexPay Corp.',
    address: 'Jl. Sudirman No. 123, Jakarta Pusat',
    phone: '(021) 555-0123',
    email: 'hr@nexpay.id',
    npwp: '01.234.567.8-012.345',
  });

  // Payroll settings (admin only)
  const [payrollForm, setPayrollForm] = useState({
    taxRate: 5,
    allowanceRate: 20,
    overtimeRate: 25000,
    lateDeduction: 50000,
    absentDeduction: 100000,
    payDate: 25,
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailPayslip: true,
    emailAttendance: false,
    emailOvertime: true,
    browserNotif: true,
  });

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = (section) => {
    if (section === 'Profil') {
      updateUser({ username: profileForm.displayName });
    }
    showToast(`Pengaturan ${section} berhasil disimpan!`);
  };

  const tabs = [
    { id: 'profil', label: 'Profil', icon: UserCircle, desc: 'Info akun' },
    { id: 'keamanan', label: 'Keamanan', icon: Lock, desc: 'Password' },
    ...(isAdmin ? [
      { id: 'perusahaan', label: 'Perusahaan', icon: Buildings, desc: 'Data perusahaan' },
      { id: 'penggajian', label: 'Penggajian', icon: CurrencyDollar, desc: 'Konfigurasi gaji' },
    ] : []),
    { id: 'notifikasi', label: 'Notifikasi', icon: Bell, desc: 'Preferensi' },
  ];

  return (
    <div className={`page-content ${styles.settings}`}>
      {/* Toast */}
      {toast && (
        <div className={`${styles.toast} ${styles[toast.type]} animate-fade-in`}>
          <CheckCircle size={18} weight="fill" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className={`${styles.pageHeader} animate-fade-in`}>
        <div>
          <h1 className={styles.pageTitle}>Pengaturan</h1>
          <p className={styles.pageSubtitle}>Kelola akun dan preferensi sistem Anda</p>
        </div>
        <div className={styles.roleBadge}>
          <ShieldCheck size={16} weight="fill" />
          {user?.role || 'User'}
        </div>
      </div>

      {/* Content Grid */}
      <div className={styles.contentGrid}>
        {/* Tab Sidebar */}
        <div className={`glass-panel ${styles.tabSidebar} animate-fade-in-delay-1`}>
          <nav className={styles.tabNav}>
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabActive : ''}`}
                >
                  <div className={styles.tabIconWrap}>
                    <TabIcon size={20} weight={activeTab === tab.id ? 'fill' : 'regular'} />
                  </div>
                  <div className={styles.tabText}>
                    <span className={styles.tabLabel}>{tab.label}</span>
                    <span className={styles.tabDesc}>{tab.desc}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className={`glass-panel ${styles.tabContent} animate-fade-in-delay-2`}>

          {/* ===== PROFIL TAB ===== */}
          {activeTab === 'profil' && (
            <div className={styles.tabPanel}>
              <div className={styles.panelHeader}>
                <h2 className={styles.panelTitle}>Profil Pengguna</h2>
                <p className={styles.panelDesc}>Kelola informasi dasar akun Anda</p>
              </div>

              {/* Avatar Section */}
              <div className={styles.avatarSection}>
                <img 
                  src={profileForm.avatar || user?.avatar} 
                  alt="Avatar" 
                  className={styles.avatarPreview} 
                  style={{ opacity: isUploading ? 0.5 : 1, transition: 'opacity 0.2s' }}
                />
                <div className={styles.avatarInfo}>
                  <h3 className={styles.avatarName}>{user?.username || 'User'}</h3>
                  <p className={styles.avatarRole}>{user?.role}</p>
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    onChange={handleAvatarChange}
                  />
                  <button 
                    className={styles.avatarBtn} 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? 'Mengunggah...' : 'Ganti Avatar'}
                  </button>
                </div>
              </div>

              <div className="divider" />

              {/* Profile Form */}
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Nama Tampilan</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={profileForm.displayName}
                    onChange={(e) => setProfileForm({...profileForm, displayName: e.target.value})}
                    placeholder="Nama Anda"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email / Username</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                    placeholder="email@nexpay.id"
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <button className={styles.btnPrimary} onClick={() => handleSave('Profil')}>
                  <FloppyDisk size={18} />
                  Simpan Perubahan
                </button>
              </div>
            </div>
          )}

          {/* ===== KEAMANAN TAB ===== */}
          {activeTab === 'keamanan' && (
            <div className={styles.tabPanel}>
              <div className={styles.panelHeader}>
                <h2 className={styles.panelTitle}>Keamanan Akun</h2>
                <p className={styles.panelDesc}>Perbarui kata sandi untuk menjaga keamanan akun</p>
              </div>

              <div className={styles.infoBox}>
                <Info size={18} />
                <span>Password minimal 8 karakter, kombinasi huruf besar, kecil, dan angka.</span>
              </div>

              <div className={styles.formStack}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Password Saat Ini</label>
                  <div className={styles.passwordWrap}>
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      className={styles.formInput}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                      placeholder="Masukkan password saat ini"
                    />
                    <button 
                      className={styles.passwordToggle}
                      onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                    >
                      {showPasswords.current ? <EyeSlash size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Password Baru</label>
                  <div className={styles.passwordWrap}>
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      className={styles.formInput}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      placeholder="Masukkan password baru"
                    />
                    <button 
                      className={styles.passwordToggle}
                      onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                    >
                      {showPasswords.new ? <EyeSlash size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Konfirmasi Password Baru</label>
                  <div className={styles.passwordWrap}>
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      className={styles.formInput}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      placeholder="Ulangi password baru"
                    />
                    <button 
                      className={styles.passwordToggle}
                      onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                    >
                      {showPasswords.confirm ? <EyeSlash size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password strength indicator */}
              {passwordForm.newPassword && (
                <div className={styles.strengthBar}>
                  <div className={styles.strengthLabel}>Kekuatan Password:</div>
                  <div className={styles.strengthTrack}>
                    <div 
                      className={`${styles.strengthFill} ${
                        passwordForm.newPassword.length >= 12 ? styles.strengthStrong :
                        passwordForm.newPassword.length >= 8 ? styles.strengthMedium : 
                        styles.strengthWeak
                      }`}
                      style={{ width: `${Math.min(100, (passwordForm.newPassword.length / 12) * 100)}%` }}
                    />
                  </div>
                  <span className={styles.strengthText}>
                    {passwordForm.newPassword.length >= 12 ? 'Kuat' :
                     passwordForm.newPassword.length >= 8 ? 'Sedang' : 'Lemah'}
                  </span>
                </div>
              )}

              <div className={styles.formActions}>
                <button className={styles.btnPrimary} onClick={() => handleSave('Keamanan')}>
                  <Lock size={18} />
                  Perbarui Password
                </button>
              </div>
            </div>
          )}

          {/* ===== PERUSAHAAN TAB (Admin only) ===== */}
          {activeTab === 'perusahaan' && isAdmin && (
            <div className={styles.tabPanel}>
              <div className={styles.panelHeader}>
                <h2 className={styles.panelTitle}>Data Perusahaan</h2>
                <p className={styles.panelDesc}>Informasi perusahaan yang ditampilkan di slip gaji</p>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Nama Perusahaan</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={companyForm.name}
                    onChange={(e) => setCompanyForm({...companyForm, name: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>NPWP</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={companyForm.npwp}
                    onChange={(e) => setCompanyForm({...companyForm, npwp: e.target.value})}
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.formLabel}>Alamat</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={companyForm.address}
                    onChange={(e) => setCompanyForm({...companyForm, address: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Telepon</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={companyForm.phone}
                    onChange={(e) => setCompanyForm({...companyForm, phone: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email HR</label>
                  <input
                    type="email"
                    className={styles.formInput}
                    value={companyForm.email}
                    onChange={(e) => setCompanyForm({...companyForm, email: e.target.value})}
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <button className={styles.btnPrimary} onClick={() => handleSave('Perusahaan')}>
                  <FloppyDisk size={18} />
                  Simpan Perubahan
                </button>
              </div>
            </div>
          )}

          {/* ===== PENGGAJIAN TAB (Admin only) ===== */}
          {activeTab === 'penggajian' && isAdmin && (
            <div className={styles.tabPanel}>
              <div className={styles.panelHeader}>
                <h2 className={styles.panelTitle}>Konfigurasi Penggajian</h2>
                <p className={styles.panelDesc}>Atur tarif pajak, tunjangan, lembur, dan potongan</p>
              </div>

              <div className={styles.configGrid}>
                {/* Tax Rate */}
                <div className={styles.configCard}>
                  <div className={styles.configIcon} style={{background: 'rgba(244, 63, 94, 0.15)', color: 'var(--danger)'}}>
                    <Percent size={22} weight="bold" />
                  </div>
                  <div className={styles.configInfo}>
                    <span className={styles.configLabel}>Tarif Pajak PPh21</span>
                    <span className={styles.configDesc}>Persentase potongan pajak dari bruto</span>
                  </div>
                  <div className={styles.configInput}>
                    <input
                      type="number"
                      className={styles.formInputSmall}
                      value={payrollForm.taxRate}
                      onChange={(e) => setPayrollForm({...payrollForm, taxRate: Number(e.target.value)})}
                    />
                    <span className={styles.inputSuffix}>%</span>
                  </div>
                </div>

                {/* Allowance Rate */}
                <div className={styles.configCard}>
                  <div className={styles.configIcon} style={{background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)'}}>
                    <Percent size={22} weight="bold" />
                  </div>
                  <div className={styles.configInfo}>
                    <span className={styles.configLabel}>Tunjangan Tetap</span>
                    <span className={styles.configDesc}>Persentase tunjangan dari gaji pokok</span>
                  </div>
                  <div className={styles.configInput}>
                    <input
                      type="number"
                      className={styles.formInputSmall}
                      value={payrollForm.allowanceRate}
                      onChange={(e) => setPayrollForm({...payrollForm, allowanceRate: Number(e.target.value)})}
                    />
                    <span className={styles.inputSuffix}>%</span>
                  </div>
                </div>

                {/* Overtime Rate */}
                <div className={styles.configCard}>
                  <div className={styles.configIcon} style={{background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent)'}}>
                    <Clock size={22} weight="fill" />
                  </div>
                  <div className={styles.configInfo}>
                    <span className={styles.configLabel}>Tarif Lembur / Jam</span>
                    <span className={styles.configDesc}>Upah per jam kerja lembur</span>
                  </div>
                  <div className={styles.configInput}>
                    <span className={styles.inputPrefix}>Rp</span>
                    <input
                      type="number"
                      className={styles.formInputSmall}
                      value={payrollForm.overtimeRate}
                      onChange={(e) => setPayrollForm({...payrollForm, overtimeRate: Number(e.target.value)})}
                    />
                  </div>
                </div>

                {/* Late Deduction */}
                <div className={styles.configCard}>
                  <div className={styles.configIcon} style={{background: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)'}}>
                    <WarningCircle size={22} weight="fill" />
                  </div>
                  <div className={styles.configInfo}>
                    <span className={styles.configLabel}>Potongan Terlambat</span>
                    <span className={styles.configDesc}>Potongan per hari keterlambatan</span>
                  </div>
                  <div className={styles.configInput}>
                    <span className={styles.inputPrefix}>Rp</span>
                    <input
                      type="number"
                      className={styles.formInputSmall}
                      value={payrollForm.lateDeduction}
                      onChange={(e) => setPayrollForm({...payrollForm, lateDeduction: Number(e.target.value)})}
                    />
                  </div>
                </div>

                {/* Absent Deduction */}
                <div className={styles.configCard}>
                  <div className={styles.configIcon} style={{background: 'rgba(244, 63, 94, 0.15)', color: 'var(--danger)'}}>
                    <WarningCircle size={22} weight="fill" />
                  </div>
                  <div className={styles.configInfo}>
                    <span className={styles.configLabel}>Potongan Absensi</span>
                    <span className={styles.configDesc}>Potongan per hari tidak hadir tanpa keterangan</span>
                  </div>
                  <div className={styles.configInput}>
                    <span className={styles.inputPrefix}>Rp</span>
                    <input
                      type="number"
                      className={styles.formInputSmall}
                      value={payrollForm.absentDeduction}
                      onChange={(e) => setPayrollForm({...payrollForm, absentDeduction: Number(e.target.value)})}
                    />
                  </div>
                </div>

                {/* Pay Date */}
                <div className={styles.configCard}>
                  <div className={styles.configIcon} style={{background: 'rgba(124, 58, 237, 0.15)', color: 'var(--primary)'}}>
                    <CurrencyDollar size={22} weight="fill" />
                  </div>
                  <div className={styles.configInfo}>
                    <span className={styles.configLabel}>Tanggal Gajian</span>
                    <span className={styles.configDesc}>Tanggal pembayaran gaji setiap bulan</span>
                  </div>
                  <div className={styles.configInput}>
                    <span className={styles.inputPrefix}>Tgl</span>
                    <input
                      type="number"
                      className={styles.formInputSmall}
                      value={payrollForm.payDate}
                      min={1}
                      max={31}
                      onChange={(e) => setPayrollForm({...payrollForm, payDate: Number(e.target.value)})}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.formActions}>
                <button className={styles.btnPrimary} onClick={() => handleSave('Penggajian')}>
                  <FloppyDisk size={18} />
                  Simpan Konfigurasi
                </button>
              </div>
            </div>
          )}

          {/* ===== NOTIFIKASI TAB ===== */}
          {activeTab === 'notifikasi' && (
            <div className={styles.tabPanel}>
              <div className={styles.panelHeader}>
                <h2 className={styles.panelTitle}>Preferensi Notifikasi</h2>
                <p className={styles.panelDesc}>Atur notifikasi yang ingin Anda terima</p>
              </div>

              <div className={styles.toggleList}>
                <div className={styles.toggleItem}>
                  <div className={styles.toggleInfo}>
                    <span className={styles.toggleLabel}>Slip Gaji via Email</span>
                    <span className={styles.toggleDesc}>Kirim slip gaji ke email setiap bulan</span>
                  </div>
                  <label className={styles.toggle}>
                    <input 
                      type="checkbox"
                      checked={notifications.emailPayslip}
                      onChange={(e) => setNotifications({...notifications, emailPayslip: e.target.checked})}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>

                <div className={styles.toggleItem}>
                  <div className={styles.toggleInfo}>
                    <span className={styles.toggleLabel}>Notifikasi Kehadiran</span>
                    <span className={styles.toggleDesc}>Pemberitahuan email jika absen tidak lengkap</span>
                  </div>
                  <label className={styles.toggle}>
                    <input 
                      type="checkbox"
                      checked={notifications.emailAttendance}
                      onChange={(e) => setNotifications({...notifications, emailAttendance: e.target.checked})}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>

                <div className={styles.toggleItem}>
                  <div className={styles.toggleInfo}>
                    <span className={styles.toggleLabel}>Notifikasi Lembur</span>
                    <span className={styles.toggleDesc}>Email ketika pengajuan lembur disetujui</span>
                  </div>
                  <label className={styles.toggle}>
                    <input 
                      type="checkbox"
                      checked={notifications.emailOvertime}
                      onChange={(e) => setNotifications({...notifications, emailOvertime: e.target.checked})}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>

                <div className={styles.toggleItem}>
                  <div className={styles.toggleInfo}>
                    <span className={styles.toggleLabel}>Notifikasi Browser</span>
                    <span className={styles.toggleDesc}>Aktifkan notifikasi push di browser</span>
                  </div>
                  <label className={styles.toggle}>
                    <input 
                      type="checkbox"
                      checked={notifications.browserNotif}
                      onChange={(e) => setNotifications({...notifications, browserNotif: e.target.checked})}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>
              </div>

              <div className={styles.formActions}>
                <button className={styles.btnPrimary} onClick={() => handleSave('Notifikasi')}>
                  <FloppyDisk size={18} />
                  Simpan Preferensi
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
