import mongoose, { Document, Schema } from 'mongoose';

export interface IMember extends Document {
  name: string;
  role: string;
  organization: 'CBT' | 'Zone';
  image?: string;
  email?: string;
  phone?: string;
  bio?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const MemberSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    organization: { type: String, enum: ['CBT', 'Zone'], required: true },
    image: { type: String },
    email: { type: String },
    phone: { type: String },
    bio: { type: String },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model<IMember>('Member', MemberSchema);
