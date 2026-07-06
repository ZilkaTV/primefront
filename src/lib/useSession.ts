import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabase'

/** undefined while the initial session is loading, null when signed out. */
export function useSession() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => listener.subscription.unsubscribe()
  }, [])

  return session
}

export function discordDisplayName(session: Session) {
  return (
    session.user.user_metadata.full_name ||
    session.user.user_metadata.name ||
    session.user.user_metadata.preferred_username ||
    'Player'
  )
}
