import { Link } from 'react-router-dom'
import { clans } from '../data/clans'
import { SectionHeading, RegionBadge } from '../components/ui'
import { useLanguage } from '../i18n/LanguageContext'

function standings() {
  return clans
    .map((c) => ({
      ...c,
      played: c.leagueWins + c.leagueLosses,
      points: c.leagueWins * 3,
    }))
    .sort((a, b) => b.points - a.points)
}

export default function League() {
  const { t } = useLanguage()
  const rows = standings()

  return (
    <div>
      <SectionHeading eyebrow={t.league.eyebrow} title={t.league.title} />
      <p className="text-slate-400 -mt-4 mb-8 max-w-2xl">{t.league.intro}</p>

      {rows.length === 0 ? (
        <div className="panel px-6 py-12 sm:px-10 text-center bg-grid-fade">
          <h2 className="text-xl font-bold text-white mb-2">{t.league.emptyTitle}</h2>
          <p className="text-slate-400 mb-6 max-w-lg mx-auto">{t.league.emptyBody}</p>
          <Link to="/league/apply" className="btn-accent">{t.league.applyButton}</Link>
        </div>
      ) : (
        <div className="panel overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="border-b border-base-700 text-left text-slate-400 uppercase text-xs tracking-wide">
                <th className="px-5 py-3 font-medium">{t.league.table.rank}</th>
                <th className="px-5 py-3 font-medium">{t.league.table.clan}</th>
                <th className="px-5 py-3 font-medium">{t.league.table.region}</th>
                <th className="px-5 py-3 font-medium hidden sm:table-cell">{t.league.table.played}</th>
                <th className="px-5 py-3 font-medium">{t.league.table.wins}</th>
                <th className="px-5 py-3 font-medium">{t.league.table.losses}</th>
                <th className="px-5 py-3 font-medium text-right">{t.league.table.points}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c, i) => (
                <tr key={c.id} className="border-b border-base-700/60 last:border-0 hover:bg-base-800/50">
                  <td className="px-5 py-3 text-slate-500 font-bold">{i + 1}</td>
                  <td className="px-5 py-3">
                    <Link to={`/clans/${c.id}`} className="flex items-center gap-2 font-medium text-white hover:text-accent">
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3"><RegionBadge region={c.region} /></td>
                  <td className="px-5 py-3 hidden sm:table-cell text-slate-400">{c.played}</td>
                  <td className="px-5 py-3 text-slate-400">{c.leagueWins}</td>
                  <td className="px-5 py-3 text-slate-400">{c.leagueLosses}</td>
                  <td className="px-5 py-3 text-right font-display font-bold text-accent">{c.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
