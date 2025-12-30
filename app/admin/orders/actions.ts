'use server';

import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Giả lập hàm kiểm tra quyền admin
async function isAdmin() {
    // Trong ứng dụng thực tế, bạn sẽ lấy session và kiểm tra vai trò người dùng
    return true;
}

const UpdateOrderSchema = z.object({
    status: z.enum(['created', 'in_progress', 'delivered', 'completed', 'disputed']),
});

export async function updateOrderAction(orderId: string, formData: { status: string }) {
    if (!await isAdmin()) {
        return { success: false, error: 'Forbidden' };
    }

    const validatedFields = UpdateOrderSchema.safeParse(formData);

    if (!validatedFields.success) {
        return { success: false, error: 'Invalid input.' };
    }

    try {
        await connectDB();
        await Order.findByIdAndUpdate(orderId, validatedFields.data);
        revalidatePath('/admin/orders'); // Xóa cache cho trang quản lý đơn hàng
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Database error.' };
    }
}