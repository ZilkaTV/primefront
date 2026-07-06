import { news as staticNews, type NewsArticle } from '../data/news'
import { loadAdminPosts } from './adminPosts'

export function getCommunityPosts(): NewsArticle[] {
  const admin = loadAdminPosts().map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    body: p.body,
    date: p.date,
    category: p.category,
    author: `${p.author} · ${p.role}`,
  }))
  return [...admin, ...staticNews].sort((a, b) => b.date.localeCompare(a.date))
}

export function getCommunityPostBySlug(slug: string): NewsArticle | undefined {
  return getCommunityPosts().find((n) => n.slug === slug)
}
