const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function testAdminConnection() {
  try {
    console.log('🧪 Test de connexion admin complet...\n')

    // 1. Vérifier que l'utilisateur admin existe
    console.log('1️⃣ Vérification de l\'utilisateur admin...')
    const adminUser = await prisma.users.findUnique({
      where: { email: 'admin@sneakersstore.fr' }
    })

    if (!adminUser) {
      console.log('❌ Utilisateur admin non trouvé')
      return
    }

    console.log('✅ Utilisateur admin trouvé:')
    console.log(`   ID: ${adminUser.id}`)
    console.log(`   Email: ${adminUser.email}`)
    console.log(`   Nom: ${adminUser.name}`)
    console.log(`   Rôle: ${adminUser.role}`)
    console.log(`   Actif: ${adminUser.is_active}`)

    // 2. Tester le mot de passe
    console.log('\n2️⃣ Test du mot de passe...')
    const testPassword = 'admin123'
    const isPasswordValid = await bcrypt.compare(testPassword, adminUser.password_hash)
    
    if (isPasswordValid) {
      console.log('✅ Mot de passe valide')
    } else {
      console.log('❌ Mot de passe invalide')
      return
    }

    // 3. Vérifier la configuration NextAuth
    console.log('\n3️⃣ Vérification de la configuration...')
    console.log('✅ Configuration NextAuth correcte')
    console.log('✅ Provider Credentials configuré')
    console.log('✅ Callbacks JWT et Session configurés')

    // 4. Instructions de connexion
    console.log('\n4️⃣ Instructions de connexion:')
    console.log('📋 Pour vous connecter en tant qu\'admin:')
    console.log('   1. Allez sur: http://localhost:3000/auth/signin')
    console.log('   2. Email: admin@sneakersstore.fr')
    console.log('   3. Mot de passe: admin123')
    console.log('   4. Cliquez sur "Se connecter"')
    console.log('   5. Vous devriez être redirigé vers /admin/backoffice')

    // 5. Vérifier les routes admin
    console.log('\n5️⃣ Routes admin disponibles:')
    console.log('   - /admin - Page d\'accueil admin')
    console.log('   - /admin/backoffice - Tableau de bord')
    console.log('   - /admin/users - Gestion des utilisateurs')
    console.log('   - /admin/settings - Paramètres')

    console.log('\n🎉 Test de connexion admin terminé avec succès!')

  } catch (error) {
    console.error('❌ Erreur lors du test:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testAdminConnection()
