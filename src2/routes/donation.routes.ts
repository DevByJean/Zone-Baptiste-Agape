import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import {
    createDonation,
    getDonations,
    updateDonation,
    deleteDonation,
    getDonationStats
} from '../controllers/donation.controller';

const router = Router();

router.post('/', createDonation);
router.get('/', protect, getDonations);
router.put('/:id', protect, updateDonation);
router.delete('/:id', protect, deleteDonation);
router.get('/stats', protect, getDonationStats);

export default router;