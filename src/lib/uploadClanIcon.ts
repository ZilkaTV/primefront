import { supabase } from './supabase'

export async function uploadClanIcon(file: File, userId: string): Promise<string> {
  const ext = file.name.split('.').pop() || 'png'
  const path = `${userId}/${Date.now()}.${ext}`
  const { error } = await supabase.storage.from('clan-icons').upload(path, file, { upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from('clan-icons').getPublicUrl(path)
  return data.publicUrl
}
