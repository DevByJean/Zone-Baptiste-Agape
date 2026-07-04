import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import { connectDB } from './config/database';

// Import des routes
import authRoutes from './routes/auth.routes';
import activityRoutes from './routes/activity.routes';
import contactRoutes from './routes/contact.routes';
import donationRoutes from './routes/donation.routes';
import galleryRoutes from './routes/gallery.routes';
import memberRoutes from './routes/member.routes';
import newsRoutes from './routes/news.routes';
import registrationRoutes from './routes/registration.routes';
import subscriberRoutes from './routes/subscriber.routes';
import paymentRoutes from './routes/payment.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middlewares globaux ───────────────────────────────────────────────
app.use(helmet());

// CORS : accepte une ou plusieurs origines (séparées par des virgules dans .env)
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Autorise aussi les requêtes sans origine (Postman, curl, healthchecks)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origine non autorisée par CORS: ${origin}`));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// IMPORTANT : mongoSanitize doit s'exécuter APRÈS le parsing du body
// (express.json/urlencoded), sinon req.body est encore undefined et
// le middleware ne nettoie rien du tout.
app.use(mongoSanitize());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite à 100 requêtes par windowMs par IP
  message: 'Trop de requêtes, veuillez réessayer plus tard.',
});
app.use('/api/', apiLimiter);

// ─── Routes ─────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Le serveur ZOBA est opérationnel' });
});

// ─── Démarrage ──────────────────────────────────────────────────────────
// Avant : app.listen() était appelé immédiatement, sans attendre connectDB().
// Résultat : le serveur pouvait accepter des requêtes HTTP avant même que
// MongoDB soit connecté (ou rester "à moitié démarré" si la connexion
// échouait), ce qui produit exactement des erreurs "failed to fetch" /
// timeouts côté frontend sans message clair côté backend.
const start = async () => {
  try {
    await connectDB();
    console.log(
      "Connexion MongoDB réussie et initialisation de l'administrateur effectuée."
    );
    app.listen(PORT, () => {
      console.log(
        `Serveur ZOBA démarré sur le port ${PORT} (mode: ${process.env.NODE_ENV || 'development'})`
      );
    });
  } catch (err) {
    console.error('Échec de la connexion initiale à MongoDB:', err);
    process.exit(1);
  }
};

start();