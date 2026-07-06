import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SectionHeading, CategoryBadge } from '../components/ui'
import { useLanguage } from '../i18n/LanguageContext'
import { getCommunityPosts } from '../lib/newsStore'
import { fetchOpenFrontReleases, type OpenFrontRelease } from '../lib/openfrontReleases'
import type { NewsArticle } from '../data/news'

export default function News() {
  const { t } = useLanguage()
  const [releases, setReleases] = useState<OpenFrontRelease[] | null>(null)
  const [releasesError, setReleasesError] = useState(false)
  const [communityPosts, setCommunityPosts] = useState<NewsArticle[]>([])

  useEffect(() => {
    fetchOpenFrontReleases()
      .then(setReleases)
      .catch(() => setReleasesError(true))
    getCommunityPosts().then(setCommunityPosts)
  }, [])

  return (
    <div>
      <SectionHeading eyebrow={t.news.eyebrow} title={t.news.title} />

      <h2 className="text-lg font-bold text-white mb-1">{t.news.communityTitle}</h2>
      <p className="text-sm text-slate-500 mb-4">{t.news.communitySubtitle}</p>

      {communityPosts.length === 0 && (
        <p className="text-sm text-slate-500 panel p-5 mb-4">{t.news.communityEmpty}</p>
      )}

      <div className="space-y-4">
        {communityPosts.map((n) => (
          <Link
            key={n.id}
            to={`/news/${n.slug}`}
            className="panel p-5 flex flex-col sm:flex-row sm:items-center gap-3 hover:border-base-500 transition-colors"
          >
            <div className="flex items-center gap-3 sm:w-40 shrink-0">
              <CategoryBadge category={n.category} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">{n.title}</h3>
              <p className="text-sm text-slate-400 mt-1">{n.excerpt}</p>
              <p className="text-xs text-slate-500 mt-1">{n.author}</p>
            </div>
            <div className="text-xs text-slate-500 sm:w-28 sm:text-right shrink-0">
              {new Date(n.date).toLocaleDateString('en-US')}
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-bold text-white mb-1">{t.news.openfrontTitle}</h2>
        <p className="text-sm text-slate-500 mb-4">{t.news.openfrontSubtitle}</p>

        {releasesError && <p className="text-sm text-slate-500 panel p-5">{t.news.openfrontError}</p>}
        {!releases && !releasesError && <p className="text-sm text-slate-500 panel p-5">{t.news.openfrontLoading}</p>}

        <div className="space-y-4">
          {releases?.map((r) => (
            <a
              key={r.id}
              href={r.url}
              target="_blank"
              rel="noreferrer"
              className="panel p-5 flex flex-col sm:flex-row sm:items-center gap-3 hover:border-base-500 transition-colors"
            >
              <div className="flex items-center gap-3 sm:w-40 shrink-0">
                <span className="badge bg-signal-gold/15 text-signal-gold">{t.badges.Patch}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">
                  {r.title} <span className="text-slate-500 font-normal">↗</span>
                </h3>
                <p className="text-sm text-slate-400 mt-1">{r.excerpt}</p>
                <p className="text-xs text-slate-500 mt-1">OpenFront GitHub</p>
              </div>
              <div className="text-xs text-slate-500 sm:w-28 sm:text-right shrink-0">
                {new Date(r.date).toLocaleDateString('en-US')}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
