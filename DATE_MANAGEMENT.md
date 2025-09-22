# Gestion Automatique des Dates

Ce document explique comment les dates sont gérées automatiquement dans le projet SneakPeak.

## 📅 Utilitaires de Date

### Fichier Principal
- `src/lib/date-utils.ts` - Contient toutes les fonctions utilitaires pour la gestion des dates

### Fonctions Disponibles

#### Dates de Base
```typescript
import { getCurrentYear, getCurrentYearString } from '@/lib/date-utils'

// Obtient l'année courante
const year = getCurrentYear() // 2025
const yearString = getCurrentYearString() // "2025"
```

#### Génération d'Identifiants
```typescript
import { generateOrderNumber, generateTransactionId } from '@/lib/date-utils'

// Génère un numéro de commande avec l'année courante
const orderNumber = generateOrderNumber() // "CMD-2025-ABC123"

// Génère un ID de transaction
const transactionId = generateTransactionId() // "TXN-2025-1234567890-ABC123"
```

#### Dates de Test
```typescript
import { generateMockCreationDate, generateMockUpdateDate } from '@/lib/date-utils'

// Génère une date de création simulée
const creationDate = generateMockCreationDate(15) // Il y a 15 jours
const updateDate = generateMockUpdateDate(5) // Il y a 5 jours
```

#### Formatage
```typescript
import { formatDisplayDate, formatShortDate } from '@/lib/date-utils'

// Formate une date pour l'affichage
const displayDate = formatDisplayDate('2025-01-15T10:30:00Z')
// "15 janvier 2025 à 10:30"

const shortDate = formatShortDate('2025-01-15T10:30:00Z')
// "15/01/2025"
```

#### Copyright et Mise à Jour
```typescript
import { generateCopyright, generateLastUpdatedDate } from '@/lib/date-utils'

// Génère un copyright automatique
const copyright = generateCopyright() // "© 2025 SneakPeak. Tous droits réservés."

// Génère une date de dernière mise à jour
const lastUpdated = generateLastUpdatedDate() // "Dernière mise à jour : 15 janvier 2025"
```

## 🔄 Mise à Jour Automatique

### Script de Mise à Jour
Un script est disponible pour mettre à jour automatiquement toutes les dates dans le projet :

```bash
node scripts/update-dates.js
```

Ce script :
- Parcourt tous les fichiers du projet
- Remplace les dates 2024 par des fonctions dynamiques
- Met à jour les numéros de commande et de transaction
- Génère des dates de test dynamiques

### Utilisation dans les Composants

#### Footer avec Copyright Automatique
```tsx
import { getCurrentYear } from '@/lib/date-utils'

export function Footer() {
  return (
    <footer>
      <p>&copy; {getCurrentYear()} SneakPeak. Tous droits réservés.</p>
    </footer>
  )
}
```

#### Page avec Date de Mise à Jour
```tsx
import { generateLastUpdatedDate } from '@/lib/date-utils'

export function LegalPage() {
  return (
    <div>
      <p>{generateLastUpdatedDate()}</p>
    </div>
  )
}
```

#### Génération de Commandes
```tsx
import { generateOrderNumber, generateMockCreationDate } from '@/lib/date-utils'

const mockOrder = {
  orderNumber: generateOrderNumber(),
  createdAt: generateMockCreationDate(10),
  // ...
}
```

## 📋 Bonnes Pratiques

### 1. Utiliser les Fonctions Utilitaires
✅ **Bon :**
```typescript
import { getCurrentYear } from '@/lib/date-utils'
const year = getCurrentYear()
```

❌ **Éviter :**
```typescript
const year = 2025 // Date codée en dur
```

### 2. Dates de Test Dynamiques
✅ **Bon :**
```typescript
import { generateMockCreationDate } from '@/lib/date-utils'
const createdAt = generateMockCreationDate(15) // Il y a 15 jours
```

❌ **Éviter :**
```typescript
const createdAt = '2024-01-15T10:30:00Z' // Date fixe
```

### 3. Formatage Consistant
✅ **Bon :**
```typescript
import { formatDisplayDate } from '@/lib/date-utils'
const displayDate = formatDisplayDate(dateString)
```

❌ **Éviter :**
```typescript
const displayDate = new Date(dateString).toLocaleDateString() // Formatage manuel
```

## 🔧 Configuration

### Constantes Disponibles
```typescript
import { DATE_CONSTANTS } from '@/lib/date-utils'

// Utilisation des constantes
const currentYear = DATE_CONSTANTS.CURRENT_YEAR
const copyright = DATE_CONSTANTS.COPYRIGHT
const lastUpdated = DATE_CONSTANTS.LAST_UPDATED
```

### Personnalisation
Vous pouvez personnaliser les fonctions selon vos besoins :

```typescript
// Copyright personnalisé
const customCopyright = generateCopyright('Mon Entreprise')
// "© 2025 Mon Entreprise. Tous droits réservés."

// Date de test personnalisée
const customDate = generateMockCreationDate(30) // Il y a 30 jours
```

## 🚀 Déploiement

### Vérification Avant Déploiement
1. Exécuter le script de mise à jour des dates
2. Vérifier que toutes les dates sont dynamiques
3. Tester les fonctions utilitaires
4. Valider l'affichage des dates

### Maintenance
- Les dates se mettent à jour automatiquement
- Aucune intervention manuelle nécessaire
- Le script peut être exécuté périodiquement pour nettoyer les dates codées en dur

## 📝 Exemples d'Utilisation

### Dans un Composant React
```tsx
import { getCurrentYear, generateLastUpdatedDate } from '@/lib/date-utils'

export function MyComponent() {
  return (
    <div>
      <h1>Application {getCurrentYear()}</h1>
      <p>{generateLastUpdatedDate()}</p>
    </div>
  )
}
```

### Dans une API Route
```typescript
import { generateTransactionId, getCurrentISODate } from '@/lib/date-utils'

export async function POST(request: Request) {
  const transaction = {
    id: generateTransactionId(),
    createdAt: getCurrentISODate(),
    // ...
  }
  
  return Response.json(transaction)
}
```

### Dans un Fichier de Configuration
```typescript
import { DATE_CONSTANTS } from '@/lib/date-utils'

export const config = {
  version: '1.0.0',
  year: DATE_CONSTANTS.CURRENT_YEAR,
  lastUpdated: DATE_CONSTANTS.LAST_UPDATED_SHORT
}
```

---

*Ce système garantit que toutes les dates restent à jour automatiquement sans intervention manuelle.*
