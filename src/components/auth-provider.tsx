'use client'

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { User } from '@/lib/edge-auth'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  refresh: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Erreur de vérification auth:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        return { success: true }
      } else {
        const error = await response.json()
        return { success: false, error: error.error || 'Erreur de connexion' }
      }
    } catch (error) {
      return { success: false, error: 'Erreur de connexion' }
    }
  }

  const signOut = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Erreur de déconnexion:', error)
    } finally {
      setUser(null)
    }
  }

  const refresh = async () => {
    setLoading(true)
    await checkAuth()
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}


// Hook de compatibilité avec NextAuth
export function useSession() {
  const { user, loading } = useContext(AuthContext) || { user: null, loading: false }
  
  return {
    data: user ? { user } : null,
    status: loading ? 'loading' : (user ? 'authenticated' : 'unauthenticated')
  }
}
