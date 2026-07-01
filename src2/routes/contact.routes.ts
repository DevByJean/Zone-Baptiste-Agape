import { Router, Response } from "express";
import Contact from '../models/Contact.model';
import { protect, AuthRequest } from "../middleware/auth.middleware";

const router = Router();

router.post('/', async (req, res) =>{
    try {
        const contact = await Contact.create(req.body);
        res.status(201).json({ message: 'Message envoye avec succes'})
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de l\'envoi'});
        
    }
});

router.get('/', protect, async (req: AuthRequest, res: Response) =>{
    try {
      const { unread } = req.query;
      const filter: any = {};
      if(unread === 'true') filter.isRead = false;

      const contacts = await Contact.find(filter).sort({createdAt: -1});
      res.json(contacts);
    } catch (error) {
      res.status(500).json({message: 'Erreur serveur' });
    }
});

router.put('/:id/read', protect, async (req: AuthRequest, res: Response) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!contact) return res.status(404).json({ message: 'Message non trouve' });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.delete('/:id', protect, async (req: AuthRequest, res: Response) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Message non trouve' });
    res.json({ message: 'Message supprime' });
  } catch (error) {
    res.status(500).json({message: 'Erreur serveur' });
  }
});
