import mongoose, { Document, Schema } from 'mongoose';

export interface INews extends Document {
  title: string;
  content: string;
  excerpt: string;
  image?: string;
  author: string;
  category: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NewsSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    image: { type: String },
    author: { type: String, required: true },
    category: { type: String, default: 'General' },
    published: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model<INews>('News', NewsSchema);
