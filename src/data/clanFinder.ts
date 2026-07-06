export interface FinderPost {
  id: string
  type: 'clan-seeking-players' | 'player-seeking-clan'
  title: string
  region: string
  eloRange: string
  description: string
  contact: string
  posted: string
}

export const finderPosts: FinderPost[] = []
