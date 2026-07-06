import type { ReactNode } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

export function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string
  title: string
  action?: ReactNode
}) {
  return (
    <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
      <div>
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-1">{eyebrow}</p>}
        <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
      </div>
      {action}
    </div>
  )
}

export function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="panel px-5 py-4">
      <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-white font-display">{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
    </div>
  )
}

export function RegionBadge({ region }: { region: string }) {
  const colors: Record<string, string> = {
    EU: 'bg-signal-blue/15 text-signal-blue',
    NA: 'bg-signal-red/15 text-signal-red',
    SA: 'bg-signal-green/15 text-signal-green',
    ASIA: 'bg-signal-gold/15 text-signal-gold',
    OCE: 'bg-accent/15 text-accent-light',
  }
  return <span className={`badge ${colors[region] ?? 'bg-base-700 text-slate-300'}`}>{region}</span>
}

export function StatusBadge({ status }: { status: 'live' | 'upcoming' | 'finished' }) {
  const { t } = useLanguage()
  const map = {
    live: { label: t.badges.live, cls: 'bg-signal-red/15 text-signal-red' },
    upcoming: { label: t.badges.upcoming, cls: 'bg-signal-blue/15 text-signal-blue' },
    finished: { label: t.badges.finished, cls: 'bg-base-600/40 text-slate-400' },
  }
  const s = map[status]
  return (
    <span className={`badge ${s.cls}`}>
      {status === 'live' && <span className="h-1.5 w-1.5 rounded-full bg-signal-red animate-pulse" />}
      {s.label}
    </span>
  )
}

export function CategoryBadge({ category }: { category: 'Update' | 'Community' | 'Tournament' | 'Patch' }) {
  const { t } = useLanguage()
  const colors: Record<string, string> = {
    Update: 'bg-signal-blue/15 text-signal-blue',
    Community: 'bg-signal-green/15 text-signal-green',
    Tournament: 'bg-accent/15 text-accent-light',
    Patch: 'bg-signal-gold/15 text-signal-gold',
  }
  return <span className={`badge ${colors[category] ?? 'bg-base-700 text-slate-300'}`}>{t.badges[category]}</span>
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`panel p-5 ${className}`}>{children}</div>
}
