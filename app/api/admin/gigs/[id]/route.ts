import connectDB from "@/lib/db";
import Gig from "@/models/Gig";
import { NextResponse } from "next/server";

// Giả lập hàm lấy session admin
async function getAdminSession() {
    // Trong ứng dụng thực tế, bạn sẽ xác thực token và kiểm tra vai trò 'admin'
    return { user: { role: 'admin' } };
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getAdminSession();
        if (session?.user?.role !== 'admin') {
            return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
        }

        await connectDB();
        const { id } = params;
        const body = await req.json();

        // Chỉ cho phép cập nhật 'status' và 'isFeatured' để đảm bảo an toàn
        const updateData: { status?: string; isFeatured?: boolean } = {};
        if (body.status && ['pending', 'approved', 'rejected'].includes(body.status)) {
            updateData.status = body.status;
        }
        if (typeof body.isFeatured === 'boolean') {
            updateData.isFeatured = body.isFeatured;
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ success: false, error: "No valid fields to update" }, { status: 400 });
        }

        const updatedGig = await Gig.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedGig) {
            return NextResponse.json({ success: false, error: "Gig not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedGig });

    } catch (error) {
        console.error("ADMIN_UPDATE_GIG_ERROR:", error);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}