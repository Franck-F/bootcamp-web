const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function enhanceProductCategories() {
  try {
    console.log('🔧 Amélioration des catégories de produits...\n')

    // Marques prioritaires
    const priorityBrands = ['Nike', 'Adidas', 'Air Jordan', 'Puma', 'New Balance', 'Converse', 'Vans']
    
    // 1. Marquer plus de produits comme "nouveaux" (priorité aux marques prioritaires)
    console.log('🆕 Marquage de produits comme nouveaux...')
    
    // Récupérer les marques prioritaires
    const priorityBrandIds = await prisma.brands.findMany({
      where: { name: { in: priorityBrands } },
      select: { id: true, name: true }
    })
    
    const priorityBrandIdList = priorityBrandIds.map(b => b.id)
    
    // Marquer 50 produits des marques prioritaires comme nouveaux
    const newProductsUpdate = await prisma.products.updateMany({
      where: {
        brand_id: { in: priorityBrandIdList },
        isNew: false,
        id: { gte: 100, lte: 150 } // Plage d'IDs pour éviter les conflits
      },
      data: { isNew: true }
    })
    console.log(`✅ ${newProductsUpdate.count} produits marqués comme nouveaux`)

    // 2. Marquer plus de produits comme "en solde" (priorité aux marques prioritaires)
    console.log('\n🏷️ Marquage de produits comme en solde...')
    
    const saleProductsUpdate = await prisma.products.updateMany({
      where: {
        brand_id: { in: priorityBrandIdList },
        onSale: false,
        id: { gte: 200, lte: 250 } // Plage d'IDs différente
      },
      data: { 
        onSale: true,
        originalPrice: 250.00 // Prix original fictif
      }
    })
    console.log(`✅ ${saleProductsUpdate.count} produits marqués comme en solde`)

    // 3. Marquer plus de produits comme "featured" (priorité aux marques prioritaires)
    console.log('\n⭐ Marquage de produits comme featured...')
    
    const featuredProductsUpdate = await prisma.products.updateMany({
      where: {
        brand_id: { in: priorityBrandIdList },
        featured: false,
        id: { gte: 300, lte: 350 } // Plage d'IDs différente
      },
      data: { featured: true }
    })
    console.log(`✅ ${featuredProductsUpdate.count} produits marqués comme featured`)

    // 4. Vérification finale
    console.log('\n📊 Vérification finale...')
    const [newCount, saleCount, featuredCount] = await Promise.all([
      prisma.products.count({ where: { isNew: true } }),
      prisma.products.count({ where: { onSale: true } }),
      prisma.products.count({ where: { featured: true } })
    ])

    console.log(`   • Produits nouveaux: ${newCount}`)
    console.log(`   • Produits en solde: ${saleCount}`)
    console.log(`   • Produits featured: ${featuredCount}`)

    // 5. Afficher quelques exemples par marque prioritaire
    console.log('\n🎯 Exemples par marque prioritaire:')
    for (const brand of priorityBrandIds) {
      const [newProducts, saleProducts, featuredProducts] = await Promise.all([
        prisma.products.count({ where: { brand_id: brand.id, isNew: true } }),
        prisma.products.count({ where: { brand_id: brand.id, onSale: true } }),
        prisma.products.count({ where: { brand_id: brand.id, featured: true } })
      ])
      
      console.log(`   • ${brand.name}: ${newProducts} nouveaux, ${saleProducts} en solde, ${featuredProducts} featured`)
    }

    console.log('\n🎉 Amélioration des catégories terminée!')

  } catch (error) {
    console.error('❌ Erreur lors de l\'amélioration:', error)
  } finally {
    await prisma.$disconnect()
  }
}

enhanceProductCategories()
