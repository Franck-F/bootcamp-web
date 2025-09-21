import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { productSchema } from '@/lib/validations'
import { sanitizeInput } from '@/lib/utils'

// GET - Récupérer un produit par ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.products.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        variants: true,
        brands: true,
        categories: true,
        product_images: true
      }
    })
    
    if (!product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      )
    }
    
    // Ajouter des valeurs par défaut pour les champs manquants
    const productWithDefaults = {
      ...product,
      averageRating: 4.5, // Valeur par défaut
      totalReviews: 0, // Valeur par défaut
    }
    
    return NextResponse.json(productWithDefaults)
    
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour un produit (Admin/Vendeur uniquement)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !['admin', 'moderator'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    const validatedData = productSchema.parse(body)
    
    const product = await prisma.products.update({
      where: { id: parseInt(params.id) },
      data: {
        name: sanitizeInput(validatedData.name),
        description: sanitizeInput(validatedData.description),
        price: validatedData.price,
        is_active: validatedData.is_active,
      },
      include: {
        variants: true,
        brands: true,
        categories: true,
        product_images: true
      }
    })
    
    return NextResponse.json(product)
    
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Données invalides', details: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un produit (Admin uniquement)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }
    
    await prisma.products.delete({
      where: { id: parseInt(params.id) }
    })
    
    return NextResponse.json(
      { message: 'Produit supprimé avec succès' },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
