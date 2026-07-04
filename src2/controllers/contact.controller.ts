import { Request, Response } from 'express';
import Contact from '../models/Contact.model';

export const createContact = async (req: Request, res: Response) => {
    try {
        const contact = await Contact.create(req.body);
        res.status(201).json({ message: 'Message envoye avec succes' });
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de l\'envoi' });
    }
};

export const getContacts = async (req: Request, res: Response) => {
    try {
        const { unread } = req.query;
        const filter: Record<string, unknown> = {};
        if (unread === 'true') filter.isRead = false;

        const contacts = await Contact.find(filter).sort({ createdAt: -1 });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

export const markAsRead = async (req: Request, res: Response) => {
    try {
        const contact = await Contact.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
        if (!contact) return res.status(404).json({ message: 'Message non trouve' });
        res.json(contact);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

export const deleteContact = async (req: Request, res: Response) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) return res.status(404).json({ message: 'Message non trouve' });
        res.json({ message: 'Message supprime' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
