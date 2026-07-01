import { Router, Response } from "express";
import Donation from '../models/Donation.model';
import { protect, AuthRequest } from "../middleware/auth.middleware";

const router = Router();

router.post('/', async (req, res) => {
    try {
        const donation = await Donation.create(req.body);
        res.status(201).json({ message: 'Don enregistre', id: donation._id });
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de l\'enregistrement du don'});
        
    }
});

router.get('/', protect, async (req: AuthRequest, res: Response) => {
    try {
      const { status } = req.query;
      const filter: any = {};
      if(status) filter.status = status;

      const donations = await Donation.find(filter).sort({createdAt: -1});
      res.json(donations);
    } catch (error) {
      res.status(500).json({message: 'Erreur serveur' });
    }
});

router.put('/:id', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const donation = await Donation.findByIdAndUpdate(
        req.params.id, 
        { status }, 
        { new: true }
    );
    if (!donation) return res.status(404).json({ message: 'Don non trouve' });
    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.delete('/:id', protect, async (req: AuthRequest, res: Response) => {
  try {
    const donation = await Donation.findByIdAndDelete(req.params.id);
    if (!donation) return res.status(404).json({ message: 'Don non trouve' });
    res.json({ message: 'Don supprime' });
  } catch (error) {
    res.status(500).json({message: 'Erreur serveur' });
  }
});
 router.get('/stats', protect, async (req: AuthRequest, res: Response) => {
    try {
      const stats = await Donation.aggregate([
        { $match: {status: 'completed' }},
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$amount' },
            count: { $sum: 1 },
            avgAmount:{ $avg: '$amount' }
          }
        }
      ]);
      res.json(stats[0] || {totalAmount: 0, count: 0, avgAmount:0 });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur' });
    }
 });

 export default router;