import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Therapy Marketplace',
  description: 'Connect clients and therapists by language and country.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
