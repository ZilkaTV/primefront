import { supabase } from './supabase'

export interface FinderPost {
  id: string
  user_id: string
  type: 'clan-seeking-players' | 'player-seeking-clan'
  title: string
  region: string
  elo_range: string
  description: string
  contact: string
  created_at: string
}

export async function fetchFinderPosts(): Promise<FinderPost[]> {
  const { data, error } = await supabase
    .from('clan_finder_posts')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as FinderPost[]
}

export async function createFinderPost(params: {
  userId: string
  type: FinderPost['type']
  title: string
  region: string
  eloRange: string
  description: string
  contact: string
}) {
  const { error } = await supabase.from('clan_finder_posts').insert({
    user_id: params.userId,
    type: params.type,
    title: params.title,
    region: params.region,
    elo_range: params.eloRange,
    description: params.description,
    contact: params.contact,
  })
  if (error) throw error
}

export async function deleteFinderPost(id: string) {
  const { error } = await supabase.from('clan_finder_posts').delete().eq('id', id)
  if (error) throw error
}
