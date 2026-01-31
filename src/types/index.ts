// Types principaux de l'application

export type UserRole = 'admin' | 'commercial' | 'livreur' | 'client';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  depot?: string;
  telephone?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Client {
  id: string;
  nom: string;
  type: 'kebab' | 'tacos' | 'pizza' | 'burger' | 'snack' | 'restaurant' | 'autre';
  adresse: string;
  codePostal: string;
  ville: string;
  telephone: string;
  email?: string;
  siret?: string;
  caAnnuel: number;
  frequenceCommande: 'quotidien' | 'bi-hebdo' | 'hebdo' | 'mensuel';
  panierMoyen: number;
  commercial: string;
  depot: 'lyon' | 'montpellier' | 'bordeaux';
  riskScore: number;
  status: 'actif' | 'inactif' | 'prospect' | 'perdu';
  coordonnees?: { lat: number; lng: number };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  ref: string;
  nom: string;
  categorie: 'viandes' | 'pains' | 'sauces' | 'fromages' | 'legumes' | 'frites' | 'boissons';
  prix: number;
  unite: string;
  stockActuel?: number;
  stockMinimum?: number;
  dlc?: Date;
  image?: string;
  actif: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  productRef: string;
  productNom: string;
  quantite: number;
  prixUnitaire: number;
  prixTotal: number;
}

export interface Order {
  id: string;
  numero: string;
  clientId: string;
  clientNom: string;
  items: OrderItem[];
  totalHT: number;
  remise: number;
  totalTTC: number;
  status: 'brouillon' | 'validee' | 'en_preparation' | 'en_livraison' | 'livree' | 'annulee';
  dateLivraison?: Date;
  creneauLivraison?: string;
  livreurId?: string;
  notes?: string;
  commercial: string;
  depot: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Delivery {
  id: string;
  orderId: string;
  clientId: string;
  clientNom: string;
  adresse: string;
  coordonnees: { lat: number; lng: number };
  livreurId: string;
  livreurNom: string;
  date: Date;
  creneauPrevu: string;
  heureArrivee?: Date;
  status: 'planifiee' | 'en_route' | 'arrivee' | 'livree' | 'probleme';
  signature?: string;
  photo?: string;
  notes?: string;
  poidsTotal: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Quote {
  id: string;
  numero: string;
  clientId: string;
  clientNom: string;
  items: OrderItem[];
  totalHT: number;
  remise: number;
  totalTTC: number;
  status: 'brouillon' | 'envoye' | 'accepte' | 'refuse' | 'expire';
  validiteJours: number;
  dateValidite: Date;
  pdfUrl?: string;
  commercial: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Alert {
  id: string;
  type: 'churn' | 'stock' | 'livraison' | 'paiement' | 'objectif';
  priority: 'critique' | 'haute' | 'moyenne' | 'basse';
  title: string;
  message: string;
  clientId?: string;
  productId?: string;
  orderId?: string;
  assignedTo?: string;
  status: 'nouvelle' | 'vue' | 'traitee' | 'ignoree';
  actionUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Prospect {
  id: string;
  nom: string;
  type: string;
  adresse: string;
  ville: string;
  telephone?: string;
  email?: string;
  score: number;
  scoreDetails?: {
    localisation: number;
    potentielCA: number;
    concurrence: number;
    accessibilite: number;
    reputation: number;
  };
  potentielCA: number;
  avisGoogle?: number;
  nombreAvis?: number;
  status: 'nouveau' | 'contacte' | 'rdv_planifie' | 'devis_envoye' | 'converti' | 'perdu';
  emailGenere?: string;
  commercial?: string;
  notes?: string;
  prochainContact?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface DemoRequest {
  id: string;
  nom: string;
  entreprise: string;
  email: string;
  telephone?: string;
  message?: string;
  source: string;
  status: 'nouveau' | 'contacte' | 'demo_planifiee' | 'demo_faite' | 'converti' | 'perdu';
  createdAt: Date;
  updatedAt: Date;
}

// Stats Dashboard
export interface DashboardStats {
  caJour: number;
  caSemaine: number;
  caMois: number;
  commandesJour: number;
  commandesSemaine: number;
  clientsActifs: number;
  clientsARisque: number;
  livraisonsEnCours: number;
  alertesCritiques: number;
  tauxConversion: number;
  panierMoyen: number;
}

// Graphiques
export interface ChartData {
  date: string;
  value: number;
  label?: string;
}

export interface DepotStats {
  depot: string;
  clients: number;
  ca: number;
  commandes: number;
}
