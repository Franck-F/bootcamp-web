import { loginUser, registerUser, validateSession, logoutUser, hasPermission, type User } from "./client-auth"

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

export type { User }

class AuthService {
  private currentUser: User | null = null
  private currentToken: string | null = null

  async login(email: string, password: string, ipAddress?: string, userAgent?: string): Promise<User | null> {
    try {
      const result = await loginUser(email, password)
      if (!result) {
        return null
      }

      // Set current user and token
      this.currentUser = result.user
      this.currentToken = result.token

      // Store in localStorage for persistence
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", result.token)
        localStorage.setItem("auth_user", JSON.stringify(this.currentUser))
      }

      return this.currentUser
    } catch (error) {
      console.error("Login error:", error)
      return null
    }
  }

  async register(userData: {
    email: string
    password: string
    first_name?: string
    last_name?: string
    phone?: string
  }): Promise<User | null> {
    try {
      const result = await registerUser({
        email: userData.email,
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        password: userData.password,
      })

      return result?.user || null
    } catch (error) {
      console.error("Registration error:", error)
      return null
    }
  }

  async logout(): Promise<void> {
    try {
      if (this.currentToken) {
        await logoutUser(this.currentToken)
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      // Clear local state
      this.currentUser = null
      this.currentToken = null

      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token")
        localStorage.removeItem("auth_user")
      }
    }
  }

  async getCurrentUser(): Promise<User | null> {
    // Return cached user if available
    if (this.currentUser) return this.currentUser

    // Try to restore from localStorage
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token")
      const storedUser = localStorage.getItem("auth_user")

      if (token && storedUser) {
        try {
          const validUser = await validateSession(token)
          if (validUser) {
            this.currentUser = validUser
            this.currentToken = token
            return this.currentUser
          } else {
            // Invalid session, clear localStorage
            localStorage.removeItem("auth_token")
            localStorage.removeItem("auth_user")
          }
        } catch (error) {
          console.error("Session validation error:", error)
          // Clear invalid session data
          localStorage.removeItem("auth_token")
          localStorage.removeItem("auth_user")
        }
      }
    }

    return null
  }

  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser()
    return user !== null
  }

  async hasRole(role: User["role"]): Promise<boolean> {
    const user = await this.getCurrentUser()
    return user?.role === role
  }

  async hasPermission(permission: string): Promise<boolean> {
    const user = await this.getCurrentUser()
    if (!user) return false

    return hasPermission(user.id, permission)
  }

  getToken(): string | null {
    return this.currentToken
  }
}

export const authService = new AuthService()
