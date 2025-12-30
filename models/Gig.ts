import mongoose, { Document, Schema } from 'mongoose';

export interface IGig extends Document {
  title: string;
  description: string;
  category: string;
  price: number;
  image?: string;
  gallery?: string[];
  deliveryTime: number;
  revisions: number;
  features: string[];
  seller: {
    uid: string;
    username: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  isFeatured: boolean;
  favoritedBy: string[];
  // --- ADD THESE FIELDS ---
  averageRating: number;
  reviewCount: number;
  // ------------------------
}

const GigSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true, index: true },
  price: { type: Number, required: true },
  image: String,
  gallery: [String],
  deliveryTime: { type: Number, required: true },
  revisions: { type: Number, default: 0 },
  features: [String],
  seller: { uid: String, username: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
  isFeatured: { type: Boolean, default: false, index: true },
  favoritedBy: [{ type: String }],
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Gig || mongoose.model<IGig>('Gig', GigSchema);