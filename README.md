# Zone Baptiste Agapé (ZOBA) ⛪

Bienvenue sur le dépôt officiel du projet **Zone Baptiste Agapé (ZOBA)**, la plateforme web de la fraternité, foi et service au sein de la Convention Baptiste du Togo (CBT).

Cette application moderne permet de présenter l'association, de gérer les différents départements, de partager les actualités et activités, de collecter des dons et de gérer le contenu via un espace d'administration sécurisé.

---

## 🚀 Technologies Utilisées

La plateforme repose sur une architecture moderne divisée en deux parties principales (Frontend et Backend) :

### Frontend
*   **Framework :** [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
*   **Outil de build :** [Vite](https://vitejs.dev/)
*   **Design & Style :** [Tailwind CSS](https://tailwindcss.com/) + [Lucide React](https://lucide.dev/) (icônes)
*   **Routage :** [React Router DOM](https://reactrouter.com/)
*   **Backend-as-a-Service (BaaS) :** [Supabase](https://supabase.com/) (pour la gestion de données et l'authentification)

### Backend (Serveur API)
*   **Runtime :** [Node.js](https://nodejs.org/)
*   **Framework :** [Express](https://expressjs.com/)
*   **Base de données :** [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
*   **Sécurité :** JSON Web Tokens (JWT) & BcryptJS
*   **Paiements :** [Stripe](https://stripe.com/) pour la gestion des dons sécurisés

---

## 📂 Structure du Projet

```text
├── src/                  # Code source du Frontend (React)
│   ├── components/       # Composants réutilisables (Navbar, Footer, Loader...)
│   ├── hooks/            # Hooks React personnalisés
│   ├── lib/              # Configurations des clients tiers (Supabase...)
│   ├── pages/            # Pages de l'application
│   │   └── admin/        # Pages de l'espace administration
│   ├── types/            # Déclarations des types TypeScript
│   ├── App.tsx           # Routeur et layout principal
│   ├── index.css         # Styles globaux & Tailwind
│   └── main.tsx          # Point d'entrée de l'application React
│
├── src2/                 # Code source du Backend (Express & MongoDB)
│   ├── config/           # Configuration de la base de données
│   ├── controllers/      # Logique métier des APIs
│   ├── middleware/       # Middlewares Express (authentification, logs...)
│   ├── models/           # Modèles de données Mongoose (MongoDB)
│   ├── routes/           # Définition des points d'accès API
│   └── server.ts         # Point d'entrée du serveur Express
│
├── dist/                 # Fichiers de production compilés (Frontend)
├── supabase/             # Fichiers de migration et de configuration Supabase
├── package.json          # Dépendances et scripts de démarrage
└── tailwind.config.js    # Configuration Tailwind CSS
```

---

## ⚙️ Configuration & Installation

### Prérequis
*   [Node.js](https://nodejs.org/) (Version 18 ou supérieure recommandée)
*   Un compte et un projet [Supabase](https://supabase.com/)
*   Une base de données [MongoDB](https://www.mongodb.com/atlas) (ou instance locale)

### 1. Cloner le projet
```bash
git clone <URL_DE_VOTRE_DEPOT_GIT>
cd project
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer les variables d'environnement (`.env`)
Créez ou modifiez le fichier `.env` à la racine du projet en y ajoutant vos configurations :

```env
# Configuration Supabase
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anon-supabase

# Configuration MongoDB (Backend)
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/zoba

# Configuration JWT (Backend)
JWT_SECRET=votre-cle-secrete-jwt

# Configuration Serveur
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Identifiants de l'administrateur par défaut
ADMIN_EMAIL=johndoe@gmail.com
ADMIN_PASSWORD=votre-mot-de-passe-admin
```

---

## 🛠️ Utilisation en Mode Développement

### Lancer le Frontend (Vite)
Pour démarrer le serveur de développement React :
```bash
npm run dev
```
L'application sera accessible par défaut à l'adresse : [http://localhost:5173](http://localhost:5173).

### Lancer le Backend (Express)
Pour exécuter le serveur API backend :
```bash
# Assurez-vous d'avoir configuré le fichier .env
npx ts-node src2/server.ts
```
Le serveur écoutera sur le port défini par la variable `PORT` (par défaut `5000`).

---

## 🏁 Scripts Disponibles

Dans le répertoire du projet, vous pouvez exécuter les commandes suivantes :

*   `npm run dev` : Démarre le serveur de développement Frontend (Vite).
*   `npm run build` : Compile l'application Frontend pour la production dans le dossier `dist/`.
*   `npm run preview` : Lance un aperçu local de la build de production.
*   `npm run lint` : Analyse le code à la recherche d'erreurs de style avec ESLint.
*   `npm run typecheck` : Vérifie la validité des types TypeScript dans l'application.

---

## 🔒 Espace Administrateur

La plateforme intègre un tableau de bord administratif complet accessible via la route `/admin`. Il permet de :
*   Gérer les articles de presse et actualités de la Zone.
*   Publier et organiser les activités et événements.
*   Visualiser les rapports d'activités et de dons.
*   Gérer la galerie d'images.
