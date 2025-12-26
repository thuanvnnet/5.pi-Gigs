import mongoose, { Schema } from "mongoose";

const GigSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String, default: "/placeholder.svg" }, // Ảnh mặc định nếu không up
    gallery: { type: [String], default: [] }, 
    images: [{ type: String }],
    seller: {
      username: { type: String, required: true },
      // Sau này có thể lưu thêm uid, avatar...
    },
  },
  { timestamps: true } // Tự động lưu ngày tạo (createdAt)
);

// Nếu model đã tồn tại thì dùng lại, chưa thì tạo mới (Tránh lỗi khi Next.js chạy lại)
const Gig = mongoose.models.Gig || mongoose.model("Gig", GigSchema);

export default Gig;