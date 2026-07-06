import { tournaments } from '../data/tournaments'
import { SectionHeading, StatusBadge, Card } from '../components/ui'
import { useLanguage } from '../i18n/LanguageContext'

export default function Tournaments() {
  const { t } = useLanguage()
  const groups: { key: 'live' | 'upcoming' | 'finished'; label: string }[] = [
    { key: 'live', label: t.tournaments.live },
    { key: 'upcoming', label: t.tournaments.upcoming },
    { key: 'finished', label: t.tournaments.finished },
  ]

  return (
    <div>
      <SectionHeading eyebrow={t.tournaments.eyebrow} title={t.tournaments.title} />

      {tournaments.length === 0 && (
        <div className="panel px-6 py-12 sm:px-10 text-center bg-grid-fade">
          <h2 className="text-xl font-bold text-white mb-2">{t.tournaments.emptyTitle}</h2>
          <p className="text-slate-400 max-w-lg mx-auto">{t.tournaments.emptyBody}</p>
        </div>
      )}

      <div className="space-y-10">
        {groups.map((g) => {
          const items = tournaments.filter((item) => item.status === g.key)
          if (items.length === 0) return null
          return (
            <section key={g.key}>
              <h2 className="text-lg font-bold text-white mb-4">{g.label}</h2>
              <div className="grid sm:grid-cols-2 gap-5">
                {items.map((item) => (
                  <Card key={item.id}>
                    <div className="flex items-center justify-between mb-3">
                      <StatusBadge status={item.status} />
                      <span className="text-xs text-slate-500">
                        {new Date(item.startDate).toLocaleDateString('en-US')}
                        {item.endDate !== item.startDate ? ` – ${new Date(item.endDate).toLocaleDateString('en-US')}` : ''}
                      </span>
                    </div>
                    <h3 className="font-semibold text-white text-lg mb-2">{item.name}</h3>
                    <dl className="grid grid-cols-2 gap-y-1.5 text-sm text-slate-400">
                      <dt className="text-slate-500">{t.tournaments.format}</dt>
                      <dd className="text-right">{item.format}</dd>
                      <dt className="text-slate-500">{t.tournaments.map}</dt>
                      <dd className="text-right">{item.map}</dd>
                      <dt className="text-slate-500">{t.tournaments.participants}</dt>
                      <dd className="text-right">{item.participants}/{item.maxParticipants}</dd>
                      <dt className="text-slate-500">{t.tournaments.prize}</dt>
                      <dd className="text-right">{item.prize}</dd>
                    </dl>
                    <div className="mt-3 h-1.5 rounded-full bg-base-700 overflow-hidden">
                      <div
                        className="h-full bg-accent"
                        style={{ width: `${Math.min(100, (item.participants / item.maxParticipants) * 100)}%` }}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
