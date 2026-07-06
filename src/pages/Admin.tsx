import { useState } from 'react'
import { SectionHeading, Card, CategoryBadge } from '../components/ui'
import { useLanguage } from '../i18n/LanguageContext'
import {
  type AdminPost,
  type EditorSession,
  getEditorSession,
  setEditorSession,
  clearEditorSession,
  loadAdminPosts,
  saveAdminPost,
  deleteAdminPost,
  slugify,
} from '../lib/adminPosts'

const categories: AdminPost['category'][] = ['Community', 'Update', 'Tournament', 'Patch']

export default function Admin() {
  const { t } = useLanguage()
  const [session, setSession] = useState<EditorSession | null>(getEditorSession)
  const [posts, setPosts] = useState<AdminPost[]>(loadAdminPosts)
  const [published, setPublished] = useState(false)

  const [name, setName] = useState('')
  const [role, setRole] = useState<'Admin' | 'Moderator'>('Admin')

  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [category, setCategory] = useState<AdminPost['category']>('Community')
  const [body, setBody] = useState('')

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    const s: EditorSession = { name: name.trim() || 'Anonymous', role }
    setEditorSession(s)
    setSession(s)
  }

  function handleLogout() {
    clearEditorSession()
    setSession(null)
  }

  function handlePublish(e: React.FormEvent) {
    e.preventDefault()
    if (!session) return
    const post: AdminPost = {
      id: `admin-${Date.now()}`,
      slug: slugify(title),
      title,
      excerpt,
      body: body.split('\n').filter((l) => l.trim().length > 0),
      date: new Date().toISOString().slice(0, 10),
      category,
      author: session.name,
      role: session.role,
    }
    saveAdminPost(post)
    setPosts(loadAdminPosts())
    setTitle('')
    setExcerpt('')
    setBody('')
    setPublished(true)
    setTimeout(() => setPublished(false), 4000)
  }

  function handleDelete(id: string) {
    deleteAdminPost(id)
    setPosts(loadAdminPosts())
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto">
        <SectionHeading eyebrow={t.admin.eyebrow} title={t.admin.title} />
        <p className="text-sm text-slate-500 -mt-4 mb-6">{t.admin.loginDisclaimer}</p>
        <Card>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">{t.admin.nameLabel}</label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg bg-base-800 border border-base-600 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">{t.admin.roleLabel}</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'Admin' | 'Moderator')}
                className="w-full rounded-lg bg-base-800 border border-base-600 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-accent"
              >
                <option value="Admin">{t.admin.roleAdmin}</option>
                <option value="Moderator">{t.admin.roleModerator}</option>
              </select>
            </div>
            <button type="submit" className="btn-accent w-full">{t.admin.enterButton}</button>
          </form>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <SectionHeading
        eyebrow={t.admin.eyebrow}
        title={t.admin.title}
        action={
          <button onClick={handleLogout} className="btn-ghost !py-2 text-sm">
            {t.admin.logoutButton}
          </button>
        }
      />
      <p className="text-sm text-slate-500 -mt-4 mb-6">
        {t.admin.loggedInAs} <span className="text-slate-300 font-medium">{session.name}</span> · {session.role === 'Admin' ? t.admin.roleAdmin : t.admin.roleModerator}
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
              onChange={(e) => setCategory(e.target.value as AdminPost['category'])}
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
                  <span className="text-xs text-slate-500">{p.author} · {p.role}</span>
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
