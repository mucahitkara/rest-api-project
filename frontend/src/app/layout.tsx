import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/providers/QueryProvider';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LuminaFX — Digital Wallet',
  description: 'Multi-currency digital wallet. Exchange currencies, send money, manage wallets.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased`}>
        <Toaster richColors position="top-right" />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
