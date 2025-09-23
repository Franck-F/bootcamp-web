const fs = require('fs');
const path = require('path');

// Liste des fichiers à corriger
const filesToFix = [
  'src/app/api/admin/products/export/route.ts',
  'src/app/api/admin/products/import/route.ts',
  'src/app/api/admin/stock/refresh/route.ts',
  'src/app/api/admin/stock/settings/route.ts',
  'src/app/api/admin/users/route.ts',
  'src/app/api/admin/users/[id]/route.ts',
  'src/app/api/admin/users/actions/route.ts'
];

function fixImports(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`❌ Fichier non trouvé: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remplacer les imports NextAuth par edge-auth
    content = content.replace(
      /import { getServerSession } from 'next-auth'\nimport { authOptions } from '\/@\/lib\/auth'\n/g,
      "import { getUserFromRequest } from '@/lib/edge-auth'\n"
    );
    
    content = content.replace(
      /import { getServerSession } from 'next-auth\/next'\nimport { authOptions } from '\/@\/lib\/auth'\n/g,
      "import { getUserFromRequest } from '@/lib/edge-auth'\n"
    );

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Imports corrigés: ${filePath}`);
  } catch (error) {
    console.error(`❌ Erreur pour ${filePath}:`, error.message);
  }
}

console.log('🚀 Correction des imports...\n');

filesToFix.forEach(file => {
  fixImports(file);
});

console.log('\n🎉 Correction des imports terminée !');
