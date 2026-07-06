import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SectionHeading, Card } from '../components/ui'
import { useLanguage } from '../i18n/LanguageContext'

const regions = ['EU', 'NA', 'SA', 'ASIA', 'OCE']

type Step = 'discord' | 'form' | 'success'

export default function PlayerRegister() {
  const { t } = useLanguage()
  const [step, setStep] = useState<Step>('discord')

  if (step === 'success') {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <p className="text-accent font-display text-sm font-semibold uppercase tracking-widest mb-2">{t.playerRegister.eyebrow}</p>
        <h1 className="text-2xl font-bold text-white mb-3">{t.playerRegister.successTitle}</h1>
        <p className="text-slate-400 mb-8">{t.playerRegister.successBody}</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/clan-finder" className="btn-accent">{t.playerRegister.goToClanFinder}</Link>
          <Link to="/" className="btn-ghost">{t.playerRegister.backHome}</Link>
        </div>
      </div>
    )
  }

  if (step === 'discord') {
    return (
      <div className="max-w-md mx-auto">
        <Link to="/" className="text-sm text-slate-400 hover:text-accent mb-6 inline-block">{t.playerRegister.backHome}</Link>
        <SectionHeading eyebrow={t.playerRegister.eyebrow} title={t.playerRegister.title} />
        <Card className="text-center py-10">
          <h2 className="text-lg font-semibold text-white mb-2">{t.playerRegister.discordStepTitle}</h2>
          <p className="text-sm text-slate-400 mb-6">{t.playerRegister.discordStepBody}</p>
          <button onClick={() => setStep('form')} className="btn-accent inline-flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.369A19.79 19.79 0 0 0 15.885 3c-.213.38-.462.893-.634 1.301a18.27 18.27 0 0 0-5.5 0A12.6 12.6 0 0 0 9.115 3a19.74 19.74 0 0 0-4.435 1.371C1.4 9.043.65 13.6.925 18.096a19.9 19.9 0 0 0 6.06 3.06c.49-.665.926-1.372 1.302-2.115a12.9 12.9 0 0 1-2.049-.98c.172-.125.34-.256.503-.392a14.19 14.19 0 0 0 12.516 0c.166.14.334.27.503.392-.65.385-1.336.71-2.052.982.377.742.812 1.45 1.303 2.114a19.83 19.83 0 0 0 6.064-3.06c.323-5.218-.552-9.735-2.758-13.727ZM8.68 15.331c-1.017 0-1.85-.933-1.85-2.081 0-1.148.815-2.082 1.85-2.082 1.044 0 1.867.943 1.85 2.082 0 1.148-.815 2.081-1.85 2.081Zm6.646 0c-1.017 0-1.85-.933-1.85-2.081 0-1.148.815-2.082 1.85-2.082 1.044 0 1.867.943 1.85 2.082 0 1.148-.806 2.081-1.85 2.081Z" />
            </svg>
            {t.playerRegister.discordButton}
          </button>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto">
      <Link to="/" className="text-sm text-slate-400 hover:text-accent mb-6 inline-block">{t.playerRegister.backHome}</Link>
      <SectionHeading eyebrow={t.playerRegister.eyebrow} title={t.playerRegister.title} />
      <p className="text-slate-400 -mt-4 mb-2">{t.playerRegister.intro}</p>
      <p className="text-sm text-signal-green mb-6">✓ {t.playerRegister.loggedInAs} Discord</p>

      <Card>
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault()
            setStep('success')
          }}
        >
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">{t.playerRegister.name}</label>
            <input required type="text" className="w-full rounded-lg bg-base-800 border border-base-600 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-accent" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">{t.playerRegister.region}</label>
              <select required className="w-full rounded-lg bg-base-800 border border-base-600 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-accent">
                {regions.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">{t.playerRegister.openfrontId}</label>
              <input required type="text" placeholder={t.playerRegister.openfrontIdPlaceholder} className="w-full rounded-lg bg-base-800 border border-base-600 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-accent" />
            </div>
          </div>
          <label className="flex items-start gap-2.5 text-sm text-slate-400 cursor-pointer select-none">
            <input required type="checkbox" className="accent-accent h-4 w-4 mt-0.5 shrink-0" />
            {t.playerRegister.agree}
          </label>
          <button type="submit" className="btn-accent w-full">{t.playerRegister.submit}</button>
        </form>
      </Card>
    </div>
  )
}
