import mongoose, { Document, Schema } from 'mongoose';

export interface IRegistration extends Document {
  activityId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  church?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentMethod?: string;
  transactionId?: string;
  amount?: number;
  paymentStatus?: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
}

const RegistrationSchema: Schema = new Schema(
  {
    activityId: { type: Schema.Types.ObjectId, ref: 'Activity', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    church: { type: String },
    notes: { type: String },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
    paymentMethod: { type: String },
    transactionId: { type: String },
    amount: { type: Number },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'] }
  },
  { timestamps: true }
);

export default mongoose.model<IRegistration>('Registration', RegistrationSchema);
