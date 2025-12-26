import connectDB from "@/lib/db";
import Gig from "@/models/Gig";
import { NextResponse } from "next/server";

// 1. POST: Dùng để Đăng bài mới (Giữ nguyên cái cũ)
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newGig = await Gig.create(body);
    return NextResponse.json({ success: true, data: newGig }, { status: 201 });
  } catch (error) {
    console.error("Lỗi tạo Gig:", error);
    return NextResponse.json({ success: false, error: "Lỗi Server" }, { status: 500 });
  }
}

// 2. GET: Dùng để Lấy danh sách bài (THÊM MỚI)
export async function GET() {
  try {
    await connectDB();
    // Lấy tất cả bài, sắp xếp bài mới nhất lên đầu (createdAt: -1)
    const gigs = await Gig.find().sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: gigs });
  } catch (error) {
    console.error("Lỗi lấy Gig:", error);
    return NextResponse.json({ success: false, error: "Lỗi Server" }, { status: 500 });
  }
}