export default function MapArt({ id, accent, className = 'h-24 w-24' }: { id: string; accent: string; className?: string }) {
  return (
    <div
      className={`${className} rounded-xl overflow-hidden shrink-0 bg-base-800 border`}
      style={{ borderColor: `${accent}55` }}
    >
      <img
        src={`/maps/${id}.webp`}
        alt=""
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </div>
  )
}
