import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    // Lấy dữ liệu từ Frontend gửi lên
    const { gigId, gigTitle, gigImage, buyerId, sellerId, price } = body;

    // Kiểm tra dữ liệu đầu vào
    if (!gigId || !buyerId || !sellerId || !price) {
      return NextResponse.json({ success: false, error: "Missing info" }, { status: 400 });
    }

    // Tạo đơn hàng mới (Status mặc định là 'created')
    const newOrder = await Order.create({
      gigId,
      gigTitle,
      gigImage: gigImage || "", 
      buyerId,
      sellerId,
      price,
      status: "created",
      revisionsCount: 0
    });

    return NextResponse.json({ success: true, orderId: newOrder._id });

  } catch (error) {
    console.error("Create Order Error:", error);
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}