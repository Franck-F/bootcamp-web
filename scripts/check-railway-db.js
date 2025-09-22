const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkRailwayDatabase() {
  try {
    console.log('🔍 Vérification de la base de données Railway...\n')

    // Vérifier la connectivité
    await prisma.$connect()
    console.log('✅ Connexion à Railway réussie\n')

    // Compter les enregistrements
    const [brandsCount, categoriesCount, productsCount, variantsCount, imagesCount] = await Promise.all([
      prisma.brands.count(),
      prisma.categories.count(),
      prisma.products.count(),
      prisma.variants.count(),
      prisma.product_images.count()
    ])

    console.log('📊 Statistiques de la base de données:')
    console.log(`   • Marques: ${brandsCount}`)
    console.log(`   • Catégories: ${categoriesCount}`)
    console.log(`   • Produits: ${productsCount}`)
    console.log(`   • Variantes: ${variantsCount}`)
    console.log(`   • Images: ${imagesCount}\n`)

    // Récupérer quelques produits avec leurs relations
    const sampleProducts = await prisma.products.findMany({
      take: 3,
      include: {
        brands: true,
        categories: true,
        variants: true,
        product_images: true
      }
    })

    console.log('🛍️ Échantillon de produits:')
    sampleProducts.forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.name}`)
      console.log(`   • Marque: ${product.brands?.name || 'N/A'}`)
      console.log(`   • Catégorie: ${product.categories?.name || 'N/A'}`)
      console.log(`   • Prix: ${product.price}€`)
      console.log(`   • Variantes: ${product.variants.length}`)
      console.log(`   • Images: ${product.product_images.length}`)
      console.log(`   • Featured: ${product.featured ? 'Oui' : 'Non'}`)
      console.log(`   • Nouveau: ${product.isNew ? 'Oui' : 'Non'}`)
      console.log(`   • En solde: ${product.onSale ? 'Oui' : 'Non'}`)
    })

    // Vérifier les produits featured
    const featuredProducts = await prisma.products.findMany({
      where: { featured: true },
      include: {
        brands: true,
        categories: true,
        variants: true
      }
    })

    console.log(`\n⭐ Produits en vedette: ${featuredProducts.length}`)
    featuredProducts.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} (${product.brands?.name})`)
    })

    console.log('\n✅ Vérification terminée avec succès!')

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkRailwayDatabase()
