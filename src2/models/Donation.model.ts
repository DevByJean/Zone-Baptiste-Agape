import mongoose, { Document, Schema } from 'mongoose';

export interface IDonation extends Document {
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  transactionId?: string;
  status: 'pending' | 'completed' | 'failed';
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DonationSchema: Schema = new Schema(
  {
    donorName: { type: String, required: true },
    donorEmail: { type: String, required: true },
    donorPhone: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'XOF' },
    paymentMethod: { type: String, required: true },
    transactionId: { type: String },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    message: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model<IDonation>('Donation', DonationSchema);
