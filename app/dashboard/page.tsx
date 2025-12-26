"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { 
  ShoppingBag, Briefcase, Wallet, Star,  
  Package, Plus, ArrowRight, Loader2,
  Pencil, Trash2, ExternalLink // 👈 Import thêm icon mới
} from "lucide-react"
import { usePiAuth } from "@/hooks/use-pi-auth"
import Link from "next/link"
import { toast } from "sonner" // Import toast để báo kết quả

export default function DashboardPage() {
  const { user, loading: authLoading } = usePiAuth()
  const [activeTab, setActiveTab] = useState<"selling" | "buying">("selling")
  
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Gọi API lấy dữ liệu
  useEffect(() => {
    const fetchDashboard = async () => {
      if (!user?.username) return;
      try {
        const res = await fetch("/api/dashboard", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: user.username })
        })
        const result = await res.json()
        if (result.success) {
            setData(result.data)
        }
      } catch (error) {
        console.error("Failed to fetch dashboard", error)
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading) {
        fetchDashboard()
    }
  }, [user, authLoading])

  // --- HÀM XỬ LÝ XÓA GIG ---
  const handleDeleteGig = async (gigId: string) => {
    // Hỏi xác nhận trước khi xóa
    if (!confirm("Are you sure you want to delete this Gig? This action cannot be undone.")) return;

    try {
      // Gọi API xóa
      const res = await fetch(`/api/gigs/${gigId}`, { method: "DELETE" });
      const result = await res.json();

      if (result.success) {
        toast.success("Gig deleted successfully!");
        
        // Cập nhật lại giao diện (Xóa Gig khỏi danh sách đang hiển thị)
        setData((prevData: any) => ({
          ...prevData,
          myGigs: prevData.myGigs.filter((g: any) => g._id !== gigId)
        }));
      } else {
        toast.error("Failed to delete gig");
      }
    } catch (error) {
      toast.error("Error deleting gig");
    }
  }

  // Helper Badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "created": return <span className="px-2 py-1 rounded text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">WAITING PAY</span>
      case "in_progress": return <span className="px-2 py-1 rounded text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">IN PROGRESS</span>
      case "delivered": return <span className="px-2 py-1 rounded text-xs font-bold bg-orange-50 text-orange-600 border border-orange-100">DELIVERED</span>
      case "completed": return <span className="px-2 py-1 rounded text-xs font-bold bg-green-50 text-green-600 border border-green-100">COMPLETED</span>
      case "disputed": return <span className="px-2 py-1 rounded text-xs font-bold bg-red-50 text-red-600 border border-red-100">DISPUTED</span>
      default: return <span className="px-2 py-1 rounded text-xs font-bold bg-gray-100 text-gray-500">{status}</span>
    }
  }
  
  if (authLoading || loading) return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FB]">
          <Loader2 className="w-8 h-8 animate-spin text-[#1dbf73]" />
      </div>
  )

  return (
    <div className="min-h-screen bg-[#F7F9FB] font-sans">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
           <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500 mt-1">Welcome back, <span className="font-bold text-gray-800">{user?.username}</span>! 👋</p>
           </div>
           <Link href="/create-gig">
             <Button className="bg-black text-white hover:bg-gray-800 font-bold shadow-lg shadow-gray-200">
               <Plus className="w-4 h-4 mr-2" /> Create New Gig
             </Button>
           </Link>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                 <p className="text-sm text-gray-400 font-medium mb-1">Total Earnings</p>
                 <h3 className="text-3xl font-extrabold text-[#1dbf73]">{data?.stats?.earnings || 0} π</h3>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-[#1dbf73]">
                 <Wallet className="w-6 h-6" />
              </div>
           </div>

           <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                 <p className="text-sm text-gray-400 font-medium mb-1">Active Orders</p>
                 <h3 className="text-3xl font-extrabold text-blue-600">{data?.stats?.active_orders || 0}</h3>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                 <Briefcase className="w-6 h-6" />
              </div>
           </div>

           <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                 <p className="text-sm text-gray-400 font-medium mb-1">Success Rate</p>
                 <h3 className="text-3xl font-extrabold text-gray-800">100%</h3>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
                 <Star className="w-6 h-6" />
              </div>
           </div>
        </div>

        {/* MAIN TABS */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[500px]">
           <div className="flex border-b border-gray-200">
              <button 
                onClick={() => setActiveTab("selling")}
                className={`flex-1 py-4 text-center font-bold text-sm transition-colors border-b-2 
                ${activeTab === 'selling' ? 'border-[#1dbf73] text-[#1dbf73] bg-green-50/30' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
              >
                Selling (Freelancer Mode)
              </button>
              <button 
                onClick={() => setActiveTab("buying")}
                className={`flex-1 py-4 text-center font-bold text-sm transition-colors border-b-2 
                ${activeTab === 'buying' ? 'border-blue-500 text-blue-600 bg-blue-50/30' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
              >
                Buying (Client Mode)
              </button>
           </div>

           <div className="p-6">
              
              {/* --- TAB SELLING --- */}
              {activeTab === "selling" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                   
                   {/* Selling Orders */}
                   <div>
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Package className="w-5 h-5 text-gray-400" /> Manage Orders ({data?.sellingOrders?.length || 0})
                      </h3>
                      <div className="space-y-3">
                        {data?.sellingOrders?.length > 0 ? (
                           data.sellingOrders.map((order: any) => (
                              <div key={order._id} className="group bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:shadow-md hover:border-[#1dbf73] transition-all">
                                 <div className="flex items-center gap-4">
                                    <div className={`w-2 h-12 rounded-full ${order.status === 'in_progress' ? 'bg-blue-500' : order.status === 'delivered' ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                                    <div>
                                       <div className="flex items-center gap-2 mb-1">
                                          {getStatusBadge(order.status)}
                                          <span className="text-xs text-gray-400">#{order._id.slice(0,6)} • {new Date(order.createdAt).toLocaleDateString()}</span>
                                       </div>
                                       <h4 className="font-bold text-gray-900">{order.gigTitle}</h4>
                                       <p className="text-xs text-gray-500">Buyer: <span className="font-medium text-gray-700">@{order.buyerId}</span></p>
                                    </div>
                                 </div>
                                 <div className="text-right">
                                    <div className="font-extrabold text-[#1dbf73] text-lg mb-1">{order.price} π</div>
                                    <Link href={`/orders/${order._id}`}>
                                      <Button size="sm" variant="outline" className="border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs h-8">
                                        Manage <ArrowRight className="w-3 h-3 ml-1" />
                                      </Button>
                                    </Link>
                                 </div>
                              </div>
                           ))
                        ) : (
                           <div className="text-center py-8 text-gray-400 italic">No orders yet. Share your gigs to get hired!</div>
                        )}
                      </div>
                   </div>

                   {/* 👇👇👇 KHI VỰC ĐÃ CHỈNH SỬA: MY GIGS 👇👇👇 */}
                   <div>
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                         <Briefcase className="w-5 h-5 text-gray-400" /> My Active Gigs
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {data?.myGigs?.length > 0 ? (
                            data.myGigs.map((gig: any) => (
                               <div key={gig._id} className="border border-gray-200 rounded-xl p-4 flex gap-4 hover:border-gray-300 bg-gray-50/50 items-center transition-all hover:shadow-sm">
                                  
                                  {/* Ảnh Gig */}
                                  <img src={gig.image} alt={gig.title} className="w-16 h-16 rounded-lg object-cover bg-gray-200" />
                                  
                                  {/* Thông tin Gig (Link ở Tiêu đề) */}
                                  <div className="flex-1 min-w-0">
                                     <Link href={`/gigs/${gig._id}`} className="group/link">
                                        <h4 className="font-bold text-gray-900 truncate text-sm mb-1 group-hover/link:text-[#1dbf73] group-hover/link:underline transition-colors flex items-center gap-1">
                                            {gig.title}
                                            <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                        </h4>
                                     </Link>
                                     <div className="flex gap-4 text-xs text-gray-500 mb-2">
                                        <span>📦 {gig.sales || 0} Sales</span>
                                     </div>
                                     <div className="font-bold text-[#1dbf73]">{gig.price} π</div>
                                  </div>

                                  {/* Nút hành động: Sửa & Xóa */}
                                  <div className="flex flex-col gap-2">
                                    {/* Nút Sửa (Tạm thời trỏ về trang tạo mới, sau này làm trang edit sau) */}
                                    <Link href={`/gigs/create?edit=${gig._id}`}> 
                                        <Button variant="outline" size="icon" className="h-8 w-8 text-blue-600 border-blue-200 hover:bg-blue-50" title="Edit Gig">
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                    
                                    {/* Nút Xóa */}
                                    <Button 
                                        variant="outline" 
                                        size="icon" 
                                        className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700" 
                                        title="Delete Gig"
                                        onClick={() => handleDeleteGig(gig._id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                               </div>
                            ))
                         ) : (
                            <div className="col-span-2 text-center py-8 text-gray-400 border border-dashed rounded-xl">
                               <p>You haven't posted any Gigs yet.</p>
                               <Link href="/create-gig" className="text-[#1dbf73] font-bold text-sm">Post a Gig now</Link>
                            </div>
                         )}
                      </div>
                   </div>
                   {/* 👆👆👆 HẾT PHẦN CHỈNH SỬA 👆👆👆 */}

                </div>
              )}

              {/* --- TAB BUYING --- */}
              {activeTab === "buying" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-gray-400" /> My Purchases
                    </h3>
                    
                    {data?.buyingOrders?.length > 0 ? (
                      <div className="space-y-3">
                         {data.buyingOrders.map((order: any) => (
                            <div key={order._id} className="group bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:shadow-md hover:border-blue-300 transition-all">
                               <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                                     <ShoppingBag className="w-6 h-6" />
                                  </div>
                                  <div>
                                     <div className="flex items-center gap-2 mb-1">
                                        {getStatusBadge(order.status)}
                                        <span className="text-xs text-gray-400">#{order._id.slice(0,6)} • {new Date(order.createdAt).toLocaleDateString()}</span>
                                     </div>
                                     <h4 className="font-bold text-gray-900">{order.gigTitle}</h4>
                                     <p className="text-xs text-gray-500">Seller: <span className="font-medium text-gray-700">@{order.sellerId}</span></p>
                                  </div>
                               </div>
                               <div className="text-right">
                                  <div className="font-bold text-gray-900 text-lg mb-1">{order.price} π</div>
                                  <Link href={`/orders/${order._id}`}>
                                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-8">
                                      View Order
                                    </Button>
                                  </Link>
                               </div>
                            </div>
                         ))}
                      </div>
                    ) : (
                      <div className="text-center py-10 text-gray-400">
                         <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-20" />
                         <p>You haven't bought anything yet.</p>
                      </div>
                    )}
                </div>
              )}

           </div>
        </div>

      </main>
      <Footer />
    </div>
  )
}