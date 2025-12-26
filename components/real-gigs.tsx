"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Định nghĩa kiểu dữ liệu cho bài đăng
interface Gig {
  _id: string
  title: string
  price: number
  category: string
  seller: { username: string }
}

export function RealGigs() {
  const [gigs, setGigs] = useState<Gig[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Hàm gọi API lấy dữ liệu thật
    const fetchGigs = async () => {
      try {
        const res = await fetch("/api/gigs")
        const data = await res.json()
        if (data.success) {
          setGigs(data.data)
        }
      } catch (error) {
        console.error("Lỗi tải trang:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGigs()
  }, [])

  if (loading) return <div className="p-8 text-center">Đang tải danh sách dịch vụ...</div>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {gigs.length === 0 ? (
        <div className="col-span-4 text-center text-gray-500">Chưa có bài đăng nào. Hãy là người đầu tiên!</div>
      ) : (
        gigs.map((gig) => (
          <div key={gig._id} className="group relative overflow-hidden rounded-lg border bg-white shadow-sm hover:shadow-md transition-all">
            <Link href={`/gigs/${gig._id}`}>
              <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center text-gray-400">
                {/* Ảnh placeholder */}
                <span className="font-bold text-sm">IMAGE</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-[#1dbf73] transition">
                  {gig.title}
                </h3>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-gray-500">{gig.seller.username}</span>
                  <span className="font-bold text-[#1dbf73]">{gig.price} π</span>
                </div>
              </div>
            </Link>
          </div>
        ))
      )}
    </div>
  )
}