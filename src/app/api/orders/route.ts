import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET - Récupérer les commandes de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Pour simplifier, on retourne des commandes factices
    // En production, on récupérerait depuis la base de données
    const mockOrders = [
      {
        id: 1,
        orderNumber: 'CMD-2024-001',
        status: 'delivered',
        paymentStatus: 'paid',
        total: 405.00,
        createdAt: '2024-01-15T10:30:00Z',
        items: [
          {
            id: 1,
            productName: 'Nike Air Force 1 \'Camo\'',
            size: 'EU 44',
            color: 'Noir',
            quantity: 1,
            unitPrice: 405.00
          }
        ]
      },
      {
        id: 2,
        orderNumber: 'CMD-2024-002',
        status: 'shipped',
        paymentStatus: 'paid',
        total: 299.00,
        createdAt: '2024-01-20T15:45:00Z',
        items: [
          {
            id: 2,
            productName: 'Nike KD 7 \'Away\'',
            size: 'EU 43',
            color: 'Blanc',
            quantity: 1,
            unitPrice: 299.00
          }
        ]
      }
    ]

    return NextResponse.json(mockOrders)
    
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// POST - Créer une nouvelle commande
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { items, shippingAddress, paymentMethod } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Panier vide' },
        { status: 400 }
      )
    }

    if (!shippingAddress) {
      return NextResponse.json(
        { error: 'Adresse de livraison requise' },
        { status: 400 }
      )
    }

    // Pour simplifier, on accepte toutes les commandes
    // En production, on créerait la commande en base de données

    const orderNumber = `CMD-2024-${Date.now()}`
    const total = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)

    const newOrder = {
      id: Date.now(),
      orderNumber,
      status: 'pending',
      paymentStatus: 'pending',
      total,
      createdAt: new Date().toISOString(),
      items,
      shippingAddress
    }

    return NextResponse.json({
      success: true,
      order: newOrder,
      message: 'Commande créée avec succès'
    })
    
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}