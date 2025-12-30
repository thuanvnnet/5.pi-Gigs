'use server';

import connectDB from '@/lib/db';
import Category from '@/models/Category';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

async function isAdmin() {
    // Giả lập kiểm tra quyền admin
    return true;
}

const CategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  slug: z.string().min(2, 'Slug must be at least 2 characters.').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens.'),
});

export async function createCategoryAction(prevState: any, formData: FormData) {
    if (!await isAdmin()) return { message: 'Forbidden' };

    const validatedFields = CategorySchema.safeParse({
        name: formData.get('name'),
        slug: formData.get('slug'),
    });

    if (!validatedFields.success) {
        return { message: validatedFields.error.flatten().fieldErrors.name?.[0] || validatedFields.error.flatten().fieldErrors.slug?.[0] || 'Invalid input.' };
    }

    try {
        await connectDB();
        const existingCategory = await Category.findOne({ $or: [{ name: validatedFields.data.name }, { slug: validatedFields.data.slug }] });
        if (existingCategory) {
            return { message: 'Category with this name or slug already exists.' };
        }
        await Category.create(validatedFields.data);
        revalidatePath('/admin/categories');
        return { message: `Category "${validatedFields.data.name}" created.`, success: true };
    } catch (error) {
        return { message: 'Database error.' };
    }
}

export async function deleteCategoryAction(categoryId: string) {
    if (!await isAdmin()) {
        return { success: false, error: 'Forbidden' };
    }
    
    try {
        await connectDB();
        // Tùy chọn: Kiểm tra xem có Gig nào đang sử dụng danh mục này không trước khi xóa
        // const gigsUsingCategory = await Gig.countDocuments({ category: categoryId });
        // if (gigsUsingCategory > 0) {
        //     return { success: false, error: `Cannot delete category as it is being used by ${gigsUsingCategory} gig(s).` };
        // }

        await Category.findByIdAndDelete(categoryId);
        revalidatePath('/admin/categories');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Database error.' };
    }
}