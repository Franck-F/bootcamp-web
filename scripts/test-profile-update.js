const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function testProfileUpdate() {
  try {
    console.log('🧪 Test de la mise à jour du profil...\n')

    // Vérifier qu'il y a des utilisateurs dans la base de données
    const users = await prisma.users.findMany({
      take: 3,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        postal_code: true,
        country: true,
        role: true,
        created_at: true
      }
    })

    console.log('👥 Utilisateurs disponibles pour les tests:')
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name} (${user.email}) - ${user.role}`)
      console.log(`      Téléphone: ${user.phone || 'Non renseigné'}`)
      console.log(`      Adresse: ${user.address || 'Non renseignée'}`)
      console.log(`      Ville: ${user.city || 'Non renseignée'}`)
      console.log(`      Code postal: ${user.postal_code || 'Non renseigné'}`)
      console.log(`      Pays: ${user.country || 'Non renseigné'}`)
      console.log('')
    })

    // Test de mise à jour d'un utilisateur
    if (users.length > 0) {
      const testUser = users[0]
      console.log(`🔄 Test de mise à jour pour ${testUser.name}...`)

      const updatedUser = await prisma.users.update({
        where: { id: testUser.id },
        data: {
          phone: '+33 6 12 34 56 78',
          address: '123 Rue de la Mode',
          city: 'Paris',
          postal_code: '75001',
          country: 'France',
          updated_at: new Date()
        }
      })

      console.log('✅ Utilisateur mis à jour avec succès:')
      console.log(`   Nom: ${updatedUser.name}`)
      console.log(`   Email: ${updatedUser.email}`)
      console.log(`   Téléphone: ${updatedUser.phone}`)
      console.log(`   Adresse: ${updatedUser.address}`)
      console.log(`   Ville: ${updatedUser.city}`)
      console.log(`   Code postal: ${updatedUser.postal_code}`)
      console.log(`   Pays: ${updatedUser.country}`)
      console.log(`   Mis à jour le: ${updatedUser.updated_at}`)
    }

    // Test de changement de mot de passe
    if (users.length > 0) {
      const testUser = users[0]
      console.log(`\n🔐 Test de changement de mot de passe pour ${testUser.name}...`)

      const newPassword = 'nouveauMotDePasse123'
      const hashedPassword = await bcrypt.hash(newPassword, 12)

      await prisma.users.update({
        where: { id: testUser.id },
        data: {
          password_hash: hashedPassword,
          updated_at: new Date()
        }
      })

      console.log('✅ Mot de passe mis à jour avec succès')
      
      // Vérifier que le nouveau mot de passe fonctionne
      const userWithNewPassword = await prisma.users.findUnique({
        where: { id: testUser.id }
      })

      const isPasswordValid = await bcrypt.compare(newPassword, userWithNewPassword.password_hash)
      console.log(`✅ Vérification du nouveau mot de passe: ${isPasswordValid ? 'Valide' : 'Invalide'}`)
    }

    console.log('\n🎉 Tests de mise à jour du profil terminés!')

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testProfileUpdate()
