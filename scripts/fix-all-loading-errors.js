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

function fixLoadingErrors(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Remplacer toutes les occurrences de loading: par status:
    if (content.includes('loading:')) {
      content = content.replace(/loading:/g, 'status:');
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Erreurs loading corrigées: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Erreur pour ${filePath}:`, error.message);
  }
}

console.log('🚀 Correction de toutes les erreurs loading...\n');

const allFiles = findFiles('src');
console.log(`📁 ${allFiles.length} fichiers trouvés\n`);

let fixedCount = 0;
allFiles.forEach(file => {
  const originalContent = fs.readFileSync(file, 'utf8');
  fixLoadingErrors(file);
  const newContent = fs.readFileSync(file, 'utf8');
  if (originalContent !== newContent) {
    fixedCount++;
  }
});

console.log(`\n🎉 Correction terminée ! ${fixedCount} fichiers modifiés.`);

