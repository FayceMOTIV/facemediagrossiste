# FastGross Pro — CLAUDE.md

## Contexte projet
B2B SaaS pour la distribution alimentaire (DISTRAM — grossiste halal fast-food).
Clients cibles : kebabs, tacos, pizzerias, burgers, snacks.
3 dépôts : Lyon, Montpellier, Bordeaux.

## Stack technique
- **Next.js 14** (App Router) — TypeScript strict
- **Firebase** : Auth, Firestore, Realtime DB, Storage, FCM, App Hosting
- **AI** : Vercel AI SDK — Gemini 2.5 Flash-Lite (primary) + GPT-4o-mini (fallback)
- **UI** : Tailwind CSS + Shadcn/ui + Lucide React
- **Monitoring** : Sentry, Langfuse (LLM), PostHog
- **Tests** : Vitest (unit) + Playwright (e2e)

## Rôles utilisateurs
- `admin` — accès total, tous dépôts
- `manager` — supervision, gestion équipe, dépôt spécifique
- `commercial` — commandes, devis, clients
- `livreur` — livraisons, tracking GPS, chat
- `client` — portail client

## Chemins clés
- Pages app : `src/app/(app)/`
- API routes : `src/app/api/`
- Hooks : `src/hooks/`
- Services Firebase : `src/services/firebase/`
- Services AI : `src/services/ai/`
- Types : `src/types/index.ts`
- Firebase Admin : `src/lib/firebase-admin.ts`
- App mobile Expo (livreur) : `mobile/`

## Pattern API route AI
Suivre `src/app/api/ai/churn/route.ts` :
```ts
generateObject({ model: openaiProvider('gpt-4o-mini'), schema: ZodSchema, prompt })
logAICall(...)  // Langfuse
getAdminDb()    // Firestore via firebase-admin (server only)
```

## Collections Firestore
`clients` · `orders` · `deliveries` · `stocks` · `alerts` · `prospects` · `conversations` · `messages` · `employees` · `tournees` · `activity_logs`

## Realtime DB
`positions/{uid}` — GPS livreurs (lat, lng, timestamp, online)

---

## Features complètes

### Pages publiques (marketing)
- `/` — Landing page (hero, stats, features, ROI, pricing, demo form)
- `/login` — Authentification email/password
- `/forgot-password` — Récupération mot de passe
- `/demo` — Page démo
- `/fonctionnalites` — Présentation features
- `/tarifs` — Grille tarifaire

### Dashboard & gestion
- `/dashboard` — KPIs temps réel (CA, commandes, clients actifs, livraisons), alertes, top clients, actions rapides
- `/clients` — Liste clients, filtres (statut/dépôt/risque), stats, export
- `/commandes` — Workflow commandes (brouillon→validée→prépa→livraison→livrée), filtres, stats
- `/devis` — Création devis (recherche produits, calcul HT/TTC), export PDF, envoi email
- `/stocks` — Niveaux de stock temps réel, alertes critique/faible, filtres catégorie
- `/livraisons` — Hub livraisons pour rôle livreur

### Features IA
- `/assistant` — Chat commercial streaming (Gemini→GPT fallback), tips quotidiens, quick actions
- `/anti-churn` — Scoring risque client 0-100, niveaux critique/élevé/modéré/faible, analyse modale détaillée
- `/prospection` — Scoring prospect (localisation, potentielCA, concurrence, accessibilité, réputation), email personnalisé IA, sauvegarde Firestore
- `/scan-menu` — Upload photo menu → GPT-4o Vision → plats détectés → produits recommandés → créer devis ou commande
- `/tournees` — Optimisation routes livraison (créneaux, poids max 1500kg, priorité clients), sauvegarde TOURNEES

### Opérationnel
- `/tracking` — Carte GPS temps réel des livreurs (Leaflet + Firebase Realtime DB)
- `/chat` — Messagerie temps réel (clients, livreurs, équipe), streaming Firestore
- `/supervision` — Dashboard admin (KPIs animés, objectifs, alertes critiques, progress livraisons)
- `/equipe` — Gestion employés (rôles, dépôts, activation/suspension)
- `/settings` — Paramètres profil utilisateur

### API Routes
| Route | Usage |
|-------|-------|
| `/api/ai/assistant` | Chat streaming (Gemini/GPT) |
| `/api/ai/churn` | Analyse risque churn (GPT-4o) |
| `/api/ai/prospect` | Scoring prospect + email (GPT-4o-mini) |
| `/api/ai/tournees` | Optimisation tournées (GPT-4o-mini) |
| `/api/ai/commercial` | Insights commerciaux |
| `/api/ai/business` | Analyse business |
| `/api/pdf/devis` | Génération PDF devis |
| `/api/email/send` | Envoi email (Resend/Nodemailer) |
| `/api/notifications/send` | FCM push notifications |
| `/api/admin/set-claims` | Firebase custom claims (rôles) |
| `/api/employees/toggle` | Activation/suspension employé |
| `/api/employees/disable` | Désactivation compte |

### App mobile (Expo SDK 51)
Dossier `mobile/` — application livreur native :
- **Login** — Firebase Auth, vérification rôle livreur
- **Liste livraisons** — Commandes du jour, progress bar, toggle GPS
- **Détail livraison** — Infos, navigation GPS natif, photo preuve (camera/galerie), statuts (Démarrer/Valider/Problème)
- **Carte** — react-native-maps, marqueurs numérotés, polyline tournée
- **GPS Tracking** — expo-location → Firebase RTDB `positions/{uid}` toutes les 10s (compatible LiveMap supervisor web)

### Intégrations externes
- **Gemini 2.5 Flash-Lite** — Assistant chat (économique, rapide)
- **GPT-4o / GPT-4o-mini** — Churn, prospect, tournées, scan menu vision
- **Groq** — Alternative AI
- **Langfuse** — Observabilité LLM (coûts, latences, logs)
- **Sentry** — Error tracking client/serveur
- **PostHog** — Analytics produit
- **Trigger.dev** — Jobs background
- **Mastra** — Orchestration AI (@mastra/core, @mastra/memory)
- **Resend** — Email API
- **ElevenLabs** — Text-to-speech
- **Leaflet / react-leaflet / Maplibre** — Cartes web
- **react-native-maps** — Cartes mobile

## Règles de développement
- Toujours lire un fichier avant de le modifier
- Pattern AI routes : `generateObject` + Zod schema + Langfuse log + firebase-admin pour Firestore
- Ne pas modifier `NEXT_PUBLIC_FIREBASE_*` dans le code — variables d'env uniquement
- `firebase-admin` = server only (`src/lib/firebase-admin.ts` importe `server-only`)
- Build Firebase App Hosting : `baseUrl: "."` requis dans tsconfig, `NODE_ENV` doit être `RUNTIME` only dans apphosting.yaml
- Toujours tester `npm run build` avant de commit
