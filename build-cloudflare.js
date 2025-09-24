#!/usr/bin/env node

console.log('🚀 Build pour Cloudflare Pages...\n');

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  // Vérifier que nous sommes dans le bon répertoire
  if (!fs.existsSync('package.json')) {
    throw new Error('package.json non trouvé. Assurez-vous d\'être dans le répertoire racine du projet.');
  }

  // Nettoyer le cache
  console.log('🧹 Nettoyage du cache...');
  if (fs.existsSync('.next')) {
    execSync('rm -rf .next', { stdio: 'inherit' });
  }

  // Installer les dépendances
  console.log('📦 Installation des dépendances...');
  execSync('npm ci', { stdio: 'inherit' });

  // Build de production
  console.log('🔨 Build de production...');
  execSync('npm run build', { stdio: 'inherit' });

  // Vérifier que le build a réussi
  if (!fs.existsSync('.next')) {
    throw new Error('Le build a échoué - dossier .next non trouvé');
  }

  console.log('\n✅ Build réussi pour Cloudflare Pages !');
  console.log('📁 Dossier de sortie: .next');
  console.log('🚀 Prêt pour le déploiement sur Cloudflare Pages');

} catch (error) {
  console.error('\n❌ Erreur lors du build:', error.message);
  process.exit(1);
}
