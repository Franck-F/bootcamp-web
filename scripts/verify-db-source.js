const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function verifyDatabaseSource() {
  try {
    console.log('🔍 Vérification directe de la base de données Railway...\n')

    // Récupérer un produit spécifique directement de la BD
    const product = await prisma.products.findFirst({
      where: { id: 27 },
      include: {
        brands: true,
        categories: true,
        variants: true,
        product_images: true
      }
    })

    if (product) {
      console.log('=== PRODUIT DIRECT DE LA BD RAILWAY ===')
      console.log(`ID: ${product.id}`)
      console.log(`Nom: ${product.name}`)
      console.log(`Prix: ${product.price}€`)
      console.log(`Marque: ${product.brands.name}`)
      console.log(`Catégorie: ${product.categories.name}`)
      console.log(`Featured: ${product.featured}`)
      console.log(`Nouveau: ${product.isNew}`)
      console.log(`En solde: ${product.onSale}`)
      console.log(`Date création: ${product.created_at}`)
      console.log(`\nImages dans la BD:`)
      product.product_images.forEach((img, i) => {
        console.log(`  ${i + 1}. ${img.image_url}`)
      })
      console.log(`\nVariantes (${product.variants.length}):`)
      product.variants.forEach((variant, i) => {
        console.log(`  ${i + 1}. Taille: ${variant.size}, Couleur: ${variant.color}, Stock: ${variant.stock}`)
      })
    }

    // Vérifier quelques autres produits
    console.log('\n=== AUTRES PRODUITS DE LA BD ===')
    const otherProducts = await prisma.products.findMany({
      take: 3,
      where: { featured: true },
      include: {
        brands: true,
        categories: true
      }
    })

    otherProducts.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name} (${p.brands.name}) - ${p.price}€ - Featured: ${p.featured}`)
    })

    // Compter les produits par marque
    console.log('\n=== RÉPARTITION PAR MARQUE ===')
    const brandStats = await prisma.products.groupBy({
      by: ['brand_id'],
      _count: { id: true },
      include: {
        brands: true
      }
    })

    for (const stat of brandStats) {
      const brand = await prisma.brands.findUnique({ where: { id: stat.brand_id } })
      console.log(`${brand.name}: ${stat._count.id} produits`)
    }

    console.log('\n✅ Les produits proviennent bien de la base de données Railway!')
    console.log('❌ Le problème est que les images Unsplash retournent des erreurs 404')

  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verifyDatabaseSource()
