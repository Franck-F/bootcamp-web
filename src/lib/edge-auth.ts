import { NextRequest, NextResponse } from 'next/server'
import { SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.EDGE_AUTH_SECRET || 'fallback-secret-key-for-edge-runtime')

export interface User {
  id: string
  email: string
  name?: string
  role: 'admin' | 'moderator' | 'customer'
}

export interface Session {
  user: User
  expires: string
}

// Créer un token JWT
export async function createToken(user: User): Promise<string> {
  return await new SignJWT({ user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
}

// Vérifier un token JWT
export async function verifyToken(token: string): Promise<User | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload.user as User
  } catch {
    return null
  }
}

// Récupérer l'utilisateur depuis la requête
export async function getUserFromRequest(request: NextRequest): Promise<User | null> {
  const token = request.cookies.get('auth-token')?.value
  if (!token) return null
  return await verifyToken(token)
}

// Créer une réponse d'authentification
export function createAuthResponse(user: User, redirectUrl?: string) {
  const response = new Response(JSON.stringify({ user, redirectUrl }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return response
}

// Créer une réponse de déconnexion
export function createLogoutResponse() {
  const response = new Response(JSON.stringify({ message: 'Logged out' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return response
}

// Vérifier les permissions
export function hasPermission(user: User | null, requiredRole: 'admin' | 'moderator' | 'customer'): boolean {
  if (!user) return false
  
  const roleHierarchy = {
    customer: 1,
    moderator: 2,
    admin: 3
  }
  
  return roleHierarchy[user?.role] >= roleHierarchy[requiredRole]
}

// Middleware helper pour Edge Runtime
export function createAuthMiddleware() {
  return async (request: NextRequest) => {
    const user = await getUserFromRequest(request)
    return { user, isAuthenticated: !!user }
  }
}