import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signUpSchema } from '@/lib/validations'
import { sanitizeInput } from '@/lib/utils'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validation des données
    const validatedData = signUpSchema.parse(body)
    
    // Vérification si l'utilisateur existe déjà
    const existingUser = await prisma.users.findUnique({
      where: { email: validatedData.email }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Un utilisateur avec cet email existe déjà' },
        { status: 400 }
      )
    }
    
    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)
    
    // Création de l'utilisateur
    const user = await prisma.users.create({
      data: {
        email: sanitizeInput(validatedData.email),
        password_hash: hashedPassword,
        name: sanitizeInput(validatedData.name),
        role: validatedData.role,
        updated_at: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        created_at: true,
      }
    })
    
    return NextResponse.json(
      { 
        message: 'Utilisateur créé avec succès',
        user 
      },
      { status: 201 }
    )
    
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error)
    
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
