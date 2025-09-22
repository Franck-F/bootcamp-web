import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Récupérer le panier de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }
    
    // Récupérer le panier depuis la base de données
    const cartItems = await prisma.cart_items.findMany({
      where: {
        user_id: parseInt(session.user.id)
      },
      include: {
        products: {
          include: {
            brands: true,
            categories: true,
            product_images: true,
            variants: true
          }
        }
      }
    })
    
    // Transformer les données pour correspondre au format attendu
    const formattedCartItems = cartItems.map(item => ({
      productId: item.product_id.toString(),
      size: item.size,
      quantity: item.quantity,
      addedAt: item.created_at.toISOString(),
      product: {
        id: item.products.id.toString(),
        name: item.products.name,
        brand: item.products.brands?.name || 'Marque inconnue',
        price: item.products.price,
        images: item.products.product_images?.map(img => img.image_url) || [],
        availableStock: item.products.variants?.reduce((total, variant) => total + variant.stock, 0) || 0,
        category: item.products.categories?.name
      }
    }))
    
    return NextResponse.json(formattedCartItems)
    
  } catch (error) {
    console.error('Erreur lors de la récupération du panier:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// POST - Ajouter un article au panier ou sauvegarder le panier complet
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
    
    // Si c'est un tableau, c'est le panier complet à sauvegarder
    if (Array.isArray(body)) {
      // Supprimer l'ancien panier
      await prisma.cart_items.deleteMany({
        where: {
          user_id: parseInt(session.user.id)
        }
      })
      
      // Ajouter les nouveaux articles
      for (const item of body) {
        await prisma.cart_items.create({
          data: {
            user_id: parseInt(session.user.id),
            product_id: parseInt(item.productId),
            size: item.size,
            quantity: item.quantity,
            created_at: new Date(item.addedAt)
          }
        })
      }
      
      return NextResponse.json({
        success: true,
        message: 'Panier sauvegardé'
      })
    }
    
    // Sinon, c'est un article individuel à ajouter
    const { productId, size, quantity = 1 } = body
    
    if (!productId || !size) {
      return NextResponse.json(
        { error: 'Données invalides' },
        { status: 400 }
      )
    }
    
    // Vérifier si l'article existe déjà dans le panier
    const existingItem = await prisma.cart_items.findFirst({
      where: {
        user_id: parseInt(session.user.id),
        product_id: parseInt(productId),
        size: size
      }
    })
    
    if (existingItem) {
      // Mettre à jour la quantité
      await prisma.cart_items.update({
        where: {
          id: existingItem.id
        },
        data: {
          quantity: existingItem.quantity + quantity
        }
      })
    } else {
      // Créer un nouvel article
      await prisma.cart_items.create({
        data: {
          user_id: parseInt(session.user.id),
          product_id: parseInt(productId),
          size: size,
          quantity: quantity
        }
      })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Article ajouté au panier'
    })
    
  } catch (error) {
    console.error('Erreur lors de l\'ajout au panier:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour la quantité d'un article
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const { productId, size, quantity } = body
    
    if (!productId || !size || quantity === undefined) {
      return NextResponse.json(
        { error: 'Données invalides' },
        { status: 400 }
      )
    }
    
    // Trouver l'article dans le panier
    const cartItem = await prisma.cart_items.findFirst({
      where: {
        user_id: parseInt(session.user.id),
        product_id: parseInt(productId),
        size: size
      }
    })
    
    if (!cartItem) {
      return NextResponse.json(
        { error: 'Article non trouvé dans le panier' },
        { status: 404 }
      )
    }
    
    if (quantity <= 0) {
      // Supprimer l'article si la quantité est 0 ou négative
      await prisma.cart_items.delete({
        where: {
          id: cartItem.id
        }
      })
    } else {
      // Mettre à jour la quantité
      await prisma.cart_items.update({
        where: {
          id: cartItem.id
        },
        data: {
          quantity: quantity
        }
      })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Quantité mise à jour'
    })
    
  } catch (error) {
    console.error('Erreur lors de la mise à jour du panier:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un article du panier
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const size = searchParams.get('size')
    
    if (!productId || !size) {
      return NextResponse.json(
        { error: 'Paramètres manquants' },
        { status: 400 }
      )
    }
    
    // Trouver et supprimer l'article du panier
    const cartItem = await prisma.cart_items.findFirst({
      where: {
        user_id: parseInt(session.user.id),
        product_id: parseInt(productId),
        size: size
      }
    })
    
    if (cartItem) {
      await prisma.cart_items.delete({
        where: {
          id: cartItem.id
        }
      })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Article supprimé du panier'
    })
    
  } catch (error) {
    console.error('Erreur lors de la suppression du panier:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}