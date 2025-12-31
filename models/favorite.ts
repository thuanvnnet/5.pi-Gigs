import mongoose, { Document, Model, Schema } from 'mongoose';

// Interface for the Favorite document
export interface IFavorite extends Document {
  userId: string;
  gigId: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

// Mongoose schema for Favorite
const FavoriteSchema: Schema<IFavorite> = new Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
  },
  gigId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig',
    required: [true, 'Gig ID is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// To prevent model overwrite errors in Next.js, especially in development
const Favorite: Model<IFavorite> = mongoose.models.Favorite || mongoose.model<IFavorite>('Favorite', FavoriteSchema);

export default Favorite;