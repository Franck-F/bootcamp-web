const bcrypt = require('bcryptjs')

async function testAdminLogin() {
  try {
    console.log('🧪 Test de connexion admin...\n')

    // Test du hachage du mot de passe
    const testPassword = 'admin123'
    const hashedPassword = await bcrypt.hash(testPassword, 12)
    
    console.log('🔐 Test de hachage du mot de passe:')
    console.log(`   Mot de passe original: ${testPassword}`)
    console.log(`   Mot de passe haché: ${hashedPassword}`)
    
    // Test de vérification
    const isValid = await bcrypt.compare(testPassword, hashedPassword)
    console.log(`   Vérification: ${isValid ? '✅ Valide' : '❌ Invalide'}`)

    // Test avec différents mots de passe
    const testPasswords = ['admin123', 'admin', 'password', '123456']
    
    console.log('\n🔍 Test avec différents mots de passe:')
    for (const password of testPasswords) {
      const isValid = await bcrypt.compare(password, hashedPassword)
      console.log(`   "${password}": ${isValid ? '✅ Valide' : '❌ Invalide'}`)
    }

    console.log('\n📋 Informations de connexion admin:')
    console.log('   Email: admin@sneakersstore.fr')
    console.log('   Mot de passe: admin123')
    console.log('   URL de connexion: http://localhost:3000/auth/signin')

  } catch (error) {
    console.error('❌ Erreur lors du test:', error)
  }
}

testAdminLogin()
