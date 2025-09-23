const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function checkAdminUsers() {
  try {
    console.log('🔍 Vérification des utilisateurs admin...\n')

    // Vérifier les utilisateurs admin existants
    const adminUsers = await prisma.users.findMany({
      where: { role: 'admin' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        is_active: true,
        created_at: true
      }
    })

    console.log('👑 Utilisateurs admin trouvés:')
    if (adminUsers.length === 0) {
      console.log('   ❌ Aucun utilisateur admin trouvé')
    } else {
      adminUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.name} (${user.email}) - ${user.role}`)
        console.log(`      Actif: ${user.is_active ? 'Oui' : 'Non'}`)
        console.log(`      Créé le: ${user.created_at}`)
        console.log('')
      })
    }

    // Vérifier tous les utilisateurs
    const allUsers = await prisma.users.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        is_active: true
      }
    })

    console.log('👥 Tous les utilisateurs:')
    allUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name} (${user.email}) - ${user.role} - ${user.is_active ? 'Actif' : 'Inactif'}`)
    })

    // Créer un utilisateur admin de test si nécessaire
    if (adminUsers.length === 0) {
      console.log('\n🔧 Création d\'un utilisateur admin de test...')
      
      const hashedPassword = await bcrypt.hash('admin123', 12)
      
      const newAdmin = await prisma.users.create({
        data: {
          email: 'admin@sneakersstore.fr',
          password_hash: hashedPassword,
          name: 'Administrateur',
          role: 'admin',
          is_active: true,
          email_verified: true,
          updated_at: new Date()
        }
      })

      console.log('✅ Utilisateur admin créé:')
      console.log(`   Email: ${newAdmin.email}`)
      console.log(`   Mot de passe: admin123`)
      console.log(`   Nom: ${newAdmin.name}`)
      console.log(`   Rôle: ${newAdmin.role}`)
    }

  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkAdminUsers()
