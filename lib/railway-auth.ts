import { query } from "./railway-db"
import bcrypt from "bcryptjs"

export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  role: "admin" | "seller" | "customer"
  created_at: Date
  updated_at: Date
}

export interface Session {
  id: string
  user_id: number
  expires_at: Date
  created_at: Date
}

export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    const result = await query("SELECT * FROM users WHERE email = $1", [email])
    return result.rows[0] || null
  } catch (error) {
    console.error("Error finding user by email:", error)
    return null
  }
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hashedPassword)
  } catch (error) {
    console.error("Error verifying password:", error)
    return false
  }
}

export async function createUser(userData: {
  email: string
  password: string
  first_name: string
  last_name: string
  role?: "customer" | "seller" | "admin"
}): Promise<User | null> {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 12)
    const result = await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, email, first_name, last_name, role, created_at, updated_at`,
      [userData.email, hashedPassword, userData.first_name, userData.last_name, userData.role || "customer"],
    )
    return result.rows[0] || null
  } catch (error) {
    console.error("Error creating user:", error)
    return null
  }
}

export async function createSession(userId: number): Promise<string> {
  try {
    const sessionId = generateSessionId()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    await query("INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)", [sessionId, userId, expiresAt])

    return sessionId
  } catch (error) {
    console.error("Error creating session:", error)
    throw error
  }
}

export async function validateSession(sessionId: string): Promise<User | null> {
  try {
    const result = await query(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.role, u.created_at, u.updated_at
       FROM sessions s
       JOIN users u ON s.user_id = u.id
       WHERE s.id = $1 AND s.expires_at > NOW()`,
      [sessionId],
    )
    return result.rows[0] || null
  } catch (error) {
    console.error("Error validating session:", error)
    return null
  }
}

export async function revokeSession(sessionId: string): Promise<void> {
  try {
    await query("DELETE FROM sessions WHERE id = $1", [sessionId])
  } catch (error) {
    console.error("Error revoking session:", error)
  }
}

export async function checkLoginAttempts(email: string): Promise<boolean> {
  try {
    const result = await query("SELECT failed_attempts, last_failed_at FROM users WHERE email = $1", [email])

    if (!result.rows[0]) return true

    const { failed_attempts, last_failed_at } = result.rows[0]

    // Reset attempts after 15 minutes
    if (last_failed_at && Date.now() - new Date(last_failed_at).getTime() > 15 * 60 * 1000) {
      await query("UPDATE users SET failed_attempts = 0, last_failed_at = NULL WHERE email = $1", [email])
      return true
    }

    return failed_attempts < 5
  } catch (error) {
    console.error("Error checking login attempts:", error)
    return true
  }
}

export async function recordFailedLogin(email: string): Promise<void> {
  try {
    await query(
      `UPDATE users 
       SET failed_attempts = COALESCE(failed_attempts, 0) + 1, 
           last_failed_at = NOW() 
       WHERE email = $1`,
      [email],
    )
  } catch (error) {
    console.error("Error recording failed login:", error)
  }
}

export async function resetFailedLogins(email: string): Promise<void> {
  try {
    await query("UPDATE users SET failed_attempts = 0, last_failed_at = NULL WHERE email = $1", [email])
  } catch (error) {
    console.error("Error resetting failed logins:", error)
  }
}

export async function hasPermission(userId: number, permission: string): Promise<boolean> {
  try {
    const result = await query(
      `SELECT 1 FROM user_permissions up
       JOIN permissions p ON up.permission_id = p.id
       WHERE up.user_id = $1 AND p.name = $2`,
      [userId, permission],
    )
    return result.rows.length > 0
  } catch (error) {
    console.error("Error checking permission:", error)
    return false
  }
}

function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}
