import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCommunityPostBySlug } from '../lib/newsStore'
import { CategoryBadge } from '../components/ui'
import { useLanguage } from '../i18n/LanguageContext'
import type { NewsArticle } from '../data/news'
import NotFound from './NotFound'

export default function NewsDetail() {
  const { t } = useLanguage()
  const { slug } = useParams()
  const [article, setArticle] = useState<NewsArticle | undefined | null>(null)

  useEffect(() => {
    if (!slug) {
      setArticle(undefined)
      return
    }
    getCommunityPostBySlug(slug).then(setArticle)
  }, [slug])

  if (article === null) return null
  if (!article) return <NotFound />

  return (
    <article className="max-w-2xl mx-auto">
      <Link to="/news" className="text-sm text-slate-400 hover:text-accent mb-6 inline-block">{t.newsDetail.back}</Link>
      <div className="flex items-center gap-3 mb-4">
        <CategoryBadge category={article.category} />
        <span className="text-xs text-slate-500">{new Date(article.date).toLocaleDateString('en-US')}</span>
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{article.title}</h1>
      <p className="text-sm text-slate-500 mb-8">{t.newsDetail.by} {article.author}</p>
      <div className="space-y-4 text-slate-300 leading-relaxed">
        {article.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </article>
  )
}
