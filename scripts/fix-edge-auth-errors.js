const fs = require('fs');
const path = require('path');

// Liste des fichiers à corriger
const filesToFix = [
  'src/app/api/admin/products/create/route.ts',
  'src/app/api/admin/products/export/route.ts',
  'src/app/api/admin/products/import/route.ts',
  'src/app/api/admin/stock/refresh/route.ts',
  'src/app/api/admin/stock/settings/route.ts',
  'src/app/api/admin/users/route.ts',
  'src/app/api/admin/users/[id]/route.ts',
  'src/app/api/admin/users/actions/route.ts'
];

function fixFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`❌ Fichier non trouvé: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Corriger les références à session qui n'existent plus
    content = content.replace(/if \(!session \|\| !session\.user\?\.email\)/g, 'if (!user)');
    content = content.replace(/if \(!session\)/g, 'if (!user)');
    
    // Supprimer les requêtes Prisma redondantes pour vérifier l'utilisateur
    content = content.replace(
      /\/\/ Vérifier que l'utilisateur est admin\s*const user = await prisma\.users\.findUnique\(\{\s*where: \{ email: user\.email \},\s*select: \{ role: true \}\s*\}\)\s*if \(!user \|\| !\['admin', 'moderator'\]\.includes\(user\.role\)\)/g,
      "if (!['admin', 'moderator'].includes(user.role))"
    );
    
    // Corriger les vérifications de rôle
    content = content.replace(
      /if \(!user \|\| !\['admin', 'moderator'\]\.includes\(user\.role\)\)/g,
      "if (!['admin', 'moderator'].includes(user.role))"
    );
    
    content = content.replace(
      /if \(!user \|\| user\.role !== 'admin'\)/g,
      "if (user.role !== 'admin')"
    );

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fichier corrigé: ${filePath}`);
  } catch (error) {
    console.error(`❌ Erreur pour ${filePath}:`, error.message);
  }
}

console.log('🚀 Correction des erreurs Edge Auth...\n');

filesToFix.forEach(file => {
  fixFile(file);
});

console.log('\n🎉 Correction terminée !');
