import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.categories.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({
      categories
    })

  } catch (error: any) {
    console.error('Erreur lors de la récupération des catégories:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des catégories' },
      { status: 500 }
    )
  }
}
