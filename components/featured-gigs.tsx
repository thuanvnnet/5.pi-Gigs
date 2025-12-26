"use client"

import { useState, useEffect } from "react"
import Link from "next/link" // <--- QUAN TRỌNG: Thêm dòng này để chuyển trang

// Định nghĩa kiểu dữ liệu
interface Gig {
  id: number
  title: string
  price: number
  rating: number
  image: string
}

// Dữ liệu giả lập
const MOCK_GIGS: Gig[] = [
  { id: 1, title: "Cài Node Pi & Docker trọn gói", price: 5, rating: 5.0, image: "/placeholder.svg" },
  { id: 2, title: "Thiết kế Logo hội nhóm Pi", price: 5, rating: 4.8, image: "/placeholder.svg" },
  { id: 3, title: "Dịch Whitepaper sang tiếng Việt", price: 10, rating: 4.9, image: "/placeholder.svg" },
  { id: 4, title: "Gỡ lỗi treo đơn KYC", price: 5, rating: 4.7, image: "/placeholder.svg" },
]

export default function FeaturedGigs() {
  const [user, setUser] = useState<any>(null)

  // 1. Đăng nhập Pi SDK
  useEffect(() => {
    const initPi = async () => {
      try {
        // @ts-ignore
        if (typeof window !== "undefined" && window.Pi) {
          // @ts-ignore
          const auth = await window.Pi.authenticate(["username", "payments"], onIncompletePayment)
          setUser(auth.user)
        }
      } catch (err) {
        console.error("Lỗi Pi SDK:", err)
      }
    }
    setTimeout(initPi, 500)
  }, [])

  const onIncompletePayment = (payment: any) => {
    console.log("Giao dịch chưa hoàn thành:", payment)
  }

  // 2. Hàm xử lý nút Mua nhanh (ở trang chủ)
  const handleBuy = async (gig: Gig) => {
    // @ts-ignore
    if (typeof window === "undefined" || !window.Pi) {
      alert("Vui lòng mở ứng dụng trên Pi Browser!")
      return
    }

    if (!user) {
      alert("Đang đăng nhập... Vui lòng thử lại sau giây lát!")
      return
    }

    try {
      const paymentData = {
        amount: gig.price,
        memo: `5.pi - Mua: ${gig.title}`,
        metadata: { gigId: gig.id, buyerId: user.uid },
      }
      // Demo: Chỉ alert chứ chưa gọi API thật
      alert(`Đang khởi tạo thanh toán cho: ${gig.title}`)
    } catch (err) {
      console.error(err)
      alert("Lỗi tạo thanh toán.")
    }
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Dịch vụ nổi bật</h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Các dịch vụ được cộng đồng bình chọn nhiều nhất.
            </p>
          </div>
        </div>
        
        {/* Grid hiển thị danh sách */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_GIGS.map((gig) => (
            <div key={gig.id} className="group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md flex flex-col">
              
              {/* --- 1. ẢNH (BẤM VÀO ĐỂ XEM CHI TIẾT) --- */}
              <Link href={`/gigs/${gig.id}`} className="block overflow-hidden">
                <div className="aspect-[4/3] bg-gray-100 relative group-hover:opacity-90 transition">
                   <div className="w-full h-full flex items-center justify-center text-gray-400 bg-[#1dbf73]/10">
                      LOGO
                   </div>
                </div>
              </Link>

              <div className="p-4 flex flex-col flex-grow">
                {/* --- 2. TIÊU ĐỀ (BẤM VÀO ĐỂ XEM CHI TIẾT) --- */}
                <Link href={`/gigs/${gig.id}`}>
                    <h3 className="font-semibold text-lg leading-tight mb-2 hover:text-[#1dbf73] transition cursor-pointer line-clamp-2">
                        {gig.title}
                    </h3>
                </Link>
                
                <div className="flex justify-between items-center mt-auto mb-4">
                    <span className="text-yellow-500 font-bold flex items-center">★ {gig.rating}</span>
                    <span className="text-purple-700 font-bold text-xl">{gig.price} π</span>
                </div>
                
                <button 
                  onClick={() => handleBuy(gig)}
                  className="mt-2 w-full bg-[#1dbf73] hover:bg-[#1dbf73]/90 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  Đặt hàng
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}