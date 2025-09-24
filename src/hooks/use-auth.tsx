'use client'

import { useContext } from 'react'
import { AuthContext } from '@/components/auth-provider'

export function useAuth() {
  const context = useContext(AuthContext)
  
  // Pendant la génération statique, retourner des valeurs par défaut
  if (context === undefined) {
    return {
      user: null,
      loading: false,
      signIn: async () => ({ success: false, error: 'Not available during build' }),
      signOut: async () => {},
      refresh: async () => {}
    }
  }
  
  return context
}
