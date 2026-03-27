'use client'

import { useMemo, useState, type SyntheticEvent } from 'react'
import type { AppLocale } from '@therapy/shared'
import { createContactInquiry } from '../../lib/public-api'

type ContactFormDictionary = {
  name: string
  email: string
  message: string
  therapistSlug: string
  submit: string
  sending: string
  success: string
  error: string
}

type ContactFormProps = {
  locale: AppLocale
  dictionary: ContactFormDictionary
  initialTherapistSlug?: string
}

export function ContactForm({ locale, dictionary, initialTherapistSlug }: ContactFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [therapistSlug, setTherapistSlug] = useState(initialTherapistSlug ?? '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submittedInquiryId, setSubmittedInquiryId] = useState<string | null>(null)

  const canSubmit = useMemo(() => {
    return name.trim().length >= 2 && email.trim().length > 3 && message.trim().length >= 10
  }, [email, message, name])

  const onSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!canSubmit || isSubmitting) {
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)
    setSubmittedInquiryId(null)

    try {
      const result = await createContactInquiry({
        name,
        email,
        message,
        locale,
        therapistSlug: therapistSlug.trim() ? therapistSlug.trim() : undefined
      })

      setSubmittedInquiryId(result.inquiryId)
      setName('')
      setEmail('')
      setMessage('')
      setTherapistSlug(initialTherapistSlug ?? '')
    } catch {
      setSubmitError(dictionary.error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block text-sm">
        <span className="mb-2 block font-medium text-slate-700">{dictionary.name}</span>
        <input
          required
          minLength={2}
          maxLength={150}
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900"
        />
      </label>

      <label className="block text-sm">
        <span className="mb-2 block font-medium text-slate-700">{dictionary.email}</span>
        <input
          type="email"
          required
          maxLength={320}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900"
        />
      </label>

      <label className="block text-sm">
        <span className="mb-2 block font-medium text-slate-700">{dictionary.message}</span>
        <textarea
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900"
        />
      </label>

      <label className="block text-sm">
        <span className="mb-2 block font-medium text-slate-700">{dictionary.therapistSlug}</span>
        <input
          value={therapistSlug}
          onChange={(event) => setTherapistSlug(event.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900"
        />
      </label>

      <button
        type="submit"
        disabled={!canSubmit || isSubmitting}
        className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-medium text-white enabled:hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isSubmitting ? dictionary.sending : dictionary.submit}
      </button>

      {submittedInquiryId ? (
        <p className="text-sm text-emerald-700">
          {dictionary.success} #{submittedInquiryId}
        </p>
      ) : null}

      {submitError ? <p className="text-sm text-rose-700">{submitError}</p> : null}
    </form>
  )
}
