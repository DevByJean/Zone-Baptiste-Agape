import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import {
    subscribe,
    unsubscribe,
    getSubscribers,
    deleteSubscriber
} from '../controllers/subscriber.controller';

const router = Router();

router.post('/', subscribe);
router.delete('/unsubscribe', unsubscribe);
router.get('/', protect, getSubscribers);
router.delete('/:id', protect, deleteSubscriber);

export default router;
