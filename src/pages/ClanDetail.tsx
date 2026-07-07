import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  fetchClanById,
  fetchClanMembers,
  fetchSubClans,
  fetchMyClanId,
  fetchMyPendingRequest,
  fetchClanJoinRequests,
  requestJoinClan,
  cancelJoinRequest,
  approveJoinRequest,
  rejectJoinRequest,
  setMemberRole,
  transferLeadership,
  kickMember,
  leaveClan,
  updateClanInfo,
  deleteClan,
  requestLeagueMembership,
  type Clan,
  type ClanMember,
  type JoinRequest,
} from '../lib/clans'
import { uploadClanIcon } from '../lib/uploadClanIcon'
import { useSession } from '../lib/useSession'
import { tagColor } from '../lib/tagColor'
import { RegionBadge, StatCard, Card } from '../components/ui'
import { useLanguage } from '../i18n/LanguageContext'
import NotFound from './NotFound'

const roleLabelKey = { leader: 'roleLeader', co_leader: 'roleCoLeader', member: 'roleMember' } as const

export default function ClanDetail() {
  const { t } = useLanguage()
  const { id } = useParams()
  const session = useSession()
  const navigate = useNavigate()

  const [clan, setClan] = useState<Clan | null | undefined>(undefined)
  const [members, setMembers] = useState<ClanMember[]>([])
  const [subClans, setSubClans] = useState<Clan[]>([])
  const [parentClan, setParentClan] = useState<Clan | null>(null)
  const [myClanId, setMyClanId] = useState<string | null | undefined>(undefined)
  const [myRequest, setMyRequest] = useState<Awaited<ReturnType<typeof fetchMyPendingRequest>>>(null)
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([])
  const [descDraft, setDescDraft] = useState('')
  const [iconDraft, setIconDraft] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [leagueError, setLeagueError] = useState('')

  async function reload() {
    if (!id) return
    let c: Clan | null
    try {
      c = await fetchClanById(id)
    } catch {
      c = null
    }
    setClan(c)
    if (!c) return
    const [m, subs] = await Promise.all([fetchClanMembers(id), fetchSubClans(id)])
    setMembers(m)
    setSubClans(subs)
    setDescDraft(c.description)
    setIconDraft(c.icon_url ?? '')
    if (c.parent_clan_id) {
      setParentClan(await fetchClanById(c.parent_clan_id))
    } else {
      setParentClan(null)
    }
  }

  useEffect(() => {
    reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    if (session === undefined) return
    if (!session) {
      setMyClanId(null)
      setMyRequest(null)
      return
    }
    fetchMyClanId(session.user.id).then(setMyClanId)
    fetchMyPendingRequest(session.user.id).then(setMyRequest)
  }, [session, id])

  const myMembership = members.find((m) => m.user_id === session?.user.id)
  const isLeaderOrCoLeader = myMembership?.clan_role === 'leader' || myMembership?.clan_role === 'co_leader'

  useEffect(() => {
    if (isLeaderOrCoLeader && id) {
      fetchClanJoinRequests(id).then(setJoinRequests)
    }
  }, [isLeaderOrCoLeader, id])

  if (clan === undefined) return null
  if (!clan) return <NotFound />

  async function handleJoin() {
    await requestJoinClan(clan!.id)
    if (session) setMyRequest(await fetchMyPendingRequest(session.user.id))
  }

  async function handleCancelRequest() {
    if (!myRequest) return
    await cancelJoinRequest(myRequest.id)
    if (session) setMyRequest(await fetchMyPendingRequest(session.user.id))
  }

  async function handleLeave() {
    if (!window.confirm(t.clanDetail.leaveConfirm)) return
    await leaveClan()
    setMyClanId(null)
    await reload()
  }

  async function handleApprove(reqId: string) {
    await approveJoinRequest(reqId)
    await reload()
    if (id) setJoinRequests(await fetchClanJoinRequests(id))
  }

  async function handleReject(reqId: string) {
    await rejectJoinRequest(reqId)
    if (id) setJoinRequests(await fetchClanJoinRequests(id))
  }

  async function handlePromote(userId: string) {
    await setMemberRole(userId, 'co_leader')
    await reload()
  }

  async function handleDemote(userId: string) {
    await setMemberRole(userId, 'member')
    await reload()
  }

  async function handleKick(userId: string) {
    if (!window.confirm(t.clanDetail.kickConfirm)) return
    await kickMember(userId)
    await reload()
  }

  async function handleTransfer(userId: string) {
    if (!window.confirm(t.clanDetail.transferConfirm)) return
    await transferLeadership(userId)
    await reload()
  }

  async function handleSaveInfo(e: React.FormEvent) {
    e.preventDefault()
    await updateClanInfo(clan!.id, descDraft, iconDraft)
    await reload()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  async function handleIconChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !session) return
    setUploading(true)
    try {
      setIconDraft(await uploadClanIcon(file, session.user.id))
    } finally {
      setUploading(false)
    }
  }

  async function handleDeleteClan() {
    if (!window.confirm(t.clanDetail.deleteClanConfirm)) return
    await deleteClan(clan!.id)
    navigate('/clans')
  }

  async function handleRequestLeague() {
    setLeagueError('')
    try {
      await requestLeagueMembership(clan!.id)
      await reload()
    } catch (err) {
      setLeagueError(err instanceof Error ? err.message : String(err))
    }
  }

  const isFull = members.length >= 10
  const canRequestJoin = session && myClanId === null && !myRequest && clan.recruiting && !isFull

  return (
    <div>
      <Link to="/clans" className="text-sm text-slate-400 hover:text-accent mb-6 inline-block">{t.clanDetail.back}</Link>

      {parentClan && (
        <p className="text-sm text-slate-500 mb-3">
          {t.clanDetail.parentClan}{' '}
          <Link to={`/clans/${parentClan.id}`} className="text-accent hover:text-accent-light">{parentClan.name}</Link>
        </p>
      )}

      <div className="panel p-6 sm:p-8 mb-8 flex flex-col sm:flex-row sm:items-center gap-5">
        {clan.icon_url ? (
          <img src={clan.icon_url} alt="" className="h-16 w-16 rounded-xl object-cover shrink-0" />
        ) : (
          <span
            className="h-16 w-16 rounded-xl flex items-center justify-center text-base font-bold text-base-950 shrink-0"
            style={{ backgroundColor: tagColor(clan.tag) }}
          >
            {clan.tag.slice(0, 3)}
          </span>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{clan.name}</h1>
            <RegionBadge region={clan.region} />
            {clan.recruiting && <span className="badge bg-signal-green/15 text-signal-green">{t.clanDetail.activelyRecruiting}</span>}
            {clan.league_status === 'member' && <span className="badge bg-signal-blue/15 text-signal-blue">{t.clanDetail.leagueStatusMember}</span>}
            {clan.league_status === 'requested' && <span className="badge bg-signal-gold/15 text-signal-gold">{t.clanDetail.leagueStatusRequested}</span>}
          </div>
          <p className="text-slate-400 mt-2 max-w-2xl">{clan.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatCard label={t.league.table.points} value={`${clan.league_wins * 3}`} sub={`${clan.league_wins}W / ${clan.league_losses}L`} />
        <StatCard label={t.clanDetail.winRate} value={`${Math.round((clan.league_wins / Math.max(1, clan.league_wins + clan.league_losses)) * 100)}%`} />
        <StatCard label={t.clanDetail.members} value={`${members.length}/10`} />
        <StatCard label={t.clanDetail.since} value={new Date(clan.created_at).toLocaleDateString('en-US')} />
      </div>

      {/* Join / leave actions */}
      <div className="mb-8 flex flex-wrap items-center gap-3">
        {!session && (
          <Link to="/register" className="btn-accent">{t.clanDetail.requestJoin}</Link>
        )}
        {session && myClanId === clan.id && (
          myMembership?.clan_role === 'leader'
            ? <p className="text-sm text-slate-500">{t.clanDetail.leaderMustTransfer}</p>
            : <button onClick={handleLeave} className="btn-ghost">{t.clanDetail.leaveClan}</button>
        )}
        {session && myClanId && myClanId !== clan.id && (
          <p className="text-sm text-slate-500">{t.clanDetail.alreadyInAnotherClan}</p>
        )}
        {session && myClanId === null && myRequest && myRequest.clan_id === clan.id && (
          <button onClick={handleCancelRequest} className="btn-ghost">{t.clanDetail.requestPending} · {t.clanDetail.cancelRequest}</button>
        )}
        {session && myClanId === null && !myRequest && (
          canRequestJoin
            ? <button onClick={handleJoin} className="btn-accent">{t.clanDetail.requestJoin}</button>
            : <p className="text-sm text-slate-500">{isFull ? t.clanDetail.full : t.clanDetail.notRecruiting}</p>
        )}
      </div>

      <h2 className="text-xl font-bold text-white mb-4">{t.clanDetail.roster}</h2>
      <Card className="!p-0 overflow-x-auto mb-8">
        <table className="w-full text-sm min-w-[420px]">
          <thead>
            <tr className="border-b border-base-700 text-left text-slate-400 uppercase text-xs tracking-wide">
              <th className="px-5 py-3 font-medium">{t.clanDetail.player}</th>
              <th className="px-5 py-3 font-medium">{t.clanDetail.role}</th>
              <th className="px-5 py-3 font-medium text-right">Region</th>
              {isLeaderOrCoLeader && <th className="px-5 py-3 font-medium text-right"> </th>}
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.user_id} className="border-b border-base-700/60 last:border-0">
                <td className="px-5 py-3 font-medium text-white">{m.in_game_name}</td>
                <td className="px-5 py-3 text-slate-400">{t.clanDetail[roleLabelKey[m.clan_role]]}</td>
                <td className="px-5 py-3 text-right"><RegionBadge region={m.region} /></td>
                {isLeaderOrCoLeader && m.user_id !== session?.user.id && (
                  <td className="px-5 py-3 text-right whitespace-nowrap">
                    <div className="flex justify-end gap-1.5 flex-wrap">
                      {myMembership?.clan_role === 'leader' && m.clan_role === 'member' && (
                        <button onClick={() => handlePromote(m.user_id)} className="btn-ghost !py-1 !px-2 text-xs">{t.clanDetail.promote}</button>
                      )}
                      {myMembership?.clan_role === 'leader' && m.clan_role === 'co_leader' && (
                        <button onClick={() => handleDemote(m.user_id)} className="btn-ghost !py-1 !px-2 text-xs">{t.clanDetail.demote}</button>
                      )}
                      {myMembership?.clan_role === 'leader' && (
                        <button onClick={() => handleTransfer(m.user_id)} className="btn-ghost !py-1 !px-2 text-xs">{t.clanDetail.transferLeadership}</button>
                      )}
                      {!(myMembership?.clan_role === 'co_leader' && m.clan_role === 'co_leader') && (
                        <button onClick={() => handleKick(m.user_id)} className="btn-ghost !py-1 !px-2 text-xs">{t.clanDetail.kick}</button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {subClans.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">{t.clanDetail.subClans}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {subClans.map((s) => (
              <Link key={s.id} to={`/clans/${s.id}`} className="panel p-4 flex items-center gap-3 hover:border-base-500 transition-colors">
                {s.icon_url ? (
                  <img src={s.icon_url} alt="" className="h-8 w-8 rounded object-cover shrink-0" />
                ) : (
                  <span className="h-8 w-8 rounded flex items-center justify-center text-xs font-bold text-base-950 shrink-0" style={{ backgroundColor: tagColor(s.tag) }}>
                    {s.tag.slice(0, 3)}
                  </span>
                )}
                <span className="font-medium text-white">{s.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {isLeaderOrCoLeader && (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-white mb-4">{t.clanDetail.leagueSectionTitle}</h2>
            <Card>
              {clan.league_status === 'member' && <p className="text-sm text-slate-300">{t.clanDetail.leagueStatusMember}</p>}
              {clan.league_status === 'requested' && <p className="text-sm text-slate-300">{t.clanDetail.leagueStatusRequested}</p>}
              {clan.league_status === 'none' && (
                <div>
                  <p className="text-sm text-slate-400 mb-4">{t.clanDetail.leagueStatusNone}</p>
                  <button onClick={handleRequestLeague} className="btn-accent">{t.clanDetail.requestLeagueButton}</button>
                </div>
              )}
              {leagueError && <p className="text-sm text-signal-red mt-3">{leagueError}</p>}
            </Card>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4">{t.clanDetail.pendingRequestsTitle}</h2>
            {joinRequests.length === 0 ? (
              <p className="text-sm text-slate-500">{t.clanDetail.noPendingRequests}</p>
            ) : (
              <div className="space-y-2">
                {joinRequests.map((r) => (
                  <Card key={r.id} className="flex items-center justify-between">
                    <span className="text-white font-medium">{r.players?.in_game_name ?? r.players?.discord_username}</span>
                    <div className="flex gap-2">
                      <button onClick={() => handleApprove(r.id)} className="btn-accent !py-1.5 !px-3 text-sm">{t.clanDetail.approve}</button>
                      <button onClick={() => handleReject(r.id)} className="btn-ghost !py-1.5 !px-3 text-sm">{t.clanDetail.reject}</button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4">{t.clanDetail.editInfo}</h2>
            <Card>
              <form className="space-y-4" onSubmit={handleSaveInfo}>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">{t.clanDetail.descriptionLabel}</label>
                  <textarea
                    rows={3}
                    value={descDraft}
                    onChange={(e) => setDescDraft(e.target.value)}
                    className="w-full rounded-lg bg-base-800 border border-base-600 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-accent resize-y"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">{t.clanDetail.iconUrlLabel}</label>
                  <div className="flex items-center gap-3">
                    {iconDraft && <img src={iconDraft} alt="" className="h-12 w-12 rounded-lg object-cover shrink-0" />}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleIconChange}
                      className="flex-1 text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-base-700 file:px-3.5 file:py-2 file:text-sm file:text-white file:cursor-pointer hover:file:bg-base-600"
                    />
                  </div>
                  {uploading && <p className="text-xs text-slate-500 mt-1.5">{t.clanDetail.uploading}</p>}
                </div>
                <button type="submit" disabled={uploading} className="btn-accent disabled:opacity-50">{t.clanDetail.saveButton}</button>
                {saved && <span className="ml-3 text-sm text-signal-green">{t.clanDetail.savedNotice}</span>}
              </form>
            </Card>
          </div>

          {myMembership?.clan_role === 'leader' && (
            <div>
              <button onClick={handleDeleteClan} className="btn-ghost !text-signal-red !border-signal-red/40 hover:!bg-signal-red/10">
                {t.clanDetail.deleteClanButton}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
