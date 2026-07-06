export interface NewsArticle {
  id: string
  slug: string
  title: string
  excerpt: string
  body: string[]
  date: string
  category: 'Update' | 'Community' | 'Tournament' | 'Patch'
  author: string
}

export const news: NewsArticle[] = []

export function getNewsBySlug(slug: string) {
  return news.find((n) => n.slug === slug)
}
