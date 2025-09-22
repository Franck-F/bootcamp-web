import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Récupérer la wishlist de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const wishlistItems = await prisma.wishlist_items.findMany({
      where: {
        user_id: parseInt(session.user.id)
      },
      include: {
        products: {
          include: {
            brands: true,
            categories: true,
            product_images: {
              orderBy: { display_order: 'asc' }
            },
            variants: {
              orderBy: { size: 'asc' }
            }
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    // Formater les données pour correspondre à l'interface WishlistItem
    const formattedItems = wishlistItems.map(item => ({
      id: item.id,
      productId: item.product_id,
      product: {
        id: item.products.id,
        name: item.products.name,
        price: Number(item.products.price),
        images: item.products.product_images.map(img => img.image_url),
        brand: {
          name: item.products.brands.name
        },
        category: {
          name: item.products.categories.name
        },
        variants: item.products.variants.map(variant => ({
          id: variant.id,
          size: variant.size || 'Unique',
          color: variant.color || 'Standard',
          stock: variant.stock
        }))
      },
      addedAt: item.created_at.toISOString()
    }))

    return NextResponse.json({
      success: true,
      items: formattedItems,
      count: formattedItems.length
    })

  } catch (error) {
    console.error('Erreur GET wishlist:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération de la wishlist' },
      { status: 500 }
    )
  }
}

// POST - Ajouter un produit à la wishlist
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json(
        { error: 'ID du produit requis' },
        { status: 400 }
      )
    }

    // Vérifier si le produit existe
    const product = await prisma.products.findUnique({
      where: { id: parseInt(productId) },
      include: {
        brands: true,
        categories: true,
        product_images: {
          orderBy: { display_order: 'asc' }
        },
        variants: {
          orderBy: { size: 'asc' }
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier si le produit est déjà dans la wishlist
    const existingItem = await prisma.wishlist_items.findFirst({
      where: {
        user_id: parseInt(session.user.id),
        product_id: parseInt(productId)
      }
    })

    if (existingItem) {
      return NextResponse.json(
        { error: 'Produit déjà dans la wishlist' },
        { status: 409 }
      )
    }

    // Ajouter à la wishlist
    const wishlistItem = await prisma.wishlist_items.create({
      data: {
        user_id: parseInt(session.user.id),
        product_id: parseInt(productId)
      },
      include: {
        products: {
          include: {
            brands: true,
            categories: true,
            product_images: {
              orderBy: { display_order: 'asc' }
            },
            variants: {
              orderBy: { size: 'asc' }
            }
          }
        }
      }
    })

    // Formater la réponse
    const formattedItem = {
      id: wishlistItem.id,
      productId: wishlistItem.product_id,
      product: {
        id: wishlistItem.products.id,
        name: wishlistItem.products.name,
        price: Number(wishlistItem.products.price),
        images: wishlistItem.products.product_images.map(img => img.image_url),
        brand: {
          name: wishlistItem.products.brands.name
        },
        category: {
          name: wishlistItem.products.categories.name
        },
        variants: wishlistItem.products.variants.map(variant => ({
          id: variant.id,
          size: variant.size || 'Unique',
          color: variant.color || 'Standard',
          stock: variant.stock
        }))
      },
      addedAt: wishlistItem.created_at.toISOString()
    }

    return NextResponse.json({
      success: true,
      message: 'Produit ajouté à la wishlist',
      item: formattedItem
    })

  } catch (error) {
    console.error('Erreur POST wishlist:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'ajout à la wishlist' },
      { status: 500 }
    )
  }
}

// DELETE - Vider la wishlist
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    await prisma.wishlist_items.deleteMany({
      where: {
        user_id: parseInt(session.user.id)
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Wishlist vidée'
    })

  } catch (error) {
    console.error('Erreur DELETE wishlist:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la suppression de la wishlist' },
      { status: 500 }
    )
  }
}
