import connectDB from "@/lib/db";
import Gig from "@/models/Gig";
import { NextResponse } from "next/server";
// import { getSessionUser } from "@/lib/auth"; // QUAN TRỌNG: Import hàm lấy session người dùng của bạn

// 1. POST: Tạo bài mới (Giữ nguyên)
export async function POST(req: Request) {
  try {
    await connectDB();
    
    // --- BƯỚC KIỂM TRA BẢO MẬT ---
    // Đây là code giả lập, bạn cần thay thế bằng logic xác thực của mình
    // const sessionUser = await getSessionUser();
    // if (!sessionUser) {
    //   return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    // }
    // --- KẾT THÚC KIỂM TRA BẢO MẬT ---

    // Chỉ lấy các trường dữ liệu của Gig, không lấy thông tin seller từ body
    const { title, description, category, price, deliveryTime, image, gallery } = await req.json();

    const newGig = await Gig.create({
      title,
      description,
      category,
      price,
      deliveryTime,
      image,
      gallery,
      // Lấy thông tin seller từ session đã xác thực trên server
      seller: { username: "PiMaster_VN", uid: "PiMaster_VN" }, // Thay thế bằng sessionUser.username và sessionUser.uid
      rating: 0,
      reviewsCount: 0
    });

    return NextResponse.json({ success: true, data: newGig }, { status: 201 });
  } catch (error) {
    // ... giữ nguyên xử lý lỗi
    console.error(error);
    return NextResponse.json({ success: false, error: "Lỗi server" }, { status: 500 });
  }
}

// 2. GET: Lấy danh sách (ĐÃ NÂNG CẤP BỘ LỌC)
export async function GET(req: Request) {
  try {
    await connectDB();

    // Lấy tham số từ URL (VD: ?q=logo&min=5)
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category");
    const minPrice = searchParams.get("min");
    const maxPrice = searchParams.get("max");
    const sort = searchParams.get("sort") || "newest";
    const sellerId = searchParams.get("sellerId");
    const exclude = searchParams.get("exclude");
    const limit = searchParams.get("limit");

    // Xây dựng bộ lọc cho MongoDB
    const filter: any = {};

    // Tìm trong Tiêu đề HOẶC Mô tả
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } }, // 'i' = không phân biệt hoa thường
        { description: { $regex: query, $options: "i" } }
      ];
    }

    // Lọc danh mục
    if (category && category !== "all") {
      filter.category = category;
    }

    // Lọc khoảng giá
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice); // Lớn hơn hoặc bằng
      if (maxPrice) filter.price.$lte = Number(maxPrice); // Nhỏ hơn hoặc bằng
    }

    // Lọc theo người bán
    if (sellerId) {
      filter['seller.uid'] = sellerId;
    }

    // Loại trừ một ID cụ thể (dùng để không hiển thị gig hiện tại)
    if (exclude) {
      filter._id = { $ne: exclude }; // $ne = Not Equal
    }

    // Sắp xếp
    let sortOption: any = { createdAt: -1 }; // Mặc định: Mới nhất
    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };

    // Truy vấn
    let gigsQuery = Gig.find(filter).sort(sortOption);
    if (limit) gigsQuery = gigsQuery.limit(Number(limit));
    const gigs = await gigsQuery;

    return NextResponse.json({ success: true, data: gigs });

  } catch (error) {
    console.error("Search Error:", error);
    return NextResponse.json({ success: false, error: "Lỗi Server" }, { status: 500 });
  }
}