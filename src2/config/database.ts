import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.models';

export const connectDB = async (): Promise<void> => {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        throw new Error("MONGO_URI non definie dans les variables d\'environnement");
    }

    try {
        const conn = await mongoose.connect(mongoUri);
        console.log(`MongoDB connecte: ${conn.connection.host}`);
    } catch (error) {
        console.error('Erreur de connexion MongoDB:', error);
        throw error;
    }
};

const createInitialAdmin = async (): Promise<void> => {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@zoba-cbt.org';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Zoba@2025!';

    const existingAdmin = await Admin.findOne({email: adminEmail });

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await Admin.create({
            email: adminEmail,
            password: hashedPassword,
            name: 'Administrateur'
        });
        console.log('Admin initial cree:', adminEmail);
    }
};