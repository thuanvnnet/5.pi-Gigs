import mongoose, { Schema } from "mongoose";

const GigSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    deliveryTime: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String, default: "/placeholder.svg" }, // Ảnh mặc định nếu không up
    gallery: { type: [String], default: [] }, 
    seller: {
      username: { type: String, required: true },
      uid: { type: String, required: true }, // Thêm UID để xác thực quyền sở hữu
    },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    isFeatured: { type: Boolean, default: false },
    favoritedBy: { type: [String], default: [] }, // Mảng các user ID đã yêu thích
  },
  { timestamps: true } // Tự động lưu ngày tạo (createdAt)
);

// Nếu model đã tồn tại thì dùng lại, chưa thì tạo mới (Tránh lỗi khi Next.js chạy lại)
const Gig = mongoose.models.Gig || mongoose.model("Gig", GigSchema);

export default Gig;