# 🚀 Déploiement sur Cloudflare Pages

## ❌ **Problème Identifié**
Cloudflare Pages détecte automatiquement Vercel CLI et essaie de l'utiliser, causant l'erreur :
```
Error: Function Runtimes must have a valid version, for example `now-php@1.0.0`.
```

## ✅ **Solution**

### **1. Configuration Cloudflare Pages**

**Build Settings :**
```
Build command: npm run build
Build output directory: .next
Root directory: /
```

**Variables d'environnement :**
```
DATABASE_URL=postgresql://user:password@host:port/database
EDGE_AUTH_SECRET=your-super-secret-jwt-key
NEXT_PUBLIC_APP_URL=https://your-domain.pages.dev
NODE_ENV=production
```

### **2. Fichiers de Configuration**

**Fichiers inclus :**
- ✅ `cloudflare-pages.toml` - Configuration spécifique
- ✅ `_headers` - Headers de sécurité
- ✅ `_redirects` - Redirections
- ✅ `build-cloudflare.js` - Script de build

**Fichiers supprimés :**
- ❌ `vercel.json` - Causait le conflit
- ❌ `wrangler.toml` - Remplacé par cloudflare-pages.toml

### **3. Étapes de Déploiement**

#### **Option A : Déploiement via Dashboard Cloudflare**

1. **Connecter le repository GitHub**
   - Aller sur [Cloudflare Pages](https://pages.cloudflare.com)
   - Cliquer sur "Connect to Git"
   - Sélectionner le repository `bootcamp-web`

2. **Configurer le build**
   ```
   Framework preset: Next.js
   Build command: npm run build
   Build output directory: .next
   Root directory: /
   ```

3. **Ajouter les variables d'environnement**
   ```
   DATABASE_URL=postgresql://user:password@host:port/database
   EDGE_AUTH_SECRET=your-super-secret-jwt-key
   NEXT_PUBLIC_APP_URL=https://your-domain.pages.dev
   NODE_ENV=production
   ```

4. **Déployer**
   - Cliquer sur "Save and Deploy"
   - Attendre la fin du build

#### **Option B : Déploiement via Wrangler CLI**

```bash
# Installer Wrangler
npm install -g wrangler

# Se connecter à Cloudflare
wrangler login

# Déployer
wrangler pages deploy .next --project-name sneakers-ecommerce
```

### **4. Configuration de la Base de Données**

**Option recommandée : Supabase**
```bash
# Créer un projet sur https://supabase.com
# Récupérer l'URL de connexion
DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres
```

**Alternative : Railway**
```bash
# Créer un projet sur https://railway.app
# Ajouter une base de données PostgreSQL
# Récupérer l'URL de connexion
```

### **5. Vérification du Déploiement**

**Tests à effectuer :**
- ✅ Page d'accueil accessible
- ✅ Authentification fonctionnelle
- ✅ APIs répondent correctement
- ✅ Images s'affichent
- ✅ Panier et wishlist fonctionnels

### **6. Résolution des Problèmes**

**Si le build échoue encore :**
1. Vérifier que `vercel.json` est supprimé
2. Utiliser le script de build : `node build-cloudflare.js`
3. Vérifier les variables d'environnement
4. Contacter le support Cloudflare si nécessaire

**Logs utiles :**
```bash
# Voir les logs de build
wrangler pages deployment tail --project-name sneakers-ecommerce
```

## 🎯 **Résultat Attendu**

Après le déploiement réussi :
- ✅ Site accessible via `https://your-domain.pages.dev`
- ✅ 6707 produits s'affichent
- ✅ Authentification fonctionnelle
- ✅ Performance optimale avec Edge Runtime

**Le projet sera 100% fonctionnel sur Cloudflare Pages !** 🚀
