const fs = require('fs');
const path = require('path');

// Liste des fichiers à convertir
const filesToConvert = [
  'src/app/api/cart/route.ts',
  'src/app/api/orders/route.ts',
  'src/app/api/orders/[id]/route.ts',
  'src/app/api/wishlist/route.ts',
  'src/app/api/wishlist/[productId]/route.ts',
  'src/app/api/stock/route.ts',
  'src/app/api/payment/route.ts',
  'src/app/api/products/route.ts',
  'src/app/api/products/[id]/route.ts',
  'src/app/api/admin/products/create/route.ts',
  'src/app/api/admin/products/export/route.ts',
  'src/app/api/admin/products/import/route.ts',
  'src/app/api/admin/stock/refresh/route.ts',
  'src/app/api/admin/stock/settings/route.ts',
  'src/app/api/admin/users/route.ts',
  'src/app/api/admin/users/[id]/route.ts',
  'src/app/api/admin/users/actions/route.ts'
];

function convertFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`❌ Fichier non trouvé: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remplacer les imports NextAuth
    content = content.replace(
      /import { getServerSession } from 'next-auth'\nimport { authOptions } from '\/@\/lib\/auth'\n/g,
      "import { getUserFromRequest } from '@/lib/edge-auth'\n"
    );
    
    content = content.replace(
      /import { getServerSession } from 'next-auth\/next'\nimport { authOptions } from '\/@\/lib\/auth'\n/g,
      "import { getUserFromRequest } from '@/lib/edge-auth'\n"
    );

    // Remplacer getServerSession par getUserFromRequest
    content = content.replace(
      /const session = await getServerSession\(authOptions\)/g,
      'const user = await getUserFromRequest(request)'
    );

    // Remplacer les vérifications de session
    content = content.replace(
      /if \(!session\?\.user\)/g,
      'if (!user)'
    );

    content = content.replace(
      /if \(!session\)/g,
      'if (!user)'
    );

    // Remplacer les accès aux propriétés utilisateur
    content = content.replace(
      /session\.user\.id/g,
      'user.id'
    );

    content = content.replace(
      /session\.user\.role/g,
      'user.role'
    );

    content = content.replace(
      /session\.user\.email/g,
      'user.email'
    );

    // Remplacer parseInt(session.user.id) par parseInt(user.id)
    content = content.replace(
      /parseInt\(session\.user\.id\)/g,
      'parseInt(user.id)'
    );

    // Remplacer les vérifications de rôle
    content = content.replace(
      /!\['admin', 'moderator'\]\.includes\(session\.user\.role\)/g,
      "!['admin', 'moderator'].includes(user.role)"
    );

    content = content.replace(
      /session\.user\.role !== 'admin'/g,
      "user.role !== 'admin'"
    );

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fichier converti: ${filePath}`);
  } catch (error) {
    console.error(`❌ Erreur pour ${filePath}:`, error.message);
  }
}

console.log('🚀 Conversion vers Edge Auth...\n');

filesToConvert.forEach(file => {
  convertFile(file);
});

console.log('\n🎉 Conversion terminée !');
