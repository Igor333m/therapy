import { notFound } from 'next/navigation'
import type { AppLocale } from '@therapy/shared'
import { fetchPublicBlogPost } from '../../../../lib/public-api'

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ locale: AppLocale; slug: string }>
}) {
  const { locale, slug } = await params
  const post = await fetchPublicBlogPost(locale, slug)

  if (!post) {
    notFound()
  }
  
  console.log(post.content)

  return (
    <article className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
      <h1 className="text-4xl font-semibold text-slate-900">{post.title}</h1>

      <div className="prose prose-slate mt-8 max-w-none">
        {post.content.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </article>
  )
}