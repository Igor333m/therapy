import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Therapy Marketplace',
  description: 'Connect clients and therapists by language and country.'
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const locale = cookieStore.get('therapy-locale')?.value ?? 'en';

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
