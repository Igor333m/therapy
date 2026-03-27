import { notFound } from 'next/navigation'
import type { AppLocale } from '@therapy/shared'
import { getCountryName, getDictionary, getLanguageName } from '../../../../lib/i18n'
import { fetchPublicTherapist } from '../../../../lib/public-api'

const formatPrice = (value: number | null, locale: AppLocale): string => {
  if (value === null) {
    return getDictionary(locale).therapistProfile.notProvided
  }

  return new Intl.NumberFormat(locale === 'sr' ? 'sr-RS' : 'en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value / 100)
}

export default async function TherapistProfilePage({
  params
}: {
  params: Promise<{ locale: AppLocale; slug: string }>
}) {
  const { locale, slug } = await params
  const dictionary = getDictionary(locale)
  const therapist = await fetchPublicTherapist(locale, slug)

  if (!therapist) {
    notFound()
  }

  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
      <h1 className="text-4xl font-semibold text-slate-900">{therapist.displayName}</h1>
      <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">
        {therapist.bio ?? dictionary.therapistProfile.notProvided}
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-lg font-semibold text-slate-900">{dictionary.therapistProfile.services}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {therapist.services.map((service) => (
              <span key={service.slug} className="rounded-full bg-white px-3 py-2 text-sm font-medium text-slate-800 ring-1 ring-slate-200">
                {service.label}
              </span>
            ))}
          </div>
        </article>

        <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
          <dl className="grid gap-4 text-sm text-slate-700">
            <div>
              <dt className="font-medium text-slate-500">{dictionary.therapistProfile.countries}</dt>
              <dd className="mt-1">{therapist.countryCodes.map((item) => getCountryName(item, locale)).join(', ')}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">{dictionary.therapistProfile.languages}</dt>
              <dd className="mt-1">{therapist.languageCodes.map((item) => getLanguageName(item, locale)).join(', ')}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">{dictionary.therapistProfile.experience}</dt>
              <dd className="mt-1">
                {therapist.yearsExperience ?? dictionary.therapistProfile.notProvided}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">{dictionary.therapistProfile.price}</dt>
              <dd className="mt-1">{formatPrice(therapist.sessionPriceUsdCents, locale)}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">{dictionary.therapistProfile.timezone}</dt>
              <dd className="mt-1">{therapist.timezone ?? dictionary.therapistProfile.notProvided}</dd>
            </div>
          </dl>
        </article>
      </div>
    </section>
  )
}