import connectDB from "@/lib/db";
import Review from "@/models/Review";
import Gig from "@/models/Gig";
import Order from "@/models/Order";
import { NextResponse } from "next/server";
// import { getSessionUser } from "@/lib/auth";

// GET: Lấy tất cả review cho một Gig
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const gigId = searchParams.get("gigId");

    if (!gigId) {
      return NextResponse.json({ success: false, error: "Gig ID is required" }, { status: 400 });
    }

    const reviews = await Review.find({ gigId }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: reviews });

  } catch (error) {
    console.error("GET_REVIEWS_ERROR:", error);
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}

// POST: Tạo một review mới
export async function POST(req: Request) {
  try {
    await connectDB();

    // const sessionUser = await getSessionUser();
    // if (!sessionUser) {
    //   return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    // }
    // const userId = sessionUser.uid;
    const userId = "PiBuyer_Test"; // Giả lập người dùng đã mua hàng

    const { gigId, star, comment } = await req.json();

    if (!gigId || !star || !comment) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // --- CÁC BƯỚC KIỂM TRA BẢO MẬT ---
    // 1. Tìm một đơn hàng đã hoàn thành của người dùng này cho Gig này.
    const completedOrders = await Order.find({
      gigId,
      buyerId: userId,
      status: 'completed'
    });

    if (completedOrders.length === 0) {
      return NextResponse.json({ success: false, error: "You must have a completed order for this gig to leave a review." }, { status: 403 });
    }

    // 2. Kiểm tra xem có đơn hàng nào trong số đó chưa được đánh giá không.
    const completedOrderIds = completedOrders.map(o => o._id);
    const existingReviews = await Review.find({ orderId: { $in: completedOrderIds } });
    const reviewedOrderIds = existingReviews.map(r => r.orderId.toString());

    const orderToReview = completedOrders.find(o => !reviewedOrderIds.includes(o._id.toString()));

    if (!orderToReview) {
      return NextResponse.json({ success: false, error: "You have already reviewed all your completed orders for this gig." }, { status: 400 });
    }

    // Tạo review mới
    const newReview = await Review.create({
      gigId,
      orderId: orderToReview._id, // Sử dụng ID của đơn hàng hợp lệ
      star,
      comment,
      buyerId: userId,
      sellerId: orderToReview.sellerId,
    });

    // --- CẬP NHẬT LẠI RATING TRUNG BÌNH CHO GIG ---
    const reviews = await Review.find({ gigId });
    const totalStars = reviews.reduce((acc, review) => acc + review.star, 0);
    const newRating = totalStars / reviews.length;

    await Gig.findByIdAndUpdate(gigId, { rating: newRating, reviewsCount: reviews.length });

    return NextResponse.json({ success: true, data: newReview }, { status: 201 });

  } catch (error) {
    console.error("POST_REVIEW_ERROR:", error);
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}