"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import  Link  from "next/link"
import { useState, useEffect } from "react"

// Giả lập dữ liệu (Sau này sẽ lấy từ Database dựa vào ID trên URL)
const MOCK_DATA = {
  id: 1,
  title: "Tôi sẽ cài đặt Node Pi & Docker trọn gói cho bạn",
  price: 5,
  description: `
    Bạn muốn chạy Node Pi nhưng không rành về kỹ thuật? Đừng lo!
    
    Gói dịch vụ này bao gồm:
    - Cài đặt Docker Desktop bản mới nhất.
    - Mở Port Modem (Port Forwarding) để thông mạng.
    - Cài đặt Pi Node và cấu hình file JSON.
    - Hướng dẫn treo máy 24/7 để tối ưu Bonus.
    
    Cam kết:
    - Không can thiệp vào ví Pi của bạn.
    - Hỗ trợ qua Ultraviewer/Teamviewer.
    - Bảo hành support 1 tuần đầu.
  `,
  rating: 5.0,
  reviews: 124,
  seller: {
    name: "PiMaster_VN",
    avatar: "👤",
    level: "Top Seller",
    joined: "2021"
  },
  images: ["/placeholder.svg"]
}

export default function GigDetailPage({ params }: { params: { id: string } }) {
  // Lấy ID từ trên thanh địa chỉ (URL)
  // Ví dụ vào trang /gigs/123 thì id = 123
  const [gigId, setGigId] = useState<string>("")

  useEffect(() => {
    // Unwrap params (Next.js 13+ requirement)
    // Trong thực tế, dùng ID này để gọi API lấy dữ liệu bài viết
    const unwrapParams = async () => {
        // @ts-ignore
        const resolvedParams = await params;
        // @ts-ignore
        setGigId(resolvedParams?.id || "1");
    }
    unwrapParams();
  }, [params])

  const handleBuy = () => {
    alert("Tính năng thanh toán 5 Pi sẽ được tích hợp tại đây!")
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb (Đường dẫn) */}
        <div className="text-sm text-gray-500 mb-6">
          Trang chủ &gt; Kỹ thuật &gt; <span className="text-gray-900 font-medium">Chi tiết dịch vụ #{gigId}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CỘT TRÁI: THÔNG TIN CHÍNH (Chiếm 2 phần) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tiêu đề */}
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              {MOCK_DATA.title}
            </h1>

            {/* Thông tin người bán & Đánh giá */}
            <div className="flex items-center space-x-4 border-b border-gray-200 pb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
                {MOCK_DATA.seller.avatar}
              </div>
              <div>
                <Link href={`/seller/${MOCK_DATA.seller.name}`} className="hover:underline hover:text-[#1dbf73]">
                <h3 className="font-bold text-gray-900">{MOCK_DATA.seller.name}</h3>
                 </Link>
                <div className="flex items-center text-sm text-gray-500 space-x-2">
                  <span className="text-yellow-500 font-bold">★ {MOCK_DATA.rating}</span>
                  <span>({MOCK_DATA.reviews} đánh giá)</span>
                  <span>•</span>
                  <span>Thành viên từ {MOCK_DATA.seller.joined}</span>
                </div>
              </div>
            </div>

            {/* Ảnh bìa lớn */}
            <div className="aspect-video bg-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-lg">
              [Ảnh Minh Họa Dịch Vụ]
            </div>

            {/* Mô tả chi tiết */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Mô tả dịch vụ</h2>
              <div className="prose max-w-none text-gray-600 whitespace-pre-line leading-relaxed">
                {MOCK_DATA.description}
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: BẢNG GIÁ & MUA (Chiếm 1 phần) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-purple-100 rounded-xl shadow-lg overflow-hidden">
              <div className="bg-[#1dbf73]/10 p-4 border-b border-purple-100">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-purple-900">Gói Tiêu Chuẩn</span>
                  <span className="text-2xl font-bold text-purple-700">{MOCK_DATA.price} π</span>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <p className="text-gray-600 text-sm">
                  Gói cơ bản hoàn thiện cài đặt Node và Docker, bàn giao trong 24h.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">🕒</span> Giao hàng trong 1 ngày
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">🔄</span> 1 lần chỉnh sửa (Revision)
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">✅</span> Hỗ trợ Ultraviewer
                  </div>
                </div>

                <Button 
                  onClick={handleBuy}
                  className="w-full bg-[#1dbf73] hover:bg-[#1dbf73]/90 text-white font-bold py-6 text-lg shadow-md hover:shadow-xl transition-all"
                >
                  Đặt Hàng Ngay (5 π)
                </Button>
                
                <button className="w-full text-gray-500 text-sm hover:text-[#1dbf73] font-medium transition">
                  Nhắn tin cho người bán
                </button>
              </div>
              
              <div className="bg-gray-50 p-4 text-center text-xs text-gray-400">
                Giao dịch được bảo vệ bởi 5.pi Escrow
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}