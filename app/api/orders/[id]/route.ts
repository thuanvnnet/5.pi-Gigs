import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

// 1. GET: Lấy đơn hàng & LAZY CHECK (Tự động hoàn tất)
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    // @ts-ignore
    const { id } = await params; 
    let order = await Order.findById(id);

    if (!order) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    // 👇 LOGIC TỰ ĐỘNG HOÀN TẤT
    // Chỉ chạy khi status là 'delivered' VÀ đã quá hạn 3 ngày
    if (order.status === "delivered" && order.autoCompleteAt && new Date() > new Date(order.autoCompleteAt)) {
      order.status = "completed";
      order.completedAt = new Date();
      // TODO: Transfer funds to Seller here
      await order.save();
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}

// 2. PUT: Xử lý Hành động (The Workflow)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    // @ts-ignore
    const { id } = await params;
    const body = await req.json();
    const { action, deliveryFile, deliveryNote, disputeReason, refundReason } = body; 

    const order = await Order.findById(id);
    if (!order) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    // --- 1. BUYER TRẢ TIỀN ---
    if (action === "pay") {
      order.status = "in_progress";
      order.paidAt = new Date();
    }
    
    // --- 2. SELLER GIAO HÀNG (Kích hoạt 72h) ---
    else if (action === "deliver") {
      order.status = "delivered";
      order.deliveryFile = deliveryFile;
      order.deliveryNote = deliveryNote;
      order.deliveredAt = new Date();
      
      // Set 3 ngày (72h)
      const completionDate = new Date();
      completionDate.setDate(completionDate.getDate() + 3); 
      // completionDate.setMinutes(completionDate.getMinutes() + 1); // Uncomment để test 1 phút
      order.autoCompleteAt = completionDate;
    }

    // --- 3. BUYER YÊU CẦU SỬA (Revision Loop) ---
    else if (action === "revision") {
      order.status = "in_progress"; // Quay lại làm việc
      order.revisionsCount += 1;
      order.autoCompleteAt = null; // Hủy bộ đếm giờ
      // Seller sẽ phải giao hàng lại
    }

    // --- 4. BUYER BÁO CÁO (Dispute) ---
    else if (action === "dispute") {
      order.status = "disputed"; 
      order.disputeReason = disputeReason;
      // Đồng hồ dừng vì status không còn là 'delivered'
    }

    // --- 5. SELLER HOÀN TIỀN NGAY (Instant Refund) ---
    else if (action === "refund") {
      order.status = "cancelled";
      order.refundReason = refundReason || "Seller accepted refund";
      order.cancelledAt = new Date();
      // TODO: Transfer funds back to Buyer here
    }

    await order.save();
    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}