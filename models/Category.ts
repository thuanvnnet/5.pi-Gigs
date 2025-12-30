import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
}

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  },
  { timestamps: true }
);

// Ngăn chặn việc tạo slug trùng lặp
CategorySchema.index({ slug: 1 });

const Category = mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);

export default Category;