import { NavLink } from 'react-router-dom'
import Logo from './Logo'
import LanguageSwitcher from './LanguageSwitcher'
import { useLanguage } from '../i18n/LanguageContext'

export default function Navbar() {
  const { t } = useLanguage()

  const links = [
    { to: '/', label: t.nav.home, end: true },
    { to: '/league', label: t.nav.league },
    { to: '/clans', label: t.nav.clans },
    { to: '/tournaments', label: t.nav.tournaments },
    { to: '/maps', label: t.nav.maps },
    { to: '/news', label: t.nav.news },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-base-700 bg-base-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <NavLink to="/" className="flex items-center gap-2.5 shrink-0">
          <Logo />
          <span className="font-display text-xl font-bold text-white tracking-wide">
            PRIME<span className="text-accent">FRONT</span>
          </span>
        </NavLink>

        <nav id="desktop-nav" className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => `nav-link whitespace-nowrap ${isActive ? 'nav-link-active' : ''}`}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <NavLink to="/clan-finder" className="btn-accent !py-2 !px-3.5 text-sm hidden sm:inline-flex">
            {t.nav.clanFinder}
          </NavLink>
          <LanguageSwitcher />
          <NavLink to="/register" className="btn-ghost !py-2 !px-3.5 text-sm hidden sm:inline-flex">
            {t.nav.register}
          </NavLink>
          <a
            href="https://discord.gg/6RcPDA9dPb"
            target="_blank"
            rel="noreferrer"
            aria-label="Discord"
            className="btn-ghost !p-2.5"
            title="Discord"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.369A19.79 19.79 0 0 0 15.885 3c-.213.38-.462.893-.634 1.301a18.27 18.27 0 0 0-5.5 0A12.6 12.6 0 0 0 9.115 3a19.74 19.74 0 0 0-4.435 1.371C1.4 9.043.65 13.6.925 18.096a19.9 19.9 0 0 0 6.06 3.06c.49-.665.926-1.372 1.302-2.115a12.9 12.9 0 0 1-2.049-.98c.172-.125.34-.256.503-.392a14.19 14.19 0 0 0 12.516 0c.166.14.334.27.503.392-.65.385-1.336.71-2.052.982.377.742.812 1.45 1.303 2.114a19.83 19.83 0 0 0 6.064-3.06c.323-5.218-.552-9.735-2.758-13.727ZM8.68 15.331c-1.017 0-1.85-.933-1.85-2.081 0-1.148.815-2.082 1.85-2.082 1.044 0 1.867.943 1.85 2.082 0 1.148-.815 2.081-1.85 2.081Zm6.646 0c-1.017 0-1.85-.933-1.85-2.081 0-1.148.815-2.082 1.85-2.082 1.044 0 1.867.943 1.85 2.082 0 1.148-.806 2.081-1.85 2.081Z" />
            </svg>
          </a>
        </div>
      </div>
      <nav id="mobile-nav" className="md:hidden flex items-center gap-1 px-4 pb-3 overflow-x-auto">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) => `nav-link whitespace-nowrap ${isActive ? 'nav-link-active' : ''}`}
          >
            {l.label}
          </NavLink>
        ))}
        <NavLink to="/clan-finder" className={({ isActive }) => `nav-link whitespace-nowrap ${isActive ? 'nav-link-active' : ''}`}>
          {t.nav.clanFinder}
        </NavLink>
        <NavLink to="/register" className={({ isActive }) => `nav-link whitespace-nowrap ${isActive ? 'nav-link-active' : ''}`}>
          {t.nav.register}
        </NavLink>
      </nav>
    </header>
  )
}
