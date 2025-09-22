async function testAPI() {
  try {
    const response = await fetch('http://localhost:3001/api/products?featured=true&limit=3')
    const data = await response.json()
    
    console.log('Produits featured trouvés:', data.products.length)
    data.products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - Featured: ${product.featured}`)
      console.log(`   Brand: ${product.brand?.name || 'N/A'}`)
      console.log(`   Category: ${product.category?.name || 'N/A'}`)
      console.log(`   Images: ${product.images?.length || 0}`)
      console.log(`   Variants: ${product.variants?.length || 0}`)
    })
  } catch (error) {
    console.error('Erreur:', error)
  }
}

testAPI()
