import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Gig from "@/models/Gig";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { username } = await req.json(); // Lấy username từ Frontend gửi lên

    if (!username) {
      return NextResponse.json({ success: false, error: "Missing username" }, { status: 400 });
    }

    // 1. Lấy số liệu thống kê (Stats)
    // - Tính tổng tiền kiếm được (Chỉ tính đơn đã hoàn thành)
    const completedOrders = await Order.find({ sellerId: username, status: "completed" });
    const totalEarnings = completedOrders.reduce((acc, order) => acc + order.price, 0);

    // - Đếm số đơn đang làm (In Progress + Delivered)
    const activeOrdersCount = await Order.countDocuments({ 
      sellerId: username, 
      status: { $in: ["in_progress", "delivered"] } 
    });

    // 2. Lấy danh sách đơn bán (Selling Orders)
    const sellingOrders = await Order.find({ sellerId: username }).sort({ createdAt: -1 });

    // 3. Lấy danh sách đơn mua (Buying Orders)
    const buyingOrders = await Order.find({ buyerId: username }).sort({ createdAt: -1 });

    // 4. Lấy danh sách Gig của tôi
    const myGigs = await Gig.find({ "seller.username": username });

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          earnings: totalEarnings,
          active_orders: activeOrdersCount,
          completed_orders: completedOrders.length
        },
        sellingOrders,
        buyingOrders,
        myGigs
      }
    });

  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}