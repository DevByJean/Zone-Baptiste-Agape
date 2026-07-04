import { Request, Response } from 'express';
import Stripe from 'stripe';
import Donation from '../models/Donation.model';
import Registration from '../models/Registration.model';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2025-02-24.acacia',
});

// Création d'une session de paiement Stripe pour un Don
export const createDonationSession = async (req: Request, res: Response) => {
  try {
    const { amount, donorName, donorEmail, message } = req.body;

    const donation = await Donation.create({
      amount,
      donorName,
      donorEmail,
      message,
      paymentMethod: 'stripe',
      status: 'pending',
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'xof',
            product_data: {
              name: 'Don pour ZOBA',
              description: message || 'Merci pour votre générosité',
            },
            unit_amount: amount * 100, // Stripe utilise les centimes
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/dons/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/dons/annulation`,
      client_reference_id: donation._id.toString(),
      customer_email: donorEmail,
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ message: 'Erreur lors de la création de la session de paiement Stripe' });
  }
};

// Webhook Stripe pour valider le paiement
export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    // req.body doit être brut (raw) pour le webhook Stripe. Il faudra configurer express.raw() pour cette route spécifique.
    event = stripe.webhooks.constructEvent(req.body, sig as string, process.env.STRIPE_WEBHOOK_SECRET || '');
  } catch (err: unknown) {
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Si c'est un don
    if (session.client_reference_id) {
      await Donation.findByIdAndUpdate(session.client_reference_id, {
        status: 'completed',
        transactionId: session.payment_intent as string,
      });
      // Optionnel : faire pareil pour Registration si on passe l'ID de l'inscription
    }
  }

  res.json({ received: true });
};

// Initier un paiement Mobile Money (YAS, Moov)
export const createMobileMoneyPayment = async (req: Request, res: Response) => {
  try {
    const { amount, phone, provider, donorName, donorEmail } = req.body; // provider: 'yas' ou 'moov'

    // Ici, vous devrez intégrer l'API de votre agrégateur (ex: CinetPay, FedaPay, ou API directe)
    // Exemple simulé :
    const donation = await Donation.create({
      amount,
      donorName,
      donorEmail,
      donorPhone: phone,
      paymentMethod: provider,
      status: 'pending',
    });

    // TODO: Appel HTTP à l'API du fournisseur
    // const response = await axios.post('URL_AGREGATEUR', { ... });

    res.json({ 
      message: 'Demande de paiement envoyée sur votre téléphone. Veuillez valider.',
      donationId: donation._id 
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'initiation du paiement mobile' });
  }
};

// Webhook Mobile Money
export const mobileMoneyWebhook = async (req: Request, res: Response) => {
  try {
    // Valider le paiement provenant de l'agrégateur
    const { transaction_id, status, custom_data } = req.body; 

    if (status === 'ACCEPTED') {
      await Donation.findByIdAndUpdate(custom_data.donationId, {
        status: 'completed',
        transactionId: transaction_id,
      });
    }

    res.json({ received: true });
  } catch (error) {
    res.status(500).json({ message: 'Erreur webhook mobile money' });
  }
};
