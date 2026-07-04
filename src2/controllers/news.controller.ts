import { Request, Response } from 'express';
import News from '../models/News.model';

export const getNews = async (req: Request, res: Response) => {
    try {
        const { limit, category } = req.query;
        let filter: Record<string, unknown> = { published: true };

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
};

export const getNewsById = async (req: Request, res: Response) => {
    try {
        const news = await News.findById(req.params.id);
        if (!news) return res.status(404).json({ message: 'Article non trouve' });
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

export const createNews = async (req: Request, res: Response) => {
    try {
        const news = await News.create(req.body);
        res.status(201).json(news);
    } catch (error) {
        res.status(400).json({ message: 'Erreur de creation' });
    }
};

export const updateNews = async (req: Request, res: Response) => {
    try {
        const news = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!news) return res.status(404).json({ message: 'Article non trouve' });
        res.json(news);
    } catch (error) {
        res.status(400).json({ message: 'Erreur de mise a jour' });
    }
};

export const deleteNews = async (req: Request, res: Response) => {
    try {
        const news = await News.findByIdAndDelete(req.params.id);
        if (!news) return res.status(404).json({ message: 'Article non trouve' });
        res.json({ message: 'Article supprime' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
