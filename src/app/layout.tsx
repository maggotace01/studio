import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans'; // Changed from next/font/google
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { PortfolioProvider } from '@/context/PortfolioProvider';
import AppShell from '@/components/layout/AppShell';

// Removed const geistSans = GeistSans(...) as GeistSans from geist/font/sans provides the variable directly

export const metadata: Metadata = {
  title: 'IndoSimVest - Simulasi Investasi Saham Indonesia',
  description: 'Platform simulasi investasi saham Indonesia dengan data real-time (mock) dan fitur portofolio virtual.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${GeistSans.variable} font-sans antialiased`}> {/* Use GeistSans.variable directly */}
        <PortfolioProvider>
          <AppShell>
            {children}
          </AppShell>
        </PortfolioProvider>
        <Toaster />
      </body>
    </html>
  );
}
