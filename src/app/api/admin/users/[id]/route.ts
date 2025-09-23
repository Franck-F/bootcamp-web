import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// GET - Récupérer un utilisateur spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  // Vérifier que l'utilisateur est admin
  const user = await prisma.users.findUnique({
    where: { email: session.user.email },
    select: { role: true }
  })

  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  try {
    const userId = parseInt(params.id)

    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        is_active: true,
        email_verified: true,
        created_at: true,
        phone: true,
        address: true,
        city: true,
        postal_code: true,
        country: true,
        orders: {
          select: {
            id: true,
            order_number: true,
            status: true,
            total_amount: true,
            created_at: true
          },
          orderBy: { created_at: 'desc' },
          take: 10
        },
        wishlist_items: {
          select: {
            id: true,
            created_at: true,
            products: {
              select: {
                id: true,
                name: true,
                price: true,
                brands: {
                  select: { name: true }
                }
              }
            }
          },
          orderBy: { created_at: 'desc' },
          take: 10
        },
        _count: {
          select: {
            orders: true,
            wishlist_items: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    return NextResponse.json({ user })

  } catch (error: any) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'utilisateur' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour un utilisateur
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  // Vérifier que l'utilisateur est admin
  const user = await prisma.users.findUnique({
    where: { email: session.user.email },
    select: { role: true }
  })

  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  try {
    const userId = parseInt(params.id)
    const data = await request.json()

    // Vérifier que l'utilisateur existe
    const existingUser = await prisma.users.findUnique({
      where: { id: userId }
    })

    if (!existingUser) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    // Préparer les données de mise à jour
    const updateData: any = {}

    if (data.name !== undefined) updateData.name = data.name
    if (data.email !== undefined) {
      // Vérifier que l'email n'est pas déjà utilisé par un autre utilisateur
      const emailExists = await prisma.users.findFirst({
        where: { 
          email: data.email,
          id: { not: userId }
        }
      })
      
      if (emailExists) {
        return NextResponse.json(
          { error: 'Cet email est déjà utilisé par un autre utilisateur' },
          { status: 400 }
        )
      }
      
      updateData.email = data.email
    }
    if (data.role !== undefined) updateData.role = data.role
    if (data.is_active !== undefined) updateData.is_active = data.is_active
    if (data.email_verified !== undefined) updateData.email_verified = data.email_verified
    if (data.phone !== undefined) updateData.phone = data.phone
    if (data.address !== undefined) updateData.address = data.address
    if (data.city !== undefined) updateData.city = data.city
    if (data.postal_code !== undefined) updateData.postal_code = data.postal_code
    if (data.country !== undefined) updateData.country = data.country

    // Mettre à jour le mot de passe si fourni
    if (data.password) {
      updateData.password_hash = await bcrypt.hash(data.password, 12)
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        is_active: true,
        email_verified: true,
        phone: true,
        address: true,
        city: true,
        postal_code: true,
        country: true
      }
    })

    return NextResponse.json({
      message: 'Utilisateur mis à jour avec succès',
      user: updatedUser
    })

  } catch (error: any) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'utilisateur' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un utilisateur
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const userId = parseInt(params.id)

    // Empêcher l'auto-suppression
    if (user.id === userId) {
      return NextResponse.json(
        { error: 'Vous ne pouvez pas supprimer votre propre compte' },
        { status: 400 }
      )
    }

    // Vérifier que l'utilisateur existe
    const existingUser = await prisma.users.findUnique({
      where: { id: userId }
    })

    if (!existingUser) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    // Supprimer l'utilisateur (cascade supprimera les relations)
    await prisma.users.delete({
      where: { id: userId }
    })

    return NextResponse.json({
      message: 'Utilisateur supprimé avec succès'
    })

  } catch (error: any) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'utilisateur' },
      { status: 500 }
    )
  }
}
