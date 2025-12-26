import connectDB from "@/lib/db";
import Review from "@/models/Review";
import Gig from "@/models/Gig";
import Order from "@/models/Order"; 
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// 1. POST: Gửi đánh giá mới (Code cũ của bạn)
export async function POST(req: Request) {
  try {
    await connectDB();
    const { gigId, orderId, star, comment, buyerId, sellerId } = await req.json();

    // Lưu Review
    await Review.create({
      gigId,
      orderId,
      buyerId,
      sellerId,
      star,
      comment
    });

    // Tính toán lại điểm trung bình
    const stats = await Review.aggregate([
      { $match: { gigId: new mongoose.Types.ObjectId(gigId) } },
      {
        $group: {
          _id: "$gigId",
          avgRating: { $avg: "$star" },
          numOfReviews: { $sum: 1 }
        }
      }
    ]);

    // Update vào Gig
    if (stats.length > 0) {
      await Gig.findByIdAndUpdate(gigId, {
        rating: stats[0].avgRating.toFixed(1),
        reviewsCount: stats[0].numOfReviews
      });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: "Bạn đã đánh giá đơn này rồi!" }, { status: 400 });
    }
    console.error("Lỗi POST Review:", error);
    return NextResponse.json({ success: false, error: "Lỗi Server" }, { status: 500 });
  }
}

// 2. GET: Lấy danh sách đánh giá (👇 BẠN ĐANG THIẾU CÁI NÀY 👇)
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const gigId = searchParams.get("gigId");

    if (!gigId) {
      return NextResponse.json({ success: false, error: "Thiếu gigId" }, { status: 400 });
    }

    // Tìm review theo gigId và sắp xếp mới nhất trước
    const reviews = await Review.find({ gigId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: reviews });

  } catch (error) {
    console.error("Lỗi GET Review:", error);
    return NextResponse.json({ success: false, error: "Không lấy được review" }, { status: 500 });
  }
}