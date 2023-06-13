import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ToastProvider } from '@/providers/toast-provider/ToastProvider';
import { AuthProvider } from '@/providers/auth-provider/AuthProvider';
import { getCurrentUser } from '@/actions/getCurrentUser';
import { OnlineStatus } from '@/components/OnlineStatus';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Messenger',
  description: 'Real time messenger',
  keywords: 'messenger, communication',
  robots: {
    index: true,
    follow: true,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    nocache: true,
  },
  manifest: '/manifest.json',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  return (
    <>
      <html lang="en">
        <body className={inter.className}>
          <ToastProvider />
          <OnlineStatus />
          <AuthProvider user={currentUser}>{children}</AuthProvider>
        </body>
      </html>
    </>
  );
}
