import { useState } from 'react'
import { finderPosts } from '../data/clanFinder'
import { SectionHeading, Card } from '../components/ui'
import { useLanguage } from '../i18n/LanguageContext'

export default function ClanFinder() {
  const { t } = useLanguage()
  const filters = [
    { key: 'all', label: t.clanFinder.all },
    { key: 'clan-seeking-players', label: t.clanFinder.clanSeekingPlayers },
    { key: 'player-seeking-clan', label: t.clanFinder.playerSeekingClan },
  ] as const

  const [filter, setFilter] = useState<(typeof filters)[number]['key']>('all')

  const items = finderPosts.filter((p) => filter === 'all' || p.type === filter)

  return (
    <div>
      <SectionHeading
        eyebrow={t.clanFinder.eyebrow}
        title={t.clanFinder.title}
        action={
          <button className="btn-accent" title={t.clanFinder.createListingTitle}>
            {t.clanFinder.createListing}
          </button>
        }
      />
      <p className="text-slate-400 -mt-4 mb-8 max-w-2xl">{t.clanFinder.intro}</p>

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
              <span className="text-xs text-slate-500">{new Date(p.posted).toLocaleDateString('en-US')}</span>
            </div>
            <h3 className="font-semibold text-white mb-2">{p.title}</h3>
            <p className="text-sm text-slate-400 mb-4">{p.description}</p>
            <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-base-700">
              <span>{p.region} · Elo {p.eloRange}</span>
              <span className="text-accent">{p.contact}</span>
            </div>
          </Card>
        ))}
        {items.length === 0 && <p className="text-slate-500 col-span-full text-center py-12">{t.clanFinder.noResults}</p>}
      </div>
    </div>
  )
}
