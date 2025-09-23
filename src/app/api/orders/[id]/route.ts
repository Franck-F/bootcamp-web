import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

// GET - Récupérer une commande spécifique
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

    const orderId = parseInt(params.id)
    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: 'ID de commande invalide' },
        { status: 400 }
      )
    }

    // Récupérer la commande depuis la base de données
    const order = await prisma.orders.findFirst({
      where: {
        id: orderId,
        user_id: parseInt(session.user.id) // S'assurer que l'utilisateur ne peut voir que ses commandes
      },
      include: {
        order_items: {
          include: {
            variants: {
              include: {
                products: {
                  include: {
                    brands: true,
                    product_images: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      )
    }

    // Transformer les données pour correspondre au format attendu
    const formattedOrder = {
      id: order.id,
      orderNumber: order.order_number,
      status: order.status,
      paymentStatus: order.payment_status,
      total: parseFloat(order.total_amount.toString()),
      subtotal: parseFloat(order.total_amount.toString()), // Utiliser total_amount comme subtotal
      tax: 0, // Pas de champ tax dans le schéma
      shipping: 0, // Pas de champ shipping dans le schéma
      createdAt: order.created_at.toISOString(),
      shippingAddress: order.shipping_address,
      items: order.order_items.map(item => ({
        id: item.id,
        productName: item.variants.products.name,
        brand: item.variants.products.brands?.name,
        size: item.variants.size,
        color: item.variants.color,
        quantity: item.quantity,
        unitPrice: parseFloat(item.unit_price.toString()),
        image: item.variants.products.product_images?.[0]?.image_url
      }))
    }

    return NextResponse.json(formattedOrder)
    
  } catch (error) {
    console.error('Erreur lors de la récupération de la commande:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour le statut d'une commande (pour les admins)
export async function PUT(
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

    // Vérifier si l'utilisateur est admin
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const orderId = parseInt(params.id)
    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: 'ID de commande invalide' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { status, paymentStatus } = body

    // Mettre à jour la commande
    const updatedOrder = await prisma.orders.update({
      where: { id: orderId },
      data: {
        ...(status && { status }),
        ...(paymentStatus && { payment_status: paymentStatus }),
        updated_at: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      order: {
        id: updatedOrder.id,
        orderNumber: updatedOrder.order_number,
        status: updatedOrder.status,
        paymentStatus: updatedOrder.payment_status
      },
      message: 'Commande mise à jour avec succès'
    })
    
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la commande:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}