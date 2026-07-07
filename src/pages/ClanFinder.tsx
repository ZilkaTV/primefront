import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchFinderPosts, createFinderPost, deleteFinderPost, type FinderPost } from '../lib/clanFinder'
import { useSession } from '../lib/useSession'
import { SectionHeading, Card } from '../components/ui'
import { useLanguage } from '../i18n/LanguageContext'

const regions = ['EU', 'NA', 'SA', 'ASIA', 'OCE']

export default function ClanFinder() {
  const { t } = useLanguage()
  const session = useSession()
  const navigate = useNavigate()

  const filters = [
    { key: 'all', label: t.clanFinder.all },
    { key: 'clan-seeking-players', label: t.clanFinder.clanSeekingPlayers },
    { key: 'player-seeking-clan', label: t.clanFinder.playerSeekingClan },
  ] as const

  const [filter, setFilter] = useState<(typeof filters)[number]['key']>('all')
  const [posts, setPosts] = useState<FinderPost[]>([])
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')

  const [type, setType] = useState<FinderPost['type']>('clan-seeking-players')
  const [title, setTitle] = useState('')
  const [region, setRegion] = useState(regions[0])
  const [eloRange, setEloRange] = useState('')
  const [description, setDescription] = useState('')
  const [contact, setContact] = useState('')

  function reload() {
    fetchFinderPosts().then(setPosts)
  }

  useEffect(() => {
    reload()
  }, [])

  function handleCreateClick() {
    if (!session) {
      navigate('/register')
      return
    }
    setShowForm((v) => !v)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!session) return
    setError('')
    try {
      await createFinderPost({
        userId: session.user.id,
        type,
        title,
        region,
        eloRange,
        description,
        contact,
      })
      setTitle('')
      setEloRange('')
      setDescription('')
      setContact('')
      setShowForm(false)
      reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  async function handleDelete(id: string) {
    await deleteFinderPost(id)
    reload()
  }

  const items = posts.filter((p) => filter === 'all' || p.type === filter)

  return (
    <div>
      <SectionHeading
        eyebrow={t.clanFinder.eyebrow}
        title={t.clanFinder.title}
        action={
          <button onClick={handleCreateClick} className="btn-accent">
            {t.clanFinder.createListing}
          </button>
        }
      />
      <p className="text-slate-400 -mt-4 mb-8 max-w-2xl">{t.clanFinder.intro}</p>

      {showForm && session && (
        <Card className="mb-8">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">{t.clanFinder.typeLabel}</label>
                <select value={type} onChange={(e) => setType(e.target.value as FinderPost['type'])} className="w-full rounded-lg bg-base-800 border border-base-600 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-accent">
                  <option value="clan-seeking-players">{t.clanFinder.clanSeekingPlayers}</option>
                  <option value="player-seeking-clan">{t.clanFinder.playerSeekingClan}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">{t.clanFinder.regionLabel}</label>
                <select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full rounded-lg bg-base-800 border border-base-600 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-accent">
                  {regions.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">{t.clanFinder.titleLabel}</label>
              <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg bg-base-800 border border-base-600 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">{t.clanFinder.eloRangeLabel}</label>
              <input required type="text" placeholder={t.clanFinder.eloRangePlaceholder} value={eloRange} onChange={(e) => setEloRange(e.target.value)} className="w-full rounded-lg bg-base-800 border border-base-600 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">{t.clanDetail.descriptionLabel}</label>
              <textarea required rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-lg bg-base-800 border border-base-600 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-accent resize-y" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">{t.clanFinder.contactLabel}</label>
              <input required type="text" value={contact} onChange={(e) => setContact(e.target.value)} className="w-full rounded-lg bg-base-800 border border-base-600 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-accent" />
            </div>
            {error && <p className="text-sm text-signal-red">{error}</p>}
            <div className="flex gap-3">
              <button type="submit" className="btn-accent">{t.clanFinder.submitButton}</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">{t.clanFinder.cancelButton}</button>
            </div>
          </form>
        </Card>
      )}

      <div className="flex flex-wrap gap-2 mb-8">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={filter === f.key ? 'btn-accent !py-1.5 !px-3 text-sm' : 'btn-ghost !py-1.5 !px-3 text-sm'}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {items.map((p) => (
          <Card key={p.id}>
            <div className="flex items-center justify-between mb-3">
              <span className={`badge ${p.type === 'clan-seeking-players' ? 'bg-signal-blue/15 text-signal-blue' : 'bg-signal-green/15 text-signal-green'}`}>
                {p.type === 'clan-seeking-players' ? t.clanFinder.clanSeekingPlayers : t.clanFinder.playerSeekingClan}
              </span>
              <span className="text-xs text-slate-500">{new Date(p.created_at).toLocaleDateString('en-US')}</span>
            </div>
            <h3 className="font-semibold text-white mb-2">{p.title}</h3>
            <p className="text-sm text-slate-400 mb-4">{p.description}</p>
            <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-base-700">
              <span>{p.region} · Elo {p.elo_range}</span>
              <span className="text-accent">{p.contact}</span>
            </div>
            {session?.user.id === p.user_id && (
              <button onClick={() => handleDelete(p.id)} className="btn-ghost !py-1 !px-2.5 text-xs mt-3">
                {t.clanFinder.deleteButton}
              </button>
            )}
          </Card>
        ))}
        {items.length === 0 && <p className="text-slate-500 col-span-full text-center py-12">{t.clanFinder.noResults}</p>}
      </div>
    </div>
  )
}
