// Constantes de l'application

export const APP_NAME = 'FastGross Pro';
export const APP_DESCRIPTION = 'Plateforme B2B pour grossistes alimentaires';
export const COMPANY_NAME = 'DISTRAM';

// Dépôts
export const DEPOTS = [
  { id: 'lyon', name: 'Lyon', address: 'Zone Industrielle, 69000 Lyon' },
  { id: 'montpellier', name: 'Montpellier', address: 'Zone Commerciale, 34000 Montpellier' },
  { id: 'bordeaux', name: 'Bordeaux', address: 'Zone Logistique, 33000 Bordeaux' },
] as const;

// Types de clients
export const CLIENT_TYPES = [
  { id: 'kebab', label: 'Kebab', icon: '🥙' },
  { id: 'tacos', label: 'Tacos', icon: '🌮' },
  { id: 'pizza', label: 'Pizzeria', icon: '🍕' },
  { id: 'burger', label: 'Burger', icon: '🍔' },
  { id: 'snack', label: 'Snack', icon: '🍟' },
  { id: 'restaurant', label: 'Restaurant', icon: '🍽️' },
  { id: 'autre', label: 'Autre', icon: '🏪' },
] as const;

// Fréquences de commande
export const ORDER_FREQUENCIES = [
  { id: 'quotidien', label: 'Quotidien' },
  { id: 'bi-hebdo', label: 'Bi-hebdomadaire' },
  { id: 'hebdo', label: 'Hebdomadaire' },
  { id: 'mensuel', label: 'Mensuel' },
] as const;

// Statuts de commande
export const ORDER_STATUSES = [
  { id: 'brouillon', label: 'Brouillon', color: 'gray' },
  { id: 'validee', label: 'Validée', color: 'blue' },
  { id: 'en_preparation', label: 'En préparation', color: 'yellow' },
  { id: 'en_livraison', label: 'En livraison', color: 'purple' },
  { id: 'livree', label: 'Livrée', color: 'green' },
  { id: 'annulee', label: 'Annulée', color: 'red' },
] as const;

// Catégories de produits
export const PRODUCT_CATEGORIES = [
  { id: 'viandes', label: 'Viandes', icon: '🥩' },
  { id: 'pains', label: 'Pains', icon: '🥖' },
  { id: 'sauces', label: 'Sauces', icon: '🧴' },
  { id: 'fromages', label: 'Fromages', icon: '🧀' },
  { id: 'legumes', label: 'Légumes', icon: '🥬' },
  { id: 'frites', label: 'Frites & Accomp.', icon: '🍟' },
  { id: 'boissons', label: 'Boissons', icon: '🥤' },
] as const;

// Créneaux de livraison
export const DELIVERY_SLOTS = [
  { id: '06-08', label: '06h00 - 08h00' },
  { id: '08-10', label: '08h00 - 10h00' },
  { id: '10-12', label: '10h00 - 12h00' },
  { id: '14-16', label: '14h00 - 16h00' },
  { id: '16-18', label: '16h00 - 18h00' },
] as const;

// Tarifs (pour le site vitrine)
export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  popular?: boolean;
  description: string;
  features: readonly string[];
  notIncluded: readonly string[];
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 449,
    description: 'Pour démarrer avec l\'IA',
    features: [
      'IA Scan Menu',
      'Dashboard temps réel',
      'Gestion clients (100 max)',
      'Devis PDF automatiques',
      'Support email',
    ],
    notIncluded: [
      'IA Prospection',
      'IA Anti-Churn',
      'IA Tournées',
      'Multi-dépôts',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 549,
    popular: true,
    description: 'Pour les grossistes ambitieux',
    features: [
      'Tout Starter +',
      'IA Prospection',
      'IA Anti-Churn',
      'Clients illimités',
      'Tracking GPS livreurs',
      'Support prioritaire',
    ],
    notIncluded: [
      'IA Tournées',
      'IA Stocks',
      'Multi-dépôts',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 649,
    description: 'Solution complète multi-sites',
    features: [
      'Tout Pro +',
      '6 IAs complètes',
      'IA Tournées optimisées',
      'IA Stocks prédictive',
      'Multi-dépôts (3 max)',
      'Intégration SAGE',
      'Support dédié',
      'Formation équipe',
    ],
    notIncluded: [],
  },
] as const;

// Navigation principale (app)
export const MAIN_NAV = [
  { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { name: 'Clients', href: '/clients', icon: 'Users' },
  { name: 'Commandes', href: '/commandes', icon: 'ShoppingCart' },
  { name: 'Tracking', href: '/tracking', icon: 'MapPin' },
] as const;

// Navigation IA
export const AI_NAV = [
  { name: 'Scan Menu', href: '/scan-menu', icon: 'Camera', badge: 'IA' },
  { name: 'Prospection', href: '/prospection', icon: 'Target', badge: 'IA' },
  { name: 'Anti-Churn', href: '/anti-churn', icon: 'Shield', badge: 'IA' },
  { name: 'Tournées', href: '/tournees', icon: 'Route', badge: 'IA' },
  { name: 'Stocks', href: '/stocks', icon: 'Package', badge: 'IA' },
  { name: 'Assistant', href: '/assistant', icon: 'MessageSquare', badge: 'IA' },
] as const;

// Navigation secondaire
export const SECONDARY_NAV = [
  { name: 'Devis', href: '/devis', icon: 'FileText' },
  { name: 'Supervision', href: '/supervision', icon: 'Building2' },
  { name: 'Messagerie', href: '/chat', icon: 'MessageCircle' },
  { name: 'Equipe', href: '/equipe', icon: 'Users2' },
  { name: 'Paramètres', href: '/settings', icon: 'Settings' },
] as const;

// Stats de démo pour le dashboard
export const DEMO_STATS = {
  caJour: 12450,
  caSemaine: 78320,
  caMois: 312500,
  commandesJour: 28,
  commandesSemaine: 187,
  clientsActifs: 487,
  clientsARisque: 12,
  livraisonsEnCours: 8,
  alertesCritiques: 3,
  tauxConversion: 68,
  panierMoyen: 485,
};
