import type { Metadata } from 'next';
import './globals.css';
import React from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import { SessionAuthProvider } from '@/components/session-auth';
import { Toaster } from '@/components/ui/sonner';
import { QueryClientContext } from '@/providers/queryClient';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'OdontoPRO',
  description: 'Sua clínica odontológica em um click',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionAuthProvider>
          <QueryClientContext>
            <Toaster duration={2500} />
            {children}
          </QueryClientContext>
        </SessionAuthProvider>
      </body>
    </html>
  );
}
