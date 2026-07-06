import { useEffect, useRef, useState } from 'react'
import { languages } from '../i18n/translations'
import { useLanguage } from '../i18n/LanguageContext'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Change language"
        aria-expanded={open}
        className="btn-ghost !p-2.5 text-xs font-bold uppercase tracking-wide"
      >
        {language}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-36 panel !p-1.5 z-50 shadow-lg">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLanguage(l.code)
                setOpen(false)
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                language === l.code ? 'bg-base-700 text-white font-semibold' : 'text-slate-300 hover:bg-base-800'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
