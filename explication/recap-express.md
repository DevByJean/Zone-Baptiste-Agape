# Récapitulatif de la migration vers Express

## Objectif
Le projet a été migré pour utiliser un backend Express comme source unique de données côté application, au lieu d’utiliser Supabase pour les écrans publics et l’administration.

## Ce qui a été changé
- L’authentification admin utilise maintenant l’API Express.
- Les pages publiques (Accueil, À propos, Départements, Actualités, Galerie, Contact, Dons) utilisent désormais l’API Express.
- Le tableau de bord admin utilise également l’API Express pour charger, créer, modifier et supprimer les contenus.
- Les anciens appels Supabase ont été retirés des composants principaux.

## Architecture retenue
- Frontend : React + Vite + TypeScript
- Backend : Express + MongoDB + JWT
- Authentification : token JWT stocké localement dans le navigateur
- Routes principales : auth, activities, news, gallery, members, contact, subscribers, registrations, donations

## Points importants
- L’API Express doit être démarrée avant d’utiliser les pages qui récupèrent des données.
- Les identifiants admin doivent exister dans la base MongoDB.
- Le front utilise l’URL configurée dans la variable VITE_API_URL.

## Vérifications à faire
1. Démarrer le backend Express.
2. Vérifier que l’endpoint /health répond correctement.
3. Vérifier la connexion admin avec les identifiants attendus.
4. Tester les formulaires publics (contact, dons, newsletter).
5. Vérifier que le dashboard admin charge bien les données depuis l’API.

## Fichiers principaux concernés
- src/pages/admin/AdminLogin.tsx
- src/pages/admin/AdminPage.tsx
- src/pages/admin/AdminDashboard.tsx
- src/pages/ContactPage.tsx
- src/pages/DonationsPage.tsx
- src/pages/GalleryPage.tsx
- src/pages/Home.tsx
- src/pages/AboutPage.tsx
- src/pages/DepartmentsPage.tsx
- src/pages/NewsPage.tsx
- src/components/Footer.tsx
- src/lib/api.ts

## Résultat attendu
Le projet fonctionne maintenant de manière cohérente avec un backend Express unique pour l’authentification, les contenus publics et l’administration.
