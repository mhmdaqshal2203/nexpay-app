'use client';

import { useState } from 'react';
import { useEmployees } from '@/context/EmployeeContext';
import { 
  Receipt, Printer, X, CheckCircle, 
  Money, TrendUp, TrendDown, Calculator,
  DownloadSimple
} from '@phosphor-icons/react';
import Modal from '@/components/Modal';
import styles from './Payroll.module.css';

export default function Payroll() {
  const { employees, formatIDR } = useEmployees();
  const [selectedEmp, setSelectedEmp] = useState(null);

  const calculatePayroll = (salary) => {
    const allowance = salary * 0.20;
    const tax = (salary + allowance) * 0.05;
    const net = salary + allowance - tax;
    return { allowance, tax, net };
  };

  const totalBase = employees.reduce((acc, emp) => acc + emp.salary, 0);
  const totalAllowance = totalBase * 0.20;
  const totalTax = (totalBase + totalAllowance) * 0.05;
  const totalNet = totalBase + totalAllowance - totalTax;

  const handlePrint = () => window.print();

  const now = new Date();
  const date = now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  return (
    <div className={`page-content ${styles.page}`}>

      {/* Page Header */}
      <div className={`${styles.pageHeader} animate-fade-in`}>
        <div>
          <h1 className="section-title">Kalkulasi Penggajian</h1>
          <p className="section-subtitle">Periode {date} · {employees.length} karyawan</p>
        </div>
        <div className={styles.headerActions}>
          <button className="btn-secondary" id="btn-export">
            <DownloadSimple size={18} />
            Export
          </button>
        </div>
      </div>

      {/* Summary Bar */}
      <div className={`${styles.summaryBar} animate-fade-in-delay-1`}>
        <div className={styles.summaryItem}>
          <div className={`${styles.summaryIcon} ${styles.baseIcon}`}>
            <Money size={18} weight="fill" />
          </div>
          <div>
            <p className={styles.summaryLabel}>Total Gaji Pokok</p>
            <p className={styles.summaryValue}>{formatIDR(totalBase)}</p>
          </div>
        </div>
        <div className={styles.summaryDivider} />
        <div className={styles.summaryItem}>
          <div className={`${styles.summaryIcon} ${styles.allowanceIcon}`}>
            <TrendUp size={18} weight="fill" />
          </div>
          <div>
            <p className={styles.summaryLabel}>Total Tunjangan</p>
            <p className={`${styles.summaryValue} ${styles.positive}`}>+{formatIDR(totalAllowance)}</p>
          </div>
        </div>
        <div className={styles.summaryDivider} />
        <div className={styles.summaryItem}>
          <div className={`${styles.summaryIcon} ${styles.taxIcon}`}>
            <TrendDown size={18} weight="fill" />
          </div>
          <div>
            <p className={styles.summaryLabel}>Total Potongan Pajak</p>
            <p className={`${styles.summaryValue} ${styles.negative}`}>-{formatIDR(totalTax)}</p>
          </div>
        </div>
        <div className={styles.summaryDivider} />
        <div className={`${styles.summaryItem} ${styles.netItem}`}>
          <div className={`${styles.summaryIcon} ${styles.netIcon}`}>
            <Calculator size={18} weight="fill" />
          </div>
          <div>
            <p className={styles.summaryLabel}>Total Bersih</p>
            <p className={`${styles.summaryValue} ${styles.netValue}`}>{formatIDR(totalNet)}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={`glass-panel ${styles.tablePanel} animate-fade-in-delay-2`}>
        <div className={styles.tablePanelHeader}>
          <h2 className={styles.tablePanelTitle}>Rincian Per Karyawan</h2>
          <div className={styles.tableLegend}>
            <span className={`${styles.legendDot} ${styles.baseDot}`} /> Pokok
            <span className={`${styles.legendDot} ${styles.allowDot}`} /> Tunjangan
            <span className={`${styles.legendDot} ${styles.taxDot}`} /> Pajak
          </div>
        </div>
        <div className="table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Karyawan</th>
                <th>Gaji Pokok</th>
                <th>Tunjangan (20%)</th>
                <th>Potongan Pajak (5%)</th>
                <th>Gaji Bersih</th>
                <th>Slip</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, i) => {
                const { allowance, tax, net } = calculatePayroll(emp.salary);
                return (
                  <tr key={emp.id} className={styles.tableRow}>
                    <td className={styles.rowNumber}>{i + 1}</td>
                    <td>
                      <div className="avatar-cell">
                        <img src={emp.avatar} alt={emp.name} className="avatar" />
                        <div>
                          <div className={styles.empName}>{emp.name}</div>
                          <div className={styles.empPos}>{emp.position}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={styles.salaryBase}>{formatIDR(emp.salary)}</span>
                    </td>
                    <td>
                      <span className={styles.allowanceVal}>+{formatIDR(allowance)}</span>
                    </td>
                    <td>
                      <span className={styles.taxVal}>-{formatIDR(tax)}</span>
                    </td>
                    <td>
                      <span className={styles.netVal}>{formatIDR(net)}</span>
                    </td>
                    <td>
                      <button
                        className={styles.slipBtn}
                        onClick={() => setSelectedEmp(emp)}
                        id={`slip-${emp.id}`}
                      >
                        <Receipt size={15} weight="fill" />
                        Slip
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payslip Modal */}
      <Modal
        isOpen={!!selectedEmp}
        onClose={() => setSelectedEmp(null)}
        title=""
      >
        {selectedEmp && (() => {
          const { allowance, tax, net } = calculatePayroll(selectedEmp.salary);
          const netPct = Math.round((net / (selectedEmp.salary + allowance)) * 100);
          return (
            <div className={styles.payslip} id="payslip-content">
              {/* Payslip Header */}
              <div className={styles.payslipHeader}>
                <div className={styles.payslipLogo}>
                  <div className={styles.payslipLogoIcon}>₦</div>
                  <div>
                    <h2 className={styles.payslipBrand}>NexPay</h2>
                    <p className={styles.payslipTagline}>Payroll Management System</p>
                  </div>
                </div>
                <div className={styles.payslipMeta}>
                  <span className={styles.payslipPeriodLabel}>SLIP GAJI</span>
                  <span className={styles.payslipPeriod}>{date}</span>
                </div>
              </div>

              {/* Employee Info */}
              <div className={styles.payslipEmpCard}>
                <img src={selectedEmp.avatar} alt={selectedEmp.name} className={styles.payslipAvatar} />
                <div className={styles.payslipEmpInfo}>
                  <h3 className={styles.payslipEmpName}>{selectedEmp.name}</h3>
                  <p className={styles.payslipEmpPos}>{selectedEmp.position}</p>
                  <code className={styles.payslipEmpId}>{selectedEmp.id}</code>
                </div>
                <div className={styles.payslipStatus}>
                  <CheckCircle size={16} weight="fill" />
                  Disetujui
                </div>
              </div>

              {/* Earnings */}
              <div className={styles.payslipSection}>
                <h4 className={styles.payslipSectionTitle}>Rincian Pembayaran</h4>
                <div className={styles.payslipRows}>
                  <div className={styles.payslipRow}>
                    <span className={styles.payslipRowLabel}>Gaji Pokok</span>
                    <span className={styles.payslipRowValue}>{formatIDR(selectedEmp.salary)}</span>
                  </div>
                  <div className={styles.payslipRow}>
                    <span className={styles.payslipRowLabel}>Tunjangan (20%)</span>
                    <span className={`${styles.payslipRowValue} ${styles.positive}`}>
                      + {formatIDR(allowance)}
                    </span>
                  </div>
                  <div className={`${styles.payslipRow} ${styles.deductRow}`}>
                    <span className={styles.payslipRowLabel}>Potongan Pajak PPh21 (5%)</span>
                    <span className={`${styles.payslipRowValue} ${styles.negative}`}>
                      - {formatIDR(tax)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Net Total */}
              <div className={styles.payslipNetSection}>
                <div className={styles.payslipNetLeft}>
                  <p className={styles.payslipNetLabel}>Total Penerimaan Bersih</p>
                  <div className={styles.payslipNetBar}>
                    <div className={styles.payslipNetBarFill} style={{ width: `${netPct}%` }} />
                  </div>
                  <p className={styles.payslipNetPct}>{netPct}% dari total bruto</p>
                </div>
                <div className={styles.payslipNetAmount}>{formatIDR(net)}</div>
              </div>

              {/* Actions */}
              <div className={styles.payslipActions}>
                <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setSelectedEmp(null)}>
                  <X size={16} /> Tutup
                </button>
                <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handlePrint}>
                  <Printer size={16} /> Cetak Slip
                </button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
