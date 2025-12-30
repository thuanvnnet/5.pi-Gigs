import connectDB from "@/lib/db";
import Gig from "@/models/Gig";
import { NextResponse } from "next/server";

// import { getSessionUser } from "@/lib/auth"; // QUAN TRỌNG: Import hàm lấy session người dùng của bạn ở đây

// 1. GET: Lấy thông tin Gig cũ để điền vào Form
export async function GET(req: Request, { params }: { params: { id:string } }) {
  try {
    await connectDB();
    const { id } = params;

    const gig = await Gig.findById(id);

    if (!gig) {
      return NextResponse.json(
        { success: false, error: "Gig not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: gig });
  } catch (error) {
    console.error("GIG_GET_ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Server Error" },
      { status: 500 }
    );
  }
}

// 2. PUT: Lưu thông tin sau khi Sửa (Đã thêm bảo mật)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = params;
    const body = await req.json();

    // --- BƯỚC KIỂM TRA BẢO MẬT ---
    // Đây là code giả lập, bạn cần thay thế bằng logic xác thực của mình
    // const sessionUser = await getSessionUser();
    // if (!sessionUser) {
    //   return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    // }

    const gigToUpdate = await Gig.findById(id);
    if (!gigToUpdate) {
      return NextResponse.json({ success: false, error: "Gig not found" }, { status: 404 });
    }

    // So sánh ID người dùng hiện tại với ID người bán của Gig
    // if (gigToUpdate.seller.uid !== sessionUser.uid) {
    //   return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    // }
    // --- KẾT THÚC KIỂM TRA BẢO MẬT ---

    // Chỉ cho phép cập nhật các trường được chỉ định để tránh lỗ hổng Mass Assignment
    const { title, category, price, deliveryTime, description, image, gallery } = body;
    const updateData = { title, category, price, deliveryTime, description, image, gallery };

    // { new: true } để trả về dữ liệu mới nhất sau khi update
    const updatedGig = await Gig.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if (!updatedGig) {
      return NextResponse.json({ success: false, error: "Gig not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedGig });
  } catch (error) {
    console.error("GIG_UPDATE_ERROR:", error);
    return NextResponse.json({ success: false, error: "Update Failed" }, { status: 500 });
  }
}

// 3. DELETE: Xóa Gig (Đã thêm bảo mật)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = params;

    // --- BƯỚC KIỂM TRA BẢO MẬT (Tương tự như PUT) ---
    // const sessionUser = await getSessionUser();
    // if (!sessionUser) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    // const gigToDelete = await Gig.findById(id);
    // if (!gigToDelete) return NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });
    // if (gigToDelete.seller.uid !== sessionUser.uid) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    // --- KẾT THÚC KIỂM TRA BẢO MẬT ---

    const deletedGig = await Gig.findByIdAndDelete(id);

    if (!deletedGig) {
      return NextResponse.json({ success: false, error: "Gig not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Gig deleted successfully" });
  } catch (error) {
    console.error("GIG_DELETE_ERROR:", error);
    return NextResponse.json({ success: false, error: "Delete Failed" }, { status: 500 });
  }
}