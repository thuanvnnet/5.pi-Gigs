import mongoose, { Schema } from "mongoose";

const ReviewSchema = new Schema(
  {
    gigId: { type: mongoose.Schema.Types.ObjectId, ref: "Gig", required: true },
    orderId: { type: String, required: true }, // ID đơn hàng
    buyerId: { type: String, required: true }, // Username người mua
    sellerId: { type: String, required: true }, // Username người bán
    
    star: { type: Number, required: true, min: 1, max: 5 }, // 1 đến 5 sao
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

// Mỗi đơn hàng chỉ được review 1 lần
ReviewSchema.index({ orderId: 1 }, { unique: true });

const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);
export default Review;