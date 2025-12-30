import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IReview extends Document {
  gigId: mongoose.Types.ObjectId;
  buyerId: string;
  star: number;
  comment: string;
}

interface IReviewModel extends Model<IReview> {
  calculateStats(gigId: mongoose.Types.ObjectId): Promise<void>;
}

const ReviewSchema: Schema<IReview, IReviewModel> = new Schema({
  gigId: { type: Schema.Types.ObjectId, ref: 'Gig', required: true, index: true },
  buyerId: { type: String, required: true },
  star: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

/**
 * Static method to calculate average rating and review count for a specific Gig.
 * It uses the aggregation pipeline for high efficiency.
 */
ReviewSchema.statics.calculateStats = async function (gigId: mongoose.Types.ObjectId) {
  const stats = await this.aggregate([
    { $match: { gigId: gigId } },
    {
      $group: {
        _id: '$gigId',
        reviewCount: { $sum: 1 },
        averageRating: { $avg: '$star' },
      },
    },
  ]);

  try {
    // Import Gig model here to avoid circular dependency issues
    const Gig = require('./Gig').default;
    if (stats.length > 0) {
      await Gig.findByIdAndUpdate(gigId, {
        reviewCount: stats[0].reviewCount,
        averageRating: stats[0].averageRating,
      });
    } else {
      // If no reviews are left, reset the stats
      await Gig.findByIdAndUpdate(gigId, {
        reviewCount: 0,
        averageRating: 0,
      });
    }
  } catch (err) {
    console.error('Error updating Gig stats:', err);
  }
};

// Mongoose middleware to automatically call the calculation after a review is saved or removed.
ReviewSchema.post('save', function () {
  // 'this' refers to the document that was saved
  (this.constructor as IReviewModel).calculateStats(this.gigId);
});

// Use 'findOneAndDelete' which is a query middleware triggered by findByIdAndDelete()
ReviewSchema.post('findOneAndDelete', async function (doc) {
  // 'doc' is the document that was deleted
  if (doc) {
    await (doc.constructor as IReviewModel).calculateStats(doc.gigId);
  }
});

export default (mongoose.models.Review as IReviewModel) || mongoose.model<IReview, IReviewModel>('Review', ReviewSchema);