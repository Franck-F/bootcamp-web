import { PrismaClient, roles, order_status, payment_status } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Début du seeding...')

  // Créer les marques
  const nike = await prisma.brands.upsert({
    where: { name: 'Nike' },
    update: {},
    create: { 
      name: 'Nike',
      logo_url: 'https://logos-world.net/wp-content/uploads/2020/04/Nike-Logo.png'
    },
  })

  const adidas = await prisma.brands.upsert({
    where: { name: 'Adidas' },
    update: {},
    create: { 
      name: 'Adidas',
      logo_url: 'https://logos-world.net/wp-content/uploads/2020/04/Adidas-Logo.png'
    },
  })

  const jordan = await prisma.brands.upsert({
    where: { name: 'Jordan' },
    update: {},
    create: { 
      name: 'Jordan',
      logo_url: 'https://logos-world.net/wp-content/uploads/2020/04/Jordan-Logo.png'
    },
  })

  const converse = await prisma.brands.upsert({
    where: { name: 'Converse' },
    update: {},
    create: { 
      name: 'Converse',
      logo_url: 'https://logos-world.net/wp-content/uploads/2020/04/Converse-Logo.png'
    },
  })

  console.log('✅ Marques créées')

  // Créer les catégories
  const menCategory = await prisma.categories.upsert({
    where: { name: 'Hommes' },
    update: {},
    create: { name: 'Hommes', sku: 'MEN' },
  })

  const womenCategory = await prisma.categories.upsert({
    where: { name: 'Femmes' },
    update: {},
    create: { name: 'Femmes', sku: 'WOMEN' },
  })

  const childrenCategory = await prisma.categories.upsert({
    where: { name: 'Enfants' },
    update: {},
    create: { name: 'Enfants', sku: 'CHILDREN' },
  })

  const unisexCategory = await prisma.categories.upsert({
    where: { name: 'Unisexe' },
    update: {},
    create: { name: 'Unisexe', sku: 'UNISEX' },
  })

  console.log('✅ Catégories créées')

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

  const moderator = await prisma.users.upsert({
    where: { email: 'moderator@sneakersstore.fr' },
    update: {},
    create: {
      email: 'moderator@sneakersstore.fr',
      name: 'Modérateur',
      password_hash: hashedPassword,
      role: roles.moderator,
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

  // Créer les produits
  const products = [
    {
      name: 'Air Jordan 1 Retro High OG',
      description: 'La Air Jordan 1 Retro High OG reprend le design iconique de 1985 avec des matériaux premium et une construction authentique.',
      price: 150.00,
      sku: 'AJ1-RETRO-HIGH',
      brand_id: jordan.id,
      category_id: menCategory.id,
      featured: true,
      isNew: false,
      onSale: false,
    },
    {
      name: 'Nike Air Max 270',
      description: 'La Nike Air Max 270 offre un confort maximal avec sa semelle Air Max visible et son design moderne.',
      price: 120.00,
      sku: 'AM270-WHITE',
      brand_id: nike.id,
      category_id: womenCategory.id,
      featured: true,
      isNew: true,
      onSale: false,
    },
    {
      name: 'Adidas Ultraboost 22',
      description: 'La Adidas Ultraboost 22 combine performance et style avec sa technologie Boost et son design épuré.',
      price: 180.00,
      sku: 'UB22-BLACK',
      brand_id: adidas.id,
      category_id: unisexCategory.id,
      featured: false,
      isNew: false,
      onSale: true,
      originalPrice: 200.00,
    },
    {
      name: 'Converse Chuck Taylor All Star',
      description: 'Le classique intemporel Converse Chuck Taylor All Star, parfait pour tous les styles.',
      price: 65.00,
      sku: 'CHUCK-TAYLOR',
      brand_id: converse.id,
      category_id: childrenCategory.id,
      featured: false,
      isNew: false,
      onSale: false,
    },
  ]

  const createdProducts = []
  for (const productData of products) {
    const product = await prisma.products.upsert({
      where: { sku: productData.sku },
      update: {},
      create: productData,
    })
    createdProducts.push(product)

    // Ajouter des images
    await prisma.product_images.createMany({
      data: [
        {
          product_id: product.id,
          image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800',
          alt_text: product.name,
          is_primary: true,
          display_order: 1,
        },
        {
          product_id: product.id,
          image_url: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800',
          alt_text: `${product.name} - Vue 2`,
          is_primary: false,
          display_order: 2,
        },
      ],
    })

    // Créer des variantes (tailles)
    const sizes = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45']
    for (const size of sizes) {
      await prisma.variants.create({
        data: {
          product_id: product.id,
          size: size,
          color: 'Noir',
          price: product.price,
          stock: Math.floor(Math.random() * 20) + 5, // 5-25 unités
        },
      })
    }
  }

  console.log('✅ Produits et variantes créés')

  // Créer quelques commandes d'exemple
  const order1 = await prisma.orders.create({
    data: {
      order_number: `CMD-${new Date().getFullYear()}001-ABC123`,
      user_id: customer.id,
      status: order_status.delivered,
      payment_status: payment_status.pending,
      total_amount: 215.00,
      shipping_address: JSON.stringify({
        firstName: 'Jean',
        lastName: 'Dupont',
        address1: '123 Rue de la Paix',
        city: 'Paris',
        postalCode: '75001',
        country: 'France',
        phone: '01 23 45 67 89',
      }),
      payment_method: 'card',
      updated_at: new Date(),
    },
  })

  const order2 = await prisma.orders.create({
    data: {
      order_number: `CMD-${new Date().getFullYear()}002-DEF456`,
      user_id: customer.id,
      status: order_status.pending,
      payment_status: payment_status.pending,
      total_amount: 120.00,
      shipping_address: JSON.stringify({
        firstName: 'Jean',
        lastName: 'Dupont',
        address1: '123 Rue de la Paix',
        city: 'Paris',
        postalCode: '75001',
        country: 'France',
        phone: '01 23 45 67 89',
      }),
      payment_method: 'paypal',
      updated_at: new Date(),
    },
  })

  // Créer les items de commande
  const variant1 = await prisma.variants.findFirst({
    where: { product_id: createdProducts[0].id, size: '42' },
  })

  const variant2 = await prisma.variants.findFirst({
    where: { product_id: createdProducts[1].id, size: '38' },
  })

  if (variant1) {
    await prisma.order_items.create({
      data: {
        order_id: order1.id,
        product_variant_id: variant1.id,
        quantity: 1,
        unit_price: 150.00,
      },
    })
  }

  if (variant2) {
    await prisma.order_items.create({
      data: {
        order_id: order2.id,
        product_variant_id: variant2.id,
        quantity: 1,
        unit_price: 120.00,
      },
    })
  }

  console.log('✅ Commandes créées')

  console.log('🎉 Seeding terminé avec succès !')
  console.log('\n📋 Comptes créés :')
  console.log('👑 Admin: admin@sneakersstore.fr / password123')
  console.log('👨‍💼 Modérateur: moderator@sneakersstore.fr / password123')
  console.log('👤 Client: client@sneakersstore.fr / password123')
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })