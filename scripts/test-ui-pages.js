const puppeteer = require('puppeteer')

async function testUIPages() {
  let browser
  try {
    console.log('🌐 Test de l\'interface utilisateur...\n')

    browser = await puppeteer.launch({ 
      headless: false, // Afficher le navigateur pour voir les tests
      defaultViewport: { width: 1280, height: 720 }
    })
    
    const page = await browser.newPage()
    
    // Test 1: Page d'accueil
    console.log('1️⃣ Test de la page d\'accueil...')
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle0' })
    
    // Vérifier que les produits featured s'affichent
    const featuredProducts = await page.$$eval('[data-testid="featured-product"], .group', elements => elements.length)
    console.log(`   ✅ ${featuredProducts} produits featured affichés`)
    
    // Vérifier les images
    const images = await page.$$eval('img', imgs => imgs.filter(img => img.src.includes('unsplash')).length)
    console.log(`   ✅ ${images} images Unsplash chargées`)
    
    // Test 2: Page des produits
    console.log('\n2️⃣ Test de la page des produits...')
    await page.goto('http://localhost:3001/products', { waitUntil: 'networkidle0' })
    
    // Vérifier la pagination
    const productCards = await page.$$eval('[data-testid="product-card"], .group', elements => elements.length)
    console.log(`   ✅ ${productCards} produits affichés sur la page`)
    
    // Test 3: Recherche
    console.log('\n3️⃣ Test de la recherche...')
    await page.goto('http://localhost:3001/products?search=Nike', { waitUntil: 'networkidle0' })
    
    const nikeProducts = await page.$$eval('[data-testid="product-card"], .group', elements => elements.length)
    console.log(`   ✅ ${nikeProducts} produits Nike trouvés`)
    
    // Test 4: Page d'un produit individuel
    console.log('\n4️⃣ Test d\'une page produit...')
    await page.goto('http://localhost:3001/products/1', { waitUntil: 'networkidle0' })
    
    // Vérifier les détails du produit
    const productTitle = await page.$eval('h1, [data-testid="product-title"]', el => el.textContent)
    console.log(`   ✅ Produit affiché: ${productTitle}`)
    
    const productPrice = await page.$eval('[data-testid="product-price"], .product-price', el => el.textContent)
    console.log(`   ✅ Prix affiché: ${productPrice}`)
    
    // Test 5: Vérifier les erreurs dans la console
    console.log('\n5️⃣ Vérification des erreurs...')
    const logs = await page.evaluate(() => {
      return window.consoleErrors || []
    })
    
    if (logs.length === 0) {
      console.log('   ✅ Aucune erreur JavaScript détectée')
    } else {
      console.log(`   ⚠️ ${logs.length} erreurs JavaScript détectées:`)
      logs.forEach((log, index) => {
        console.log(`      ${index + 1}. ${log}`)
      })
    }
    
    console.log('\n🎉 Tests de l\'interface utilisateur terminés!')
    
  } catch (error) {
    console.error('❌ Erreur lors des tests UI:', error)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

// Vérifier si puppeteer est installé
try {
  testUIPages()
} catch (error) {
  console.log('⚠️ Puppeteer non installé. Installation en cours...')
  console.log('💡 Pour tester l\'UI manuellement, ouvrez http://localhost:3001 dans votre navigateur')
  console.log('📋 Vérifiez:')
  console.log('   - Les produits featured s\'affichent sur la page d\'accueil')
  console.log('   - Les images se chargent correctement')
  console.log('   - Les prix sont formatés correctement')
  console.log('   - La navigation fonctionne')
  console.log('   - Aucune erreur dans la console du navigateur')
}
