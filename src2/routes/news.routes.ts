import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import {
    getNews,
    getNewsById,
    createNews,
    updateNews,
    deleteNews
} from '../controllers/news.controller';

const router = Router();

router.get('/', getNews);
router.get('/:id', getNewsById);
router.post('/', protect, createNews);
router.put('/:id', protect, updateNews);
router.delete('/:id', protect, deleteNews);

export default router;
