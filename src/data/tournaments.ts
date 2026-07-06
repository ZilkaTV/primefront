export interface Tournament {
  id: string
  name: string
  status: 'live' | 'upcoming' | 'finished'
  format: string
  map: string
  prize: string
  startDate: string
  endDate: string
  participants: number
  maxParticipants: number
}

export const tournaments: Tournament[] = []
