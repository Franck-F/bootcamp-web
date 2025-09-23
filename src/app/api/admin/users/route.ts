import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// GET - Récupérer tous les utilisateurs
export async function GET(request: NextRequest) {
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
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || ''
    const status = searchParams.get('status') || ''

    const skip = (page - 1) * limit

    // Construire les filtres
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (role) {
      where.role = role
    }
    
    if (status === 'active') {
      where.is_active = true
    } else if (status === 'inactive') {
      where.is_active = false
    }

    // Récupérer les utilisateurs avec pagination
    const [users, total] = await Promise.all([
      prisma.users.findMany({
        where,
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
          _count: {
            select: {
              orders: true,
              wishlist_items: true
            }
          }
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit
      }),
      prisma.users.count({ where })
    ])

    // Statistiques
    const stats = await prisma.users.groupBy({
      by: ['role'],
      _count: { id: true }
    })

    const activeUsers = await prisma.users.count({
      where: { is_active: true }
    })

    const verifiedUsers = await prisma.users.count({
      where: { email_verified: true }
    })

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: {
        total,
        active: activeUsers,
        inactive: total - activeUsers,
        verified: verifiedUsers,
        unverified: total - verifiedUsers,
        byRole: stats.reduce((acc, stat) => {
          acc[stat.role] = stat._count.id
          return acc
        }, {} as Record<string, number>)
      }
    })

  } catch (error: any) {
    console.error('Erreur lors de la récupération des utilisateurs:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des utilisateurs' },
      { status: 500 }
    )
  }
}

// POST - Créer un nouvel utilisateur
export async function POST(request: NextRequest) {
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
    const data = await request.json()
    
    // Validation des données requises
    if (!data.email || !data.password || !data.name) {
      return NextResponse.json(
        { error: 'Email, mot de passe et nom sont requis' },
        { status: 400 }
      )
    }

    // Vérifier que l'email n'existe pas déjà
    const existingUser = await prisma.users.findUnique({
      where: { email: data.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un utilisateur avec cet email existe déjà' },
        { status: 400 }
      )
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(data.password, 12)

    // Créer l'utilisateur
    const newUser = await prisma.users.create({
      data: {
        email: data.email,
        password_hash: hashedPassword,
        name: data.name,
        role: data.role || 'customer',
        is_active: data.is_active !== false,
        email_verified: data.email_verified || false,
        phone: data.phone || null,
        address: data.address || null,
        city: data.city || null,
        postal_code: data.postal_code || null,
        country: data.country || null,
        created_at: new Date(),
        updated_at: new Date()
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        is_active: true,
        email_verified: true,
        created_at: true
      }
    })

    return NextResponse.json({
      message: 'Utilisateur créé avec succès',
      user: newUser
    })

  } catch (error: any) {
    console.error('Erreur lors de la création de l\'utilisateur:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'utilisateur' },
      { status: 500 }
    )
  }
}
