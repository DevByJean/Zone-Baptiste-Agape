import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import {
    getGallery,
    getGalleryItemById,
    createGalleryItem,
    updateGalleryItem,
    deleteGalleryItem
} from '../controllers/gallery.controller';

const router = Router();

router.get('/', getGallery);
router.get('/:id', getGalleryItemById);
router.post('/', protect, createGalleryItem);
router.put('/:id', protect, updateGalleryItem);
router.delete('/:id', protect, deleteGalleryItem);

export default router;
