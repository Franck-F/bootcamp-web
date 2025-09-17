import bcrypt from "bcryptjs"
import { hasPermission as mockHasPermission } from "./mock-auth"
import {
  hasPermission as permissionsHasPermission,
  hasAnyPermission as permissionsHasAnyPermission,
} from "./permissions"
import { logSecurityEvent as securityLogEvent } from "./security-utils"

export interface User {
  id: number
  email: string
  first_name?: string
  last_name?: string
  role: "customer" | "seller" | "admin"
  is_active: boolean
  email_verified: boolean
}

export interface Session {
  id: number
  user_id: number
  token_hash: string
  expires_at: Date
}

// Hash password with bcrypt
export async function hashPassword(password: string): Promise<string> {
  const rounds = Number.parseInt(process.env.BCRYPT_ROUNDS || "12")
  return bcrypt.hash(password, rounds)
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Generate secure token using Web Crypto API or fallback
export function generateSecureToken(): string {
  if (typeof window !== "undefined" && window.crypto) {
    // Browser environment - use Web Crypto API
    const array = new Uint8Array(32)
    window.crypto.getRandomValues(array)
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
  } else {
    // Fallback for server environment
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }
}

function createHash(data: string): string {
  if (typeof window !== "undefined") {
    // Browser environment - simple hash fallback
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16)
  } else {
    // Fallback hash
    return data
      .split("")
      .reduce((a, b) => {
        a = (a << 5) - a + b.charCodeAt(0)
        return a & a
      }, 0)
      .toString(16)
  }
}

// Create simple auth token
export function createJWT(payload: any, type: "access" | "refresh" = "access"): string {
  const header = { typ: "JWT", alg: "HS256" }
  const now = Math.floor(Date.now() / 1000)

  // Shorter expiration for access tokens (15 minutes), longer for refresh (7 days)
  const expiration = type === "access" ? now + 15 * 60 : now + 7 * 24 * 60 * 60

  const tokenPayload = {
    ...payload,
    iat: now,
    exp: expiration,
    iss: "sneaker-store",
    aud: "sneaker-store-users",
    type, // Add token type
  }

  const encodedHeader = btoa(JSON.stringify(header))
  const encodedPayload = btoa(JSON.stringify(tokenPayload))
  const signature = createHash(encodedHeader + "." + encodedPayload + (process.env.JWT_SECRET || "fallback-secret"))

  return `${encodedHeader}.${encodedPayload}.${signature}`
}

// Verify simple auth token
export function verifyJWT(token: string, expectedType: "access" | "refresh" = "access"): any {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null

    const [encodedHeader, encodedPayload, signature] = parts
    const expectedSignature = createHash(
      encodedHeader + "." + encodedPayload + (process.env.JWT_SECRET || "fallback-secret"),
    )

    if (signature !== expectedSignature) return null

    const payload = JSON.parse(atob(encodedPayload))

    // Check token type
    if (payload.type !== expectedType) return null

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }

    // Check issuer and audience
    if (payload.iss !== "sneaker-store" || payload.aud !== "sneaker-store-users") {
      return null
    }

    return payload
  } catch (error) {
    return null
  }
}

export function createTokenPair(payload: any): { accessToken: string; refreshToken: string } {
  const accessToken = createJWT(payload, "access")
  const refreshToken = createJWT({ userId: payload.userId }, "refresh")

  return { accessToken, refreshToken }
}

export async function hasPermission(userIdOrRole: number | string, permission: string): Promise<boolean> {
  if (typeof userIdOrRole === "number") {
    // Use mock auth for user ID based permission check
    return mockHasPermission(userIdOrRole, permission)
  } else {
    // Use permissions system for role-based permission check
    return permissionsHasPermission(userIdOrRole, permission)
  }
}

export function hasAnyPermission(userRole: string, requiredPermissions: string[]): boolean {
  return permissionsHasAnyPermission(userRole, requiredPermissions)
}

export async function logSecurityEvent(
  userId: number | null,
  action: string,
  details: any,
  ipAddress?: string,
  userAgent?: string,
): Promise<void> {
  return securityLogEvent(userId, action, details, ipAddress, userAgent)
}
