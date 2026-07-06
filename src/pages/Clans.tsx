import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { fetchClans, type Clan } from '../lib/clans'
import { SectionHeading, RegionBadge, Card } from '../components/ui'
import { useLanguage } from '../i18n/LanguageContext'
import { tagColor } from '../lib/tagColor'

const regionKeys = ['All', 'EU', 'NA', 'SA', 'ASIA', 'OCE'] as const

export default function Clans() {
  const { t } = useLanguage()
  const [region, setRegion] = useState<(typeof regionKeys)[number]>('All')
  const [recruitingOnly, setRecruitingOnly] = useState(false)
  const [clans, setClans] = useState<Clan[]>([])
  const [memberCounts, setMemberCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    fetchClans().then(setClans)
    supabase
      .from('players')
      .select('clan_id')
      .not('clan_id', 'is', null)
      .then(({ data }) => {
        const counts: Record<string, number> = {}
        for (const row of data ?? []) {
          const id = row.clan_id as string
          counts[id] = (counts[id] ?? 0) + 1
        }
        setMemberCounts(counts)
      })
  }, [])

  const filtered = useMemo(
    () =>
      clans
        .filter((c) => region === 'All' || c.region === region)
        .filter((c) => !recruitingOnly || c.recruiting)
        .sort((a, b) => b.league_wins - a.league_wins),
    [clans, region, recruitingOnly],
  )

  return (
    <div>
      <SectionHeading
        eyebrow={t.clans.eyebrow}
        title={t.clans.title}
        action={<Link to="/clans/create" className="btn-accent !py-2 text-sm">{t.clanCreate.title}</Link>}
      />

      <div className="flex flex-wrap items-center gap-2 mb-8">
        {regionKeys.map((r) => (
          <button
            key={r}
            onClick={() => setRegion(r)}
            className={region === r ? 'btn-accent !py-1.5 !px-3 text-sm' : 'btn-ghost !py-1.5 !px-3 text-sm'}
          >
            {r === 'All' ? t.clans.all : r}
          </button>
        ))}
        <label className="flex items-center gap-2 ml-2 text-sm text-slate-400 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={recruitingOnly}
            onChange={(e) => setRecruitingOnly(e.target.checked)}
            className="accent-accent h-4 w-4"
          />
          {t.clans.recruitingOnly}
        </label>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((c) => (
          <Link key={c.id} to={`/clans/${c.id}`} className="block">
            <Card className="h-full hover:border-base-500 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {c.icon_url ? (
                    <img src={c.icon_url} alt="" className="h-9 w-9 rounded-lg object-cover shrink-0" />
                  ) : (
                    <span
                      className="h-9 w-9 rounded-lg flex items-center justify-center text-xs font-bold text-base-950 shrink-0"
                      style={{ backgroundColor: tagColor(c.tag) }}
                    >
                      {c.tag.slice(0, 3)}
                    </span>
                  )}
                  <div>
                    <h3 className="font-semibold text-white leading-tight">{c.name}</h3>
                    <span className="text-xs text-slate-500">{c.league_wins * 3} {t.league.table.points.toLowerCase()}</span>
                  </div>
                </div>
                <RegionBadge region={c.region} />
              </div>
              <p className="text-sm text-slate-400 mb-4 line-clamp-3">{c.description}</p>
              <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-base-700">
                <span>{memberCounts[c.id] ?? 0}/10 {t.clans.members}</span>
                <span>{c.league_wins}W / {c.league_losses}L</span>
                {c.recruiting && <span className="text-signal-green font-semibold">{t.clans.recruiting}</span>}
              </div>
            </Card>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="text-slate-500 col-span-full text-center py-12">{t.clans.noResults}</p>
        )}
      </div>
    </div>
  )
}
