import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

    // Récupérer les commandes depuis la base de données
    const orders = await prisma.orders.findMany({
      where: {
        user_id: parseInt(session.user.id)
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
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    // Transformer les données pour correspondre au format attendu
    const formattedOrders = orders.map(order => ({
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
    }))

    return NextResponse.json(formattedOrders)
    
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
    const { cartItems, address, paymentMethod, subtotal, tax, shipping, total, transactionId } = body

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Panier vide' },
        { status: 400 }
      )
    }

    if (!address) {
      return NextResponse.json(
        { error: 'Adresse de livraison requise' },
        { status: 400 }
      )
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { error: 'Méthode de paiement requise' },
        { status: 400 }
      )
    }

    // Générer un numéro de commande unique
    const orderNumber = `CMD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
    
    // Créer la commande en base de données
    const order = await prisma.orders.create({
      data: {
        user_id: parseInt(session.user.id),
        order_number: orderNumber,
        status: 'pending',
        payment_status: 'pending',
        total_amount: total,
        shipping_address: JSON.stringify(address),
        payment_method: paymentMethod.method,
        payment_intent_id: transactionId,
        created_at: new Date(),
        updated_at: new Date()
      }
    })

    // Créer les articles de la commande
    for (const item of cartItems) {
      // Trouver la variante correspondante
      const variant = await prisma.variants.findFirst({
        where: {
          product_id: parseInt(item.productId),
          size: item.size
        }
      })

      if (variant) {
        await prisma.order_items.create({
          data: {
            order_id: order.id,
            product_variant_id: variant.id,
            quantity: item.quantity,
            unit_price: item.product?.price || 0,
            created_at: new Date()
          }
        })

        // Mettre à jour le stock
        await prisma.variants.update({
          where: {
            id: variant.id
          },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        })
      }
    }

    // Vider le panier de l'utilisateur
    await prisma.shopping_carts.deleteMany({
      where: {
        user_id: parseInt(session.user.id)
      }
    })

    // Simuler l'envoi d'email de confirmation
    await simulateOrderConfirmationEmail(session.user.email!, orderNumber, total)

    // Retourner la commande créée
    const createdOrder = await prisma.orders.findUnique({
      where: { id: order.id },
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

    return NextResponse.json({
      success: true,
      order: {
        id: createdOrder!.id,
        orderNumber: createdOrder!.order_number,
        status: createdOrder!.status,
        paymentStatus: createdOrder!.payment_status,
        total: parseFloat(createdOrder!.total_amount.toString()),
        createdAt: createdOrder!.created_at.toISOString(),
        items: createdOrder!.order_items.map(item => ({
          id: item.id,
          productName: item.variants.products.name,
          brand: item.variants.products.brands?.name,
          size: item.variants.size,
          quantity: item.quantity,
          unitPrice: parseFloat(item.unit_price.toString()),
          image: item.variants.products.product_images?.[0]?.image_url
        }))
      },
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

// Fonction pour simuler l'envoi d'email de confirmation
async function simulateOrderConfirmationEmail(email: string, orderNumber: string, total: number) {
  try {
    console.log(`📧 Email de confirmation envoyé à ${email}`)
    console.log(`📦 Commande: ${orderNumber}`)
    console.log(`💰 Total: ${total}€`)
    console.log(`📅 Date: ${new Date().toLocaleString('fr-FR')}`)
    
    // En production, on utiliserait un service d'email comme SendGrid, Mailgun, etc.
    // await emailService.sendOrderConfirmation(email, orderNumber, total)
    
    return true
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error)
    return false
  }
}