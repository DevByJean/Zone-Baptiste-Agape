import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import {
    getMembers,
    getMemberById,
    createMember,
    updateMember,
    deleteMember
} from '../controllers/member.controller';

const router = Router();

router.get('/', getMembers);
router.get('/:id', getMemberById);
router.post('/', protect, createMember);
router.put('/:id', protect, updateMember);
router.delete('/:id', protect, deleteMember);

export default router;
