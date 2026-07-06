import { news as staticNews, type NewsArticle } from '../data/news'
import { fetchNewsPosts, fetchNewsPostBySlug } from './newsPosts'

export async function getCommunityPosts(): Promise<NewsArticle[]> {
  const posts = await fetchNewsPosts()
  return [...posts, ...staticNews].sort((a, b) => b.date.localeCompare(a.date))
}

export async function getCommunityPostBySlug(slug: string): Promise<NewsArticle | undefined> {
  const staticMatch = staticNews.find((n) => n.slug === slug)
  if (staticMatch) return staticMatch
  return fetchNewsPostBySlug(slug)
}
