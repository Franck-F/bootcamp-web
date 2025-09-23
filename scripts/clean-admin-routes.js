const fs = require('fs');
const path = require('path');

// Liste des fichiers à nettoyer
const filesToClean = [
  'src/app/api/admin/products/create/route.ts',
  'src/app/api/admin/products/export/route.ts',
  'src/app/api/admin/products/import/route.ts',
  'src/app/api/admin/stock/refresh/route.ts',
  'src/app/api/admin/stock/settings/route.ts',
  'src/app/api/admin/users/route.ts',
  'src/app/api/admin/users/[id]/route.ts',
  'src/app/api/admin/users/actions/route.ts'
];

function cleanFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`❌ Fichier non trouvé: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Supprimer complètement les requêtes Prisma redondantes pour vérifier l'utilisateur
    content = content.replace(
      /\/\/ Vérifier que l'utilisateur est admin\s*const user = await prisma\.users\.findUnique\(\{\s*where: \{ email: user\.email \},\s*select: \{ role: true \}\s*\}\)\s*/g,
      ''
    );
    
    // Supprimer les requêtes Prisma similaires
    content = content.replace(
      /const user = await prisma\.users\.findUnique\(\{\s*where: \{ email: user\.email \},\s*select: \{ role: true \}\s*\}\)\s*/g,
      ''
    );
    
    // Supprimer les vérifications de rôle redondantes
    content = content.replace(
      /if \(!user \|\| !\['admin', 'moderator'\]\.includes\(user\.role\)\)\s*\{\s*return NextResponse\.json\(\{ error: 'Accès non autorisé' \}, \{ status: 403 \}\)\s*\}\s*/g,
      "if (!['admin', 'moderator'].includes(user.role)) {\n    return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 })\n  }"
    );
    
    content = content.replace(
      /if \(!user \|\| user\.role !== 'admin'\)\s*\{\s*return NextResponse\.json\(\{ error: 'Accès non autorisé' \}, \{ status: 403 \}\)\s*\}\s*/g,
      "if (user.role !== 'admin') {\n    return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 })\n  }"
    );

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fichier nettoyé: ${filePath}`);
  } catch (error) {
    console.error(`❌ Erreur pour ${filePath}:`, error.message);
  }
}

console.log('🚀 Nettoyage des routes admin...\n');

filesToClean.forEach(file => {
  cleanFile(file);
});

console.log('\n🎉 Nettoyage terminé !');
