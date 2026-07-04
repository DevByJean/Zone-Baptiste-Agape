import { Request, Response } from 'express';
import Registration from '../models/Registration.model';
import Activity from '../models/Acttivity.model';

export const createRegistration = async (req: Request, res: Response) => {
    try {
        const { activityId } = req.body;

        const activity = await Activity.findById(activityId);
        if (!activity) {
            return res.status(404).json({ message: 'Activite non trouvee' });
        }

        if (!activity.registrationRequired) {
            return res.status(400).json({ message: 'Cette activite ne necessite pas d\'inscription' });
        }

        if (activity.registrationDeadline && new Date() > activity.registrationDeadline) {
            return res.status(400).json({ message: 'La date limite d\'inscription est passee' });
        }

        if (activity.maxParticipants) {
            const count = await Registration.countDocuments({ activityId, status: { $ne: 'cancelled' } });
            if (count >= activity.maxParticipants) {
                return res.status(400).json({ message: 'Plus de places disponibles' });
            }
        }

        const registration = await Registration.create(req.body);
        res.status(201).json({ message: 'Inscription reussie', id: registration._id });
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de l\'inscription' });
    }
};

export const getRegistrations = async (req: Request, res: Response) => {
    try {
        const { activityId, status } = req.query;
        const filter: Record<string, unknown> = {};

        if (activityId) filter.activityId = activityId;
        if (status) filter.status = status;

        const registrations = await Registration.find(filter)
            .populate('activityId', 'title date location')
            .sort({ createdAt: -1 });
        res.json(registrations);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

export const updateRegistrationStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        const registration = await Registration.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!registration) return res.status(404).json({ message: 'Inscription non trouvee' });
        res.json(registration);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

export const deleteRegistration = async (req: Request, res: Response) => {
    try {
        const registration = await Registration.findByIdAndDelete(req.params.id);
        if (!registration) return res.status(404).json({ message: 'Inscription non trouvee' });
        res.json({ message: 'Inscription supprimee' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
