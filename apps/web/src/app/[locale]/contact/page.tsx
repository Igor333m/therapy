import type { AppLocale } from '@therapy/shared'
import { ContactForm } from '../../../components/public/contact-form'
import { getDictionary } from '../../../lib/i18n'

export default async function ContactPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: AppLocale }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { locale } = await params
  const resolvedSearchParams = await searchParams
  const dictionary = getDictionary(locale)
  const therapistSlug = Array.isArray(resolvedSearchParams.therapist)
    ? resolvedSearchParams.therapist[0]
    : resolvedSearchParams.therapist

  return (
    <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <article className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
        <h1 className="text-3xl font-semibold text-slate-900">{dictionary.contact.title}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">{dictionary.contact.description}</p>

        <div className="mt-8">
          <ContactForm
            locale={locale}
            dictionary={dictionary.contact.form}
            initialTherapistSlug={therapistSlug}
          />
        </div>
      </article>

      <aside className="rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white">
        <h2 className="text-lg font-semibold">therapy@example.com</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Inquiries sent from this form are stored in the contact inquiry queue with locale metadata for moderation and routing.
        </p>
      </aside>
    </section>
  )
}