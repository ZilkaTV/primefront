import { SectionHeading, Card } from '../components/ui'
import { useLanguage } from '../i18n/LanguageContext'
import TwitchEmbed from '../components/TwitchEmbed'

export default function Socials() {
  const { t } = useLanguage()
  return (
    <div>
      <SectionHeading eyebrow={t.socials.eyebrow} title={t.socials.title} />
      <p className="text-slate-400 max-w-2xl mb-8">{t.socials.intro}</p>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-bold text-white mb-2">{t.socials.twitchLabel}</h2>
          <p className="text-sm text-slate-400 leading-relaxed mb-4">{t.socials.twitchDescription}</p>
          <TwitchEmbed />
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-white mb-2">{t.socials.discordLabel}</h2>
          <p className="text-sm text-slate-400 leading-relaxed mb-4">{t.socials.discordDescription}</p>
          <a
            href="https://discord.gg/SP2V5VsNHn"
            target="_blank"
            rel="noreferrer"
            className="btn-accent inline-flex"
          >
            {t.socials.visitButton}
          </a>
        </Card>
      </div>
    </div>
  )
}
