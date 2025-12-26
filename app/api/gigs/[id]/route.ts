import connectDB from "@/lib/db";
import Gig from "@/models/Gig";
import { NextResponse } from "next/server";

// Hàm hỗ trợ lấy ID an toàn (dành cho Next.js mới nhất)
async function getId(params: any) {
  const p = await params;
  return p.id;
}

// 1. GET: Lấy thông tin Gig cũ để điền vào Form Sửa
export async function GET(req: Request, { params }: { params: any }) {
  try {
    await connectDB();
    const id = await getId(params);

    const gig = await Gig.findById(id);

    if (!gig) {
      return NextResponse.json({ success: false, error: "Gig not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: gig });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}

// 2. PUT: Lưu thông tin sau khi Sửa
export async function PUT(req: Request, { params }: { params: any }) {
  try {
    await connectDB();
    const id = await getId(params);
    const body = await req.json();

    // { new: true } để trả về dữ liệu mới nhất sau khi update
    const updatedGig = await Gig.findByIdAndUpdate(id, body, { new: true });

    if (!updatedGig) {
      return NextResponse.json({ success: false, error: "Gig not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedGig });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Update Failed" }, { status: 500 });
  }
}

// 3. DELETE: Xóa Gig
export async function DELETE(req: Request, { params }: { params: any }) {
  try {
    await connectDB();
    const id = await getId(params);
    await Gig.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Delete Failed" }, { status: 500 });
  }
}