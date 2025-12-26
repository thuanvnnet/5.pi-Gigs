"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { notFound } from "next/navigation"

// 1. Dữ liệu giả lập (Thêm trường category để lọc)
const ALL_GIGS = [
  { id: 1, title: "Cài Node Pi & Docker trọn gói", price: 5, rating: 5.0, image: "/placeholder.svg", category: "programming" },
  { id: 2, title: "Thiết kế Logo hội nhóm Pi", price: 5, rating: 4.8, image: "/placeholder.svg", category: "design" },
  { id: 3, title: "Dịch Whitepaper sang tiếng Việt", price: 10, rating: 4.9, image: "/placeholder.svg", category: "writing" },
  { id: 4, title: "Gỡ lỗi treo đơn KYC", price: 5, rating: 4.7, image: "/placeholder.svg", category: "programming" },
  { id: 5, title: "Làm Video Intro giới thiệu Pi", price: 10, rating: 5.0, image: "/placeholder.svg", category: "video" },
  { id: 6, title: "Viết bài PR cho cửa hàng Pi", price: 5, rating: 4.5, image: "/placeholder.svg", category: "writing" },
]

// Map tên slug sang tên hiển thị đẹp hơn
const CATEGORY_NAMES: Record<string, string> = {
  design: "Thiết kế đồ họa",
  writing: "Viết lách & Dịch thuật",
  programming: "Lập trình & Kỹ thuật",
  marketing: "Marketing & SEO",
  video: "Video & Âm nhạc",
  business: "Kinh doanh",
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const slug = params.slug

  // Lọc các Gig thuộc danh mục này
  const filteredGigs = ALL_GIGS.filter(gig => gig.category === slug)

  // Lấy tên hiển thị (Nếu không có thì lấy chính cái slug)
  const categoryTitle = CATEGORY_NAMES[slug] || slug.charAt(0).toUpperCase() + slug.slice(1)

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#1dbf73]">Trang chủ</Link> &gt; <span className="text-gray-900 font-medium">{categoryTitle}</span>
        </div>

        {/* Header danh mục */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{categoryTitle}</h1>
          <p className="text-gray-500">Tìm thấy {filteredGigs.length} dịch vụ phù hợp với nhu cầu của bạn.</p>
        </div>

        {/* Danh sách dịch vụ */}
        {filteredGigs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredGigs.map((gig) => (
              <div key={gig.id} className="group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md flex flex-col">
                <Link href={`/gigs/${gig.id}`} className="block overflow-hidden">
                  <div className="aspect-[4/3] bg-gray-100 relative group-hover:opacity-90 transition">
                     <div className="w-full h-full flex items-center justify-center text-gray-400 bg-[#1dbf73]/10">
                        {categoryTitle.split(" ")[0]}
                     </div>
                  </div>
                </Link>

                <div className="p-4 flex flex-col flex-grow">
                  <Link href={`/gigs/${gig.id}`}>
                      <h3 className="font-semibold text-lg leading-tight mb-2 hover:text-[#1dbf73] transition cursor-pointer line-clamp-2">
                          {gig.title}
                      </h3>
                  </Link>
                  
                  <div className="flex justify-between items-center mt-auto">
                      <span className="text-yellow-500 font-bold flex items-center">★ {gig.rating}</span>
                      <span className="text-purple-700 font-bold text-xl">{gig.price} π</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Giao diện khi không có bài nào */
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-900">Chưa có dịch vụ nào</h3>
            <p className="text-gray-500 mb-6">Hãy là người đầu tiên đăng dịch vụ trong danh mục này!</p>
            <Link href="/create-gig">
              <button className="bg-[#1dbf73] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#1dbf73]/90">
                Đăng dịch vụ ngay
              </button>
            </Link>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  )
}