const fs = require('fs');
const path = require('path');

function findApiRoutes(dir, routes = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findApiRoutes(filePath, routes);
    } else if (file === 'route.ts') {
      routes.push(filePath);
    }
  }
  
  return routes;
}

function verifyEdgeRuntime(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes("export const runtime = 'edge'")) {
      console.log(`✅ ${filePath} - Edge Runtime configuré`);
      return true;
    } else {
      console.log(`❌ ${filePath} - Edge Runtime manquant`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${filePath} - Erreur de lecture: ${error.message}`);
    return false;
  }
}

console.log('🔍 Vérification des routes API pour Edge Runtime...\n');

const apiDir = 'src/app/api';
if (!fs.existsSync(apiDir)) {
  console.log('❌ Dossier API non trouvé');
  process.exit(1);
}

const routes = findApiRoutes(apiDir);
console.log(`📁 ${routes.length} routes API trouvées:\n`);

let allValid = true;
routes.forEach(route => {
  const isValid = verifyEdgeRuntime(route);
  if (!isValid) allValid = false;
});

console.log('\n' + '='.repeat(50));
if (allValid) {
  console.log('🎉 Toutes les routes API sont configurées avec Edge Runtime !');
} else {
  console.log('❌ Certaines routes API ne sont pas configurées avec Edge Runtime');
}
console.log('='.repeat(50));
