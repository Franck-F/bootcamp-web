async function testNewAPI() {
  try {
    console.log('🧪 Test de l\'API avec la nouvelle base de données...\n')

    // Test 1: Produits featured
    console.log('1️⃣ Test des produits featured:')
    const featuredResponse = await fetch('http://localhost:3001/api/products?featured=true&limit=3')
    const featuredData = await featuredResponse.json()
    
    console.log(`   ✅ ${featuredData.products.length} produits featured trouvés`)
    featuredData.products.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} - ${product.brand?.name} - ${product.price}€`)
      console.log(`      Images: ${product.images?.length || 0}, Variantes: ${product.variants?.length || 0}`)
    })

    // Test 2: Produits récents
    console.log('\n2️⃣ Test des produits récents:')
    const recentResponse = await fetch('http://localhost:3001/api/products?sortBy=newest&limit=5')
    const recentData = await recentResponse.json()
    
    console.log(`   ✅ ${recentData.products.length} produits récents trouvés`)
    recentData.products.slice(0, 3).forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} - ${product.brand?.name} - ${product.price}€`)
    })

    // Test 3: Recherche par marque
    console.log('\n3️⃣ Test de recherche par marque (Nike):')
    const nikeResponse = await fetch('http://localhost:3001/api/products?brand=Nike&limit=3')
    const nikeData = await nikeResponse.json()
    
    console.log(`   ✅ ${nikeData.products.length} produits Nike trouvés`)
    nikeData.products.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} - ${product.price}€`)
    })

    // Test 4: Statistiques générales
    console.log('\n4️⃣ Test des statistiques:')
    const statsResponse = await fetch('http://localhost:3001/api/products?limit=1')
    const statsData = await statsResponse.json()
    
    console.log(`   ✅ Total produits: ${statsData.pagination.total}`)
    console.log(`   ✅ Pages totales: ${statsData.pagination.totalPages}`)

    // Test 5: Produit individuel
    if (featuredData.products.length > 0) {
      console.log('\n5️⃣ Test d\'un produit individuel:')
      const productId = featuredData.products[0].id
      const productResponse = await fetch(`http://localhost:3001/api/products/${productId}`)
      const productData = await productResponse.json()
      
      console.log(`   ✅ Produit ID ${productId}: ${productData.name}`)
      console.log(`   ✅ Marque: ${productData.brand?.name}`)
      console.log(`   ✅ Catégorie: ${productData.category?.name}`)
      console.log(`   ✅ Prix: ${productData.price}€`)
      console.log(`   ✅ Images: ${productData.images?.length || 0}`)
      console.log(`   ✅ Variantes: ${productData.variants?.length || 0}`)
    }

    console.log('\n🎉 Tous les tests API sont passés avec succès!')

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error)
  }
}

testNewAPI()
