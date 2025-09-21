import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET - Récupérer une commande par ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const orderId = params.id

    // Pour simplifier, on retourne une commande factice
    // En production, on récupérerait depuis la base de données
    const mockOrder = {
      id: orderId,
      orderNumber: `CMD-2024-${orderId}`,
      status: 'delivered',
      paymentStatus: 'paid',
      total: 405.00,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-18T14:20:00Z',
      user: {
        name: session.user.name,
        email: session.user.email
      },
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
    }

    return NextResponse.json(mockOrder)
    
  } catch (error) {
    console.error('Erreur lors de la récupération de la commande:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour le statut d'une commande
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    const orderId = params.id
    const body = await request.json()
    const { status, paymentStatus } = body

    // Pour simplifier, on accepte toutes les mises à jour
    // En production, on mettrait à jour en base de données

    return NextResponse.json({
      success: true,
      message: 'Commande mise à jour'
    })
    
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la commande:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// DELETE - Annuler une commande
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    const orderId = params.id

    // Pour simplifier, on accepte toutes les annulations
    // En production, on mettrait à jour le statut en base

    return NextResponse.json({
      success: true,
      message: 'Commande annulée'
    })
    
  } catch (error) {
    console.error('Erreur lors de l\'annulation de la commande:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}