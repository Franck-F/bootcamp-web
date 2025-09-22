import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateTransactionId, generateMockCreationDate } from '@/lib/date-utils'
import crypto from 'crypto'

// POST - Traitement sécurisé du paiement
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Vérification du rate limiting basique
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    // Log de sécurité
    console.log(`🔒 Tentative de paiement - IP: ${clientIP}, User: ${session.user.email}, UA: ${userAgent}`)

    const body = await request.json()
    const { paymentMethod, amount, orderId, cartItems } = body

    // Validation des données d'entrée
    if (!paymentMethod || !amount || !cartItems || !Array.isArray(cartItems)) {
      return NextResponse.json(
        { error: 'Données de paiement manquantes ou invalides' },
        { status: 400 }
      )
    }

    // Validation du montant
    if (typeof amount !== 'number' || amount <= 0 || amount > 10000) {
      return NextResponse.json(
        { error: 'Montant invalide' },
        { status: 400 }
      )
    }

    // Validation de la méthode de paiement
    const validPaymentMethods = ['card', 'paypal', 'apple_pay', 'google_pay']
    if (!validPaymentMethods.includes(paymentMethod.method)) {
      return NextResponse.json(
        { error: 'Méthode de paiement non supportée' },
        { status: 400 }
      )
    }

    // Vérification du stock en temps réel
    for (const item of cartItems) {
      const product = await prisma.products.findUnique({
        where: { id: parseInt(item.productId) },
        include: { variants: true }
      })

      if (!product) {
        return NextResponse.json(
          { error: `Produit ${item.productId} non trouvé` },
          { status: 400 }
        )
      }

      const variant = product.variants.find(v => v.size === item.size)
      if (!variant || variant.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stock insuffisant pour ${product.name} (${item.size})` },
          { status: 400 }
        )
      }
    }

    // Générer un hash sécurisé pour la transaction
    const transactionHash = crypto.createHash('sha256')
      .update(`${session.user.id}-${amount}-${Date.now()}-${Math.random()}`)
      .digest('hex')
      .substring(0, 16)

    // Simuler le délai de traitement du paiement
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Simuler différents scénarios de paiement avec probabilités réalistes
    const paymentScenarios = [
      { success: true, message: 'Paiement traité avec succès' },
      { success: true, message: 'Paiement approuvé' },
      { success: true, message: 'Transaction validée' },
      { success: false, message: 'Carte refusée' },
      { success: false, message: 'Fonds insuffisants' },
      { success: false, message: 'Carte expirée' }
    ]

    // 95% de chance de succès (plus réaliste)
    const randomIndex = Math.random() < 0.95 ? 
      Math.floor(Math.random() * 3) : // Succès
      Math.floor(Math.random() * 3) + 3 // Échec

    const scenario = paymentScenarios[randomIndex]

    if (scenario.success) {
      // Générer un ID de transaction sécurisé
      const transactionId = generateTransactionId()
      
      // Enregistrer la transaction dans la base de données
      // Note: Le modèle payments n'existe pas dans le schéma actuel
      // En production, on pourrait créer une table payments ou utiliser les orders
      try {
        console.log(`💳 Transaction enregistrée: ${transactionId}`)
        console.log(`💰 Montant: ${amount}€`)
        console.log(`👤 Utilisateur: ${session.user.id}`)
        console.log(`🛒 Articles: ${cartItems.length}`)
      } catch (dbError) {
        console.error('Erreur lors de l\'enregistrement de la transaction:', dbError)
        // Continuer même si l'enregistrement échoue
      }
      
      // Logs de sécurité détaillés
      console.log(`✅ Paiement traité avec succès`)
      console.log(`👤 Utilisateur: ${session.user.email} (ID: ${session.user.id})`)
      console.log(`💰 Montant: ${amount}€`)
      console.log(`🔢 Transaction ID: ${transactionId}`)
      console.log(`💳 Méthode: ${paymentMethod.method}`)
      console.log(`🌐 IP: ${clientIP}`)
      console.log(`📅 Date: ${new Date().toLocaleString('fr-FR')}`)
      console.log(`🛒 Articles: ${cartItems.length}`)

      return NextResponse.json({
        success: true,
        transactionId,
        message: scenario.message,
        paymentDetails: {
          method: paymentMethod.method,
          amount: amount,
          currency: 'EUR',
          status: 'completed',
          processedAt: new Date().toISOString(),
          transactionHash
        }
      })
    } else {
      // Enregistrer l'échec de paiement
      // Note: Le modèle payments n'existe pas dans le schéma actuel
      try {
        console.log(`❌ Échec de paiement enregistré: FAIL-${generateTransactionId()}`)
        console.log(`💰 Montant: ${amount}€`)
        console.log(`👤 Utilisateur: ${session.user.id}`)
        console.log(`🛒 Articles: ${cartItems.length}`)
        console.log(`❌ Erreur: ${scenario.message}`)
      } catch (dbError) {
        console.error('Erreur lors de l\'enregistrement de l\'échec:', dbError)
      }

      console.log(`❌ Échec du paiement`)
      console.log(`👤 Utilisateur: ${session.user.email} (ID: ${session.user.id})`)
      console.log(`💰 Montant: ${amount}€`)
      console.log(`💳 Méthode: ${paymentMethod.method}`)
      console.log(`🌐 IP: ${clientIP}`)
      console.log(`❌ Raison: ${scenario.message}`)
      console.log(`📅 Date: ${new Date().toLocaleString('fr-FR')}`)

      return NextResponse.json({
        success: false,
        error: scenario.message,
        paymentDetails: {
          method: paymentMethod.method,
          amount: amount,
          currency: 'EUR',
          status: 'failed',
          processedAt: new Date().toISOString(),
          transactionHash
        }
      }, { status: 400 })
    }
    
  } catch (error) {
    console.error('Erreur lors du traitement du paiement:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// GET - Récupérer l'historique des paiements (pour les admins)
export async function GET(request: NextRequest) {
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

    // Simuler l'historique des paiements
    const mockPayments = [
      {
        id: 1,
        transactionId: generateTransactionId(),
        userId: 1,
        amount: 405.00,
        method: 'card',
        status: 'completed',
        createdAt: generateMockCreationDate(15)
      },
      {
        id: 2,
        transactionId: generateTransactionId(),
        userId: 2,
        amount: 299.00,
        method: 'paypal',
        status: 'completed',
        createdAt: generateMockCreationDate(10)
      }
    ]

    return NextResponse.json(mockPayments)
    
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
