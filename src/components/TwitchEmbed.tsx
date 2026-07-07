import { TWITCH_CHANNEL } from '../config'

export default function TwitchEmbed({ className = '' }: { className?: string }) {
  const parent = typeof window !== 'undefined' ? window.location.hostname : 'localhost'
  const src = `https://player.twitch.tv/?channel=${TWITCH_CHANNEL}&parent=${parent}&muted=true`

  return (
    <div className={`aspect-video w-full rounded-xl overflow-hidden bg-base-900 border border-base-700 ${className}`}>
      <iframe
        src={src}
        title="Twitch stream"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  )
}
