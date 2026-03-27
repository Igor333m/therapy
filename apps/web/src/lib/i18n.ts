import { SUPPORTED_LOCALES, type AppLocale } from '@therapy/shared'

export const PUBLIC_COUNTRIES = [
  { code: 'RS', name: { en: 'Serbia', sr: 'Srbija' } },
  { code: 'DE', name: { en: 'Germany', sr: 'Nemacka' } },
  { code: 'AT', name: { en: 'Austria', sr: 'Austrija' } },
  { code: 'US', name: { en: 'United States', sr: 'Sjedinjene Drzave' } }
] as const

export const PUBLIC_LANGUAGES = [
  { code: 'en', name: { en: 'English', sr: 'Engleski' } },
  { code: 'sr', name: { en: 'Serbian', sr: 'Srpski' } }
] as const

export const DEFAULT_COUNTRY_CODE = 'RS'

export const dictionaries = {
  en: {
    brand: 'Therapy Marketplace',
    tagline: 'Find therapists by language, country, and service type.',
    nav: {
      home: 'Home',
      services: 'Services',
      therapists: 'Therapists',
      blog: 'Blog',
      faq: 'FAQ',
      contact: 'Contact'
    },
    home: {
      eyebrow: 'Bilingual therapy search',
      title: 'Care discovery built for people living across borders',
      description:
        'Start with your country and language, then browse approved therapists who actually match both.',
      filtersTitle: 'Start your search',
      filtersDescription: 'Discovery uses the same public filters as the therapist listing.',
      servicesTitle: 'Core services',
      servicesEmpty: 'No services are available yet.'
    },
    services: {
      title: 'Services',
      description: 'The service catalog is localized and shared across the public discovery flow.',
      empty: 'No public services are available yet.'
    },
    therapists: {
      title: 'Therapist discovery',
      description: 'Only approved therapists appear here.',
      empty: 'No therapists match the selected filters yet.',
      viewProfile: 'View profile',
      filters: {
        country: 'Country',
        language: 'Language',
        service: 'Service',
        allLanguages: 'All languages',
        allServices: 'All services',
        apply: 'Apply filters'
      }
    },
    therapistProfile: {
      countries: 'Countries',
      languages: 'Languages',
      services: 'Services',
      experience: 'Years of experience',
      price: 'Session price',
      timezone: 'Timezone',
      notProvided: 'Not provided'
    },
    blog: {
      title: 'Blog',
      description: 'Localized therapist and marketplace content.',
      empty: 'No published posts are available in this locale yet.',
      readMore: 'Read article'
    },
    faq: {
      title: 'FAQ',
      description: 'Frequently asked questions for clients and therapists.',
      empty: 'No FAQ entries are published for this locale yet.'
    },
    contact: {
      title: 'Contact',
      description:
        'Send a message and our team will route your inquiry to the right therapist or support flow.',
      form: {
        name: 'Full name',
        email: 'Email address',
        message: 'How can we help?',
        therapistSlug: 'Therapist slug (optional)',
        submit: 'Send inquiry',
        sending: 'Sending...',
        success: 'Inquiry sent successfully. We will follow up soon.',
        error: 'Unable to send inquiry right now. Please try again in a moment.'
      }
    },
    localeLabel: 'Language'
  },
  sr: {
    brand: 'Therapy Marketplace',
    tagline: 'Pronadjite terapeute po jeziku, drzavi i vrsti usluge.',
    nav: {
      home: 'Pocetna',
      services: 'Usluge',
      therapists: 'Terapeuti',
      blog: 'Blog',
      faq: 'FAQ',
      contact: 'Kontakt'
    },
    home: {
      eyebrow: 'Dvojezicna pretraga terapije',
      title: 'Pretraga terapeuta za ljude koji zive izmedju drzava i jezika',
      description:
        'Izaberite drzavu i jezik, pa pregledajte odobrene terapeute koji zaista pokrivaju oba filtera.',
      filtersTitle: 'Pokrenite pretragu',
      filtersDescription: 'Javni filteri su isti kao na listi terapeuta.',
      servicesTitle: 'Osnovne usluge',
      servicesEmpty: 'Jos nema javno dostupnih usluga.'
    },
    services: {
      title: 'Usluge',
      description: 'Katalog usluga je lokalizovan i koristi se u javnoj pretrazi.',
      empty: 'Jos nema javno dostupnih usluga.'
    },
    therapists: {
      title: 'Pretraga terapeuta',
      description: 'Ovde su prikazani samo odobreni terapeuti.',
      empty: 'Nijedan terapeut ne odgovara izabranim filterima.',
      viewProfile: 'Pogledaj profil',
      filters: {
        country: 'Drzava',
        language: 'Jezik',
        service: 'Usluga',
        allLanguages: 'Svi jezici',
        allServices: 'Sve usluge',
        apply: 'Primeni filtere'
      }
    },
    therapistProfile: {
      countries: 'Drzave',
      languages: 'Jezici',
      services: 'Usluge',
      experience: 'Godine iskustva',
      price: 'Cena sesije',
      timezone: 'Vremenska zona',
      notProvided: 'Nije uneto'
    },
    blog: {
      title: 'Blog',
      description: 'Lokalizovan sadrzaj terapeuta i platforme.',
      empty: 'Jos nema objavljenih tekstova za ovaj jezik.',
      readMore: 'Otvori tekst'
    },
    faq: {
      title: 'FAQ',
      description: 'Najcesca pitanja za klijente i terapeute.',
      empty: 'Jos nema objavljenih FAQ stavki za ovaj jezik.'
    },
    contact: {
      title: 'Kontakt',
      description:
        'Posaljite poruku i nas tim ce proslediti upit odgovarajucem terapeutu ili timu za podrsku.',
      form: {
        name: 'Ime i prezime',
        email: 'Email adresa',
        message: 'Kako mozemo da pomognemo?',
        therapistSlug: 'Slug terapeuta (opciono)',
        submit: 'Posalji upit',
        sending: 'Slanje...',
        success: 'Upit je uspesno poslat. Javicemo se uskoro.',
        error: 'Upit trenutno nije moguce poslati. Pokusajte ponovo za nekoliko trenutaka.'
      }
    },
    localeLabel: 'Jezik'
  }
} as const

export function isSupportedLocale(value: string): value is AppLocale {
  return SUPPORTED_LOCALES.includes(value as AppLocale)
}

export function getDictionary(locale: AppLocale) {
  return dictionaries[locale]
}

export function getCountryName(countryCode: string, locale: AppLocale): string {
  const country = PUBLIC_COUNTRIES.find((item) => item.code === countryCode)
  return country?.name[locale] ?? countryCode
}

export function getLanguageName(languageCode: string, locale: AppLocale): string {
  const language = PUBLIC_LANGUAGES.find((item) => item.code === languageCode)
  return language?.name[locale] ?? languageCode
}