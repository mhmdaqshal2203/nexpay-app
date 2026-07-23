'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, Briefcase, Money, ChartBar } from '@phosphor-icons/react';
import styles from './Login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError('');
    setIsSubmitting(true);

    // Simulate network delay for UX
    await new Promise((r) => setTimeout(r, 800));

    const result = await login(username, password);
    if (result.success) {
      router.replace('/');
    } else {
      setError(result.message);
      setIsSubmitting(false);
    }
  };

  if (!mounted || isLoading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingSpinner} />
      </div>
    );
  }

  if (isAuthenticated) return null;

  return (
    <div className={styles.loginPage}>
      {/* Theme Toggle */}
      <button 
        onClick={toggleTheme} 
        className={styles.themeToggle}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun size={24} weight="fill" /> : <Moon size={24} weight="fill" />}
      </button>

      {/* Animated background orbs */}
      <div className={styles.bgOrb1} />
      <div className={styles.bgOrb2} />
      <div className={styles.bgOrb3} />

      {/* Floating particles */}
      <div className={styles.particles}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className={`${styles.particle} ${styles[`p${i + 1}`]}`} />
        ))}
      </div>

      <div className={styles.loginContainer}>
        {/* Left panel - branding */}
        <div className={styles.brandPanel}>
          <div className={styles.brandContent}>
            <div className={styles.logoMark}>
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.logoSvg}>
                <rect width="40" height="40" rx="12" fill="url(#grad)" />
                <path d="M10 28L15 12L20 22L25 16L30 28" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#7c3aed" />
                    <stop offset="1" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1 className={styles.brandName}>NexPay</h1>
            <p className={styles.brandTagline}>Sistem Penggajian Karyawan</p>

            <div className={styles.brandFeatures}>
              {[
                { icon: <Briefcase size={28} weight="duotone" color="#7c3aed" />, title: 'Manajemen Karyawan', desc: 'Kelola data lengkap seluruh karyawan', bg: 'rgba(124, 58, 237, 0.15)' },
                { icon: <Money size={28} weight="duotone" color="#ec4899" />, title: 'Kalkulasi Gaji Otomatis', desc: 'Hitung gaji, tunjangan & pajak PPh21', bg: 'rgba(236, 72, 153, 0.15)' },
                { icon: <ChartBar size={28} weight="duotone" color="#06b6d4" />, title: 'Laporan Real-time', desc: 'Dashboard analitik data penggajian', bg: 'rgba(6, 182, 212, 0.15)' },
              ].map((f, i) => (
                <div key={i} className={styles.featureItem} style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
                  <div className={styles.featureIcon} style={{ background: f.bg }}>{f.icon}</div>
                  <div>
                    <div className={styles.featureTitle}>{f.title}</div>
                    <div className={styles.featureDesc}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.brandBadge}>
              <span className={styles.badgeDot} />
              Sistem aktif &amp; aman
            </div>
          </div>
        </div>

        {/* Right panel - form */}
        <div className={styles.formPanel}>
          <div className={styles.formCard}>
            <div className={styles.formHeader}>
              <div className={styles.formLogoSmall}>
                <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
                  <rect width="32" height="32" rx="10" fill="url(#grad2)" />
                  <path d="M8 22L12 10L16 18L20 13L24 22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <defs>
                    <linearGradient id="grad2" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#7c3aed" />
                      <stop offset="1" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h2 className={styles.formTitle}>Selamat Datang</h2>
              <p className={styles.formSubtitle}>Masuk ke akun NexPay Anda</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form} id="login-form">
              {/* Username */}
              <div className={styles.inputGroup}>
                <label htmlFor="username" className={styles.label}>
                  Username
                </label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>
                    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                      <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm-6 8a6 6 0 1112 0H4z" />
                    </svg>
                  </span>
                  <input
                    id="username"
                    type="text"
                    className={`${styles.input} ${error ? styles.inputError : ''}`}
                    placeholder="Masukkan username"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setError(''); }}
                    autoComplete="username"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Password */}
              <div className={styles.inputGroup}>
                <label htmlFor="password" className={styles.label}>
                  Password
                </label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>
                    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className={`${styles.input} ${styles.inputPadded} ${error ? styles.inputError : ''}`}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    autoComplete="current-password"
                    required
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                        <path d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className={styles.errorMsg} id="login-error">
                  <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                id="btn-login"
                className={`${styles.submitBtn} ${isSubmitting ? styles.submitting : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className={styles.btnSpinner} />
                    Memverifikasi...
                  </>
                ) : (
                  <>
                    Login
                  </>
                )}
              </button>

              {/* Hint */}
              <div className={styles.hint}>
                <span className={styles.hintIcon}>💡</span>
                <span>Demo: username <code className={styles.code}>admin</code> / password <code className={styles.code}>admin</code></span>
              </div>
            </form>
          </div>

          <p className={styles.footer}>
            © {new Date().getFullYear()} NexPay · Sistem Penggajian Premium
          </p>
        </div>
      </div>
    </div>
  );
}
