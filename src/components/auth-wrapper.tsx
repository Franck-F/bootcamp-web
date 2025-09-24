'use client'

import { ReactNode } from 'react'
import { useAuth } from '@/hooks/use-auth'

interface AuthWrapperProps {
  children: ReactNode
  fallback?: ReactNode
}

export function AuthWrapper({ children, fallback = null }: AuthWrapperProps) {
  const { loading } = useAuth()
  
  if (loading) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}
