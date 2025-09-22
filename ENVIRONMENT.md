# 🔧 Configuration des Variables d'Environnement

## Variables Requises

### Base de Données
```env
DATABASE_URL="postgresql://username:password@host:port/database"
```
- **Description** : URL de connexion à la base de données PostgreSQL
- **Source** : Railway, Supabase, ou autre fournisseur PostgreSQL
- **Exemple** : `postgresql://postgres:password@containers-us-west-123.railway.app:5432/railway`

### NextAuth.js
```env
NEXTAUTH_URL="http://localhost:3000"
```
- **Description** : URL de base de l'application
- **Développement** : `http://localhost:3000`
- **Production** : `https://your-domain.vercel.app`

```env
NEXTAUTH_SECRET="your-secret-key-here"
```
- **Description** : Clé secrète pour signer les tokens JWT
- **Génération** : `openssl rand -base64 32`
- **Exemple** : `abc123def456ghi789jkl012mno345pqr678stu901vwx234yz`

## Variables Optionnelles

### Railway
```env
RAILWAY_STATIC_URL="your-railway-url"
```
- **Description** : URL statique du projet Railway (optionnel)
- **Usage** : Pour les webhooks ou intégrations

## Configuration pour Vercel

### Variables d'Environnement dans Vercel
1. Aller dans les **Settings** de votre projet Vercel
2. Section **Environment Variables**
3. Ajouter les variables suivantes :

| Variable | Valeur | Environnement |
|----------|--------|---------------|
| `DATABASE_URL` | `postgresql://...` | Production, Preview, Development |
| `NEXTAUTH_URL` | `https://your-domain.vercel.app` | Production |
| `NEXTAUTH_URL` | `http://localhost:3000` | Development |
| `NEXTAUTH_SECRET` | `your-secret-key` | Production, Preview, Development |

### Génération de NEXTAUTH_SECRET
```bash
# Sur Windows (PowerShell)
[System.Web.Security.Membership]::GeneratePassword(32, 0)

# Sur macOS/Linux
openssl rand -base64 32

# Ou en ligne
# https://generate-secret.vercel.app/32
```

## Configuration pour Railway

### Variables d'Environnement dans Railway
1. Aller dans votre projet Railway
2. Section **Variables**
3. Ajouter les variables nécessaires

### Base de Données PostgreSQL
1. Créer un service **PostgreSQL** dans Railway
2. Copier la variable `DATABASE_URL` générée automatiquement
3. L'utiliser dans votre application

## Vérification de la Configuration

### Test Local
```bash
# Vérifier que les variables sont chargées
npm run dev

# Vérifier la connexion à la base de données
npx prisma db push
```

### Test en Production
1. Déployer sur Vercel
2. Vérifier les logs de déploiement
3. Tester les fonctionnalités principales

## Sécurité

### Bonnes Pratiques
- ✅ Ne jamais commiter les fichiers `.env*`
- ✅ Utiliser des secrets forts pour `NEXTAUTH_SECRET`
- ✅ Limiter l'accès aux variables d'environnement
- ✅ Utiliser des URLs HTTPS en production
- ✅ Rotation régulière des secrets

### Fichiers à Ignorer
```gitignore
.env
.env.local
.env.production
.env.development
.env.*.local
```

## Dépannage

### Erreurs Courantes
1. **"Invalid DATABASE_URL"** : Vérifier la syntaxe de l'URL
2. **"NEXTAUTH_SECRET is not set"** : Ajouter la variable d'environnement
3. **"Connection refused"** : Vérifier les paramètres de la base de données

### Logs Utiles
```bash
# Logs Vercel
vercel logs

# Logs Railway
railway logs

# Logs locaux
npm run dev
```
