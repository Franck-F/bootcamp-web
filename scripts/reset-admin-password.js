const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function resetAdminPassword() {
  try {
    console.log('🔧 Réinitialisation du mot de passe admin...\n')

    // Nouveau mot de passe
    const newPassword = 'admin123'
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Mettre à jour le mot de passe
    const updatedUser = await prisma.users.update({
      where: { email: 'admin@sneakersstore.fr' },
      data: {
        password_hash: hashedPassword,
        updated_at: new Date()
      }
    })

    console.log('✅ Mot de passe admin réinitialisé avec succès!')
    console.log('\n📋 Informations de connexion:')
    console.log(`   Email: ${updatedUser.email}`)
    console.log(`   Mot de passe: ${newPassword}`)
    console.log(`   URL: http://localhost:3000/auth/signin`)

    // Tester le nouveau mot de passe
    console.log('\n🧪 Test du nouveau mot de passe...')
    const isPasswordValid = await bcrypt.compare(newPassword, updatedUser.password_hash)
    
    if (isPasswordValid) {
      console.log('✅ Nouveau mot de passe valide')
    } else {
      console.log('❌ Erreur: le nouveau mot de passe n\'est pas valide')
    }

    console.log('\n🎉 Réinitialisation terminée!')

  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation:', error)
  } finally {
    await prisma.$disconnect()
  }
}

resetAdminPassword()
