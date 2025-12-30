import connectDB from "@/lib/db";
import Category from "@/models/Category";
import { CategoryManager } from "./CategoryManager";

export const dynamic = 'force-dynamic';

async function getCategories() {
    await connectDB();
    const categories = await Category.find({}).sort({ name: 1 });
    return JSON.parse(JSON.stringify(categories));
}

export default async function AdminCategoriesPage() {
    const categories = await getCategories();
    return <CategoryManager initialCategories={categories} />;
}