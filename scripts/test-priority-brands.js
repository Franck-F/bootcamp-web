const fetch = require('node-fetch')

async function testPriorityBrands() {
  try {
    console.log('🧪 Test de la priorisation des marques...\n')

    const tests = [
      {
        name: 'Produits généraux (toutes catégories)',
        url: '/api/products?limit=12'
      },
      {
        name: 'Catégorie Sneakers',
        url: '/api/products?category=Sneakers&limit=12'
      },
      {
        name: 'Produits nouveaux',
        url: '/api/products?new=true&limit=12'
      },
      {
        name: 'Produits en solde',
        url: '/api/products?sale=true&limit=12'
      },
      {
        name: 'Catégorie Hommes',
        url: '/api/products?category=Hommes&limit=12'
      },
      {
        name: 'Catégorie Femmes',
        url: '/api/products?category=Femmes&limit=12'
      }
    ]

    for (const test of tests) {
      console.log(`\n${test.name}:`)
      console.log('=' .repeat(50))
      
      try {
        const response = await fetch(`http://localhost:3001${test.url}`)
        const data = await response.json()
        
        if (data.products && data.products.length > 0) {
          console.log(`✅ ${data.products.length} produits trouvés`)
          
          // Analyser les marques des premiers produits
          const brands = data.products.slice(0, 8).map(p => p.brand?.name || 'Inconnu')
          const uniqueBrands = [...new Set(brands)]
          
          console.log('🏷️ Marques des 8 premiers produits:')
          uniqueBrands.forEach((brand, index) => {
            const count = brands.filter(b => b === brand).length
            console.log(`   ${index + 1}. ${brand} (${count} produit${count > 1 ? 's' : ''})`)
          })
          
          // Vérifier si les marques prioritaires sont en premier
          const priorityBrands = ['Nike', 'Adidas', 'Air Jordan', 'Puma', 'New Balance', 'Converse', 'Vans']
          const firstBrand = brands[0]
          const isPriority = priorityBrands.includes(firstBrand)
          
          console.log(`🎯 Premier produit: ${data.products[0].name} (${firstBrand})`)
          console.log(`${isPriority ? '✅' : '⚠️'} Marque prioritaire: ${isPriority ? 'Oui' : 'Non'}`)
          
        } else {
          console.log('❌ Aucun produit trouvé')
        }
        
      } catch (error) {
        console.log(`❌ Erreur: ${error.message}`)
      }
    }

    console.log('\n🎉 Tests terminés!')

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error)
  }
}

testPriorityBrands()
