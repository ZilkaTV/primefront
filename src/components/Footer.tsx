import { Link } from 'react-router-dom'
import Logo from './Logo'
import { useLanguage } from '../i18n/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="border-t border-base-700 bg-base-900/60 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <Logo className="h-7 w-7" />
            <span className="font-display text-lg font-bold text-white">PRIME<span className="text-accent">FRONT</span></span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">{t.footer.tagline}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">{t.footer.competition}</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link to="/league" className="hover:text-accent">{t.footer.league}</Link></li>
            <li><Link to="/tournaments" className="hover:text-accent">{t.footer.tournaments}</Link></li>
            <li><Link to="/clans" className="hover:text-accent">{t.footer.clans}</Link></li>
            <li><Link to="/clan-finder" className="hover:text-accent">{t.footer.clanFinder}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">{t.footer.resources}</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link to="/maps" className="hover:text-accent">{t.footer.maps}</Link></li>
            <li><Link to="/news" className="hover:text-accent">{t.footer.news}</Link></li>
            <li><Link to="/rules" className="hover:text-accent">{t.footer.rules}</Link></li>
            <li><Link to="/about" className="hover:text-accent">{t.footer.about}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">{t.footer.community}</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><a href="https://discord.gg/6RcPDA9dPb" target="_blank" rel="noreferrer" className="hover:text-accent">{t.footer.discord}</a></li>
            <li><a href="https://github.com/openfrontio/OpenFrontIO" target="_blank" rel="noreferrer" className="hover:text-accent">{t.footer.github}</a></li>
            <li><a href="https://openfront.io/privacy-policy.html" target="_blank" rel="noreferrer" className="hover:text-accent">{t.footer.privacyPolicy}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-base-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between gap-2 text-xs text-slate-500">
          <p>{t.footer.copyright}</p>
          <div className="flex items-center gap-3">
            <p>{t.footer.demoNotice}</p>
            <Link to="/admin" className="hover:text-accent underline underline-offset-2">{t.admin.eyebrow}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
