import { NextRequest } from 'next/server'
import { SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret')

export interface User {
  id: string
  email: string
  name?: string
  role: 'admin' | 'moderator' | 'customer'
}

export async function createToken(user: User): Promise<string> {
  return await new SignJWT({ user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
}

export async function verifyToken(token: string): Promise<User | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload.user as User
  } catch {
    return null
  }
}

export async function getUserFromRequest(request: NextRequest): Promise<User | null> {
  const token = request.cookies.get('auth-token')?.value
  if (!token) return null
  return await verifyToken(token)
}

export function createAuthResponse(user: User, redirectUrl?: string) {
  const response = new Response(JSON.stringify({ user, redirectUrl }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Le token sera défini côté client
  return response
}

export function createLogoutResponse() {
  const response = new Response(JSON.stringify({ message: 'Logged out' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Le cookie sera supprimé côté client
  return response
}
