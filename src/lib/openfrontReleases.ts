export interface OpenFrontRelease {
  id: string
  tag: string
  title: string
  date: string
  url: string
  excerpt: string
}

function firstSection(body: string): string {
  const lines = body.split('\n')
  const headingIdx: number[] = []
  lines.forEach((line, i) => {
    if (/^#\s+/.test(line)) headingIdx.push(i)
  })
  if (headingIdx.length <= 1) return body
  return lines.slice(headingIdx[0], headingIdx[1]).join('\n')
}

function toExcerpt(section: string): string {
  const bullets = section
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => /^[-*]\s+/.test(l))
    .map((l) => l.replace(/^[-*]\s+/, '').replace(/\*\*/g, ''))
  const text = bullets.slice(0, 3).join(' · ')
  return text.length > 220 ? text.slice(0, 217) + '…' : text || 'View the full patch notes on GitHub.'
}

export async function fetchOpenFrontReleases(limit = 6): Promise<OpenFrontRelease[]> {
  const res = await fetch(`https://api.github.com/repos/openfrontio/OpenFrontIO/releases?per_page=${limit}`)
  if (!res.ok) throw new Error(`GitHub API responded ${res.status}`)
  const data: Array<{ tag_name: string; published_at: string; html_url: string; body: string | null }> = await res.json()
  return data.map((r) => {
    const section = firstSection(r.body ?? '')
    return {
      id: `openfront-${r.tag_name.replace(/\./g, '-')}`,
      tag: r.tag_name,
      title: `OpenFront ${r.tag_name}`,
      date: r.published_at,
      url: r.html_url,
      excerpt: toExcerpt(section),
    }
  })
}
