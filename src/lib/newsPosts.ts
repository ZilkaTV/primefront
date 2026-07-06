import { supabase } from './supabase'
import type { NewsArticle } from '../data/news'

export interface NewsPostRow {
  id: string
  slug: string
  title: string
  excerpt: string
  body: string[]
  category: 'Update' | 'Community' | 'Tournament' | 'Patch'
  author_name: string
  author_role: string
  created_at: string
}

function toArticle(row: NewsPostRow): NewsArticle {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    body: row.body,
    date: row.created_at.slice(0, 10),
    category: row.category,
    author: `${row.author_name} · ${row.author_role}`,
  }
}

export async function fetchNewsPosts(): Promise<NewsArticle[]> {
  const { data, error } = await supabase
    .from('news_posts')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as NewsPostRow[]).map(toArticle)
}

export async function fetchNewsPostBySlug(slug: string): Promise<NewsArticle | undefined> {
  const { data, error } = await supabase.from('news_posts').select('*').eq('slug', slug).maybeSingle()
  if (error) throw error
  return data ? toArticle(data as NewsPostRow) : undefined
}

export async function createNewsPost(post: {
  title: string
  excerpt: string
  body: string[]
  category: NewsPostRow['category']
  authorName: string
  authorRole: string
}) {
  const slug = slugify(post.title)
  const { error } = await supabase.from('news_posts').insert({
    slug,
    title: post.title,
    excerpt: post.excerpt,
    body: post.body,
    category: post.category,
    author_name: post.authorName,
    author_role: post.authorRole,
  })
  if (error) throw error
}

export async function deleteNewsPost(id: string) {
  const { error } = await supabase.from('news_posts').delete().eq('id', id)
  if (error) throw error
}

export function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || `post-${Date.now()}`
  )
}
