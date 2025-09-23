import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { jsPDF } from 'jspdf'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  try {
    const orderId = parseInt(params.id)

    // Récupérer la commande avec tous les détails
    const order = await prisma.orders.findUnique({
      where: { id: orderId },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            city: true,
            postal_code: true,
            country: true
          }
        },
        order_items: {
          include: {
            variants: {
              include: {
                products: {
                  include: {
                    brands: {
                      select: { name: true }
                    },
                    categories: {
                      select: { name: true }
                    }
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 })
    }

    // Vérifier que l'utilisateur peut accéder à cette commande
    if (session.user.role !== 'admin' && order.user_id !== parseInt(session.user.id)) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    // Générer le PDF
    const pdf = new jsPDF()
    
    // Configuration des couleurs
    const primaryColor = [255, 140, 0] // Orange
    const darkColor = [0, 0, 0] // Noir
    const grayColor = [128, 128, 128] // Gris

    // En-tête
    pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
    pdf.rect(0, 0, 210, 30, 'F')
    
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(24)
    pdf.setFont('helvetica', 'bold')
    pdf.text('SNEAKERS STORE', 20, 20)
    
    pdf.setFontSize(10)
    pdf.text('Reçu de Paiement', 20, 28)

    // Informations de la commande
    pdf.setTextColor(darkColor[0], darkColor[1], darkColor[2])
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.text('REÇU DE PAIEMENT', 20, 45)
    
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    
    // Numéro de commande et date
    pdf.text(`Numéro de commande: ${order.order_number}`, 20, 55)
    pdf.text(`Date: ${new Date(order.created_at).toLocaleDateString('fr-FR')}`, 20, 60)
    pdf.text(`Statut: ${order.status.toUpperCase()}`, 20, 65)

    // Informations client
    pdf.setFont('helvetica', 'bold')
    pdf.text('INFORMATIONS CLIENT', 20, 80)
    
    pdf.setFont('helvetica', 'normal')
    pdf.text(`Nom: ${order.users.name || 'Non renseigné'}`, 20, 90)
    pdf.text(`Email: ${order.users.email}`, 20, 95)
    if (order.users.phone) {
      pdf.text(`Téléphone: ${order.users.phone}`, 20, 100)
    }
    
    // Adresse de livraison
    if (order.users.address) {
      pdf.text('Adresse de livraison:', 20, 110)
      pdf.text(order.users.address, 20, 115)
      if (order.users.city) {
        pdf.text(`${order.users.postal_code || ''} ${order.users.city}`, 20, 120)
      }
      if (order.users.country) {
        pdf.text(order.users.country, 20, 125)
      }
    }

    // Détails des articles
    pdf.setFont('helvetica', 'bold')
    pdf.text('ARTICLES COMMANDÉS', 20, 145)
    
    let yPosition = 155
    
    // En-tête du tableau
    pdf.setFillColor(240, 240, 240)
    pdf.rect(20, yPosition - 5, 170, 8, 'F')
    
    pdf.setFontSize(8)
    pdf.setTextColor(darkColor[0], darkColor[1], darkColor[2])
    pdf.text('Produit', 22, yPosition)
    pdf.text('Taille', 80, yPosition)
    pdf.text('Couleur', 100, yPosition)
    pdf.text('Qté', 130, yPosition)
    pdf.text('Prix unit.', 150, yPosition)
    pdf.text('Total', 170, yPosition)
    
    yPosition += 10
    
    // Articles
    order.order_items.forEach((item) => {
      const product = item.variants.products
      const brand = product.brands.name
      const category = product.categories.name
      
      pdf.setFontSize(8)
      pdf.setTextColor(darkColor[0], darkColor[1], darkColor[2])
      
      // Nom du produit (avec retour à la ligne si nécessaire)
      const productName = `${brand} ${product.name}`
      const lines = pdf.splitTextToSize(productName, 50)
      
      lines.forEach((line: string, index: number) => {
        pdf.text(line, 22, yPosition + (index * 4))
      })
      
      // Taille
      pdf.text(item.variants.size || '-', 80, yPosition)
      
      // Couleur
      pdf.text(item.variants.color || '-', 100, yPosition)
      
      // Quantité
      pdf.text(item.quantity.toString(), 130, yPosition)
      
      // Prix unitaire
      pdf.text(`${Number(item.unit_price).toFixed(2)} €`, 150, yPosition)
      
      // Total
      const itemTotal = item.quantity * Number(item.unit_price)
      pdf.text(`${itemTotal.toFixed(2)} €`, 170, yPosition)
      
      yPosition += Math.max(8, lines.length * 4 + 2)
    })

    // Totaux
    yPosition += 10
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    
    // Ligne de séparation
    pdf.setDrawColor(grayColor[0], grayColor[1], grayColor[2])
    pdf.line(20, yPosition, 190, yPosition)
    yPosition += 10
    
    // Sous-total
    pdf.text('Sous-total:', 150, yPosition)
    pdf.text(`${Number(order.total_amount).toFixed(2)} €`, 170, yPosition)
    yPosition += 8
    
    // TVA (20%)
    const tax = Number(order.total_amount) * 0.20
    pdf.text('TVA (20%):', 150, yPosition)
    pdf.text(`${tax.toFixed(2)} €`, 170, yPosition)
    yPosition += 8
    
    // Livraison
    pdf.text('Livraison:', 150, yPosition)
    pdf.text('Gratuite', 170, yPosition)
    yPosition += 8
    
    // Ligne de séparation
    pdf.line(20, yPosition, 190, yPosition)
    yPosition += 10
    
    // Total final
    pdf.setFontSize(12)
    pdf.text('TOTAL:', 150, yPosition)
    pdf.text(`${Number(order.total_amount).toFixed(2)} €`, 170, yPosition)

    // Pied de page
    yPosition += 20
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(grayColor[0], grayColor[1], grayColor[2])
    
    pdf.text('Merci pour votre achat !', 20, yPosition)
    yPosition += 5
    pdf.text('Pour toute question, contactez-nous à support@sneakersstore.fr', 20, yPosition)
    yPosition += 5
    pdf.text('www.sneakersstore.fr', 20, yPosition)

    // Générer le buffer PDF
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'))

    // Retourner le PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="recu-${order.order_number}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    })

  } catch (error: any) {
    console.error('Erreur lors de la génération du reçu:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération du reçu' },
      { status: 500 }
    )
  }
}
