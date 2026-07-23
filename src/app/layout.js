import { Inter } from 'next/font/google';
import './globals.css';
import { EmployeeProvider } from '@/context/EmployeeContext';
import { AuthProvider } from '@/context/AuthContext';
import { ActivityProvider } from '@/context/ActivityContext';
import { ThemeProvider } from '@/context/ThemeContext';
import AppShell from '@/components/AppShell';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'NexPay - Web Penggajian Karyawan',
  description: 'Premium Payroll Management System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <EmployeeProvider>
              <ActivityProvider>
                <AppShell>{children}</AppShell>
              </ActivityProvider>
            </EmployeeProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
