const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkCategories() {
  try {
    console.log('🔍 Vérification des catégories disponibles...\n')

    const categories = await prisma.categories.findMany({
      orderBy: { name: 'asc' }
    })

    console.log('📊 Catégories disponibles dans la base de données:')
    categories.forEach((category, index) => {
      console.log(`   ${index + 1}. ${category.name} (ID: ${category.id})`)
    })

    // Vérifier les catégories spécifiques
    const specificCategories = ['Hommes', 'Femmes', 'Infant/Toddler Shoes']
    
    console.log('\n🎯 Catégories spécifiques recherchées:')
    specificCategories.forEach((categoryName) => {
      const found = categories.find(c => c.name.toLowerCase() === categoryName.toLowerCase())
      if (found) {
        console.log(`   ✅ ${categoryName} - Trouvée (ID: ${found.id})`)
      } else {
        console.log(`   ❌ ${categoryName} - Non trouvée`)
      }
    })

    // Compter les produits par catégorie
    console.log('\n📈 Nombre de produits par catégorie:')
    for (const category of categories) {
      const productCount = await prisma.products.count({
        where: { category_id: category.id }
      })
      console.log(`   • ${category.name}: ${productCount} produits`)
    }

  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkCategories()
