import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Gig from "@/models/Gig";
import { NextResponse } from "next/server";
// import { getSessionUser } from "@/lib/auth"; // QUAN TRỌNG: Import hàm lấy session người dùng

export async function POST(req: Request) {
  try {
    await connectDB();

    // --- BƯỚC 1: XÁC THỰC NGƯỜI MUA ---
    // const sessionUser = await getSessionUser();
    // if (!sessionUser) {
    //   return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    // }
    // const buyerId = sessionUser.uid;
    const buyerId = "PiBuyer_Test"; // Giả lập người mua

    const body = await req.json();
    const { gigId } = body;

    if (!gigId) {
      return NextResponse.json({ success: false, error: "Gig ID is required" }, { status: 400 });
    }

    // --- BƯỚC 2: LẤY THÔNG TIN GIG TỪ DATABASE (KHÔNG TIN TƯỞNG CLIENT) ---
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return NextResponse.json({ success: false, error: "Gig not found" }, { status: 404 });
    }

    // --- BƯỚC 3: KIỂM TRA LOGIC NGHIỆP VỤ ---
    if (gig.seller.uid === buyerId) {
      return NextResponse.json({ success: false, error: "You cannot buy your own gig" }, { status: 400 });
    }

    const { title: gigTitle, image: gigImage, price, seller } = gig;

    // Tạo đơn hàng mới (Status mặc định là 'created')
    const newOrder = await Order.create({
      gigId,
      gigTitle,
      gigImage,
      buyerId,
      sellerId: seller.uid,
      price,
    });

    return NextResponse.json({ success: true, orderId: newOrder._id });

  } catch (error) {
    console.error("Create Order Error:", error);
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}