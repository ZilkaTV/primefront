export default function Logo({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="9" fill="#131A2B" />
      <path d="M20 6L33 13V27L20 34L7 27V13L20 6Z" stroke="#FF7A1A" strokeWidth="2" strokeLinejoin="round" />
      <path d="M20 6V34M7 13L33 27M33 13L7 27" stroke="#FF7A1A" strokeWidth="1" strokeOpacity="0.4" />
      <circle cx="20" cy="20" r="4.5" fill="#FF7A1A" />
    </svg>
  )
}
