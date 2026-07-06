import { Link, useParams } from 'react-router-dom'
import { getClanById } from '../data/clans'
import { RegionBadge, StatCard, Card } from '../components/ui'
import { useLanguage } from '../i18n/LanguageContext'
import NotFound from './NotFound'

export default function ClanDetail() {
  const { t } = useLanguage()
  const { id } = useParams()
  const clan = id ? getClanById(id) : undefined

  if (!clan) return <NotFound />

  const winrate = Math.round((clan.wins / (clan.wins + clan.losses)) * 100)

  return (
    <div>
      <Link to="/clans" className="text-sm text-slate-400 hover:text-accent mb-6 inline-block">{t.clanDetail.back}</Link>

      <div className="panel p-6 sm:p-8 mb-8 flex flex-col sm:flex-row sm:items-center gap-5">
        <span
          className="h-16 w-16 rounded-xl flex items-center justify-center text-base font-bold text-base-950 shrink-0"
          style={{ backgroundColor: clan.color }}
        >
          {clan.tag.slice(0, 3)}
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{clan.name}</h1>
            <RegionBadge region={clan.region} />
            {clan.recruiting && <span className="badge bg-signal-green/15 text-signal-green">{t.clanDetail.activelyRecruiting}</span>}
          </div>
          <p className="text-slate-400 mt-2 max-w-2xl">{clan.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        <StatCard label={t.league.table.points} value={`${clan.leagueWins * 3}`} sub={`${clan.leagueWins}W / ${clan.leagueLosses}L`} />
        <StatCard label={t.clanDetail.winRate} value={`${winrate}%`} sub={`${clan.wins}W / ${clan.losses}L`} />
        <StatCard label={t.clanDetail.members} value={`${clan.members}`} />
        <StatCard label={t.clanDetail.since} value={new Date(clan.founded).toLocaleDateString('en-US')} />
      </div>

      <h2 className="text-xl font-bold text-white mb-4">{t.clanDetail.roster}</h2>
      <Card className="!p-0 overflow-x-auto">
        <table className="w-full text-sm min-w-[420px]">
          <thead>
            <tr className="border-b border-base-700 text-left text-slate-400 uppercase text-xs tracking-wide">
              <th className="px-5 py-3 font-medium">{t.clanDetail.player}</th>
              <th className="px-5 py-3 font-medium">{t.clanDetail.role}</th>
              <th className="px-5 py-3 font-medium text-right">Elo</th>
            </tr>
          </thead>
          <tbody>
            {clan.roster.map((m) => (
              <tr key={m.name} className="border-b border-base-700/60 last:border-0">
                <td className="px-5 py-3 font-medium text-white">{m.name}</td>
                <td className="px-5 py-3 text-slate-400">{m.role}</td>
                <td className="px-5 py-3 text-right font-display font-bold text-accent">{m.elo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
