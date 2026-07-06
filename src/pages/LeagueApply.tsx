import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SectionHeading, Card } from '../components/ui'
import { useLanguage } from '../i18n/LanguageContext'

const regions = ['EU', 'NA', 'SA', 'ASIA', 'OCE']

export default function LeagueApply() {
  const { t } = useLanguage()
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <p className="text-accent font-display text-sm font-semibold uppercase tracking-widest mb-2">{t.apply.eyebrow}</p>
        <h1 className="text-2xl font-bold text-white mb-3">{t.apply.successTitle}</h1>
        <p className="text-slate-400 mb-8">{t.apply.successBody}</p>
        <Link to="/" className="btn-accent">{t.apply.backHome}</Link>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto">
      <Link to="/league" className="text-sm text-slate-400 hover:text-accent mb-6 inline-block">{t.apply.backToLeague}</Link>
      <SectionHeading eyebrow={t.apply.eyebrow} title={t.apply.title} />
      <p className="text-slate-400 -mt-4 mb-8">{t.apply.intro}</p>

      <Card>
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault()
            setSubmitted(true)
          }}
        >
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">{t.apply.clanName}</label>
            <input required type="text" className="w-full rounded-lg bg-base-800 border border-base-600 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-accent" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">{t.apply.clanTag}</label>
              <input required type="text" maxLength={5} className="w-full rounded-lg bg-base-800 border border-base-600 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">{t.apply.region}</label>
              <select required className="w-full rounded-lg bg-base-800 border border-base-600 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-accent">
                {regions.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">{t.apply.contact}</label>
            <input required type="text" placeholder="Discord: yourname" className="w-full rounded-lg bg-base-800 border border-base-600 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">{t.apply.roster}</label>
            <textarea required rows={5} placeholder={t.apply.rosterPlaceholder} className="w-full rounded-lg bg-base-800 border border-base-600 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-accent resize-y" />
          </div>
          <label className="flex items-start gap-2.5 text-sm text-slate-400 cursor-pointer select-none">
            <input required type="checkbox" className="accent-accent h-4 w-4 mt-0.5 shrink-0" />
            {t.apply.agree}
          </label>
          <button type="submit" className="btn-accent w-full">{t.apply.submit}</button>
        </form>
      </Card>
    </div>
  )
}
