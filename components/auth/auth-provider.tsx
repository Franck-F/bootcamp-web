"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { authService, type User } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: {
    email: string
    password: string
    first_name?: string
    last_name?: string
    phone?: string
  }) => Promise<boolean>
  logout: () => Promise<void>
  hasRole: (role: User["role"]) => boolean
  hasPermission: (permission: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const initAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error("Auth initialization error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Get client IP and user agent for security logging
      const ipAddress = typeof window !== "undefined" ? window.location.hostname : undefined
      const userAgent = typeof window !== "undefined" ? window.navigator.userAgent : undefined

      const user = await authService.login(email, password, ipAddress, userAgent)
      if (user) {
        setUser(user)
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: {
    email: string
    password: string
    first_name?: string
    last_name?: string
    phone?: string
  }): Promise<boolean> => {
    setIsLoading(true)
    try {
      const newUser = await authService.register(userData)
      if (newUser) {
        // Auto-login after successful registration
        const loginSuccess = await login(userData.email, userData.password)
        return loginSuccess
      }
      return false
    } catch (error) {
      console.error("Registration error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    setIsLoading(true)
    try {
      await authService.logout()
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const hasRole = (role: User["role"]): boolean => {
    return user?.role === role
  }

  const hasPermission = async (permission: string): Promise<boolean> => {
    return authService.hasPermission(permission)
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    hasRole,
    hasPermission,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
