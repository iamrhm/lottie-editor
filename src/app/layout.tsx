import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import Header from '@/components/Header';
import AuthProvider from '@/scenes/auth/AuthProvider';
import GraphQlProvider from '@/service/graphql/Provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Lottie Editor',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={`${inter.className} min-h-screen`}>
        <Header />
        <GraphQlProvider>
          <AuthProvider>{children}</AuthProvider>
        </GraphQlProvider>
      </body>
    </html>
  );
}
