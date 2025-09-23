const fs = require('fs');
const path = require('path');

// Fonction pour trouver tous les fichiers .tsx et .ts
function findFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      findFiles(fullPath, files);
    } else if ((item.endsWith('.tsx') || item.endsWith('.ts')) && !item.includes('node_modules')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function updateAuthImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Remplacer l'import useAuth
    if (content.includes("import { useAuth } from '@/hooks/use-auth'")) {
      content = content.replace(
        "import { useAuth } from '@/hooks/use-auth'",
        "import { useAuth } from '@/components/auth-provider'"
      );
      modified = true;
    }
    
    if (content.includes("import { useSession } from '@/hooks/use-auth'")) {
      content = content.replace(
        "import { useSession } from '@/hooks/use-auth'",
        "import { useSession } from '@/components/auth-provider'"
      );
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Imports mis à jour: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Erreur pour ${filePath}:`, error.message);
  }
}

console.log('🚀 Mise à jour des imports auth...\n');

const allFiles = findFiles('src');
console.log(`📁 ${allFiles.length} fichiers trouvés\n`);

let updatedCount = 0;
allFiles.forEach(file => {
  const originalContent = fs.readFileSync(file, 'utf8');
  updateAuthImports(file);
  const newContent = fs.readFileSync(file, 'utf8');
  if (originalContent !== newContent) {
    updatedCount++;
  }
});

console.log(`\n🎉 Mise à jour terminée ! ${updatedCount} fichiers modifiés.`);
