# ZOBA — Site Web de la Zone Baptiste Agapé

**ZOBA** est le site officiel de la Zone Baptiste Agapé, gérée par la Convention Baptiste du Togo (CBT). Ce repository contient un frontend React/Vite/Tailwind et un backend Node/Express/MongoDB pour gérer l'information publique, les dons, les activités et l'administration.

## Fonctionnalités principales

### Site public

- Page d'accueil avec mission, activités et actualités
- Page À propos et présentation des départements
- Page Activités avec inscriptions en ligne
- Section Actualités
- Galerie photo
- Formulaire de contact
- Page de dons

### Administration

- Gestion des activités (CRUD)
- Gestion des actualités (CRUD)
- Gestion de la galerie (CRUD)
- Gestion des membres du bureau
- Lecture et réponse aux contacts
- Gestion des abonnés newsletter
- Suivi des inscriptions aux activités
- Suivi des dons

## Stack technique

- Frontend : React 18, TypeScript, Vite
- UI : Tailwind CSS
- Backend : Node.js, Express.js, TypeScript
- Base de données : MongoDB via Mongoose
- Authentification : JWT
- Icônes : Lucide React

## Architecture du projet

```
project-bolt/
├── backend/                # Backend Node.js
│   ├── package.json
│   └── src/
│       ├── config/         # Configuration de MongoDB et initialisation
│       ├── middleware/     # Auth et validation
│       ├── models/         # Modèles Mongoose
│       └── routes/         # Routes API Express
├── src/                    # Frontend React
│   ├── components/         # Navbar, Footer, éléments UI
│   ├── lib/                # API client et Supabase
│   ├── pages/              # Pages publiques
│   │   └── admin/          # Interface d'administration
│   └── types/              # Types TypeScript
├── supabase/               # Migrations et schéma Supabase
├── implementation.md       # Guide d'intégration Stripe
├── README.md               # Documentation du projet
└── package.json            # Dépendances frontend
```

## Prérequis

- Node.js >= 18
- npm
- MongoDB (local ou Atlas)

## Installation

```bash
# Racine du frontend
npm install

# Backend
cd backend && npm install
```

## Configuration backend

1. Copier le fichier d'exemple :

```bash
cp backend/.env.example backend/.env
```

2. Compléter `backend/.env` :

```env
MONGODB_URI=mongodb://localhost:27017/zoba
JWT_SECRET=votre-secret-jwt-tres-securise
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=admin@zoba-cbt.org
ADMIN_PASSWORD=Zoba@2025!
```

### Option Stripe

Pour activer Stripe, ajoutez également :

```env
STRIPE_SECRET_KEY=sk_test_votre_cle
STRIPE_WEBHOOK_SECRET=whsec_votre_secret
STRIPE_SUCCESS_URL=http://localhost:5173/donations/success
STRIPE_CANCEL_URL=http://localhost:5173/donations/cancel
```

> Consultez `implementation.md` pour une documentation complète sur l’intégration Stripe.

## Démarrage local

```bash
# Terminal 1 : backend
cd backend && npm run dev

# Terminal 2 : frontend
npm run dev
```

- Frontend : `http://localhost:5173`
- Backend API : `http://localhost:5000`

## Build production

```bash
# Frontend
npm run build

# Backend
cd backend && npm run build && npm start
```

## Administration

- URL : `/admin`
- Email : `admin@zoba-cbt.org`
- Mot de passe : `Zoba@2025!`

> Changer le mot de passe admin dès la première connexion.

## API principale

| Méthode | Endpoint             | Description                   |
| ------- | -------------------- | ----------------------------- |
| POST    | `/api/auth/login`    | Connexion admin               |
| GET     | `/api/members`       | Liste des membres             |
| POST    | `/api/members`       | Créer un membre               |
| GET     | `/api/activities`    | Liste des activités           |
| POST    | `/api/activities`    | Créer une activité            |
| GET     | `/api/news`          | Liste des actualités          |
| POST    | `/api/news`          | Créer un article              |
| GET     | `/api/gallery`       | Liste des éléments de galerie |
| POST    | `/api/contacts`      | Envoyer un message            |
| POST    | `/api/subscribers`   | S'abonner à la newsletter     |
| POST    | `/api/registrations` | S'inscrire à une activité     |
| POST    | `/api/donations`     | Enregistrer un don            |

## Modèles principaux

- `Admin` — administrateurs
- `Member` — membres du bureau
- `Activity` — activités et événements
- `News` — actualités
- `Gallery` — images de la galerie
- `Contact` — messages de contact
- `Subscriber` — abonnés newsletter
- `Registration` — inscriptions aux événements
- `Donation` — dons

## Notes importantes

- Le backend requis MongoDB avant démarrage.
- Ne jamais exposer la clé secrète Stripe côté frontend.
- Le webhook Stripe doit être vérifié avec `STRIPE_WEBHOOK_SECRET`.
- La page de dons frontend est dans `src/pages/DonationsPage.tsx`.
- Les routes backend de donation sont dans `backend/src/routes/donation.routes.ts`.

## Documentation complémentaire

- `implementation.md` : guide Stripe complet
- `backend/.env.example` : variables d’environnement backend
- `src/lib/supabase.ts` : configuration client Supabase

## Contribuer

1. Forker le repository
2. Créer une branche de fonctionnalité
3. Ajouter ou modifier du code
4. Ouvrir une pull request

---

Projet ZOBA — Zone Baptiste Agapé
