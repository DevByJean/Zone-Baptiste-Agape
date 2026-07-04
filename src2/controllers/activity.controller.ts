import { Request, Response } from 'express';
import Activity from '../models/Acttivity.model';

export const getActivities = async (req: Request, res: Response) => {
    try {
        const { upcomming, departement } = req.query;
        const filter: Record<string, unknown> = {};

        if (departement) filter.departement = departement;
        if (upcomming === 'true') filter.date = { $gte: new Date() };

        const activities = await Activity.find(filter).sort({ date: 1 });
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

export const getActivityById = async (req: Request, res: Response) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (!activity) return res.status(404).json({ message: 'Activite non trouvee' });
        res.json(activity);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

export const createActivity = async (req: Request, res: Response) => {
    try {
        const activity = await Activity.create(req.body);
        res.status(201).json(activity);
    } catch (error) {
        res.status(400).json({ message: 'Erreur de creation' });
    }
};

export const updateActivity = async (req: Request, res: Response) => {
    try {
        const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!activity) return res.status(404).json({ message: 'Activite non trouve' });
        res.json(activity);
    } catch (error) {
        res.status(400).json({ message: 'Erreur de mise a jour' });
    }
};

export const deleteActivity = async (req: Request, res: Response) => {
    try {
        const activity = await Activity.findByIdAndDelete(req.params.id);
        if (!activity) return res.status(404).json({ message: 'Activite non trouvee' });
        res.json({ message: 'Activite supprimee' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
