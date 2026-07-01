import { Router, Response } from 'express';
import Subscriber from '../models/Subscriber.model';
import { protect, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { email } = req.body;

    const existing = await Subscriber.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (!existing.active) {
        existing.active = true;
        await existing.save();
        return res.json({ message: 'Reabonnement reussi' });
      }
      return res.status(400).json({ message: 'Deja_abonne' });
    }

    const subscriber = await Subscriber.create({ email: email.toLowerCase() });
    res.status(201).json({ message: 'Abonnement reussi', id: subscriber._id });
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de l\'abonnement' });
  }
});

router.delete('/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;
    await Subscriber.findOneAndUpdate({ email: email.toLowerCase() }, { active: false });
    res.json({ message: 'Desabonnement reussi' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const subscribers = await Subscriber.find({ active: true }).sort({ createdAt: -1 });
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.delete('/:id', protect, async (req: AuthRequest, res: Response) => {
  try {
    const subscriber = await Subscriber.findByIdAndDelete(req.params.id);
    if (!subscriber) return res.status(404).json({ message: 'Abonne non trouve' });
    res.json({ message: 'Abonne supprime' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;
