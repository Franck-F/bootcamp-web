import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/edge-auth'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Erreur de vérification de user:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
