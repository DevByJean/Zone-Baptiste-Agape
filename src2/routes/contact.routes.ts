import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import {
    createContact,
    getContacts,
    markAsRead,
    deleteContact
} from '../controllers/contact.controller';

const router = Router();

router.post('/', createContact);
router.get('/', protect, getContacts);
router.put('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteContact);

export default router;
