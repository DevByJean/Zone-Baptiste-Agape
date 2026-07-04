import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import {
    getActivities,
    getActivityById,
    createActivity,
    updateActivity,
    deleteActivity
} from '../controllers/activity.controller';

const router = Router();

router.get('/', getActivities);
router.get('/:id', getActivityById);
router.post('/', protect, createActivity);
router.post('/:id', protect, updateActivity);
router.delete('/:id', protect, deleteActivity);

export default router;