import { SectionHeading, Card } from '../components/ui'
import { useLanguage } from '../i18n/LanguageContext'

export default function Support() {
  const { t } = useLanguage()
  return (
    <div>
      <SectionHeading eyebrow={t.support.eyebrow} title={t.support.title} />
      <div className="max-w-2xl space-y-6">
        <Card>
          <p className="text-slate-300 leading-relaxed mb-4">{t.support.intro}</p>
          <ul className="space-y-2 text-sm text-slate-400 list-disc list-inside mb-6">
            <li>{t.support.reasonServer}</li>
            <li>{t.support.reasonStaff}</li>
            <li>{t.support.reasonPrize}</li>
          </ul>
          <a
            href="https://paypal.me/gqku"
            target="_blank"
            rel="noreferrer"
            className="btn-accent inline-flex"
          >
            {t.support.donateButton}
          </a>
        </Card>
        <p className="text-xs text-slate-500 leading-relaxed">{t.support.disclaimer}</p>
      </div>
    </div>
  )
}
