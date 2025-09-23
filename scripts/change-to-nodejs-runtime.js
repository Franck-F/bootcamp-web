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

function changeToNodejsRuntime(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`❌ Fichier non trouvé: ${filePath}`);
      return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    
    // Remplacer 'edge' par 'nodejs'
    const newContent = content.replace("export const runtime = 'edge'", "export const runtime = 'nodejs'");
    
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ Runtime changé vers nodejs: ${filePath}`);
    } else {
      console.log(`⚠️ Aucun changement nécessaire: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Erreur pour ${filePath}:`, error.message);
  }
}

console.log('🚀 Changement du runtime vers nodejs pour les routes admin...\n');

adminApiFiles.forEach(file => {
  changeToNodejsRuntime(file);
});

console.log('\n🎉 Changement du runtime terminé !');
