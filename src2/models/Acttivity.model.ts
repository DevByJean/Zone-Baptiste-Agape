import mongoose, {Document, Schema } from 'mongoose';

export interface IActivity extends Document {
    title: string;
    description: string;
    date: Date;
    location: string;
    image?: string;
    departement?: string;
    registrationRequied: boolean;
    registrationDeadline?: Date;
    maxParticipants?: number;
    createdAt: Date;
    updatedAt: Date;
}

const ActivitySchema: Schema = new Schema(
    {
        title: { type: String, required: true},
        description: { type: String, required: true},
        Date: { type: Date, required: true},
        location: { type: String, required: true},
        Image: {type: String },
        departement: { type: String},
        registrationRequired: {type: Boolean, default: false},
        registrationDeadline: { type:Date },
        maxParticipants: { type: Number }
    },
    {timestamps: true }
);

export default mongoose.model<IActivity>('Activity', ActivitySchema);