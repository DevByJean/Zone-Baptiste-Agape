import { Request, Response } from 'express';
import Gallery from '../models/Gallery.model';

export const getGallery = async (req: Request, res: Response) => {
    try {
        const { category, departement, limit } = req.query;
        const filter: Record<string, unknown> = {};

        if (category) filter.category = category;
        if (departement) filter.departement = departement;

        let query = Gallery.find(filter).sort({ createdAt: -1 });
        if (limit) query = query.limit(parseInt(limit as string));

        const items = await query;
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

export const getGalleryItemById = async (req: Request, res: Response) => {
    try {
        const item = await Gallery.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Image non trouvee' });
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

export const createGalleryItem = async (req: Request, res: Response) => {
    try {
        const item = await Gallery.create(req.body);
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ message: 'Erreur de creation' });
    }
};

export const updateGalleryItem = async (req: Request, res: Response) => {
    try {
        const item = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!item) return res.status(404).json({ message: 'Image non trouvee' });
        res.json(item);
    } catch (error) {
        res.status(400).json({ message: 'Erreur de mise a jour' });
    }
};

export const deleteGalleryItem = async (req: Request, res: Response) => {
    try {
        const item = await Gallery.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ message: 'Image non trouvee' });
        res.json({ message: 'Image supprimee' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
