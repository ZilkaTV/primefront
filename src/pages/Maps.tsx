import { maps } from '../data/maps'
import { SectionHeading, Card } from '../components/ui'
import { useLanguage } from '../i18n/LanguageContext'

const scaleColor: Record<string, string> = {
  Compact: 'bg-signal-green/15 text-signal-green',
  Balanced: 'bg-signal-gold/15 text-signal-gold',
  Sprawling: 'bg-signal-red/15 text-signal-red',
}

export default function Maps() {
  const { t } = useLanguage()
  return (
    <div>
      <SectionHeading eyebrow={t.maps.eyebrow} title={t.maps.title} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {maps.map((m) => (
          <Card key={m.id} className="!p-0 overflow-hidden">
            <div className="aspect-video bg-base-800 border-b" style={{ borderColor: `${m.accent}55` }}>
              <img src={`/maps/${m.id}.webp`} alt={m.name} className="h-full w-full object-cover" loading="lazy" />
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="font-semibold text-white text-lg">{m.name}</h3>
                <span className={`badge shrink-0 ${scaleColor[m.scale]}`}>{m.scale}</span>
              </div>
              <p className="text-xs text-slate-500 mb-3 mt-1">{m.terrain}</p>
              <p className="text-sm text-slate-400">{m.description}</p>
            </div>
          </Card>
        ))}
      </div>
      <p className="text-xs text-slate-600 mt-8">
        Map thumbnails sourced from the official{' '}
        <a href="https://github.com/openfrontio/OpenFrontIO" target="_blank" rel="noreferrer" className="text-accent hover:text-accent-light">
          OpenFrontIO
        </a>{' '}
        repository.
      </p>
    </div>
  )
}
