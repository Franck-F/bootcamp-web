import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    // Vérifier la session utilisateur
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const { currentPassword, newPassword } = await request.json()

    // Validation des données
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Le mot de passe actuel et le nouveau mot de passe sont requis' },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Le nouveau mot de passe doit contenir au moins 8 caractères' },
        { status: 400 }
      )
    }

    // Récupérer l'utilisateur depuis la base de données
    const user = await prisma.users.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier le mot de passe actuel
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash)
    
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: 'Le mot de passe actuel est incorrect' },
        { status: 400 }
      )
    }

    // Vérifier que le nouveau mot de passe est différent de l'actuel
    const isSamePassword = await bcrypt.compare(newPassword, user.password_hash)
    
    if (isSamePassword) {
      return NextResponse.json(
        { error: 'Le nouveau mot de passe doit être différent de l\'actuel' },
        { status: 400 }
      )
    }

    // Hasher le nouveau mot de passe
    const saltRounds = 12
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds)

    // Mettre à jour le mot de passe dans la base de données
    await prisma.users.update({
      where: { id: user.id },
      data: {
        password_hash: hashedNewPassword,
        updated_at: new Date()
      }
    })

    return NextResponse.json(
      { message: 'Mot de passe modifié avec succès' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
