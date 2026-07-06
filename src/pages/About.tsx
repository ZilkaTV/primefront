import { SectionHeading, Card } from '../components/ui'
import { useLanguage } from '../i18n/LanguageContext'

export default function About() {
  const { t } = useLanguage()
  return (
    <div>
      <SectionHeading eyebrow={t.about.eyebrow} title={t.about.title} />
      <div className="max-w-2xl space-y-6">
        <Card>
          <p className="text-slate-300 leading-relaxed">{t.about.p1}</p>
        </Card>
        <Card>
          <h2 className="text-lg font-bold text-white mb-2">{t.about.p2title}</h2>
          <p className="text-sm text-slate-400 leading-relaxed">{t.about.p2}</p>
        </Card>
      </div>
    </div>
  )
}
