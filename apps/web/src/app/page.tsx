import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { isSupportedLocale } from '../lib/i18n';

export default async function HomePage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get('therapy-locale')?.value;

  redirect(isSupportedLocale(locale ?? '') ? `/${locale}` : '/en');
}
