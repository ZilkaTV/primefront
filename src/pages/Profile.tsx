import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useSession, discordDisplayName } from '../lib/useSession'
import { fetchMyProfile, upsertMyProfile, type PlayerProfile } from '../lib/players'
import { SectionHeading, Card } from '../components/ui'
import { useLanguage } from '../i18n/LanguageContext'

const regions = ['EU', 'NA', 'SA', 'ASIA', 'OCE']

interface Whitelist {
  role: 'admin' | 'moderator'
}

export default function Profile() {
  const { t } = useLanguage()
  const session = useSession()
  const [profile, setProfile] = useState<PlayerProfile | null>(null)
  const [whitelist, setWhitelist] = useState<Whitelist | null>(null)
  const [name, setName] = useState('')
  const [region, setRegion] = useState(regions[0])
  const [openfrontId, setOpenfrontId] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!session) return
    fetchMyProfile(session.user.id).then((p) => {
      setProfile(p)
      if (p) {
        setName(p.in_game_name)
        setRegion(p.region)
        setOpenfrontId(p.openfront_id)
      }
    })
    supabase
      .from('admins')
      .select('role')
      .eq('user_id', session.user.id)
      .maybeSingle()
      .then(({ data }) => setWhitelist(data))
  }, [session])

  if (session === undefined) {
    return <p className="text-center text-slate-500 py-16">{t.admin.checkingAccess}</p>
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <SectionHeading eyebrow={t.profile.eyebrow} title={t.profile.title} />
        <p className="text-slate-400 mb-8">{t.profile.notLoggedInBody}</p>
        <Link to="/register" className="btn-accent">{t.profile.goToRegister}</Link>
      </div>
    )
  }

  const avatarUrl = session.user.user_metadata.avatar_url as string | undefined

  return (
    <div className="max-w-xl mx-auto">
      <SectionHeading
        eyebrow={t.profile.eyebrow}
        title={t.profile.title}
        action={
          <button onClick={() => supabase.auth.signOut()} className="btn-ghost !py-2 text-sm">
            {t.profile.signOutButton}
          </button>
        }
      />

      <div className="panel p-5 mb-6 flex items-center gap-4">
        {avatarUrl && <img src={avatarUrl} alt="" className="h-14 w-14 rounded-full" />}
        <div>
          <p className="font-semibold text-white">{discordDisplayName(session)}</p>
          {whitelist && (
            <p className="text-sm text-accent">
              {t.profile.staffLabel}: {whitelist.role === 'admin' ? t.admin.roleAdmin : t.admin.roleModerator}
              {' · '}
              <Link to="/admin" className="underline hover:text-accent-light">{t.profile.teamAreaLink}</Link>
            </p>
          )}
        </div>
      </div>

      <Card>
        {!profile && <p className="text-sm text-slate-400 mb-4">{t.profile.completePrompt}</p>}
        <form
          className="space-y-5"
          onSubmit={async (e) => {
            e.preventDefault()
            await upsertMyProfile({
              user_id: session.user.id,
              discord_username: discordDisplayName(session),
              in_game_name: name,
              region,
              openfront_id: openfrontId,
            })
            setProfile({ user_id: session.user.id, discord_username: discordDisplayName(session), in_game_name: name, region, openfront_id: openfrontId })
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
          }}
        >
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">{t.playerRegister.name}</label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg bg-base-800 border border-base-600 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-accent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">{t.playerRegister.region}</label>
              <select
                required
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full rounded-lg bg-base-800 border border-base-600 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-accent"
              >
                {regions.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">{t.playerRegister.openfrontId}</label>
              <input
                required
                type="text"
                value={openfrontId}
                onChange={(e) => setOpenfrontId(e.target.value)}
                placeholder={t.playerRegister.openfrontIdPlaceholder}
                className="w-full rounded-lg bg-base-800 border border-base-600 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-accent"
              />
            </div>
          </div>
          <button type="submit" className="btn-accent w-full">{t.profile.saveButton}</button>
          {saved && <p className="text-sm text-signal-green text-center">{t.profile.savedNotice}</p>}
        </form>
      </Card>
    </div>
  )
}
