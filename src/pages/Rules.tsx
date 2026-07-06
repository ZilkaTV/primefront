import { SectionHeading, Card } from '../components/ui'
import { useLanguage } from '../i18n/LanguageContext'

const sections = [
  {
    title: '1. Eligibility & conduct (from the OpenFront Terms of Service)',
    rules: [
      'Players must be at least 13 years old to use OpenFront — 16 in the EEA, UK, or other jurisdictions requiring a higher minimum age.',
      'Knowingly exploiting a bug, glitch, or unintended behaviour is prohibited. Suspected bugs must be reported privately via the official OpenFront GitHub repository or Discord — never exploited or publicly weaponised.',
      'Sustained behaviour intended to ruin the experience for others is prohibited: griefing, spawn-camping in violation of mode rules, intentional AFK/idle play, chat spam, and coordinated harassment of specific players.',
    ],
  },
  {
    title: '2. Cheating & enforcement (from the OpenFront Terms of Service)',
    rules: [
      'No automated means or interface not provided by OpenFront may be used to access the service, and reverse engineering any part of it is prohibited.',
      'Cheating, distributing unauthorised modifications, repeated offences after a prior warning, or behaviour endangering minors can result in an immediate permanent ban without prior warning.',
      'Enforcement applies across every account reasonably believed to be controlled by the same person, and across every platform OpenFront is distributed on. Appeals can be filed within 30 days of the action and are reviewed in good faith.',
    ],
  },
  {
    title: '3. Primefront league structure',
    rules: [
      'Primefront is played 5v5 — exactly 10 players per match, on the official map pool.',
      'The league currently runs as a single division while the community grows — every approved clan competes in the same table.',
      'Once enough clans have registered, the league may split into multiple divisions with promotion and relegation. This page will be updated if and when that happens.',
    ],
  },
  {
    title: '4. Clans & applications',
    rules: [
      'A clan needs a full 5-player starting roster (plus substitutes) and at least 5 active members to register for the league.',
      'Applications are reviewed by the league admins; approval depends on roster completeness and confirmed agreement to these rules and the OpenFront Terms of Service.',
      'Clan tags may not contain offensive or misleading terms. A clan may switch its registered roster at most once per season.',
    ],
  },
  {
    title: '5. Match rules',
    rules: [
      "One team always provides the host: before the match, that team's captain creates a private OpenFront lobby and sends the join link to the opposing captain. The host is responsible for starting the countdown once all 10 players have joined.",
      'League points are awarded 3 for a win, 0 for a loss. Standings are ranked by points, then by matches played.',
      'If a disconnect occurs within the first 5 minutes of a match, the match is replayed rather than scored.',
      'Failure to field a full 5-player roster within 10 minutes of the scheduled match time counts as a forfeit.',
      'Host duty alternates each match week between the two competing clans, so the same team is never responsible for hosting twice in a row against the same opponent.',
    ],
  },
]

export default function Rules() {
  const { t } = useLanguage()
  return (
    <div>
      <SectionHeading eyebrow={t.rules.eyebrow} title={t.rules.title} />
      <p className="text-sm text-slate-500 -mt-4 mb-8 max-w-3xl">
        {t.rules.sourceNote}{' '}
        <a href="https://openfront.io/terms-of-service.html" target="_blank" rel="noreferrer" className="text-accent hover:text-accent-light">
          {t.rules.sourceLink}
        </a>
        .
      </p>
      <div className="space-y-6 max-w-3xl">
        {sections.map((s) => (
          <Card key={s.title}>
            <h2 className="text-lg font-bold text-white mb-3">{s.title}</h2>
            <ul className="space-y-2 text-sm text-slate-400 list-disc list-inside">
              {s.rules.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  )
}
