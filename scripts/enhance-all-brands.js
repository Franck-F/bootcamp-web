const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function enhanceAllBrands() {
  try {
    console.log('🔧 Amélioration de toutes les marques prioritaires...\n')

    // Marques prioritaires
    const priorityBrands = ['Nike', 'Adidas', 'Air Jordan', 'Puma', 'New Balance', 'Converse', 'Vans']
    
    // Récupérer les marques prioritaires
    const priorityBrandIds = await prisma.brands.findMany({
      where: { name: { in: priorityBrands } },
      select: { id: true, name: true }
    })
    
    console.log('📊 Marques prioritaires trouvées:')
    priorityBrandIds.forEach(brand => {
      console.log(`   • ${brand.name} (ID: ${brand.id})`)
    })

    // Pour chaque marque, marquer des produits comme nouveaux, en solde et featured
    for (const brand of priorityBrandIds) {
      console.log(`\n🎯 Traitement de ${brand.name}...`)
      
      // Récupérer les produits de cette marque
      const brandProducts = await prisma.products.findMany({
        where: { brand_id: brand.id },
        select: { id: true, name: true },
        take: 20 // Prendre les 20 premiers produits
      })
      
      if (brandProducts.length > 0) {
        const productIds = brandProducts.map(p => p.id)
        
        // Marquer 5 produits comme nouveaux
        const newUpdate = await prisma.products.updateMany({
          where: {
            id: { in: productIds.slice(0, 5) },
            isNew: false
          },
          data: { isNew: true }
        })
        
        // Marquer 5 produits comme en solde
        const saleUpdate = await prisma.products.updateMany({
          where: {
            id: { in: productIds.slice(5, 10) },
            onSale: false
          },
          data: { 
            onSale: true,
            originalPrice: 200.00
          }
        })
        
        // Marquer 5 produits comme featured
        const featuredUpdate = await prisma.products.updateMany({
          where: {
            id: { in: productIds.slice(10, 15) },
            featured: false
          },
          data: { featured: true }
        })
        
        console.log(`   ✅ ${newUpdate.count} nouveaux, ${saleUpdate.count} en solde, ${featuredUpdate.count} featured`)
      } else {
        console.log(`   ⚠️ Aucun produit trouvé pour ${brand.name}`)
      }
    }

    // Vérification finale
    console.log('\n📊 Vérification finale par marque:')
    for (const brand of priorityBrandIds) {
      const [newCount, saleCount, featuredCount] = await Promise.all([
        prisma.products.count({ where: { brand_id: brand.id, isNew: true } }),
        prisma.products.count({ where: { brand_id: brand.id, onSale: true } }),
        prisma.products.count({ where: { brand_id: brand.id, featured: true } })
      ])
      
      console.log(`   • ${brand.name}: ${newCount} nouveaux, ${saleCount} en solde, ${featuredCount} featured`)
    }

    // Totaux généraux
    const [totalNew, totalSale, totalFeatured] = await Promise.all([
      prisma.products.count({ where: { isNew: true } }),
      prisma.products.count({ where: { onSale: true } }),
      prisma.products.count({ where: { featured: true } })
    ])

    console.log('\n🎯 Totaux généraux:')
    console.log(`   • Produits nouveaux: ${totalNew}`)
    console.log(`   • Produits en solde: ${totalSale}`)
    console.log(`   • Produits featured: ${totalFeatured}`)

    console.log('\n🎉 Amélioration de toutes les marques terminée!')

  } catch (error) {
    console.error('❌ Erreur lors de l\'amélioration:', error)
  } finally {
    await prisma.$disconnect()
  }
}

enhanceAllBrands()
