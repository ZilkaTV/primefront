import { SectionHeading, Card } from '../components/ui'
import { useLanguage } from '../i18n/LanguageContext'

const CONTACT_EMAIL = 'gqkutv@gmail.com'

const roles = [
  {
    title: 'Frontend Developer',
    description: 'Help build and improve the Primefront website (React, TypeScript, Tailwind).',
  },
  {
    title: 'Backend Developer',
    description: 'Help design and maintain the Supabase backend — database schema, permissions, and integrations.',
  },
  {
    title: 'Host (Moderator & Referee)',
    description: 'Run league matches — enforce match rules, resolve disputes, and keep games on schedule as moderator and referee at the same time.',
  },
  {
    title: 'Social Media Manager',
    description: "Manage Primefront's social media presence and help grow the community.",
  },
  {
    title: 'Graphic Designer',
    description: 'Design graphics, banners, and visual assets for the league, tournaments, and socials.',
  },
  {
    title: 'Caster & Analyst',
    description: 'Commentate and analyze league matches for the community.',
  },
  {
    title: 'Music Composer',
    description: 'Compose original music for Primefront content, streams, and tournaments.',
  },
  {
    title: 'Sponsor / Partner',
    description: 'Interested in sponsoring Primefront or partnering with the league? Get in touch.',
  },
]

export default function Jobs() {
  const { t } = useLanguage()
  return (
    <div>
      <SectionHeading eyebrow={t.jobs.eyebrow} title={t.jobs.title} />
      <p className="text-slate-400 -mt-4 mb-8 max-w-2xl">{t.jobs.intro}</p>

      <div className="grid sm:grid-cols-2 gap-5">
        {roles.map((r) => (
          <Card key={r.title} className="flex flex-col">
            <h3 className="font-semibold text-white mb-2">{r.title}</h3>
            <p className="text-sm text-slate-400 mb-4 flex-1">{r.description}</p>
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Primefront application: ${r.title}`)}`}
              className="btn-accent self-start"
            >
              {t.jobs.applyButton}
            </a>
          </Card>
        ))}
      </div>
    </div>
  )
}
