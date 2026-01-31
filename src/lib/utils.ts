import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge des classes Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formater un montant en euros
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

// Formater un nombre
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('fr-FR').format(num);
}

// Formater un pourcentage
export function formatPercent(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
}

// Formater une date
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}

// Formater une date avec heure
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

// Formater une date relative (il y a X jours)
export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffTime = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaine(s)`;
  if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`;
  return `Il y a ${Math.floor(diffDays / 365)} an(s)`;
}

// Tronquer un texte
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

// Générer un ID unique
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Générer un numéro de commande
export function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CMD-${year}${month}${day}-${random}`;
}

// Couleurs par type de client
export const clientTypeColors: Record<string, string> = {
  kebab: 'bg-orange-100 text-orange-800',
  tacos: 'bg-yellow-100 text-yellow-800',
  pizza: 'bg-red-100 text-red-800',
  burger: 'bg-amber-100 text-amber-800',
  snack: 'bg-purple-100 text-purple-800',
  restaurant: 'bg-blue-100 text-blue-800',
  autre: 'bg-gray-100 text-gray-800',
};

// Couleurs par statut de commande
export const orderStatusColors: Record<string, string> = {
  brouillon: 'bg-gray-100 text-gray-800',
  validee: 'bg-blue-100 text-blue-800',
  en_preparation: 'bg-yellow-100 text-yellow-800',
  en_livraison: 'bg-purple-100 text-purple-800',
  livree: 'bg-green-100 text-green-800',
  annulee: 'bg-red-100 text-red-800',
};

// Couleurs par niveau de risque
export const riskLevelColors: Record<string, string> = {
  critique: 'bg-red-100 text-red-800 border-red-300',
  élevé: 'bg-orange-100 text-orange-800 border-orange-300',
  modéré: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  faible: 'bg-green-100 text-green-800 border-green-300',
};

// Labels des dépôts
export const depotLabels: Record<string, string> = {
  lyon: 'Lyon',
  montpellier: 'Montpellier',
  bordeaux: 'Bordeaux',
};

// Calculer le score de risque basé sur différents facteurs
export function calculateRiskScore(
  evolutionCA: number,
  joursDepuisDerniereCommande: number,
  reclamations: number,
  retardsPaiement: number
): number {
  let score = 0;

  // Évolution CA (max 30 pts)
  if (evolutionCA < -30) score += 30;
  else if (evolutionCA < -15) score += 20;
  else if (evolutionCA < 0) score += 10;

  // Jours depuis dernière commande (max 30 pts)
  if (joursDepuisDerniereCommande > 21) score += 30;
  else if (joursDepuisDerniereCommande > 14) score += 20;
  else if (joursDepuisDerniereCommande > 7) score += 10;

  // Réclamations (max 20 pts)
  if (reclamations >= 3) score += 20;
  else if (reclamations >= 2) score += 12;
  else if (reclamations >= 1) score += 5;

  // Retards paiement (max 20 pts)
  if (retardsPaiement >= 3) score += 20;
  else if (retardsPaiement >= 2) score += 12;
  else if (retardsPaiement >= 1) score += 5;

  return Math.min(100, score);
}

// Obtenir le niveau de risque à partir du score
export function getRiskLevel(score: number): 'critique' | 'élevé' | 'modéré' | 'faible' {
  if (score >= 76) return 'critique';
  if (score >= 51) return 'élevé';
  if (score >= 26) return 'modéré';
  return 'faible';
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Sleep function
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
