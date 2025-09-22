/**
 * Utilitaires de gestion des dates pour le projet SneakPeak
 * Ces fonctions permettent de maintenir les dates automatiquement à jour
 */

/**
 * Obtient l'année courante
 */
export function getCurrentYear(): number {
  return new Date().getFullYear()
}

/**
 * Obtient l'année courante sous forme de chaîne
 */
export function getCurrentYearString(): string {
  return getCurrentYear().toString()
}

/**
 * Génère un numéro de commande avec l'année courante
 */
export function generateOrderNumber(): string {
  const year = getCurrentYear()
  const random = Math.random().toString(36).substr(2, 6).toUpperCase()
  return `CMD-${year}-${random}`
}

/**
 * Génère un numéro de transaction avec l'année courante
 */
export function generateTransactionId(): string {
  const year = getCurrentYear()
  const timestamp = Date.now()
  const random = Math.random().toString(36).substr(2, 9).toUpperCase()
  return `TXN-${year}-${timestamp}-${random}`
}

/**
 * Obtient la date courante au format ISO
 */
export function getCurrentISODate(): string {
  return new Date().toISOString()
}

/**
 * Obtient la date courante au format français
 */
export function getCurrentFrenchDate(): string {
  return new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Obtient la date courante au format court français
 */
export function getCurrentShortFrenchDate(): string {
  return new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

/**
 * Génère une date de création simulée (pour les données de test)
 */
export function generateMockCreationDate(daysAgo: number = 0): string {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString()
}

/**
 * Génère une date de mise à jour simulée (pour les données de test)
 */
export function generateMockUpdateDate(daysAgo: number = 0): string {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString()
}

/**
 * Formate une date pour l'affichage dans l'interface
 */
export function formatDisplayDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Formate une date pour l'affichage court
 */
export function formatShortDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

/**
 * Vérifie si une date est dans l'année courante
 */
export function isCurrentYear(dateString: string): boolean {
  const date = new Date(dateString)
  return date.getFullYear() === getCurrentYear()
}

/**
 * Génère un copyright avec l'année courante
 */
export function generateCopyright(companyName: string = 'SneakPeak'): string {
  const year = getCurrentYear()
  return `© ${year} ${companyName}. Tous droits réservés.`
}

/**
 * Génère une date de dernière mise à jour
 */
export function generateLastUpdatedDate(): string {
  return `Dernière mise à jour : ${getCurrentFrenchDate()}`
}

/**
 * Génère une date de dernière mise à jour courte
 */
export function generateLastUpdatedShortDate(): string {
  return getCurrentShortFrenchDate()
}

/**
 * Constantes de dates pour le projet
 */
export const DATE_CONSTANTS = {
  CURRENT_YEAR: getCurrentYear(),
  CURRENT_YEAR_STRING: getCurrentYearString(),
  CURRENT_ISO_DATE: getCurrentISODate(),
  CURRENT_FRENCH_DATE: getCurrentFrenchDate(),
  CURRENT_SHORT_FRENCH_DATE: getCurrentShortFrenchDate(),
  COPYRIGHT: generateCopyright(),
  LAST_UPDATED: generateLastUpdatedDate(),
  LAST_UPDATED_SHORT: generateLastUpdatedShortDate()
} as const
