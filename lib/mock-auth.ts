export interface User {
  id: number
  email: string
  first_name?: string
  last_name?: string
  role: "customer" | "seller" | "admin"
  is_active: boolean
  email_verified: boolean
}

// Mock users for development
const mockUsers: User[] = [
  {
    id: 1,
    email: "admin@sneakerstore.com",
    first_name: "Admin",
    last_name: "User",
    role: "admin",
    is_active: true,
    email_verified: true,
  },
  {
    id: 2,
    email: "seller@sneakerstore.com",
    first_name: "Seller",
    last_name: "User",
    role: "seller",
    is_active: true,
    email_verified: true,
  },
  {
    id: 3,
    email: "customer@sneakerstore.com",
    first_name: "Customer",
    last_name: "User",
    role: "customer",
    is_active: true,
    email_verified: true,
  },
]

// Mock sessions storage
const mockSessions = new Map<string, { userId: number; expiresAt: Date }>()

// Generate secure token
export function generateSecureToken(): string {
  if (typeof window !== "undefined" && window.crypto) {
    const array = new Uint8Array(32)
    window.crypto.getRandomValues(array)
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
  }
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Simple hash function
function simpleHash(data: string): string {
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16)
}

// Mock password verification
export async function verifyPassword(password: string, email: string): Promise<boolean> {
  // Simple mock - in real app this would check hashed passwords
  const validPasswords: Record<string, string> = {
    "admin@sneakerstore.com": "admin123",
    "seller@sneakerstore.com": "seller123",
    "customer@sneakerstore.com": "customer123",
  }
  return validPasswords[email] === password
}

// Create session
export async function createSession(userId: number): Promise<string> {
  const token = generateSecureToken()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  mockSessions.set(token, { userId, expiresAt })
  return token
}

// Validate session
export async function validateSession(token: string): Promise<User | null> {
  const session = mockSessions.get(token)
  if (!session || session.expiresAt < new Date()) {
    if (session) mockSessions.delete(token)
    return null
  }

  return mockUsers.find((user) => user.id === session.userId) || null
}

// Revoke session
export async function revokeSession(token: string): Promise<void> {
  mockSessions.delete(token)
}

// Find user by email
export async function findUserByEmail(email: string): Promise<User | null> {
  return mockUsers.find((user) => user.email === email) || null
}

// Create user (mock)
export async function createUser(userData: {
  email: string
  first_name: string
  last_name: string
  password: string
}): Promise<User> {
  const newUser: User = {
    id: mockUsers.length + 1,
    email: userData.email,
    first_name: userData.first_name,
    last_name: userData.last_name,
    role: "customer",
    is_active: true,
    email_verified: false,
  }

  mockUsers.push(newUser)
  return newUser
}

// Check permissions
export async function hasPermission(userId: number, permission: string): Promise<boolean> {
  const user = mockUsers.find((u) => u.id === userId)
  if (!user) return false

  // Simple permission system
  const permissions: Record<string, string[]> = {
    admin: ["read", "write", "delete", "manage_users", "manage_products", "manage_orders"],
    seller: ["read", "write", "manage_products", "manage_orders"],
    customer: ["read"],
  }

  return permissions[user.role]?.includes(permission) || false
}

export async function hasAnyPermission(userId: number, requiredPermissions: string[]): Promise<boolean> {
  const user = mockUsers.find((u) => u.id === userId)
  if (!user) return false

  // Simple permission system
  const permissions: Record<string, string[]> = {
    admin: ["read", "write", "delete", "manage_users", "manage_products", "manage_orders"],
    seller: ["read", "write", "manage_products", "manage_orders"],
    customer: ["read"],
  }

  const userPermissions = permissions[user.role] || []
  return requiredPermissions.some((permission) => userPermissions.includes(permission))
}

// Rate limiting mock
const loginAttempts = new Map<string, { count: number; lastAttempt: Date }>()

export async function checkLoginAttempts(email: string): Promise<boolean> {
  const attempts = loginAttempts.get(email)
  if (!attempts) return true

  // Reset if more than 30 minutes passed
  if (Date.now() - attempts.lastAttempt.getTime() > 30 * 60 * 1000) {
    loginAttempts.delete(email)
    return true
  }

  return attempts.count < 5
}

export async function recordFailedLogin(email: string): Promise<void> {
  const attempts = loginAttempts.get(email) || { count: 0, lastAttempt: new Date() }
  attempts.count++
  attempts.lastAttempt = new Date()
  loginAttempts.set(email, attempts)
}

export async function resetFailedLogins(email: string): Promise<void> {
  loginAttempts.delete(email)
}
