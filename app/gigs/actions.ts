'use server';

import connectDB from '@/lib/db';
import Gig from '@/models/Gig';
import { revalidatePath } from 'next/cache';

// Giả lập hàm lấy session phía server
// Trong ứng dụng thực tế, bạn sẽ lấy thông tin này từ session hoặc token
async function getSession() {
    // Để phục vụ demo, trả về một người dùng giả lập.
    // Hãy thay thế bằng logic session thực tế của bạn.
    return {
        user: {
            // ID này phải khớp với kiểu dữ liệu bạn lưu trong `favoritedBy`
            id: 'mock-user-id-string' 
        }
    };
}

export async function toggleFavoriteAction(gigId: string, pathname: string) {
    const session = await getSession();
    if (!session?.user) {
        return { success: false, error: 'Please login to favorite gigs.' };
    }
    const userId = session.user.id;

    try {
        await connectDB();
        const gig = await Gig.findById(gigId);
        if (!gig) {
            return { success: false, error: 'Gig not found.' };
        }

        const isFavorited = gig.favoritedBy?.includes(userId);

        await Gig.updateOne({ _id: gigId }, isFavorited ? { $pull: { favoritedBy: userId } } : { $addToSet: { favoritedBy: userId } });

        revalidatePath(pathname);
        return { success: true };
    } catch (error) {
        console.error("TOGGLE_FAVORITE_ERROR:", error);
        return { success: false, error: 'A server error occurred.' };
    }
}