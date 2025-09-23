import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const brands = await prisma.brands.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({
      brands
    })

  } catch (error: any) {
    console.error('Erreur lors de la récupération des marques:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des marques' },
      { status: 500 }
    )
  }
}
