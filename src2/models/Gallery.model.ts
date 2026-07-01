import mongoose, { Document, Schema } from 'mongoose';

export interface IGallery extends Document {
  title: string;
  description?: string;
  image: string;
  category: string;
  department?: string;
  event?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true },
    category: { type: String, default: 'General' },
    department: { type: String },
    event: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model<IGallery>('Gallery', GallerySchema);
