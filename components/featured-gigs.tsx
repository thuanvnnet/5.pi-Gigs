import Link from "next/link"
import connectDB from "@/lib/db"
import mongoose from "mongoose"
import Gig from "@/models/Gig"
import Category from "@/models/Category"
import { GigCard } from "@/components/gig/GigCard"
import { processGigsForClient, LeanGig } from "@/lib/gig-utils"

// Giả lập hàm lấy session phía server để kiểm tra trạng thái yêu thích
async function getSession() {
    // Trong ứng dụng thực tế, bạn sẽ lấy thông tin này từ session hoặc token
    return { user: { id: 'mock-user-id-string' } };
}

async function getFeaturedGigs() {
    await connectDB();
    const session = await getSession();
    const userId = session.user?.id;

    // Lấy 8 Gigs nổi bật đã được duyệt
    const gigs = await Gig.find({ status: 'approved', isFeatured: true })
        .sort({ createdAt: -1 })
        .limit(8)
        .lean() as LeanGig[];

    // Lấy các slug danh mục duy nhất từ các gigs đã tìm thấy
    const categorySlugs = [...new Set(gigs.map(gig => gig.category))];
    // Tìm các danh mục tương ứng
    const categories = await Category.find({ slug: { $in: categorySlugs } }).lean();
    // Tạo một map để tra cứu tên danh mục từ slug nhanh chóng
    const categoryMap = new Map(categories.map(cat => [cat.slug, cat.name]));

    // Xử lý dữ liệu gigs cho client (ví dụ: kiểm tra trạng thái yêu thích)
    const processedGigs = processGigsForClient(gigs, userId);

    // Thêm tên danh mục vào mỗi gig
    return processedGigs.map(gig => ({
        ...gig,
        categoryName: categoryMap.get(gig.category) || 'Uncategorized'
    }));
}

export default async function FeaturedGigs() {
  const gigs = await getFeaturedGigs();

  return (
    <section className="container mx-auto px-4 py-16">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end mb-8">
        <div>
           <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Gigs</h2>
           <p className="text-gray-500">Hand-picked services with excellent quality and value.</p>
        </div>
        <Link href="/search" className="text-[#1dbf73] font-bold hover:underline hidden md:block">
          View All Gigs →
        </Link>
      </div>

      {/* EMPTY STATE */}
      {gigs.length === 0 && (
        <div className="text-center py-10 border border-dashed border-gray-200 rounded-xl">
          <p className="text-gray-500">No gigs found. Be the first to post!</p>
          <Link href="/create">
            <button className="mt-4 px-4 py-2 bg-[#1dbf73] text-white rounded-md font-bold text-sm">
              Post a Gig
            </button>
          </Link>
        </div>
      )}

      {/* GIGS GRID */}
      {gigs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {gigs.map((gig: any) => <GigCard key={gig._id} gig={gig} isFavorited={gig.isFavorited} categoryName={gig.categoryName} />)}
        </div>
      )}

      {/* MOBILE BUTTON */}
      <div className="mt-8 text-center md:hidden">
         <Link href="/search" className="text-[#1dbf73] font-bold hover:underline">
            View All Gigs →
         </Link>
      </div>
    </section>
  )
}