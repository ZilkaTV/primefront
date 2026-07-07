import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchClans, type Clan } from '../lib/clans'
import { tagColor } from '../lib/tagColor'
import { supabase } from '../lib/supabase'
import { tournaments } from '../data/tournaments'
import { maps } from '../data/maps'
import { SectionHeading, StatCard, RegionBadge, StatusBadge, CategoryBadge, Card } from '../components/ui'
import MapArt from '../components/MapArt'
import TwitchEmbed from '../components/TwitchEmbed'
import { useLanguage } from '../i18n/LanguageContext'
import { getCommunityPosts } from '../lib/newsStore'
import { fetchOpenFrontReleases, type OpenFrontRelease } from '../lib/openfrontReleases'
import type { NewsArticle } from '../data/news'

const liveTournament = tournaments.find((t) => t.status === 'live')
const featuredMaps = maps.slice(0, 4)

export default function Home() {
  const { t } = useLanguage()
  const [clans, setClans] = useState<Clan[]>([])
  const [playerCount, setPlayerCount] = useState(0)
  const [latestPatch, setLatestPatch] = useState<OpenFrontRelease | null>(null)
  const [latestNews, setLatestNews] = useState<NewsArticle[]>([])

  useEffect(() => {
    fetchOpenFrontReleases(1)
      .then((releases) => setLatestPatch(releases[0] ?? null))
      .catch(() => setLatestPatch(null))
    getCommunityPosts().then((posts) => setLatestNews(posts.slice(0, 2)))
    fetchClans().then(setClans)
    supabase
      .from('players')
      .select('*', { count: 'exact', head: true })
      .then(({ count }) => setPlayerCount(count ?? 0))
  }, [])

  const leagueClans = clans.filter((c) => c.league_status === 'member')
  const top = [...leagueClans].sort((a, b) => b.league_wins - a.league_wins).slice(0, 5)

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl panel px-6 py-14 sm:px-12 sm:py-20 bg-grid-fade">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">{t.home.eyebrow}</p>
        <h1 className="text-3xl sm:text-5xl font-bold text-white max-w-2xl leading-tight">
          {t.home.titleA} <span className="text-accent">{t.home.titleB}</span> {t.home.titleC}
        </h1>
        <p className="mt-4 text-slate-400 max-w-xl text-base sm:text-lg">{t.home.subtitle}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/league" className="btn-accent">{t.home.viewLeague}</Link>
          <Link to="/clan-finder" className="btn-ghost">{t.home.findClan}</Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 max-w-md">
          <StatCard label={t.home.statPlayers} value={`${playerCount}`} sub={t.home.statPlayersSub} />
          <StatCard label={t.home.statClans} value={`${clans.length}`} sub={t.home.statClansSub} />
        </div>
      </section>

      {/* Featured tournament */}
      {liveTournament && (
        <section className="panel px-6 py-6 sm:px-8 sm:py-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-accent/30">
          <div className="flex items-center gap-4">
            <StatusBadge status="live" />
            <div>
              <h3 className="text-lg font-bold text-white">{liveTournament.name}</h3>
              <p className="text-sm text-slate-400">
                {liveTournament.format} · {liveTournament.map} · {liveTournament.participants}/{liveTournament.maxParticipants} clans
              </p>
            </div>
          </div>
          <Link to="/tournaments" className="btn-accent shrink-0">{t.home.followTournament}</Link>
        </section>
      )}

      {/* League overview */}
      <section>
        <SectionHeading
          eyebrow={t.home.leagueEyebrow}
          title={t.home.leagueTitle}
          action={<Link to="/league" className="text-sm font-semibold text-accent hover:text-accent-light">{t.home.leagueViewAll}</Link>}
        />
        <Card className="!p-0 overflow-hidden max-w-2xl">
          <div className="px-5 py-4 border-b border-base-700 flex items-center justify-between">
            <h3 className="font-semibold text-white">{t.league.title}</h3>
            <span className="text-xs text-slate-500">{top.length} {t.home.clansEnrolled}</span>
          </div>
          {top.length === 0 ? (
            <div className="p-5">
              <p className="text-sm text-slate-400 mb-4">{t.home.division1Empty}</p>
              <Link to="/clans/create" className="text-sm font-semibold text-accent hover:text-accent-light">{t.league.applyButton} →</Link>
            </div>
          ) : (
            <ul>
              {top.map((c, i) => (
                <li key={c.id} className="flex items-center justify-between px-5 py-3 border-b border-base-700/60 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="w-4 text-sm font-bold text-slate-500">{i + 1}</span>
                    {c.icon_url ? (
                      <img src={c.icon_url} alt="" className="h-6 w-6 rounded object-cover shrink-0" />
                    ) : (
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: tagColor(c.tag) }} />
                    )}
                    <Link to={`/clans/${c.id}`} className="font-medium text-white hover:text-accent">{c.name}</Link>
                  </div>
                  <div className="flex items-center gap-3">
                    <RegionBadge region={c.region} />
                    <span className="font-display font-bold text-accent">{c.league_wins * 3}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>

      {/* Twitch / socials */}
      <section>
        <SectionHeading
          eyebrow={t.socials.eyebrow}
          title={t.socials.twitchLabel}
          action={<Link to="/socials" className="text-sm font-semibold text-accent hover:text-accent-light">{t.socials.title} →</Link>}
        />
        <Card className="max-w-2xl">
          <TwitchEmbed />
        </Card>
      </section>

      {/* Latest news */}
      <section>
        <SectionHeading
          eyebrow={t.home.newsEyebrow}
          title={t.home.newsTitle}
          action={<Link to="/news" className="text-sm font-semibold text-accent hover:text-accent-light">{t.home.newsViewAll}</Link>}
        />
        {latestNews.length === 0 && !latestPatch ? (
          <div className="panel p-5 text-sm text-slate-400">
            {t.news.communityEmpty}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {latestNews.map((n) => (
              <Link key={n.id} to={`/news/${n.slug}`} className="panel p-5 hover:border-base-500 transition-colors flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <CategoryBadge category={n.category} />
                  <span className="text-xs text-slate-500">{new Date(n.date).toLocaleDateString('en-US')}</span>
                </div>
                <h3 className="font-semibold text-white mb-2 leading-snug">{n.title}</h3>
                <p className="text-sm text-slate-400 flex-1">{n.excerpt}</p>
              </Link>
            ))}
            {latestPatch && (
              <a
                href={latestPatch.url}
                target="_blank"
                rel="noreferrer"
                className="panel p-5 hover:border-base-500 transition-colors flex flex-col"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="badge bg-signal-gold/15 text-signal-gold">{t.badges.Patch}</span>
                  <span className="text-xs text-slate-500">{new Date(latestPatch.date).toLocaleDateString('en-US')}</span>
                </div>
                <h3 className="font-semibold text-white mb-2 leading-snug">
                  {latestPatch.title} <span className="text-slate-500 font-normal">↗</span>
                </h3>
                <p className="text-sm text-slate-400 flex-1">{latestPatch.excerpt}</p>
              </a>
            )}
          </div>
        )}
      </section>

      {/* Maps highlight */}
      <section>
        <SectionHeading
          eyebrow={t.home.mapsEyebrow}
          title={t.home.mapsTitle}
          action={<Link to="/maps" className="text-sm font-semibold text-accent hover:text-accent-light">{t.home.mapsViewAll}</Link>}
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredMaps.map((m) => (
            <Card key={m.id}>
              <MapArt id={m.id} accent={m.accent} className="h-16 w-16 mb-3" />
              <h3 className="font-semibold text-white mb-1">{m.name}</h3>
              <p className="text-sm text-slate-400">{m.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="panel px-6 py-10 sm:px-10 text-center bg-grid-fade">
        <h2 className="text-2xl font-bold text-white mb-2">{t.home.ctaTitle}</h2>
        <p className="text-slate-400 mb-6 max-w-lg mx-auto">{t.home.ctaSubtitle}</p>
        <Link to="/clan-finder" className="btn-accent">{t.home.ctaButton}</Link>
      </section>
    </div>
  )
}
