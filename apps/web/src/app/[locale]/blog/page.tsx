import Link from 'next/link'
import type { AppLocale } from '@therapy/shared'
import { getDictionary } from '../../../lib/i18n'
import { fetchPublicBlogPosts } from '../../../lib/public-api'

export default async function BlogPage({
  params
}: {
  params: Promise<{ locale: AppLocale }>
}) {
  const { locale } = await params
  const dictionary = getDictionary(locale)
  const posts = await fetchPublicBlogPosts(locale)

  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
      <h1 className="text-3xl font-semibold text-slate-900">{dictionary.blog.title}</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{dictionary.blog.description}</p>

      {posts.length ? (
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {posts.map((post) => (
            <article key={post.slug} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-xl font-semibold text-slate-900">{post.title}</h2>
              <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-600">{post.content}</p>
              <Link
                href={`/${locale}/blog/${post.slug}`}
                className="mt-5 inline-flex text-sm font-medium text-teal-800 hover:text-teal-600"
              >
                {dictionary.blog.readMore}
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-8 text-sm text-slate-600">{dictionary.blog.empty}</p>
      )}
    </section>
  )
}