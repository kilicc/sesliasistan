import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Şirinyer Sürücü Kursu - Sesli Asistan',
  description: 'Retell AI tabanlı sesli asistan sistemi',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}

