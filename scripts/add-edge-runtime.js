const fs = require('fs');
const path = require('path');

// Liste des fichiers API à modifier
const apiFiles = [
  'src/app/api/admin/products/export/route.ts',
  'src/app/api/admin/products/import/route.ts',
  'src/app/api/admin/stock/refresh/route.ts',
  'src/app/api/admin/stock/settings/route.ts',
  'src/app/api/admin/users/route.ts',
  'src/app/api/admin/users/[id]/route.ts',
  'src/app/api/admin/users/actions/route.ts'
];

function addEdgeRuntime(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`❌ Fichier non trouvé: ${filePath}`);
      return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    
    // Vérifier si l'Edge Runtime est déjà présent
    if (content.includes("export const runtime = 'edge'")) {
      console.log(`✅ Edge Runtime déjà présent: ${filePath}`);
      return;
    }

    // Trouver la position après les imports
    const lines = content.split('\n');
    let insertIndex = 0;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ') || lines[i].startsWith("import ")) {
        insertIndex = i + 1;
      } else if (lines[i].trim() === '' && insertIndex > 0) {
        // Insérer après la dernière ligne d'import et avant la ligne vide
        break;
      }
    }

    // Insérer l'Edge Runtime
    lines.splice(insertIndex, 0, '', "export const runtime = 'edge'");
    
    const newContent = lines.join('\n');
    fs.writeFileSync(filePath, newContent, 'utf8');
    
    console.log(`✅ Edge Runtime ajouté: ${filePath}`);
  } catch (error) {
    console.error(`❌ Erreur pour ${filePath}:`, error.message);
  }
}

console.log('🚀 Ajout de l\'Edge Runtime aux routes API...\n');

apiFiles.forEach(file => {
  addEdgeRuntime(file);
});

console.log('\n🎉 Ajout de l\'Edge Runtime terminé !');
