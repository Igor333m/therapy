import Link from 'next/link'
import type { ReactNode } from 'react'
import type { AppLocale } from '@therapy/shared'
import { getDictionary } from '../../lib/i18n'

type PublicShellProps = {
  locale: AppLocale
  children: ReactNode
}

export function PublicShell({ locale, children }: PublicShellProps) {
  const dictionary = getDictionary(locale)
  const navItems = [
    { href: `/${locale}`, label: dictionary.nav.home },
    { href: `/${locale}/services`, label: dictionary.nav.services },
    { href: `/${locale}/therapists`, label: dictionary.nav.therapists },
    { href: `/${locale}/blog`, label: dictionary.nav.blog },
    { href: `/${locale}/faq`, label: dictionary.nav.faq },
    { href: `/${locale}/contact`, label: dictionary.nav.contact }
  ]

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,118,110,0.18),_transparent_42%),linear-gradient(180deg,_#f5f7f4_0%,_#eef3ef_55%,_#ffffff_100%)] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8">
        <header className="rounded-[2rem] border border-white/60 bg-white/75 px-6 py-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Link href={`/${locale}`} className="text-lg font-semibold tracking-[0.18em] text-teal-800 uppercase">
                {dictionary.brand}
              </Link>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">{dictionary.tagline}</p>
            </div>

            <nav className="flex flex-wrap gap-3 text-sm font-medium text-slate-700">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 transition hover:border-teal-300 hover:text-teal-800"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className="flex-1 py-10">{children}</main>
      </div>
    </div>
  )
}