import { Router, Response } from 'express';
import News from '../models/News.model';
import { protect, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { limit, category } = req.query;
    let filter: any = { published: true };

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      delete filter.published;
    }

    if (category) filter.category = category;

    let query = News.find(filter).sort({ createdAt: -1 });
    if (limit) query = query.limit(parseInt(limit as string));

    const news = await query;
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: 'Article non trouve' });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const news = await News.create(req.body);
    res.status(201).json(news);
  } catch (error) {
    res.status(400).json({ message: 'Erreur de creation' });
  }
});

router.put('/:id', protect, async (req: AuthRequest, res: Response) => {
  try {
    const news = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!news) return res.status(404).json({ message: 'Article non trouve' });
    res.json(news);
  } catch (error) {
    res.status(400).json({ message: 'Erreur de mise a jour' });
  }
});

router.delete('/:id', protect, async (req: AuthRequest, res: Response) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) return res.status(404).json({ message: 'Article non trouve' });
    res.json({ message: 'Article supprime' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;
