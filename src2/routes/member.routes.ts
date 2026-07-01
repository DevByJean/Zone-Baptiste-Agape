import { Router, Response } from 'express';
import Member from '../models/Member.model';
import { protect, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { organization } = req.query;
    const filter = organization ? { organization } : {};
    const members = await Member.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Membre non trouve' });
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const member = await Member.create(req.body);
    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ message: 'Erreur de creation', error });
  }
});

router.put('/:id', protect, async (req: AuthRequest, res: Response) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!member) return res.status(404).json({ message: 'Membre non trouve' });
    res.json(member);
  } catch (error) {
    res.status(400).json({ message: 'Erreur de mise a jour' });
  }
});

router.delete('/:id', protect, async (req: AuthRequest, res: Response) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ message: 'Membre non trouve' });
    res.json({ message: 'Membre supprime' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;
