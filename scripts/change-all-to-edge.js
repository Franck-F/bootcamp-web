const fs = require('fs');
const path = require('path');

// Liste des fichiers API admin à modifier
const adminApiFiles = [
  'src/app/api/admin/products/create/route.ts',
  'src/app/api/admin/products/export/route.ts',
  'src/app/api/admin/products/import/route.ts',
  'src/app/api/admin/stock/refresh/route.ts',
  'src/app/api/admin/stock/settings/route.ts',
  'src/app/api/admin/users/route.ts',
  'src/app/api/admin/users/[id]/route.ts',
  'src/app/api/admin/users/actions/route.ts'
];

function changeToEdgeRuntime(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`❌ Fichier non trouvé: ${filePath}`);
      return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    
    // Remplacer 'nodejs' par 'edge'
    const newContent = content.replace("export const runtime = 'nodejs'", "export const runtime = 'edge'");
    
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ Runtime changé vers edge: ${filePath}`);
    } else {
      console.log(`⚠️ Aucun changement nécessaire: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Erreur pour ${filePath}:`, error.message);
  }
}

console.log('🚀 Changement du runtime vers edge pour toutes les routes admin...\n');

adminApiFiles.forEach(file => {
  changeToEdgeRuntime(file);
});

console.log('\n🎉 Changement du runtime terminé !');
