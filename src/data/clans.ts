export type Region = 'EU' | 'NA' | 'SA' | 'ASIA' | 'OCE'

export interface Clan {
  id: string
  tag: string
  name: string
  color: string
  region: Region
  leagueWins: number
  leagueLosses: number
  members: number
  founded: string
  wins: number
  losses: number
  recruiting: boolean
  description: string
  roster: { name: string; role: 'Leader' | 'Officer' | 'Member'; elo: number }[]
}

export const clans: Clan[] = []

export function getClanById(id: string) {
  return clans.find((c) => c.id === id)
}
