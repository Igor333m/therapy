import type { AppLocale, CoreService } from '@therapy/shared'

export type PublicService = {
  slug: CoreService
  label: string
}

export type PublicTherapist = {
  slug: string
  displayName: string
  bio: string | null
  avatarUrl: string | null
  countryCodes: string[]
  languageCodes: string[]
  yearsExperience: number | null
  sessionPriceUsdCents: number | null
  timezone: string | null
  services: PublicService[]
}

export type PublicBlogPost = {
  slug: string
  title: string
  content: string
  locale: AppLocale
  publishedAt: string | null
}

export type PublicFaqEntry = {
  id: string
  question: string
  answer: string
  locale: AppLocale
  sortOrder: number
}

type CreateContactInquiryPayload = {
  name: string
  email: string
  message: string
  locale: AppLocale
  therapistSlug?: string
}

type CreateContactInquiryResponse = {
  inquiryId: string
  status: 'new'
}

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    cache: 'no-store'
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return response.json() as Promise<T>
}

export async function fetchPublicServices(locale: AppLocale): Promise<PublicService[]> {
  try {
    return await getJson<PublicService[]>(`/public/services?locale=${locale}`)
  } catch {
    return []
  }
}

export async function fetchPublicTherapists(input: {
  locale: AppLocale
  countryCode?: string
  languageCode?: string
  service?: string
}): Promise<PublicTherapist[]> {
  const params = new URLSearchParams({ locale: input.locale })

  if (input.countryCode) {
    params.set('countryCode', input.countryCode)
  }

  if (input.languageCode) {
    params.set('languageCode', input.languageCode)
  }

  if (input.service) {
    params.set('services', input.service)
  }

  try {
    return await getJson<PublicTherapist[]>(`/public/therapists?${params.toString()}`)
  } catch {
    return []
  }
}

export async function fetchPublicTherapist(locale: AppLocale, slug: string): Promise<PublicTherapist | null> {
  try {
    return await getJson<PublicTherapist>(`/public/therapists/${slug}?locale=${locale}`)
  } catch {
    return null
  }
}

export async function fetchPublicBlogPosts(locale: AppLocale): Promise<PublicBlogPost[]> {
  try {
    return await getJson<PublicBlogPost[]>(`/public/blog?locale=${locale}`)
  } catch {
    return []
  }
}

export async function fetchPublicBlogPost(locale: AppLocale, slug: string): Promise<PublicBlogPost | null> {
  try {
    return await getJson<PublicBlogPost>(`/public/blog/${slug}?locale=${locale}`)
  } catch {
    return null
  }
}

export async function fetchPublicFaq(locale: AppLocale): Promise<PublicFaqEntry[]> {
  try {
    return await getJson<PublicFaqEntry[]>(`/public/faq?locale=${locale}`)
  } catch {
    return []
  }
}

export async function createContactInquiry(
  payload: CreateContactInquiryPayload
): Promise<CreateContactInquiryResponse> {
  const response = await fetch(`${apiBaseUrl}/public/contact-inquiries`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    throw new Error(`Contact inquiry failed: ${response.status}`)
  }

  return response.json() as Promise<CreateContactInquiryResponse>
}