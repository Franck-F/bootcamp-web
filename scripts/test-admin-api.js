const bcrypt = require('bcryptjs')

async function testAdminAPI() {
  try {
    console.log('🧪 Test de l\'API de connexion admin...\n')

    // Test de connexion avec les bonnes credentials
    const credentials = {
      email: 'admin@sneakersstore.fr',
      password: 'admin123'
    }

    console.log('📤 Test de connexion avec les credentials:')
    console.log(`   Email: ${credentials.email}`)
    console.log(`   Mot de passe: ${credentials.password}`)

    // Simuler une requête de connexion
    const response = await fetch('http://localhost:3000/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    })

    console.log(`\n📥 Réponse de l'API:`)
    console.log(`   Status: ${response.status}`)
    console.log(`   Status Text: ${response.statusText}`)

    if (response.ok) {
      const data = await response.json()
      console.log(`   Données:`, data)
      console.log('✅ Connexion réussie !')
    } else {
      const error = await response.text()
      console.log(`   Erreur: ${error}`)
      console.log('❌ Connexion échouée')
    }

    console.log('\n🔍 Vérification des variables d\'environnement:')
    console.log(`   NEXTAUTH_SECRET: ${process.env.NEXTAUTH_SECRET ? '✅ Défini' : '❌ Non défini'}`)
    console.log(`   NEXTAUTH_URL: ${process.env.NEXTAUTH_URL ? '✅ Défini' : '❌ Non défini'}`)
    console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? '✅ Défini' : '❌ Non défini'}`)

  } catch (error) {
    console.error('❌ Erreur lors du test API:', error.message)
    console.log('\n💡 Suggestions:')
    console.log('   1. Vérifiez que le serveur de développement est démarré (npm run dev)')
    console.log('   2. Vérifiez que le port 3000 est accessible')
    console.log('   3. Vérifiez les variables d\'environnement dans .env')
  }
}

testAdminAPI()
