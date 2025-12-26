"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DashboardPage() {
  // Trạng thái Tab hiện tại: 'buying' hoặc 'selling'
  const [activeTab, setActiveTab] = useState<'buying' | 'selling'>('buying')

  // Giả lập dữ liệu Đơn hàng Đã Mua (Bạn là khách)
  const myOrders = [
    { id: "ORD-101", title: "Thiết kế Logo hội nhóm Pi", seller: "PiMaster_VN", price: 5, status: "completed", date: "24/12/2024" },
    { id: "ORD-102", title: "Cài Node Pi & Docker", seller: "NodeGuru", price: 5, status: "in_progress", date: "25/12/2024" },
  ]

  // Giả lập dữ liệu Đơn hàng Đang Bán (Bạn là người bán)
  const mySales = [
    { id: "SL-888", title: "Dịch bài viết tiếng Anh", buyer: "User123", price: 5, status: "pending", date: "25/12/2024" }
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        {/* 1. KHOANG THÔNG TIN USER */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 flex flex-col md:flex-row items-center justify-between border border-gray-100">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-3xl">
              👤
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">User_Pioneer</h1>
              <p className="text-gray-500 text-sm">Thành viên từ 2024</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-gray-500">Ví nội bộ</p>
              <p className="text-2xl font-bold text-[#1dbf73]">125.00 π</p>
            </div>
            <Button className="bg-[#1dbf73] hover:bg-[#1dbf73]/90">Rút Pi</Button>
          </div>
        </div>

        {/* 2. KHU VỰC TAB CHUYỂN ĐỔI */}
        <div className="flex space-x-6 border-b border-gray-200 mb-6">
          <button 
            onClick={() => setActiveTab('buying')}
            className={`pb-3 text-lg font-medium transition-colors relative ${
              activeTab === 'buying' ? 'text-[#1dbf73]' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Đơn Mua Hàng
            {activeTab === 'buying' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1dbf73]"></span>}
          </button>
          
          <button 
            onClick={() => setActiveTab('selling')}
            className={`pb-3 text-lg font-medium transition-colors relative ${
              activeTab === 'selling' ? 'text-[#1dbf73]' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Quản Lý Bán Hàng
            {activeTab === 'selling' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1dbf73]"></span>}
          </button>
        </div>

        {/* 3. DANH SÁCH ĐƠN HÀNG */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {activeTab === 'buying' ? (
            /* --- DANH SÁCH MUA --- */
            <div>
              {myOrders.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {myOrders.map((order) => (
                    <div key={order.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl">📦</div>
                        <div>
                          <h3 className="font-bold text-gray-900">{order.title}</h3>
                          <p className="text-sm text-gray-500">Người bán: {order.seller} • Ngày: {order.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-1 ${
                          order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {order.status === 'completed' ? 'Hoàn thành' : 'Đang thực hiện'}
                        </span>
                        <p className="font-bold text-gray-900">{order.price} π</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-gray-500">Bạn chưa mua đơn hàng nào.</div>
              )}
            </div>
          ) : (
            /* --- DANH SÁCH BÁN --- */
            <div>
               {mySales.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {mySales.map((sale) => (
                    <div key={sale.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-xl">💰</div>
                        <div>
                          <h3 className="font-bold text-gray-900">{sale.title}</h3>
                          <p className="text-sm text-gray-500">Khách hàng: {sale.buyer} • Ngày: {sale.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 mb-1">
                                Chờ xác nhận
                            </span>
                            <p className="font-bold text-gray-900">+{sale.price} π</p>
                        </div>
                        <Button size="sm" className="bg-[#1dbf73]">Giao hàng</Button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Nút tạo thêm Gig */}
                  <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                    <Link href="/create-gig">
                        <Button variant="outline" className="border-dashed border-2 border-gray-300 w-full py-6 text-gray-500 hover:border-purple-500 hover:text-[#1dbf73]">
                            + Đăng dịch vụ mới
                        </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                 <div className="p-12 text-center text-gray-500">Bạn chưa có đơn hàng nào.</div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}