import Link from 'next/link'
import { cookies } from 'next/headers'
import type { AppLocale } from '@therapy/shared'
import { DEFAULT_COUNTRY_CODE, PUBLIC_COUNTRIES, PUBLIC_LANGUAGES, getDictionary } from '../../lib/i18n'
import { fetchPublicServices } from '../../lib/public-api'

export default async function LocalizedHomePage({
  params
}: {
  params: Promise<{ locale: AppLocale }>
}) {
  const { locale } = await params
  const dictionary = getDictionary(locale)
  const cookieStore = await cookies()
  const selectedCountry = cookieStore.get('therapy-country')?.value ?? DEFAULT_COUNTRY_CODE
  const services = await fetchPublicServices(locale)

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
        <article className="rounded-[2rem] border border-white/60 bg-slate-950 px-8 py-10 text-white shadow-[0_30px_90px_rgba(15,23,42,0.18)]">
          <p className="text-sm uppercase tracking-[0.24em] text-teal-300">{dictionary.home.eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
            {dictionary.home.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">{dictionary.home.description}</p>

          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <Link
              href={`/${locale}/therapists?country=${selectedCountry}`}
              className="rounded-full bg-teal-400 px-5 py-3 font-medium text-slate-950 hover:bg-teal-300"
            >
              {dictionary.therapists.title}
            </Link>
            <Link
              href={`/${locale}/services`}
              className="rounded-full border border-white/20 px-5 py-3 font-medium text-white hover:border-teal-300 hover:text-teal-200"
            >
              {dictionary.services.title}
            </Link>
          </div>
        </article>

        <aside className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
          <h2 className="text-xl font-semibold text-slate-900">{dictionary.home.filtersTitle}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{dictionary.home.filtersDescription}</p>

          <dl className="mt-6 space-y-5 text-sm">
            <div>
              <dt className="font-medium text-slate-500">{dictionary.localeLabel}</dt>
              <dd className="mt-1 text-slate-900">
                {PUBLIC_LANGUAGES.find((item) => item.code === locale)?.name[locale]}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">{dictionary.therapists.filters.country}</dt>
              <dd className="mt-1 text-slate-900">
                {PUBLIC_COUNTRIES.find((item) => item.code === selectedCountry)?.name[locale] ?? selectedCountry}
              </dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">{dictionary.home.servicesTitle}</h2>
            <p className="mt-2 text-sm text-slate-600">{dictionary.services.description}</p>
          </div>
          <Link href={`/${locale}/services`} className="text-sm font-medium text-teal-800 hover:text-teal-600">
            {dictionary.services.title}
          </Link>
        </div>

        {services.length ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service) => (
              <article
                key={service.slug}
                className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-6"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{service.slug}</p>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">{service.label}</h3>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-6 text-sm text-slate-600">{dictionary.home.servicesEmpty}</p>
        )}
      </section>
    </div>
  )
}