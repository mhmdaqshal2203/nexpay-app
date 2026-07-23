'use client';

import { useEmployees } from '@/context/EmployeeContext';
import { 
  Users, 
  Money, 
  TrendUp, 
  ArrowUpRight,
  ArrowDownRight,
  ChartLine,
  CurrencyDollar,
  UserCheck,
  CalendarBlank,
  Confetti,
  CalendarCheck,
  AirplaneTilt
} from '@phosphor-icons/react';
import styles from './Dashboard.module.css';
import { useAuth } from '@/context/AuthContext';
import EmployeeDashboard from '@/components/EmployeeDashboard';
import { useActivity } from '@/context/ActivityContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

function AdminDashboard() {
  const { employees, formatIDR } = useEmployees();
  const { attendances, leaves, updateLeaveStatus } = useActivity();

  const totalBase = employees.reduce((acc, emp) => acc + emp.salary, 0);
  const totalAllowance = totalBase * 0.20;
  const totalTax = (totalBase + totalAllowance) * 0.05;
  const totalNet = totalBase + totalAllowance - totalTax;
  const avgSalary = employees.length > 0 ? totalBase / employees.length : 0;

  const recentEmployees = [...employees].reverse().slice(0, 5);

  const now = new Date();
  const month = now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  // 1. Data for Salary by Position (BarChart)
  const salaryByPositionMap = employees.reduce((acc, emp) => {
    if (!acc[emp.position]) {
      acc[emp.position] = { position: emp.position, totalSalary: 0, count: 0 };
    }
    acc[emp.position].totalSalary += emp.salary;
    acc[emp.position].count += 1;
    return acc;
  }, {});

  const salaryByPositionData = Object.values(salaryByPositionMap)
    .map(item => ({
      position: item.position,
      rataRataGaji: item.totalSalary / item.count,
      totalGaji: item.totalSalary
    }))
    .sort((a, b) => b.totalGaji - a.totalGaji);

  // 2. Data for Attendance (PieChart)
  const attendanceMap = attendances.reduce((acc, att) => {
    acc[att.status] = (acc[att.status] || 0) + 1;
    return acc;
  }, {});

  const attendanceData = Object.keys(attendanceMap).map(status => ({
    name: status,
    value: attendanceMap[status]
  }));

  const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#6366F1', '#8B5CF6', '#EC4899']; // Color palette

  const statCards = [
    {
      label: 'Total Karyawan',
      value: employees.length,
      sub: 'Aktif bulan ini',
      icon: UserCheck,
      gradient: 'violet',
      trend: '+1 bulan ini',
      trendUp: true,
    },
    {
      label: 'Estimasi Penggajian',
      value: formatIDR(totalNet),
      sub: `Periode ${month}`,
      icon: Money,
      gradient: 'cyan',
      trend: 'Net setelah pajak',
      trendUp: true,
    },
    {
      label: 'Rata-rata Gaji',
      value: formatIDR(avgSalary),
      sub: 'Per karyawan / bulan',
      icon: ChartLine,
      gradient: 'pink',
      trend: 'Gaji pokok',
      trendUp: true,
    },
    {
      label: 'Total Potongan Pajak',
      value: formatIDR(totalTax),
      sub: 'PPh21 (5%)',
      icon: CurrencyDollar,
      gradient: 'amber',
      trend: 'Dari bruto',
      trendUp: false,
    },
  ];

  return (
    <div className={`page-content ${styles.dashboard}`}>

      {/* Welcome Banner */}
      <div className={`${styles.welcomeBanner} animate-fade-in`}>
        <div className={styles.welcomeLeft}>
          <div className={styles.welcomeIcon}>
            <Confetti size={24} weight="fill" color="white" />
          </div>
          <div>
            <h2 className={styles.welcomeTitle}>Selamat Datang kembali, Admin HR! 👋</h2>
            <p className={styles.welcomeSub}>Berikut ringkasan data penggajian terbaru Anda.</p>
          </div>
        </div>
        <div className={styles.welcomePeriod}>
          <CalendarBlank size={16} />
          <span>Periode: {month}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className={`${styles.statCard} ${styles[card.gradient]} animate-fade-in-delay-${i + 1}`}
            >
              <div className={styles.statCardTop}>
                <div className={`${styles.statIcon} ${styles[`${card.gradient}Icon`]}`}>
                  <Icon size={22} weight="fill" />
                </div>
                <div className={`${styles.statTrend} ${card.trendUp ? styles.trendUp : styles.trendDown}`}>
                  {card.trendUp
                    ? <ArrowUpRight size={14} />
                    : <ArrowDownRight size={14} />
                  }
                  <span>{card.trend}</span>
                </div>
              </div>
              <div className={styles.statValue}>{card.value}</div>
              <div className={styles.statLabel}>{card.label}</div>
              <div className={styles.statSub}>{card.sub}</div>
              {/* Decorative glow orb */}
              <div className={styles.statOrb} />
            </div>
          );
        })}
      </div>

      {/* Analytics Section */}
      <div className={styles.analyticsGrid}>
        
        {/* Salary Distribution Bar Chart */}
        <div className={`glass-panel ${styles.chartCard} animate-fade-in-delay-3`}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className="section-title">Distribusi Gaji per Jabatan</h2>
              <p className="section-subtitle">Total gaji berdasarkan peran karyawan</p>
            </div>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryByPositionData} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="position" 
                  stroke="var(--text-secondary)" 
                  tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} 
                  axisLine={false} 
                  tickLine={false}
                />
                <YAxis 
                  stroke="var(--text-secondary)" 
                  tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} 
                  axisLine={false} 
                  tickLine={false}
                  tickFormatter={(value) => `Rp${(value/1000000).toFixed(0)}M`}
                />
                <RechartsTooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
                  formatter={(value) => formatIDR(value)}
                  labelStyle={{ color: 'var(--text-secondary)', marginBottom: '5px' }}
                />
                <Bar dataKey="totalGaji" name="Total Gaji" fill="var(--primary)" radius={[6, 6, 0, 0]}>
                  {salaryByPositionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attendance Ratio Pie Chart */}
        <div className={`glass-panel ${styles.chartCard} animate-fade-in-delay-3`}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className="section-title">Rasio Kehadiran</h2>
              <p className="section-subtitle">Distribusi status absensi karyawan</p>
            </div>
          </div>
          <div className={styles.chartContainer}>
            {attendanceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 20 }}>
                  <Pie
                    data={attendanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {attendanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(value) => <span style={{ color: 'var(--text-primary)', fontSize: '13px' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className={styles.emptyChart}>Belum ada data absensi</div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className={styles.bottomGrid}>
        {/* Recent Employees */}
        <div className={`glass-panel ${styles.recentSection} animate-fade-in-delay-3`}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className="section-title">Karyawan Terbaru</h2>
              <p className="section-subtitle">5 karyawan yang terakhir ditambahkan</p>
            </div>
            <a href="/employees" className={styles.viewAll}>
              Lihat Semua
              <ArrowUpRight size={14} />
            </a>
          </div>
          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Karyawan</th>
                  <th>Jabatan</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentEmployees.map((emp, i) => (
                  <tr key={emp.id}>
                    <td>
                      <code className={styles.empId}>{emp.id}</code>
                    </td>
                    <td>
                      <div className="avatar-cell">
                        <img src={emp.avatar} alt={emp.name} className="avatar" />
                        <div>
                          <div className="avatar-cell name">{emp.name}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={styles.positionBadge}>{emp.position}</span>
                    </td>
                    <td>
                      <span className="badge active">Aktif</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payroll Summary */}
        <div className={`glass-panel ${styles.summarySection} animate-fade-in-delay-4`}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className="section-title">Ringkasan Gaji</h2>
              <p className="section-subtitle">Kalkulasi bulan {month}</p>
            </div>
          </div>

          <div className={styles.summaryItems}>
            <div className={styles.summaryItem}>
              <div className={styles.summaryDot} style={{ background: 'var(--primary-light)' }} />
              <div className={styles.summaryInfo}>
                <span className={styles.summaryLabel}>Total Gaji Pokok</span>
                <span className={styles.summaryValue}>{formatIDR(totalBase)}</span>
              </div>
            </div>
            <div className={styles.summaryItem}>
              <div className={styles.summaryDot} style={{ background: 'var(--success)' }} />
              <div className={styles.summaryInfo}>
                <span className={styles.summaryLabel}>Total Tunjangan (20%)</span>
                <span className={`${styles.summaryValue} ${styles.positive}`}>+ {formatIDR(totalAllowance)}</span>
              </div>
            </div>
            <div className={styles.summaryItem}>
              <div className={styles.summaryDot} style={{ background: 'var(--danger)' }} />
              <div className={styles.summaryInfo}>
                <span className={styles.summaryLabel}>Total Potongan Pajak (5%)</span>
                <span className={`${styles.summaryValue} ${styles.negative}`}>- {formatIDR(totalTax)}</span>
              </div>
            </div>

            <div className="divider" />

            <div className={styles.summaryTotal}>
              <span className={styles.summaryTotalLabel}>Total Penerimaan Bersih</span>
              <span className={styles.summaryTotalValue}>{formatIDR(totalNet)}</span>
            </div>
          </div>

          {/* Visual bar */}
          <div className={styles.payrollBar}>
            <div className={styles.payrollBarFill} style={{ 
              width: `${(totalNet / (totalBase + totalAllowance)) * 100}%` 
            }} />
          </div>
          <p className={styles.payrollBarLabel}>
            {Math.round((totalNet / (totalBase + totalAllowance)) * 100)}% dari total bruto
          </p>

          <a href="/payroll" className={`btn-primary ${styles.fullWidthBtn}`}>
            <TrendUp size={18} />
            Lihat Kalkulasi Lengkap
          </a>
        </div>
      </div>

      {/* Activity Grid (Integrasi Karyawan) */}
      <div className={styles.activityGrid}>
        
        {/* Kehadiran Hari Ini */}
        <div className={`glass-panel animate-fade-in-delay-4`}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className="section-title">Kehadiran Hari Ini</h2>
              <p className="section-subtitle">Aktivitas absensi terbaru</p>
            </div>
          </div>
          <div className={styles.activityList}>
            {attendances.slice(0, 5).length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>Belum ada yang absen masuk hari ini.</p>
            ) : (
              attendances.slice(0, 5).map((att, i) => (
                <div key={i} className={styles.activityItem}>
                  <div className={styles.activityInfo}>
                    <div className={`${styles.activityIcon} ${att.status === 'Terlambat' ? styles.iconWarning : styles.iconSuccess}`}>
                      <CalendarCheck size={20} weight="fill" />
                    </div>
                    <div>
                      <div className={styles.activityName}>{att.name}</div>
                      <div className={styles.activityDesc}>Absen Masuk • {att.status}</div>
                    </div>
                  </div>
                  <div className={`${styles.activityTime} ${att.status === 'Terlambat' ? styles.negative : styles.positive}`}>
                    {att.time} WIB
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Permohonan Cuti */}
        <div className={`glass-panel animate-fade-in-delay-5`}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className="section-title">Permohonan Cuti</h2>
              <p className="section-subtitle">Menunggu persetujuan Anda</p>
            </div>
          </div>
          <div className={styles.activityList}>
            
            {leaves.filter(l => l.status === 'Menunggu').length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>Tidak ada permohonan cuti baru.</p>
            ) : (
              leaves.filter(l => l.status === 'Menunggu').slice(0, 3).map((req, i) => (
                <div key={i} className={styles.activityItem}>
                  <div className={styles.activityInfo}>
                    <div className={`${styles.activityIcon} ${styles.iconWarning}`}>
                      <AirplaneTilt size={20} weight="fill" />
                    </div>
                    <div>
                      <div className={styles.activityName}>{req.name}</div>
                      <div className={styles.activityDesc}>{req.type}</div>
                    </div>
                  </div>
                  <button 
                    className={`${styles.actionBtn} ${styles.btnApprove}`}
                    onClick={() => updateLeaveStatus(req.id, 'Disetujui')}
                  >
                    Setujui
                  </button>
                </div>
              ))
            )}
            
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  
  // If the user's role is 'Karyawan', show the employee dashboard
  if (user?.role === 'Karyawan') {
    return <EmployeeDashboard />;
  }

  // Otherwise, default to the Admin dashboard
  return <AdminDashboard />;
}
