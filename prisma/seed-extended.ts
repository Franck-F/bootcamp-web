import { PrismaClient, roles, order_status, payment_status } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Données étendues pour créer beaucoup plus de produits
const brands = [
  { name: 'Nike', logo_url: 'https://logos-world.net/wp-content/uploads/2020/04/Nike-Logo.png' },
  { name: 'Adidas', logo_url: 'https://logos-world.net/wp-content/uploads/2020/04/Adidas-Logo.png' },
  { name: 'Jordan', logo_url: 'https://logos-world.net/wp-content/uploads/2020/04/Jordan-Logo.png' },
  { name: 'Converse', logo_url: 'https://logos-world.net/wp-content/uploads/2020/04/Converse-Logo.png' },
  { name: 'Vans', logo_url: 'https://logos-world.net/wp-content/uploads/2020/04/Vans-Logo.png' },
  { name: 'Puma', logo_url: 'https://logos-world.net/wp-content/uploads/2020/04/Puma-Logo.png' },
  { name: 'New Balance', logo_url: 'https://logos-world.net/wp-content/uploads/2020/04/New-Balance-Logo.png' },
  { name: 'Reebok', logo_url: 'https://logos-world.net/wp-content/uploads/2020/04/Reebok-Logo.png' },
  { name: 'Asics', logo_url: 'https://logos-world.net/wp-content/uploads/2020/04/Asics-Logo.png' },
  { name: 'Under Armour', logo_url: 'https://logos-world.net/wp-content/uploads/2020/04/Under-Armour-Logo.png' }
]

const categories = [
  { name: 'Hommes', sku: 'MEN' },
  { name: 'Femmes', sku: 'WOMEN' },
  { name: 'Enfants', sku: 'CHILDREN' },
  { name: 'Unisexe', sku: 'UNISEX' },
  { name: 'Running', sku: 'RUNNING' },
  { name: 'Basketball', sku: 'BASKETBALL' },
  { name: 'Lifestyle', sku: 'LIFESTYLE' },
  { name: 'Skateboard', sku: 'SKATEBOARD' }
]

const productTemplates = [
  // Nike
  { name: 'Nike Air Max 270', basePrice: 120, brand: 'Nike', category: 'Lifestyle' },
  { name: 'Nike Air Max 90', basePrice: 110, brand: 'Nike', category: 'Lifestyle' },
  { name: 'Nike Air Force 1', basePrice: 90, brand: 'Nike', category: 'Lifestyle' },
  { name: 'Nike Dunk Low', basePrice: 100, brand: 'Nike', category: 'Lifestyle' },
  { name: 'Nike React Element 55', basePrice: 130, brand: 'Nike', category: 'Running' },
  { name: 'Nike Pegasus 38', basePrice: 120, brand: 'Nike', category: 'Running' },
  { name: 'Nike LeBron 19', basePrice: 200, brand: 'Nike', category: 'Basketball' },
  { name: 'Nike Kyrie 8', basePrice: 130, brand: 'Nike', category: 'Basketball' },
  
  // Adidas
  { name: 'Adidas Ultraboost 22', basePrice: 180, brand: 'Adidas', category: 'Running' },
  { name: 'Adidas NMD R1', basePrice: 130, brand: 'Adidas', category: 'Lifestyle' },
  { name: 'Adidas Stan Smith', basePrice: 80, brand: 'Adidas', category: 'Lifestyle' },
  { name: 'Adidas Gazelle', basePrice: 85, brand: 'Adidas', category: 'Lifestyle' },
  { name: 'Adidas Yeezy Boost 350', basePrice: 220, brand: 'Adidas', category: 'Lifestyle' },
  { name: 'Adidas Solarboost 4', basePrice: 140, brand: 'Adidas', category: 'Running' },
  { name: 'Adidas Harden Vol. 6', basePrice: 130, brand: 'Adidas', category: 'Basketball' },
  { name: 'Adidas Dame 8', basePrice: 110, brand: 'Adidas', category: 'Basketball' },
  
  // Jordan
  { name: 'Air Jordan 1 Retro High OG', basePrice: 150, brand: 'Jordan', category: 'Basketball' },
  { name: 'Air Jordan 4 Retro', basePrice: 200, brand: 'Jordan', category: 'Basketball' },
  { name: 'Air Jordan 11 Retro', basePrice: 220, brand: 'Jordan', category: 'Basketball' },
  { name: 'Air Jordan 3 Retro', basePrice: 190, brand: 'Jordan', category: 'Basketball' },
  { name: 'Air Jordan 5 Retro', basePrice: 200, brand: 'Jordan', category: 'Basketball' },
  { name: 'Air Jordan 6 Retro', basePrice: 200, brand: 'Jordan', category: 'Basketball' },
  
  // Converse
  { name: 'Converse Chuck Taylor All Star', basePrice: 65, brand: 'Converse', category: 'Lifestyle' },
  { name: 'Converse Chuck 70', basePrice: 85, brand: 'Converse', category: 'Lifestyle' },
  { name: 'Converse One Star', basePrice: 70, brand: 'Converse', category: 'Lifestyle' },
  { name: 'Converse Jack Purcell', basePrice: 75, brand: 'Converse', category: 'Lifestyle' },
  
  // Vans
  { name: 'Vans Old Skool', basePrice: 60, brand: 'Vans', category: 'Skateboard' },
  { name: 'Vans Sk8-Hi', basePrice: 70, brand: 'Vans', category: 'Skateboard' },
  { name: 'Vans Authentic', basePrice: 55, brand: 'Vans', category: 'Skateboard' },
  { name: 'Vans Era', basePrice: 60, brand: 'Vans', category: 'Skateboard' },
  { name: 'Vans Slip-On', basePrice: 60, brand: 'Vans', category: 'Skateboard' },
  
  // Puma
  { name: 'Puma Suede Classic', basePrice: 70, brand: 'Puma', category: 'Lifestyle' },
  { name: 'Puma RS-X', basePrice: 100, brand: 'Puma', category: 'Lifestyle' },
  { name: 'Puma Thunder', basePrice: 90, brand: 'Puma', category: 'Lifestyle' },
  { name: 'Puma Cali', basePrice: 80, brand: 'Puma', category: 'Lifestyle' },
  
  // New Balance
  { name: 'New Balance 574', basePrice: 80, brand: 'New Balance', category: 'Lifestyle' },
  { name: 'New Balance 990v5', basePrice: 180, brand: 'New Balance', category: 'Running' },
  { name: 'New Balance 327', basePrice: 90, brand: 'New Balance', category: 'Lifestyle' },
  { name: 'New Balance 530', basePrice: 85, brand: 'New Balance', category: 'Lifestyle' },
  
  // Reebok
  { name: 'Reebok Classic Leather', basePrice: 75, brand: 'Reebok', category: 'Lifestyle' },
  { name: 'Reebok Club C 85', basePrice: 70, brand: 'Reebok', category: 'Lifestyle' },
  { name: 'Reebok Instapump Fury', basePrice: 120, brand: 'Reebok', category: 'Lifestyle' },
  
  // Asics
  { name: 'Asics Gel-Kayano 28', basePrice: 160, brand: 'Asics', category: 'Running' },
  { name: 'Asics Gel-Nimbus 24', basePrice: 150, brand: 'Asics', category: 'Running' },
  { name: 'Asics Gel-Lyte III', basePrice: 100, brand: 'Asics', category: 'Lifestyle' },
  
  // Under Armour
  { name: 'Under Armour Curry 9', basePrice: 130, brand: 'Under Armour', category: 'Basketball' },
  { name: 'Under Armour HOVR Phantom', basePrice: 120, brand: 'Under Armour', category: 'Running' }
]

const colors = ['Noir', 'Blanc', 'Rouge', 'Bleu', 'Vert', 'Jaune', 'Rose', 'Gris', 'Beige', 'Marron']
const sizes = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47']

async function main() {
  console.log('🌱 Début du seeding étendu...')

  // Créer les marques
  const createdBrands = []
  for (const brandData of brands) {
    const brand = await prisma.brands.upsert({
      where: { name: brandData.name },
      update: {},
      create: brandData,
    })
    createdBrands.push(brand)
  }
  console.log(`✅ ${createdBrands.length} marques créées`)

  // Créer les catégories
  const createdCategories = []
  for (const categoryData of categories) {
    const category = await prisma.categories.upsert({
      where: { name: categoryData.name },
      update: {},
      create: categoryData,
    })
    createdCategories.push(category)
  }
  console.log(`✅ ${createdCategories.length} catégories créées`)

  // Créer les utilisateurs
  const hashedPassword = await bcrypt.hash('password123', 12)

  const admin = await prisma.users.upsert({
    where: { email: 'admin@sneakersstore.fr' },
    update: {},
    create: {
      email: 'admin@sneakersstore.fr',
      name: 'Administrateur',
      password_hash: hashedPassword,
      role: roles.admin,
      email_verified: true,
      updated_at: new Date(),
    },
  })

  const customer = await prisma.users.upsert({
    where: { email: 'client@sneakersstore.fr' },
    update: {},
    create: {
      email: 'client@sneakersstore.fr',
      name: 'Client Test',
      password_hash: hashedPassword,
      role: roles.customer,
      email_verified: true,
      updated_at: new Date(),
    },
  })
  console.log('✅ Utilisateurs créés')

  // Créer beaucoup de produits
  let productCount = 0
  for (const template of productTemplates) {
    const brand = createdBrands.find(b => b.name === template.brand)
    const category = createdCategories.find(c => c.name === template.category)
    
    if (!brand || !category) continue

    // Créer plusieurs variantes de chaque produit (différentes couleurs)
    for (let colorIndex = 0; colorIndex < Math.min(3, colors.length); colorIndex++) {
      const color = colors[colorIndex]
      const price = template.basePrice + (Math.random() * 20 - 10) // Variation de prix ±10€
      const isNew = Math.random() < 0.2 // 20% de chance d'être nouveau
      const onSale = Math.random() < 0.15 // 15% de chance d'être en solde
      const featured = Math.random() < 0.1 // 10% de chance d'être en vedette
      
      const product = await prisma.products.create({
        data: {
          name: `${template.name} ${color}`,
          description: `La ${template.name} en couleur ${color.toLowerCase()}, parfaite pour votre style.`,
          price: price,
          sku: `${template.name.replace(/\s+/g, '-').toUpperCase()}-${color.toUpperCase()}-${Date.now()}`,
          brand_id: brand.id,
          category_id: category.id,
          featured: featured,
          isNew: isNew,
          onSale: onSale,
          originalPrice: onSale ? price * 1.2 : null,
        },
      })

      // Ajouter des images
      await prisma.product_images.createMany({
        data: [
          {
            product_id: product.id,
            image_url: `https://images.unsplash.com/photo-${1549298916 + productCount}?w=800`,
            alt_text: product.name,
            is_primary: true,
            display_order: 1,
          },
          {
            product_id: product.id,
            image_url: `https://images.unsplash.com/photo-${1551107696 + productCount}?w=800`,
            alt_text: `${product.name} - Vue 2`,
            is_primary: false,
            display_order: 2,
          },
        ],
      })

      // Créer des variantes (tailles)
      for (const size of sizes) {
        await prisma.variants.create({
          data: {
            product_id: product.id,
            size: size,
            color: color,
            price: price,
            stock: Math.floor(Math.random() * 25) + 5, // 5-30 unités
          },
        })
      }

      productCount++
      if (productCount % 50 === 0) {
        console.log(`📦 ${productCount} produits créés...`)
      }
    }
  }

  console.log(`✅ ${productCount} produits créés avec leurs variantes`)

  console.log('🎉 Seeding étendu terminé avec succès !')
  console.log('\n📋 Comptes créés :')
  console.log('👑 Admin: admin@sneakersstore.fr / password123')
  console.log('👤 Client: client@sneakersstore.fr / password123')
  console.log(`\n📊 Statistiques :`)
  console.log(`- ${createdBrands.length} marques`)
  console.log(`- ${createdCategories.length} catégories`)
  console.log(`- ${productCount} produits`)
  console.log(`- ${productCount * sizes.length} variantes`)
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
