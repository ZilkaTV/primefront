import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSession } from '../lib/useSession'
import { fetchMyProfile } from '../lib/players'
import { fetchClans, fetchMyClanId, createClan, type Clan } from '../lib/clans'
import { SectionHeading, Card } from '../components/ui'
import { useLanguage } from '../i18n/LanguageContext'

const regions = ['EU', 'NA', 'SA', 'ASIA', 'OCE']

export default function ClanCreate() {
  const { t } = useLanguage()
  const session = useSession()
  const navigate = useNavigate()

  const [hasProfile, setHasProfile] = useState<boolean | undefined>(undefined)
  const [myClanId, setMyClanId] = useState<string | null | undefined>(undefined)
  const [clans, setClans] = useState<Clan[]>([])

  const [name, setName] = useState('')
  const [tag, setTag] = useState('')
  const [description, setDescription] = useState('')
  const [iconUrl, setIconUrl] = useState('')
  const [region, setRegion] = useState(regions[0])
  const [parentClanId, setParentClanId] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!session) return
    fetchMyProfile(session.user.id).then((p) => setHasProfile(!!p))
    fetchMyClanId(session.user.id).then(setMyClanId)
    fetchClans().then(setClans)
  }, [session])

  if (session === undefined) {
    return <p className="text-center text-slate-500 py-16">{t.admin.checkingAccess}</p>
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <SectionHeading eyebrow={t.clanCreate.eyebrow} title={t.clanCreate.title} />
        <p className="text-slate-400 mb-8">{t.profile.notLoggedInBody}</p>
        <Link to="/register" className="btn-accent">{t.profile.goToRegister}</Link>
      </div>
    )
  }

  if (hasProfile === false) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <SectionHeading eyebrow={t.clanCreate.eyebrow} title={t.clanCreate.title} />
        <p className="text-slate-400 mb-8">{t.clanCreate.needsProfileBody}</p>
        <Link to="/register" className="btn-accent">{t.clanCreate.completeProfileButton}</Link>
      </div>
    )
  }

  if (myClanId) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <SectionHeading eyebrow={t.clanCreate.eyebrow} title={t.clanCreate.title} />
        <p className="text-slate-400 mb-8">{t.clanCreate.alreadyInClanBody}</p>
        <Link to={`/clans/${myClanId}`} className="btn-accent">{t.clanCreate.viewClanButton}</Link>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto">
      <SectionHeading eyebrow={t.clanCreate.eyebrow} title={t.clanCreate.title} />
      <p className="text-slate-400 -mt-4 mb-8">{t.clanCreate.intro}</p>

      <Card>
        <form
          className="space-y-5"
          onSubmit={async (e) => {
            e.preventDefault()
            setError('')
            try {
              const id = await createClan({
                name,
                tag,
                description,
                iconUrl,
                region,
                parentClanId: parentClanId || null,
              })
              navigate(`/clans/${id}`)
            } catch (err) {
              setError(err instanceof Error ? err.message : String(err))
            }
          }}
        >
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">{t.clanCreate.nameLabel}</label>
            <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg bg-base-800 border border-base-600 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-accent" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">{t.clanCreate.tagLabel}</label>
              <input required type="text" maxLength={5} value={tag} onChange={(e) => setTag(e.target.value.toUpperCase())} className="w-full rounded-lg bg-base-800 border border-base-600 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">{t.clanCreate.regionLabel}</label>
              <select required value={region} onChange={(e) => setRegion(e.target.value)} className="w-full rounded-lg bg-base-800 border border-base-600 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-accent">
                {regions.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">{t.clanDetail.descriptionLabel}</label>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-lg bg-base-800 border border-base-600 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-accent resize-y" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">{t.clanDetail.iconUrlLabel}</label>
            <input type="text" value={iconUrl} onChange={(e) => setIconUrl(e.target.value)} className="w-full rounded-lg bg-base-800 border border-base-600 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">{t.clanCreate.parentClanLabel}</label>
            <select value={parentClanId} onChange={(e) => setParentClanId(e.target.value)} className="w-full rounded-lg bg-base-800 border border-base-600 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-accent">
              <option value="">{t.clanCreate.parentClanNone}</option>
              {clans.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          {error && <p className="text-sm text-signal-red">{error}</p>}
          <button type="submit" className="btn-accent w-full">{t.clanCreate.submitButton}</button>
        </form>
      </Card>
    </div>
  )
}
