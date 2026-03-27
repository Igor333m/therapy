import type { AppLocale } from '@therapy/shared'
import { getDictionary } from '../../../lib/i18n'
import { fetchPublicFaq } from '../../../lib/public-api'

export default async function FaqPage({
  params
}: {
  params: Promise<{ locale: AppLocale }>
}) {
  const { locale } = await params
  const dictionary = getDictionary(locale)
  const entries = await fetchPublicFaq(locale)

  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
      <h1 className="text-3xl font-semibold text-slate-900">{dictionary.faq.title}</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{dictionary.faq.description}</p>

      {entries.length ? (
        <div className="mt-8 space-y-4">
          {entries.map((entry) => (
            <article key={entry.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-lg font-semibold text-slate-900">{entry.question}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{entry.answer}</p>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-8 text-sm text-slate-600">{dictionary.faq.empty}</p>
      )}
    </section>
  )
}