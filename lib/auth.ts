import { mockUsers, type User } from "./mock-data"

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

class AuthService {
  private currentUser: User | null = null

  async login(email: string, password: string): Promise<User | null> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user = mockUsers.find((u) => u.email === email)
    if (user && password === "password") {
      // Simple demo password
      this.currentUser = user
      localStorage.setItem("auth_user", JSON.stringify(user))
      return user
    }
    return null
  }

  async logout(): Promise<void> {
    this.currentUser = null
    localStorage.removeItem("auth_user")
  }

  getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("auth_user")
      if (stored) {
        this.currentUser = JSON.parse(stored)
        return this.currentUser
      }
    }
    return null
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  }

  hasRole(role: User["role"]): boolean {
    const user = this.getCurrentUser()
    return user?.role === role
  }
}

export const authService = new AuthService()
