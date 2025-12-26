"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MapPin, User, Calendar, Star, CheckCircle2 } from "lucide-react"

// Dữ liệu giả lập các dịch vụ của người bán này
const SELLER_GIGS = [
  { id: 1, title: "Cài Node Pi & Docker trọn gói", price: 5, rating: 5.0, image: "/placeholder.svg" },
  { id: 5, title: "Tư vấn cấu hình PC chạy Node", price: 2, rating: 4.9, image: "/placeholder.svg" },
]

export default function SellerProfile({ params }: { params: { username: string } }) {
  // Lấy username từ URL (đã decode để hiển thị đẹp)
  const username = decodeURIComponent(params.username)

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* CỘT TRÁI: THÔNG TIN CÁ NHÂN */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center relative overflow-hidden">
              {/* Badge Online */}
              <div className="absolute top-4 right-4 flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Online
              </div>

              <div className="w-24 h-24 bg-[#1dbf73]/10 text-[#1dbf73] rounded-full mx-auto flex items-center justify-center text-4xl mb-4 border-4 border-white shadow-sm">
                {username.charAt(0).toUpperCase()}
              </div>
              
              <h1 className="text-xl font-bold text-gray-900 mb-1">{username}</h1>
              <p className="text-gray-500 text-sm mb-4">Lập trình viên & Pi Node Expert</p>

              <div className="flex justify-center mb-6">
                <Button className="w-full bg-[#1dbf73] hover:bg-[#1dbf73]/90 text-white font-bold">
                  Liên hệ
                </Button>
              </div>

              <div className="border-t border-gray-100 pt-4 text-left space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span className="flex items-center gap-2"><MapPin className="w-4 h-4"/> Đến từ</span>
                  <span className="font-bold text-gray-900">Việt Nam</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-2"><User className="w-4 h-4"/> Thành viên từ</span>
                  <span className="font-bold text-gray-900">Tháng 12/2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-2"><Calendar className="w-4 h-4"/> Giao gần nhất</span>
                  <span className="font-bold text-gray-900">2 giờ trước</span>
                </div>
              </div>
            </div>

            {/* Box Kỹ năng */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Kỹ năng</h3>
              <div className="flex flex-wrap gap-2">
                {["Pi Node", "Docker", "Linux", "IT Support", "English"].map(skill => (
                  <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: DANH SÁCH GIG & GIỚI THIỆU */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Giới thiệu */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Giới thiệu</h2>
              <p className="text-gray-600 leading-relaxed">
                Xin chào, mình là {username}. Mình là một Pioneer tâm huyết và có 5 năm kinh nghiệm làm việc trong lĩnh vực IT System Admin.
                <br/><br/>
                Mình chuyên nhận cài đặt, sửa lỗi Pi Node và hướng dẫn chạy Docker tối ưu nhất. Cam kết hỗ trợ nhiệt tình cho anh em cộng đồng Pi Network Việt Nam.
              </p>
            </div>

            {/* Danh sách Gig đang bán */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Dịch vụ của {username}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {SELLER_GIGS.map((gig) => (
                  <div key={gig.id} className="group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md flex flex-col">
                    <Link href={`/gigs/${gig.id}`} className="block overflow-hidden">
                      <div className="aspect-[4/3] bg-gray-100 relative group-hover:opacity-90 transition">
                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-[#1dbf73]/10">
                            LOGO
                        </div>
                      </div>
                    </Link>

                    <div className="p-4 flex flex-col flex-grow">
                      <Link href={`/gigs/${gig.id}`}>
                        <h3 className="font-semibold text-base leading-tight mb-2 hover:text-[#1dbf73] transition cursor-pointer line-clamp-2">
                            {gig.title}
                        </h3>
                      </Link>
                      <div className="flex justify-between items-center mt-auto">
                          <span className="text-yellow-500 font-bold flex items-center text-sm">★ {gig.rating}</span>
                          <span className="text-[#1dbf73] font-bold text-lg">{gig.price} π</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Đánh giá từ khách hàng */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <div className="flex items-center gap-2 mb-6">
                 <h2 className="text-lg font-bold text-gray-900">Đánh giá từ khách hàng</h2>
                 <span className="text-yellow-500 font-bold text-lg">★ 5.0</span>
                 <span className="text-gray-400 text-sm">(124 đánh giá)</span>
               </div>
               
               <div className="space-y-6">
                 {[1, 2].map((review) => (
                   <div key={review} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                     <div className="flex items-center gap-3 mb-2">
                       <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">K</div>
                       <div>
                         <div className="font-bold text-sm">KhachHang_{review}</div>
                         <div className="text-xs text-gray-400">1 tuần trước</div>
                       </div>
                     </div>
                     <p className="text-gray-600 text-sm">
                       "Dịch vụ rất tốt, bác chủ nhiệt tình cài đặt qua Ultraviewer nhanh gọn. Node chạy bon bon!"
                     </p>
                   </div>
                 ))}
               </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}