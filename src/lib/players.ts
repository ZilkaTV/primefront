import { supabase } from './supabase'

export interface PlayerProfile {
  user_id: string
  discord_username: string
  in_game_name: string
  region: string
  openfront_id: string
}

export async function fetchMyProfile(userId: string): Promise<PlayerProfile | null> {
  const { data, error } = await supabase.from('players').select('*').eq('user_id', userId).maybeSingle()
  if (error) throw error
  return data
}

export async function upsertMyProfile(profile: PlayerProfile) {
  const { error } = await supabase.from('players').upsert(profile)
  if (error) throw error
}
