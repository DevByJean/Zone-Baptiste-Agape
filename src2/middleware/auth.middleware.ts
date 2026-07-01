import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    adminId?: string;
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer')) {
        res.status(401).json({message:'Non autorise - Token manquant'});
        return;
    }

    const token = authHeader.split(' ')[1];

    try{
        const secret = process.env.JWT_SECRET || 'default-secret';
        const decoded = jwt.verify(token, secret) as {id: string };
        req.adminId = decoded.id;
        next();
    } catch(error) {
        res.status(401).json({ message: 'Non autorise - TOken manquant'})
    }
};