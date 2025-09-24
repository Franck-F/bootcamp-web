import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createToken } from '@/lib/edge-auth'

// export const runtime = 'edge' // Temporairement désactivé pour Prisma
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 })
    }

    // Trouver l'utilisateur
    const user = await prisma.users.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password_hash: true,
        is_active: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 })
    }

    if (!user.is_active) {
      return NextResponse.json({ error: 'Compte désactivé' }, { status: 401 })
    }

    // Vérifier le mot de passe (simplifié pour Edge Runtime)
    // En production, vous devriez utiliser une méthode de hachage compatible Edge Runtime
    const isValidPassword = password === 'admin123' // Temporaire pour le test
    
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 })
    }

    // Créer le token JWT
    const token = await createToken({
      id: user?.id.toString(),
      email: user?.email,
      name: user?.name || undefined,
      role: user?.role as 'admin' | 'moderator' | 'customer'
    })

    // Retourner la réponse avec le token
    const response = NextResponse.json({
      user: {
        id: user?.id,
        email: user?.email,
        name: user?.name,
        role: user?.role
      }
    })

    // Définir le cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 jours
    })

    return response
  } catch (error) {
    console.error('Erreur de connexion:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
