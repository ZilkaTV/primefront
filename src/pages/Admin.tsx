import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useSession } from '../lib/useSession'
import { SectionHeading, Card, CategoryBadge } from '../components/ui'
import { useLanguage } from '../i18n/LanguageContext'
import { createNewsPost, deleteNewsPost, fetchNewsPosts } from '../lib/newsPosts'
import type { NewsPostRow } from '../lib/newsPosts'
import type { NewsArticle } from '../data/news'

const categories: NewsPostRow['category'][] = ['Community', 'Update', 'Tournament', 'Patch']

interface Whitelist {
  role: 'admin' | 'moderator'
  display_name: string
}

export default function Admin() {
  const { t } = useLanguage()
  const session = useSession()
  const [whitelist, setWhitelist] = useState<Whitelist | null | undefined>(undefined)
  const [posts, setPosts] = useState<NewsArticle[]>([])
  const [published, setPublished] = useState(false)

  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [category, setCategory] = useState<NewsPostRow['category']>('Community')
  const [body, setBody] = useState('')

  useEffect(() => {
    if (!session) {
      setWhitelist(session === null ? null : undefined)
      return
    }
    supabase
      .from('admins')
      .select('role, display_name')
      .eq('user_id', session.user.id)
      .maybeSingle()
      .then(({ data }) => setWhitelist(data ?? null))
  }, [session])

  useEffect(() => {
    if (whitelist) {
      fetchNewsPosts().then(setPosts)
    }
  }, [whitelist])

  async function handlePublish(e: React.FormEvent) {
    e.preventDefault()
    if (!session || !whitelist) return
    const authorName =
      session.user.user_metadata.full_name ||
      session.user.user_metadata.name ||
      session.user.user_metadata.preferred_username ||
      'Unknown'
    await createNewsPost({
      title,
      excerpt,
      body: body.split('\n').filter((l) => l.trim().length > 0),
      category,
      authorName,
      authorRole: whitelist.role === 'admin' ? t.admin.roleAdmin : t.admin.roleModerator,
    })
    setPosts(await fetchNewsPosts())
    setTitle('')
    setExcerpt('')
    setBody('')
    setPublished(true)
    setTimeout(() => setPublished(false), 4000)
  }

  async function handleDelete(id: string) {
    await deleteNewsPost(id)
    setPosts(await fetchNewsPosts())
  }

  // Still resolving the initial session.
  if (session === undefined) {
    return <p className="text-center text-slate-500 py-16">{t.admin.checkingAccess}</p>
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto">
        <SectionHeading eyebrow={t.admin.eyebrow} title={t.admin.title} />
        <Card className="text-center py-10">
          <p className="text-sm text-slate-400 mb-6">{t.admin.loginPrompt}</p>
          <button
            onClick={() =>
              supabase.auth.signInWithOAuth({
                provider: 'discord',
                options: { redirectTo: `${window.location.origin}/admin` },
              })
            }
            className="btn-accent inline-flex items-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.369A19.79 19.79 0 0 0 15.885 3c-.213.38-.462.893-.634 1.301a18.27 18.27 0 0 0-5.5 0A12.6 12.6 0 0 0 9.115 3a19.74 19.74 0 0 0-4.435 1.371C1.4 9.043.65 13.6.925 18.096a19.9 19.9 0 0 0 6.06 3.06c.49-.665.926-1.372 1.302-2.115a12.9 12.9 0 0 1-2.049-.98c.172-.125.34-.256.503-.392a14.19 14.19 0 0 0 12.516 0c.166.14.334.27.503.392-.65.385-1.336.71-2.052.982.377.742.812 1.45 1.303 2.114a19.83 19.83 0 0 0 6.064-3.06c.323-5.218-.552-9.735-2.758-13.727ZM8.68 15.331c-1.017 0-1.85-.933-1.85-2.081 0-1.148.815-2.082 1.85-2.082 1.044 0 1.867.943 1.85 2.082 0 1.148-.815 2.081-1.85 2.081Zm6.646 0c-1.017 0-1.85-.933-1.85-2.081 0-1.148.815-2.082 1.85-2.082 1.044 0 1.867.943 1.85 2.082 0 1.148-.806 2.081-1.85 2.081Z" />
            </svg>
            {t.admin.loginButton}
          </button>
        </Card>
      </div>
    )
  }

  if (whitelist === undefined) {
    return <p className="text-center text-slate-500 py-16">{t.admin.checkingAccess}</p>
  }

  if (whitelist === null) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <p className="text-accent font-display text-sm font-semibold uppercase tracking-widest mb-2">{t.admin.eyebrow}</p>
        <h1 className="text-2xl font-bold text-white mb-3">{t.admin.notAuthorizedTitle}</h1>
        <p className="text-slate-400 mb-8">{t.admin.notAuthorizedBody}</p>
        <button onClick={() => supabase.auth.signOut()} className="btn-ghost">{t.admin.logoutButton}</button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <SectionHeading
        eyebrow={t.admin.eyebrow}
        title={t.admin.title}
        action={
          <button onClick={() => supabase.auth.signOut()} className="btn-ghost !py-2 text-sm">
            {t.admin.logoutButton}
          </button>
        }
      />
      <p className="text-sm text-slate-500 -mt-4 mb-6">
        {t.admin.loggedInAs} <span className="text-slate-300 font-medium">{whitelist.display_name}</span> ·{' '}
        {whitelist.role === 'admin' ? t.admin.roleAdmin : t.admin.roleModerator}
      </p>

      <Card className="mb-8">
        <h2 className="text-lg font-bold text-white mb-4">{t.admin.composerTitle}</h2>
        <form className="space-y-4" onSubmit={handlePublish}>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">{t.admin.titleLabel}</label>
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg bg-base-800 border border-base-600 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">{t.admin.excerptLabel}</label>
            <input
              required
              type="text"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full rounded-lg bg-base-800 border border-base-600 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">{t.admin.categoryLabel}</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as NewsPostRow['category'])}
              className="w-full rounded-lg bg-base-800 border border-base-600 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-accent"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{t.badges[c]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">{t.admin.bodyLabel}</label>
            <textarea
              required
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={t.admin.bodyPlaceholder}
              className="w-full rounded-lg bg-base-800 border border-base-600 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-accent resize-y"
            />
          </div>
          <button type="submit" className="btn-accent w-full">{t.admin.publishButton}</button>
          {published && <p className="text-sm text-signal-green text-center">{t.admin.publishedNotice}</p>}
        </form>
      </Card>

      <h2 className="text-lg font-bold text-white mb-4">{t.admin.existingPostsTitle}</h2>
      {posts.length === 0 ? (
        <p className="text-slate-500 text-sm">{t.admin.noPostsYet}</p>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <Card key={p.id} className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <CategoryBadge category={p.category} />
                  <span className="text-xs text-slate-500">{p.author}</span>
                </div>
                <h3 className="font-semibold text-white">{p.title}</h3>
                <p className="text-sm text-slate-400 mt-1">{p.excerpt}</p>
              </div>
              <button onClick={() => handleDelete(p.id)} className="btn-ghost !py-1.5 !px-3 text-xs shrink-0">
                {t.admin.deleteButton}
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
