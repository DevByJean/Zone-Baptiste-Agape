import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import {
    createRegistration,
    getRegistrations,
    updateRegistrationStatus,
    deleteRegistration
} from '../controllers/registration.controller';

const router = Router();

router.post('/', createRegistration);
router.get('/', protect, getRegistrations);
router.put('/:id', protect, updateRegistrationStatus);
router.delete('/:id', protect, deleteRegistration);

export default router;
