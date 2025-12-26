import connectDB from "@/lib/db";
import Gig from "@/models/Gig";
import { NextResponse } from "next/server";

// 1. POST: Tạo bài mới (Giữ nguyên)
export async function POST(req: Request) {
  try {
    await connectDB();
    
    // 👇 Thêm 'gallery' vào danh sách nhận dữ liệu
    const { title, description, category, price, image, gallery, seller } = await req.json();

    const newGig = await Gig.create({
      title,
      description,
      category,
      price,
      image,
      gallery, // 👇 Lưu mảng ảnh vào DB
      seller,
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

    // Sắp xếp
    let sortOption: any = { createdAt: -1 }; // Mặc định: Mới nhất
    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };

    // Truy vấn
    const gigs = await Gig.find(filter).sort(sortOption);

    return NextResponse.json({ success: true, data: gigs });

  } catch (error) {
    console.error("Search Error:", error);
    return NextResponse.json({ success: false, error: "Lỗi Server" }, { status: 500 });
  }
}