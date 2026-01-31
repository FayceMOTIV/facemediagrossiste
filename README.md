# FastGross Pro × DISTRAM

Plateforme B2B intelligente pour grossistes alimentaires avec 6 IAs spécialisées.

## Présentation

FastGross Pro est une solution complète pour les grossistes alimentaires, développée en partenariat avec DISTRAM (grossiste alimentaire halal Lyon/Montpellier/Bordeaux).

### Fonctionnalités principales

- **Site vitrine** : Landing page, tarifs, calculateur ROI, formulaire de démo
- **Dashboard** : Vue d'ensemble temps réel de l'activité
- **Gestion clients** : 487+ clients, scoring risque, historique
- **Gestion commandes** : Création, suivi, génération de devis PDF
- **Tracking GPS** : Suivi temps réel des livreurs

### 6 IAs Spécialisées

1. **IA Scan Menu** ⭐ - Photographiez un menu, obtenez un devis en 30 secondes
2. **IA Prospection** - Scoring prospects, génération d'emails personnalisés
3. **IA Anti-Churn** - Détection clients à risque 30 jours avant
4. **IA Tournées** - Optimisation des routes de livraison
5. **IA Stocks** - Prédiction des ruptures 2 semaines avant
6. **IA Assistant Commercial** - Aide à la vente terrain

## Stack Technique

- **Frontend** : Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend** : Firebase (Auth, Firestore, Storage, Hosting)
- **IA** : Groq API (Llama 3.1/3.2)
- **UI** : Composants custom inspirés shadcn/ui

## Installation

```bash
# Cloner le repo
git clone https://github.com/FayceMOTIV/facemediagrossiste.git
cd facemediagrossiste

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos clés

# Lancer en développement
npm run dev
```

## Configuration Firebase

1. Créer un projet sur [Firebase Console](https://console.firebase.google.com)
2. Activer Authentication (Email/Password)
3. Créer une base Firestore
4. Configurer Storage
5. Copier les credentials dans `.env.local`

## Structure du Projet

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── page.tsx            # Landing page
│   ├── (auth)/             # Pages authentification
│   ├── (app)/              # App protégée
│   └── (livreur)/          # Mode livreur
├── components/             # Composants React
│   ├── ui/                 # Composants UI de base
│   ├── layout/             # Sidebar, Header
│   └── vitrine/            # Composants site vitrine
├── services/               # Services externes
│   ├── firebase/           # Config et services Firebase
│   ├── ai/                 # Services IA (Groq)
│   └── pdf/                # Génération PDF
├── hooks/                  # Hooks React custom
├── lib/                    # Utilitaires
├── types/                  # Types TypeScript
└── data/                   # Données de démo
```

## Déploiement

```bash
# Build
npm run build

# Déployer sur Firebase Hosting
firebase deploy
```

## Comptes de Démo

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| admin@distram.fr | demo123 | Admin |
| commercial@distram.fr | demo123 | Commercial |
| livreur@distram.fr | demo123 | Livreur |

## Licence

Propriétaire - Face Media © 2024

## Contact

- **Site** : [facemediagrossiste.web.app](https://facemediagrossiste.web.app)
- **Email** : contact@distram.fr
