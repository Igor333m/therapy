import { CORE_SERVICES, SUPPORTED_LOCALES, type AppLocale } from '@therapy/shared';

const countries = [
  { code: 'RS', name: 'Serbia' },
  { code: 'DE', name: 'Germany' },
  { code: 'AT', name: 'Austria' },
  { code: 'US', name: 'United States' }
];

function localeLabel(locale: AppLocale): string {
  return locale === 'en' ? 'English' : 'Serbian';
}

export default function HomePage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-16">
      <section className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-3xl font-semibold tracking-tight text-brand-700">
          Therapy Marketplace MVP
        </h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          Start with language and country, then discover therapists who match both.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Language</span>
            <select className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
              {SUPPORTED_LOCALES.map((locale) => (
                <option key={locale} value={locale}>
                  {localeLabel(locale)}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Country</span>
            <select className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-900">Available Services</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {CORE_SERVICES.map((service) => (
            <article key={service} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h3 className="font-medium capitalize text-slate-900">{service.replaceAll('-', ' ')}</h3>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
