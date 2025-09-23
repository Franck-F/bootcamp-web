import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST() {
  const response = NextResponse.json({ message: 'Déconnexion réussie' })
  
  // Supprimer le cookie
  response.cookies.set('auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0
  })

  return response
}
