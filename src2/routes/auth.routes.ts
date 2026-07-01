import { Router } from 'express';
import Admin from '../models/Admin.models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
          return res.status(400).json({ message: 'Email et mot de passe requis'})
        }
        const admin = await Admin.findOne({ email: email.toLowerCase() });
        
        if (!admin) {
          return res.status(401).json({ message: 'Identifiants invalides' });
        }
        const isMatch = bcrypt.compare(password, admin.password);
        
        if (!isMatch) {
          return res.status(401).json({ message: 'identifiants invalides' });
        }

        const secret = process.env.JWT_SECRET || 'default-secret';
        const token = jwt.sign({ id: admin._id }, secret, { expiresIn: '7d' });

        res.json({
          token,
          admin: {
            id: admin._id,
            email: admin.email,
            name: admin.name
          }
        });
    } catch (error) {
      console.error('erreur login:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
});

router.get('/verify', async (req, res) =>{
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ valid: false });
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET || 'default-secret';
    const decoded = jwt.verify(token, secret) as {id: string};

    const admin = await Admin.findById(decoded.id);
    if(!admin) {
      return res.status(401).json({ valid: false });
    }

    res.json({
      valid: true,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name
      }
    });
  } catch (error) {
    res.status(401).json({ valid: false });
  }
});

export default router;

