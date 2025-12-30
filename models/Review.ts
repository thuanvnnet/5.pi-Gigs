import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  gigId: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  buyerId: string;
  sellerId: string;
  star: number;
  comment: string;
}

const ReviewSchema: Schema = new Schema(
  {
    gigId: { type: Schema.Types.ObjectId, ref: 'Gig', required: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, unique: true }, // Một đơn hàng chỉ được đánh giá một lần
    buyerId: { type: String, required: true }, // Lưu UID của người mua
    sellerId: { type: String, required: true }, // Lưu UID của người bán
    star: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

const Review = mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);

export default Review;