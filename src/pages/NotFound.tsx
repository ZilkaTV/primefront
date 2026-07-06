import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'

export default function NotFound() {
  const { t } = useLanguage()
  return (
    <div className="text-center py-24">
      <p className="text-accent font-display text-sm font-semibold uppercase tracking-widest mb-2">404</p>
      <h1 className="text-3xl font-bold text-white mb-4">{t.notFound.title}</h1>
      <p className="text-slate-400 mb-8">{t.notFound.body}</p>
      <Link to="/" className="btn-accent">{t.notFound.button}</Link>
    </div>
  )
}
