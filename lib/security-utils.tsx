import { query } from "./database"

// CSRF Token management
export function generateCSRFToken(): string {
  if (typeof window !== "undefined" && window.crypto) {
    // Browser environment - use Web Crypto API
    const array = new Uint8Array(32)
    window.crypto.getRandomValues(array)
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
  } else {
    // Server environment - use Node.js crypto
    const crypto = require("crypto")
    return crypto.randomBytes(32).toString("hex")
  }
}

function createHash(data: string): string {
  if (typeof window !== "undefined") {
    // Browser environment - simple hash
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return Math.abs(hash).toString(16)
  } else {
    // Server environment
    const crypto = require("crypto")
    return crypto.createHash("sha256").update(data).digest("hex")
  }
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false

  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}

export function verifyCSRFToken(token: string, sessionToken: string): boolean {
  const expectedToken = createHash(sessionToken + (process.env.JWT_SECRET || "fallback-secret"))
  return timingSafeEqual(token, expectedToken)
}

// SQL Injection prevention helpers
export function escapeSQL(value: string): string {
  return value.replace(/'/g, "''").replace(/;/g, "\\;")
}

// XSS Prevention
export function escapeHTML(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

// Audit logging
export async function logSecurityEvent(
  userId: number | null,
  action: string,
  details: any,
  ipAddress?: string,
  userAgent?: string,
) {
  try {
    await query(
      `INSERT INTO audit_logs (user_id, action, table_name, record_id, new_values, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [userId, action, "security", null, JSON.stringify(details), ipAddress, userAgent],
    )
  } catch (error) {
    console.error("Failed to log security event:", error)
  }
}

// Session security
export function generateSecureSessionId(): string {
  if (typeof window !== "undefined" && window.crypto) {
    const array = new Uint8Array(32)
    window.crypto.getRandomValues(array)
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
  } else {
    const crypto = require("crypto")
    return crypto.randomBytes(32).toString("hex")
  }
}

// Password policy enforcement
export const PASSWORD_POLICY = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: false,
  maxRepeatingChars: 3,
  preventCommonPasswords: true,
}

export function enforcePasswordPolicy(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (password.length < PASSWORD_POLICY.minLength) {
    errors.push(`Password must be at least ${PASSWORD_POLICY.minLength} characters long`)
  }

  if (password.length > PASSWORD_POLICY.maxLength) {
    errors.push(`Password must be no more than ${PASSWORD_POLICY.maxLength} characters long`)
  }

  if (PASSWORD_POLICY.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter")
  }

  if (PASSWORD_POLICY.requireLowercase && !/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter")
  }

  if (PASSWORD_POLICY.requireNumbers && !/\d/.test(password)) {
    errors.push("Password must contain at least one number")
  }

  if (PASSWORD_POLICY.requireSpecialChars && !/[^a-zA-Z\d]/.test(password)) {
    errors.push("Password must contain at least one special character")
  }

  // Check for repeating characters
  const repeatingPattern = new RegExp(`(.)\\1{${PASSWORD_POLICY.maxRepeatingChars},}`)
  if (repeatingPattern.test(password)) {
    errors.push(`Password cannot have more than ${PASSWORD_POLICY.maxRepeatingChars} repeating characters`)
  }

  // Check against common passwords (simplified list)
  const commonPasswords = [
    "password",
    "123456",
    "password123",
    "admin",
    "qwerty",
    "letmein",
    "welcome",
    "monkey",
    "dragon",
  ]
  if (PASSWORD_POLICY.preventCommonPasswords && commonPasswords.includes(password.toLowerCase())) {
    errors.push("Password is too common, please choose a more secure password")
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

// IP-based security
export function isValidIP(ip: string): boolean {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
  return ipv4Regex.test(ip) || ipv6Regex.test(ip)
}

// Content Security Policy nonce generation
export function generateCSPNonce(): string {
  if (typeof window !== "undefined" && window.crypto) {
    const array = new Uint8Array(16)
    window.crypto.getRandomValues(array)
    return btoa(String.fromCharCode(...array))
  } else {
    const crypto = require("crypto")
    return crypto.randomBytes(16).toString("base64")
  }
}

// Secure cookie options
export const SECURE_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/",
}
