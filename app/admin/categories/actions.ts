'use server';

import connectDB from '@/lib/db';
import Gig from '@/models/Gig';
import Category from '@/models/Category';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

async function isAdmin() {
    // Giả lập kiểm tra quyền admin
    return true;
}

const CreateCategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
});

// Hàm tiện ích để tạo slug an toàn cho URL
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Thay thế khoảng trắng bằng '-'
    .replace(/[^\w\-]+/g, '')       // Xóa các ký tự không phải là chữ, số, hoặc '-'
    .replace(/\-\-+/g, '-');        // Thay thế nhiều '-' thành một '-'
}

export async function createCategoryAction(prevState: any, formData: FormData) {
    if (!await isAdmin()) return { message: 'Forbidden' };

    const validatedFields = CreateCategorySchema.safeParse({
        name: formData.get('name'),
    });

    if (!validatedFields.success) {
        return { message: validatedFields.error.flatten().fieldErrors.name?.[0] || 'Invalid input.' };
    }

    const { name } = validatedFields.data;
    const slug = slugify(name);

    try {
        await connectDB();
        const existingCategory = await Category.findOne({ $or: [{ name }, { slug }] });
        if (existingCategory) {
            return { message: 'Category with this name or slug already exists.' };
        }
        await Category.create({ name, slug });
        revalidatePath('/admin/categories');
        return { message: `Category "${name}" created.`, success: true };
    } catch (error) {
        return { message: 'Database error.' };
    }
}

export async function deleteCategoryAction(categoryId: string, categorySlug: string) {
    if (!await isAdmin()) {
        return { success: false, error: 'Forbidden' };
    }
    
    try {
        await connectDB();
        // Quan trọng: Kiểm tra xem có Gig nào đang sử dụng danh mục này không
        const gigsUsingCategory = await Gig.countDocuments({ category: categorySlug });
        if (gigsUsingCategory > 0) {
            return { success: false, error: `Cannot delete: ${gigsUsingCategory} gig(s) are using this category.` };
        }

        await Category.findByIdAndDelete(categoryId);
        revalidatePath('/admin/categories');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Database error.' };
    }
}