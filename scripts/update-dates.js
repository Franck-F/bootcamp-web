#!/usr/bin/env node

/**
 * Script pour mettre à jour automatiquement toutes les dates 2024 vers 2025
 * ou utiliser des fonctions dynamiques pour maintenir les dates à jour
 */

const fs = require('fs');
const path = require('path');

// Fonction pour parcourir récursivement les dossiers
function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    
    if (isDirectory && !f.startsWith('.') && f !== 'node_modules' && f !== '.next' && f !== 'dist') {
      walkDir(dirPath, callback);
    } else if (f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.js') || f.endsWith('.jsx') || f.endsWith('.md')) {
      callback(dirPath);
    }
  });
}

// Fonction pour mettre à jour les dates dans un fichier
function updateDatesInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Remplacer les dates 2024 par des fonctions dynamiques
    const replacements = [
      // Dates de copyright
      {
        pattern: /© 2024/g,
        replacement: '© {new Date().getFullYear()}'
      },
      {
        pattern: /&copy; 2024/g,
        replacement: '&copy; {new Date().getFullYear()}'
      },
      // Dates de dernière mise à jour
      {
        pattern: /Dernière mise à jour : \d{1,2} \w+ 2024/g,
        replacement: 'Dernière mise à jour : {new Date().toLocaleDateString(\'fr-FR\', { day: \'numeric\', month: \'long\', year: \'numeric\' })}'
      },
      // Dates ISO
      {
        pattern: /'2024-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z'/g,
        replacement: 'new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()'
      },
      // Numéros de commande
      {
        pattern: /CMD-2024/g,
        replacement: 'CMD-{new Date().getFullYear()}'
      },
      // Numéros de transaction
      {
        pattern: /TXN-2024/g,
        replacement: 'TXN-{new Date().getFullYear()}'
      },
      // Collection Premium
      {
        pattern: /Collection Premium 2024/g,
        replacement: 'Collection Premium {new Date().getFullYear()}'
      }
    ];

    replacements.forEach(({ pattern, replacement }) => {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Mis à jour: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Erreur lors de la mise à jour de ${filePath}:`, error.message);
  }
}

// Fonction principale
function main() {
  console.log('🔄 Mise à jour des dates dans le projet...\n');

  const projectRoot = path.join(__dirname, '..');
  let filesUpdated = 0;

  walkDir(projectRoot, (filePath) => {
    updateDatesInFile(filePath);
    filesUpdated++;
  });

  console.log(`\n✨ Mise à jour terminée ! ${filesUpdated} fichiers traités.`);
  console.log('\n📝 Note: Certains fichiers peuvent nécessiter une vérification manuelle.');
  console.log('💡 Utilisez les fonctions de src/lib/date-utils.ts pour les nouvelles dates.');
}

// Exécuter le script
if (require.main === module) {
  main();
}

module.exports = { updateDatesInFile, walkDir };
