import type { AppLocale } from '@therapy/shared'
import { getDictionary } from '../../../lib/i18n'
import { fetchPublicServices } from '../../../lib/public-api'

export default async function ServicesPage({
  params
}: {
  params: Promise<{ locale: AppLocale }>
}) {
  const { locale } = await params
  const dictionary = getDictionary(locale)
  const services = await fetchPublicServices(locale)

  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
      <h1 className="text-3xl font-semibold text-slate-900">{dictionary.services.title}</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{dictionary.services.description}</p>

      {services.length ? (
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <article key={service.slug} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{service.slug}</p>
              <h2 className="mt-3 text-xl font-semibold text-slate-900">{service.label}</h2>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-8 text-sm text-slate-600">{dictionary.services.empty}</p>
      )}
    </section>
  )
}