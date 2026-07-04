import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.models';

/**
 * Ce fichier était manquant / mal référencé : le "database.ts" que tu avais
 * uploadé était en réalité le fichier de types frontend
 * (src/types/database.ts, utilisé par AdminDashboard.tsx), pas le fichier
 * backend de connexion Mongo. Résultat : server.ts importait une fonction
 * connectDB() qui n'existait nulle part → le serveur ne démarrait jamais
 * correctement, d'où le "failed to fetch" côté frontend (il n'y a
 * littéralement rien qui écoute sur le port 5000).
 */

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "La variable d'environnement MONGODB_URI est manquante. Ajoute-la dans ton fichier .env (ex: MONGODB_URI=mongodb://localhost:27017/zoba)."
    );
  }

  await mongoose.connect(uri);
  await seedInitialAdmin();
};

/**
 * Crée un compte admin par défaut au premier démarrage si aucun admin
 * n'existe encore en base. Sans ça, la page de login renverra toujours
 * "Identifiants invalides" puisqu'il n'y a personne à qui se connecter.
 */
const seedInitialAdmin = async (): Promise<void> => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'Administrateur';

  if (!email || !password) {
    console.warn(
      "ADMIN_EMAIL / ADMIN_PASSWORD non définis dans .env : aucun compte admin par défaut n'a été créé."
    );
    return;
  }

  const existing = await Admin.findOne({ email: email.toLowerCase() });
  if (existing) return;

  const hashedPassword = await bcrypt.hash(password, 10);
  await Admin.create({
    email: email.toLowerCase(),
    password: hashedPassword,
    name,
  });

  console.log(`Compte admin initial créé pour ${email}.`);
};