const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testCategoryPages() {
  try {
    console.log('🧪 Test des pages de catégories...\n')

    // Test page Homme (Sneakers)
    console.log('👨 Page Homme - Catégorie: Sneakers')
    const hommeProducts = await prisma.products.findMany({
      where: {
        categories: { name: 'Sneakers' },
        is_active: true
      },
      include: {
        brands: true,
        categories: true
      },
      take: 5
    })
    console.log(`   ✅ ${hommeProducts.length} produits trouvés`)
    hommeProducts.forEach(product => {
      console.log(`   • ${product.name} - ${product.brands.name} - ${product.categories.name}`)
    })

    // Test page Femme (Marathon Running Shoes/Sneakers)
    console.log('\n👩 Page Femme - Catégorie: Marathon Running Shoes/Sneakers')
    const femmeProducts = await prisma.products.findMany({
      where: {
        categories: { name: 'Marathon Running Shoes/Sneakers' },
        is_active: true
      },
      include: {
        brands: true,
        categories: true
      },
      take: 5
    })
    console.log(`   ✅ ${femmeProducts.length} produits trouvés`)
    femmeProducts.forEach(product => {
      console.log(`   • ${product.name} - ${product.brands.name} - ${product.categories.name}`)
    })

    // Test page Enfant (Infant/Toddler Shoes)
    console.log('\n👶 Page Enfant - Catégorie: Infant/Toddler Shoes')
    const enfantProducts = await prisma.products.findMany({
      where: {
        categories: { name: 'Infant/Toddler Shoes' },
        is_active: true
      },
      include: {
        brands: true,
        categories: true
      },
      take: 5
    })
    console.log(`   ✅ ${enfantProducts.length} produits trouvés`)
    enfantProducts.forEach(product => {
      console.log(`   • ${product.name} - ${product.brands.name} - ${product.categories.name}`)
    })

    // Test page Nouveautés (isNew = true)
    console.log('\n🆕 Page Nouveautés - Produits nouveaux')
    const newProducts = await prisma.products.findMany({
      where: {
        isNew: true,
        is_active: true
      },
      include: {
        brands: true,
        categories: true
      },
      take: 5
    })
    console.log(`   ✅ ${newProducts.length} produits trouvés`)
    newProducts.forEach(product => {
      console.log(`   • ${product.name} - ${product.brands.name} - ${product.categories.name}`)
    })

    // Test page Soldes (onSale = true)
    console.log('\n🏷️ Page Soldes - Produits en solde')
    const saleProducts = await prisma.products.findMany({
      where: {
        onSale: true,
        is_active: true
      },
      include: {
        brands: true,
        categories: true
      },
      take: 5
    })
    console.log(`   ✅ ${saleProducts.length} produits trouvés`)
    saleProducts.forEach(product => {
      console.log(`   • ${product.name} - ${product.brands.name} - ${product.categories.name}`)
    })

    console.log('\n🎉 Tests des pages de catégories terminés!')

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testCategoryPages()
