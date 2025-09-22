const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Images de remplacement valides pour les sneakers
const validSneakerImages = [
  'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500&h=500&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&h=500&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=500&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&h=500&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500&h=500&fit=crop&crop=center'
]

// URLs d'images cassées à remplacer
const brokenImageUrls = [
  'https://images.unsplash.com/photo-1612902377771-67358c0a0d3c?w=500&h=500&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1612902376491-1a51ba138b15?w=500&h=500&fit=crop&crop=center'
]

async function fixBrokenImages() {
  try {
    console.log('🔧 Correction des images cassées...\n')

    let totalFixed = 0

    // Récupérer toutes les images cassées
    for (const brokenUrl of brokenImageUrls) {
      const brokenImages = await prisma.product_images.findMany({
        where: {
          image_url: brokenUrl
        }
      })

      console.log(`📸 Trouvé ${brokenImages.length} images avec l'URL cassée: ${brokenUrl}`)

      // Remplacer chaque image cassée par une image valide
      for (const image of brokenImages) {
        const randomValidImage = validSneakerImages[Math.floor(Math.random() * validSneakerImages.length)]
        
        await prisma.product_images.update({
          where: { id: image.id },
          data: { image_url: randomValidImage }
        })

        totalFixed++
        console.log(`  ✅ Image ID ${image.id} mise à jour vers: ${randomValidImage}`)
      }
    }

    console.log(`\n🎉 Correction terminée! ${totalFixed} images corrigées.`)

    // Vérifier les résultats
    console.log('\n📊 Vérification des résultats:')
    const sampleProducts = await prisma.products.findMany({
      take: 3,
      include: {
        product_images: true,
        brands: true
      }
    })

    sampleProducts.forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.name} (${product.brands.name})`)
      product.product_images.forEach((img, i) => {
        console.log(`   Image ${i + 1}: ${img.image_url}`)
      })
    })

  } catch (error) {
    console.error('❌ Erreur lors de la correction:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixBrokenImages()
