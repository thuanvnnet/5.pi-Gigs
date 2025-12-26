import connectDB from "@/lib/db";
import Gig from "@/models/Gig";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    // Nếu không nhập gì hoặc nhập < 2 ký tự thì không tìm
    if (!query || query.length < 2) {
      return NextResponse.json({ success: true, data: [] });
    }

    // Chỉ lấy 5 kết quả đầu tiên, chỉ lấy trường 'title' cho nhẹ
    const suggestions = await Gig.find(
      { title: { $regex: query, $options: "i" } },
      { title: 1, _id: 1 } 
    ).limit(5);

    return NextResponse.json({ success: true, data: suggestions });
  } catch (error) {
    return NextResponse.json({ success: false, data: [] });
  }
}