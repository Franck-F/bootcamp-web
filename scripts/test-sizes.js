const fetch = require('node-fetch')

async function testSizes() {
  try {
    console.log('🧪 Test des tailles européennes...\n')

    // Test de la fonction formatSize
    function formatSize(sizeString, category) {
      if (!sizeString) return 'Unique'
      
      // Extraire la taille EU (normes européennes) - priorité absolue
      const euMatch = sizeString.match(/EU (\d+(?:\.\d+)?)/)
      if (euMatch) {
        return `EU ${euMatch[1]}`
      }
      
      // Si pas de EU, essayer de convertir depuis US
      const usMatch = sizeString.match(/US (\d+(?:\.\d+)?)/)
      if (usMatch) {
        const usSize = parseFloat(usMatch[1])
        
        // Pour les enfants
        if (category === 'Infant/Toddler Shoes' || category?.toLowerCase().includes('enfant')) {
          const euSize = Math.round(usSize + 18)
          if (euSize >= 18 && euSize <= 35) {
            return `EU ${euSize}`
          }
        }
        
        // Pour les adultes - conversion approximative US vers EU
        if (usSize >= 3 && usSize <= 15) {
          const euSize = Math.round(usSize + 33)
          if (euSize >= 36 && euSize <= 48) {
            return `EU ${euSize}`
          }
        }
        
        return `US ${usSize}`
      }
      
      // Si rien ne correspond, retourner les 10 premiers caractères
      return sizeString.length > 10 ? sizeString.substring(0, 10) + '...' : sizeString
    }

    // Test avec des exemples de tailles
    const testSizes = [
      "Women's US 3 / Men's US 1.5 / UK 1 / EU 33.5 / JP 20.5",
      "Women's US 5 / Men's US 3.5 / UK 2.5 / EU 35.5 / JP 22",
      "Women's US 7 / Men's US 5 / UK 4 / EU 37.5 / JP 24",
      "Women's US 9 / Men's US 7 / UK 6 / EU 39.5 / JP 26",
      "Men's US 10 / UK 9 / EU 43 / JP 28",
      "Men's US 12 / UK 11 / EU 45 / JP 30"
    ]

    console.log('📏 Test de formatSize:')
    testSizes.forEach(size => {
      const formatted = formatSize(size)
      console.log(`   • "${size}" → "${formatted}"`)
    })

    // Test avec des produits réels
    console.log('\n🔍 Test avec des produits réels:')
    const response = await fetch('http://localhost:3001/api/products?limit=3')
    const data = await response.json()
    
    if (data.products && data.products.length > 0) {
      data.products.forEach(product => {
        console.log(`\n📦 ${product.name} (${product.brand?.name})`)
        if (product.variants && product.variants.length > 0) {
          const uniqueSizes = [...new Set(product.variants.map(v => v.size).filter(Boolean))]
          uniqueSizes.slice(0, 5).forEach(size => {
            const formatted = formatSize(size, product.category?.name)
            console.log(`   • ${size} → ${formatted}`)
          })
        }
      })
    }

    console.log('\n✅ Test des tailles terminé!')

  } catch (error) {
    console.error('❌ Erreur lors du test:', error)
  }
}

testSizes()
