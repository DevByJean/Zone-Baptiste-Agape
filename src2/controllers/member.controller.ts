import { Request, Response } from 'express';
import Member from '../models/Member.model';

export const getMembers = async (req: Request, res: Response) => {
    try {
        const { organization } = req.query;
        const filter = organization ? { organization } : {};
        const members = await Member.find(filter).sort({ order: 1, createdAt: -1 });
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

export const getMemberById = async (req: Request, res: Response) => {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) return res.status(404).json({ message: 'Membre non trouve' });
        res.json(member);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

export const createMember = async (req: Request, res: Response) => {
    try {
        const member = await Member.create(req.body);
        res.status(201).json(member);
    } catch (error) {
        res.status(400).json({ message: 'Erreur de creation', error });
    }
};

export const updateMember = async (req: Request, res: Response) => {
    try {
        const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!member) return res.status(404).json({ message: 'Membre non trouve' });
        res.json(member);
    } catch (error) {
        res.status(400).json({ message: 'Erreur de mise a jour' });
    }
};

export const deleteMember = async (req: Request, res: Response) => {
    try {
        const member = await Member.findByIdAndDelete(req.params.id);
        if (!member) return res.status(404).json({ message: 'Membre non trouve' });
        res.json({ message: 'Membre supprime' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
