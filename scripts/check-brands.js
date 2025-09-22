const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkBrands() {
  try {
    console.log('🔍 Vérification des marques disponibles...\n')

    const brands = await prisma.brands.findMany({
      orderBy: { name: 'asc' }
    })

    console.log('📊 Marques disponibles dans la base de données:')
    brands.forEach((brand, index) => {
      console.log(`   ${index + 1}. ${brand.name} (ID: ${brand.id})`)
    })

    // Vérifier les marques prioritaires
    const priorityBrands = ['Nike', 'Adidas', 'Jordan', 'Puma', 'New Balance', 'Converse', 'Vans']
    
    console.log('\n🎯 Marques prioritaires demandées:')
    priorityBrands.forEach((brandName, index) => {
      const found = brands.find(b => b.name.toLowerCase() === brandName.toLowerCase())
      if (found) {
        console.log(`   ✅ ${brandName} - Trouvée (ID: ${found.id})`)
      } else {
        console.log(`   ❌ ${brandName} - Non trouvée`)
      }
    })

    // Compter les produits par marque
    console.log('\n📈 Nombre de produits par marque:')
    for (const brand of brands) {
      const productCount = await prisma.products.count({
        where: { brand_id: brand.id }
      })
      console.log(`   • ${brand.name}: ${productCount} produits`)
    }

  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkBrands()
