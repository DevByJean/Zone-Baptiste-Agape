import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  adminId?: string;
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  // Avant : startsWith('Bearer') sans espace, incohérent avec verify()
  // qui vérifie 'Bearer ' (avec espace) dans auth.controller.ts.
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Non autorisé - Token manquant' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET || 'default-secret';
    const decoded = jwt.verify(token, secret) as { id: string };
    req.adminId = decoded.id;
    next();
  } catch (error) {
    // Avant : message copié-collé du cas "token manquant" ("Non autorise -
    // TOken manquant"), trompeur puisqu'ici le token existe mais est
    // invalide ou expiré.
    res.status(401).json({ message: 'Non autorisé - Token invalide ou expiré' });
  }
};