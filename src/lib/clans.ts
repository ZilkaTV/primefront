import { supabase } from './supabase'

export type ClanRole = 'leader' | 'co_leader' | 'member'

export interface Clan {
  id: string
  parent_clan_id: string | null
  tag: string
  name: string
  description: string
  icon_url: string | null
  region: string
  recruiting: boolean
  league_wins: number
  league_losses: number
  created_at: string
}

export interface ClanMember {
  user_id: string
  discord_username: string
  in_game_name: string
  region: string
  openfront_id: string
  clan_role: ClanRole
}

export interface JoinRequest {
  id: string
  clan_id: string
  user_id: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  players: { in_game_name: string; discord_username: string } | null
}

export async function fetchClans(): Promise<Clan[]> {
  const { data, error } = await supabase.from('clans').select('*').order('league_wins', { ascending: false })
  if (error) throw error
  return data as Clan[]
}

export async function fetchClanById(id: string): Promise<Clan | null> {
  const { data, error } = await supabase.from('clans').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data
}

export async function fetchSubClans(parentId: string): Promise<Clan[]> {
  const { data, error } = await supabase.from('clans').select('*').eq('parent_clan_id', parentId)
  if (error) throw error
  return data as Clan[]
}

export async function fetchClanMembers(clanId: string): Promise<ClanMember[]> {
  const { data, error } = await supabase
    .from('players')
    .select('user_id, discord_username, in_game_name, region, openfront_id, clan_role')
    .eq('clan_id', clanId)
    .order('clan_role', { ascending: true })
  if (error) throw error
  return data as ClanMember[]
}

export async function fetchMyClanId(userId: string): Promise<string | null> {
  const { data, error } = await supabase.from('players').select('clan_id').eq('user_id', userId).maybeSingle()
  if (error) throw error
  return data?.clan_id ?? null
}

export async function fetchMyPendingRequest(userId: string) {
  const { data, error } = await supabase
    .from('clan_join_requests')
    .select('*, clans(name, tag)')
    .eq('user_id', userId)
    .eq('status', 'pending')
    .maybeSingle()
  if (error) throw error
  return data as (JoinRequest & { clans: { name: string; tag: string } | null }) | null
}

export async function fetchClanJoinRequests(clanId: string): Promise<JoinRequest[]> {
  const { data, error } = await supabase
    .from('clan_join_requests')
    .select('*, players(in_game_name, discord_username)')
    .eq('clan_id', clanId)
    .eq('status', 'pending')
  if (error) throw error
  return data as JoinRequest[]
}

export async function createClan(params: {
  name: string
  tag: string
  description: string
  iconUrl: string
  region: string
  parentClanId?: string | null
}): Promise<string> {
  const { data, error } = await supabase.rpc('create_clan', {
    p_name: params.name,
    p_tag: params.tag,
    p_description: params.description,
    p_icon_url: params.iconUrl || null,
    p_region: params.region,
    p_parent_clan_id: params.parentClanId ?? null,
  })
  if (error) throw error
  return data as string
}

export async function requestJoinClan(clanId: string) {
  const { error } = await supabase.rpc('request_join_clan', { p_clan_id: clanId })
  if (error) throw error
}

export async function cancelJoinRequest(requestId: string) {
  const { error } = await supabase.rpc('cancel_join_request', { p_request_id: requestId })
  if (error) throw error
}

export async function approveJoinRequest(requestId: string) {
  const { error } = await supabase.rpc('approve_join_request', { p_request_id: requestId })
  if (error) throw error
}

export async function rejectJoinRequest(requestId: string) {
  const { error } = await supabase.rpc('reject_join_request', { p_request_id: requestId })
  if (error) throw error
}

export async function setMemberRole(targetUserId: string, role: 'co_leader' | 'member') {
  const { error } = await supabase.rpc('set_member_role', { p_target_user_id: targetUserId, p_role: role })
  if (error) throw error
}

export async function transferLeadership(newLeaderUserId: string) {
  const { error } = await supabase.rpc('transfer_leadership', { p_new_leader_user_id: newLeaderUserId })
  if (error) throw error
}

export async function kickMember(targetUserId: string) {
  const { error } = await supabase.rpc('kick_member', { p_target_user_id: targetUserId })
  if (error) throw error
}

export async function leaveClan() {
  const { error } = await supabase.rpc('leave_clan')
  if (error) throw error
}

export async function updateClanInfo(clanId: string, description: string, iconUrl: string) {
  const { error } = await supabase.rpc('update_clan_info', {
    p_clan_id: clanId,
    p_description: description,
    p_icon_url: iconUrl || null,
  })
  if (error) throw error
}

export async function deleteClan(clanId: string) {
  const { error } = await supabase.rpc('delete_clan', { p_clan_id: clanId })
  if (error) throw error
}
