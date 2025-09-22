const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function setupNewDatabase() {
  try {
    console.log('🔧 Configuration de la nouvelle base de données...\n')

    // 1. Marquer certains produits comme featured
    console.log('⭐ Marquage de produits comme featured...')
    const featuredUpdate = await prisma.products.updateMany({
      where: {
        id: {
          in: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] // Premiers 10 produits
        }
      },
      data: {
        featured: true
      }
    })
    console.log(`✅ ${featuredUpdate.count} produits marqués comme featured`)

    // 2. Marquer certains produits comme nouveaux
    console.log('\n🆕 Marquage de produits comme nouveaux...')
    const newUpdate = await prisma.products.updateMany({
      where: {
        id: {
          in: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] // Produits 11-20
        }
      },
      data: {
        isNew: true
      }
    })
    console.log(`✅ ${newUpdate.count} produits marqués comme nouveaux`)

    // 3. Marquer certains produits comme en solde
    console.log('\n🏷️ Marquage de produits comme en solde...')
    const saleUpdate = await prisma.products.updateMany({
      where: {
        id: {
          in: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] // Produits 21-30
        }
      },
      data: {
        onSale: true,
        originalPrice: 200.00 // Prix original fictif
      }
    })
    console.log(`✅ ${saleUpdate.count} produits marqués comme en solde`)

    // 4. Créer des utilisateurs de test
    console.log('\n👥 Création d\'utilisateurs de test...')
    const hashedPassword = await bcrypt.hash('password123', 12)

    const admin = await prisma.users.upsert({
      where: { email: 'admin@sneakersstore.fr' },
      update: {},
      create: {
        email: 'admin@sneakersstore.fr',
        name: 'Administrateur',
        password_hash: hashedPassword,
        role: 'admin',
        email_verified: true,
        updated_at: new Date(),
      },
    })

    const customer = await prisma.users.upsert({
      where: { email: 'client@sneakersstore.fr' },
      update: {},
      create: {
        email: 'client@sneakersstore.fr',
        name: 'Client Test',
        password_hash: hashedPassword,
        role: 'customer',
        email_verified: true,
        updated_at: new Date(),
      },
    })

    console.log(`✅ Utilisateur admin créé: ${admin.email}`)
    console.log(`✅ Utilisateur client créé: ${customer.email}`)

    // 5. Vérification finale
    console.log('\n📊 Vérification finale...')
    const [featuredCount, newCount, saleCount, usersCount] = await Promise.all([
      prisma.products.count({ where: { featured: true } }),
      prisma.products.count({ where: { isNew: true } }),
      prisma.products.count({ where: { onSale: true } }),
      prisma.users.count()
    ])

    console.log(`   • Produits featured: ${featuredCount}`)
    console.log(`   • Produits nouveaux: ${newCount}`)
    console.log(`   • Produits en solde: ${saleCount}`)
    console.log(`   • Utilisateurs: ${usersCount}`)

    console.log('\n🎉 Configuration terminée avec succès!')

  } catch (error) {
    console.error('❌ Erreur lors de la configuration:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setupNewDatabase()
