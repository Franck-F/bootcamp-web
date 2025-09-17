export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  role: "admin" | "seller" | "customer"
  created_at: Date
  updated_at: Date
}

export async function loginUser(email: string, password: string): Promise<{ user: User; token: string } | null> {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error("Login error:", error)
    return null
  }
}

export async function registerUser(userData: {
  email: string
  password: string
  first_name: string
  last_name: string
  role?: "customer" | "seller" | "admin"
}): Promise<{ user: User; token: string } | null> {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error("Registration error:", error)
    return null
  }
}

export async function validateSession(token: string): Promise<User | null> {
  try {
    const response = await fetch("/api/auth/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.user
  } catch (error) {
    console.error("Session validation error:", error)
    return null
  }
}

export async function logoutUser(token: string): Promise<boolean> {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.ok
  } catch (error) {
    console.error("Logout error:", error)
    return false
  }
}

export async function hasPermission(userId: number, permission: string): Promise<boolean> {
  try {
    const response = await fetch("/api/auth/permissions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, permission }),
    })

    if (!response.ok) {
      return false
    }

    const data = await response.json()
    return data.hasPermission
  } catch (error) {
    console.error("Permission check error:", error)
    return false
  }
}
