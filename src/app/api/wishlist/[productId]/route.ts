import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

// DELETE - Supprimer un produit spécifique de la wishlist
export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const productId = parseInt(params.productId)

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'ID du produit invalide' },
        { status: 400 }
      )
    }

    // Vérifier si l'élément existe dans la wishlist
    const wishlistItem = await prisma.wishlist_items.findFirst({
      where: {
        user_id: parseInt(session.user.id),
        product_id: productId
      }
    })

    if (!wishlistItem) {
      return NextResponse.json(
        { error: 'Produit non trouvé dans la wishlist' },
        { status: 404 }
      )
    }

    // Supprimer de la wishlist
    await prisma.wishlist_items.delete({
      where: {
        id: wishlistItem.id
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Produit supprimé de la wishlist'
    })

  } catch (error) {
    console.error('Erreur DELETE wishlist item:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la suppression du produit' },
      { status: 500 }
    )
  }
}

// GET - Vérifier si un produit est dans la wishlist
export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const productId = parseInt(params.productId)

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'ID du produit invalide' },
        { status: 400 }
      )
    }

    // Vérifier si le produit est dans la wishlist
    const wishlistItem = await prisma.wishlist_items.findFirst({
      where: {
        user_id: parseInt(session.user.id),
        product_id: productId
      }
    })

    return NextResponse.json({
      success: true,
      isInWishlist: !!wishlistItem,
      item: wishlistItem ? {
        id: wishlistItem.id,
        addedAt: wishlistItem.created_at.toISOString()
      } : null
    })

  } catch (error) {
    console.error('Erreur GET wishlist item:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la vérification' },
      { status: 500 }
    )
  }
}
