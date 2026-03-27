import Link from 'next/link'
import { cookies } from 'next/headers'
import type { AppLocale } from '@therapy/shared'
import {
  DEFAULT_COUNTRY_CODE,
  PUBLIC_COUNTRIES,
  PUBLIC_LANGUAGES,
  getCountryName,
  getDictionary,
  getLanguageName
} from '../../../lib/i18n'
import { fetchPublicServices, fetchPublicTherapists } from '../../../lib/public-api'

const firstValue = (value: string | string[] | undefined): string | undefined => {
  if (Array.isArray(value)) {
    return value[0]
  }

  return value
}

export default async function TherapistsPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: AppLocale }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { locale } = await params
  const resolvedSearchParams = await searchParams
  const dictionary = getDictionary(locale)
  const cookieStore = await cookies()
  const selectedCountry = firstValue(resolvedSearchParams.country) ?? cookieStore.get('therapy-country')?.value ?? DEFAULT_COUNTRY_CODE
  const selectedLanguage = firstValue(resolvedSearchParams.language)
  const selectedService = firstValue(resolvedSearchParams.service)

  const [therapists, services] = await Promise.all([
    fetchPublicTherapists({
      locale,
      countryCode: selectedCountry,
      languageCode: selectedLanguage,
      service: selectedService
    }),
    fetchPublicServices(locale)
  ])

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
        <h1 className="text-3xl font-semibold text-slate-900">{dictionary.therapists.title}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">{dictionary.therapists.description}</p>

        <form className="mt-8 grid gap-4 md:grid-cols-4 md:items-end">
          <label className="block text-sm">
            <span className="mb-2 block font-medium text-slate-700">{dictionary.therapists.filters.country}</span>
            <select
              name="country"
              defaultValue={selectedCountry}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-slate-900"
            >
              {PUBLIC_COUNTRIES.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name[locale]}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="mb-2 block font-medium text-slate-700">{dictionary.therapists.filters.language}</span>
            <select
              name="language"
              defaultValue={selectedLanguage ?? ''}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-slate-900"
            >
              <option value="">{dictionary.therapists.filters.allLanguages}</option>
              {PUBLIC_LANGUAGES.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.name[locale]}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="mb-2 block font-medium text-slate-700">{dictionary.therapists.filters.service}</span>
            <select
              name="service"
              defaultValue={selectedService ?? ''}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-slate-900"
            >
              <option value="">{dictionary.therapists.filters.allServices}</option>
              {services.map((service) => (
                <option key={service.slug} value={service.slug}>
                  {service.label}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
          >
            {dictionary.therapists.filters.apply}
          </button>
        </form>
      </section>

      {therapists.length ? (
        <section className="grid gap-5 lg:grid-cols-2">
          {therapists.map((therapist) => (
            <article
              key={therapist.slug}
              className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">{therapist.displayName}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{therapist.bio ?? dictionary.therapistProfile.notProvided}</p>
                </div>
                <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-teal-800">
                  {therapist.services.length}
                </span>
              </div>

              <dl className="mt-6 grid gap-4 text-sm text-slate-700 sm:grid-cols-2">
                <div>
                  <dt className="font-medium text-slate-500">{dictionary.therapistProfile.countries}</dt>
                  <dd className="mt-1">{therapist.countryCodes.map((item) => getCountryName(item, locale)).join(', ')}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-500">{dictionary.therapistProfile.languages}</dt>
                  <dd className="mt-1">{therapist.languageCodes.map((item) => getLanguageName(item, locale)).join(', ')}</dd>
                </div>
              </dl>

              <div className="mt-6 flex flex-wrap gap-2">
                {therapist.services.map((service) => (
                  <span key={service.slug} className="rounded-full bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700">
                    {service.label}
                  </span>
                ))}
              </div>

              <Link
                href={`/${locale}/therapists/${therapist.slug}`}
                className="mt-6 inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 hover:border-teal-400 hover:text-teal-800"
              >
                {dictionary.therapists.viewProfile}
              </Link>
            </article>
          ))}
        </section>
      ) : (
        <section className="rounded-[2rem] border border-dashed border-slate-300 bg-white/70 p-10 text-sm text-slate-600">
          {dictionary.therapists.empty}
        </section>
      )}
    </div>
  )
}