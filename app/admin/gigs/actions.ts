'use server';

import connectDB from '@/lib/db';
import Gig from '@/models/Gig';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Giả lập hàm kiểm tra quyền admin
async function isAdmin() {
    // Trong ứng dụng thực tế, bạn sẽ lấy session và kiểm tra vai trò người dùng
    return true;
}

const UpdateGigSchema = z.object({
    status: z.enum(['pending', 'approved', 'rejected']).optional(),
    isFeatured: z.boolean().optional(),
});

export async function updateGigAction(gigId: string, formData: { status?: string; isFeatured?: boolean }) {
    if (!await isAdmin()) {
        return { success: false, error: 'Forbidden' };
    }

    const validatedFields = UpdateGigSchema.safeParse(formData);

    if (!validatedFields.success) {
        return { success: false, error: 'Invalid input.' };
    }

    try {
        await connectDB();
        await Gig.findByIdAndUpdate(gigId, validatedFields.data);
        
        revalidatePath('/admin/gigs'); // Đây là dòng lệnh quan trọng để xóa cache
        
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Database error.' };
    }
}

export async function deleteGigAction(gigId: string) {
    if (!await isAdmin()) {
        return { success: false, error: 'Forbidden' };
    }
    
    try {
        await connectDB();
        await Gig.findByIdAndDelete(gigId);
        
        revalidatePath('/admin/gigs'); // Xóa cache sau khi xóa
        
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Database error.' };
    }
}