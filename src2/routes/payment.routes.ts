import { Router } from 'express';
import express from 'express';
import {
  createDonationSession,
  stripeWebhook,
  createMobileMoneyPayment,
  mobileMoneyWebhook
} from '../controllers/payment.controller';

const router = Router();

// Routes pour Stripe
router.post('/create-donation-session', createDonationSession);

// Webhook Stripe (doit utiliser express.raw() pour pouvoir vérifier la signature)
router.post('/webhook/stripe', express.raw({ type: 'application/json' }), stripeWebhook);

// Routes pour Mobile Money (YAS, Moov)
router.post('/mobile-money', createMobileMoneyPayment);
router.post('/webhook/mobile-money', mobileMoneyWebhook);

export default router;
