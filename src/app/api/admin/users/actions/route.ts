import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  // Vérifier que l'utilisateur est admin
  const user = await prisma.users.findUnique({
    where: { email: session.user.email },
    select: { role: true, id: true }
  })

  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  try {
    const data = await request.json()
    const { action, userIds } = data

    if (!action || !userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: 'Action et liste d\'utilisateurs requis' },
        { status: 400 }
      )
    }

    // Empêcher les actions sur son propre compte
    const filteredUserIds = userIds.filter((id: number) => id !== user.id)

    if (filteredUserIds.length === 0) {
      return NextResponse.json(
        { error: 'Aucun utilisateur valide sélectionné' },
        { status: 400 }
      )
    }

    const results = []

    switch (action) {
      case 'activate':
        for (const userId of filteredUserIds) {
          try {
            await prisma.users.update({
              where: { id: userId },
              data: { is_active: true }
            })
            results.push({ userId, success: true, action: 'activated' })
          } catch (error) {
            results.push({ userId, success: false, error: 'Erreur lors de l\'activation' })
          }
        }
        break

      case 'deactivate':
        for (const userId of filteredUserIds) {
          try {
            await prisma.users.update({
              where: { id: userId },
              data: { is_active: false }
            })
            results.push({ userId, success: true, action: 'deactivated' })
          } catch (error) {
            results.push({ userId, success: false, error: 'Erreur lors de la désactivation' })
          }
        }
        break

      case 'verify':
        for (const userId of filteredUserIds) {
          try {
            await prisma.users.update({
              where: { id: userId },
              data: { email_verified: true }
            })
            results.push({ userId, success: true, action: 'verified' })
          } catch (error) {
            results.push({ userId, success: false, error: 'Erreur lors de la vérification' })
          }
        }
        break

      case 'unverify':
        for (const userId of filteredUserIds) {
          try {
            await prisma.users.update({
              where: { id: userId },
              data: { email_verified: false }
            })
            results.push({ userId, success: true, action: 'unverified' })
          } catch (error) {
            results.push({ userId, success: false, error: 'Erreur lors de la dévérification' })
          }
        }
        break

      case 'changeRole':
        const { newRole } = data
        if (!newRole) {
          return NextResponse.json(
            { error: 'Nouveau rôle requis' },
            { status: 400 }
          )
        }

        for (const userId of filteredUserIds) {
          try {
            await prisma.users.update({
              where: { id: userId },
              data: { role: newRole }
            })
            results.push({ userId, success: true, action: 'role_changed', newRole })
          } catch (error) {
            results.push({ userId, success: false, error: 'Erreur lors du changement de rôle' })
          }
        }
        break

      case 'delete':
        for (const userId of filteredUserIds) {
          try {
            await prisma.users.delete({
              where: { id: userId }
            })
            results.push({ userId, success: true, action: 'deleted' })
          } catch (error) {
            results.push({ userId, success: false, error: 'Erreur lors de la suppression' })
          }
        }
        break

      default:
        return NextResponse.json(
          { error: 'Action non reconnue' },
          { status: 400 }
        )
    }

    const successCount = results.filter(r => r.success).length
    const errorCount = results.filter(r => !r.success).length

    return NextResponse.json({
      message: `Action ${action} terminée`,
      results: {
        total: filteredUserIds.length,
        success: successCount,
        errors: errorCount,
        details: results
      }
    })

  } catch (error: any) {
    console.error('Erreur lors de l\'action en masse:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'action en masse' },
      { status: 500 }
    )
  }
}
