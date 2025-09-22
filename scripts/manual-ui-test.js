const fetch = require('node-fetch')

async function manualUITest() {
  try {
    console.log('🧪 Test manuel de l\'interface utilisateur...\n')

    // Test 1: Vérifier que le serveur répond
    console.log('1️⃣ Test de connectivité du serveur...')
    const homeResponse = await fetch('http://localhost:3001')
    console.log(`   ✅ Serveur répond: ${homeResponse.status} ${homeResponse.statusText}`)

    // Test 2: Vérifier la page des produits
    console.log('\n2️⃣ Test de la page des produits...')
    const productsResponse = await fetch('http://localhost:3001/products')
    console.log(`   ✅ Page produits: ${productsResponse.status} ${productsResponse.statusText}`)

    // Test 3: Vérifier une page produit individuelle
    console.log('\n3️⃣ Test d\'une page produit...')
    const productResponse = await fetch('http://localhost:3001/products/1')
    console.log(`   ✅ Page produit: ${productResponse.status} ${productResponse.statusText}`)

    // Test 4: Vérifier les API endpoints
    console.log('\n4️⃣ Test des API endpoints...')
    
    const apiTests = [
      { name: 'Produits featured', url: '/api/products?featured=true&limit=3' },
      { name: 'Produits récents', url: '/api/products?sortBy=newest&limit=5' },
      { name: 'Recherche Nike', url: '/api/products?brand=Nike&limit=3' },
      { name: 'Produit individuel', url: '/api/products/1' }
    ]

    for (const test of apiTests) {
      try {
        const response = await fetch(`http://localhost:3001${test.url}`)
        const data = await response.json()
        console.log(`   ✅ ${test.name}: ${response.status} - ${data.products?.length || 'OK'}`)
      } catch (error) {
        console.log(`   ❌ ${test.name}: Erreur - ${error.message}`)
      }
    }

    // Test 5: Vérifier les performances
    console.log('\n5️⃣ Test des performances...')
    const startTime = Date.now()
    await fetch('http://localhost:3001/api/products?limit=12')
    const endTime = Date.now()
    const responseTime = endTime - startTime
    console.log(`   ✅ Temps de réponse API: ${responseTime}ms`)

    console.log('\n📋 Instructions pour le test manuel:')
    console.log('   1. Ouvrez http://localhost:3001 dans votre navigateur')
    console.log('   2. Vérifiez que la page d\'accueil se charge')
    console.log('   3. Vérifiez que les produits featured s\'affichent (3 produits)')
    console.log('   4. Vérifiez que les images se chargent correctement')
    console.log('   5. Cliquez sur "Voir tous les produits"')
    console.log('   6. Vérifiez que la liste des produits s\'affiche')
    console.log('   7. Testez la recherche (ex: "Nike")')
    console.log('   8. Cliquez sur un produit pour voir ses détails')
    console.log('   9. Vérifiez que les prix sont formatés correctement')
    console.log('   10. Ouvrez la console du navigateur (F12) et vérifiez qu\'il n\'y a pas d\'erreurs')

    console.log('\n🎉 Tests automatisés terminés!')
    console.log('💡 Procédez maintenant au test manuel selon les instructions ci-dessus.')

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error)
  }
}

manualUITest()
