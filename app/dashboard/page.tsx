import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { 
  ShoppingBag, Briefcase, Wallet, Star, Heart,
  Plus
} from "lucide-react"
import Link from "next/link"
import connectDB from "@/lib/db"
import Gig from "@/models/Gig"
// import Order from "@/models/Order" // Giả sử bạn có model Order
import Order from "@/models/Order" // Import model Order thật
import { DashboardTabs } from "./DashboardTabs" // Component mới cho các tab

// Hàm lấy dữ liệu trực tiếp trên server
async function getDashboardData(userId: string) {
  await connectDB();

  // Lấy các Gigs của người dùng
  const myGigs = await Gig.find({ "seller.uid": userId }).sort({ createdAt: -1 });

  // Lấy đơn hàng thật
  const sellingOrders = await Order.find({ sellerId: userId }).sort({ createdAt: -1 });
  const buyingOrders = await Order.find({ buyerId: userId }).sort({ createdAt: -1 });

  // Tính toán các chỉ số thống kê từ dữ liệu thật
  const totalEarnings = sellingOrders
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + order.price, 0);

  const activeOrdersCount = sellingOrders.filter(order => order.status === 'in_progress').length;

  return {
    myGigs: JSON.parse(JSON.stringify(myGigs)), // Cần serialize để truyền từ Server -> Client
    sellingOrders: JSON.parse(JSON.stringify(sellingOrders)),
    buyingOrders: JSON.parse(JSON.stringify(buyingOrders)),
    // Tính toán stats từ dữ liệu thật
    stats: { earnings: totalEarnings, active_orders: activeOrdersCount }
  };
}

export default async function DashboardPage() {
  // Lấy thông tin người dùng từ session server-side (thay thế bằng logic thật của bạn)
  const user = { username: "PiMaster_VN", uid: "PiMaster_VN", role: "admin" };
  const data = await getDashboardData(user.uid);

  return (
    <div className="min-h-screen bg-[#F7F9FB] font-sans">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
           <div>
              <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
              <p className="text-gray-500 mt-1">Welcome back, <span className="font-bold text-gray-800">{user?.username}</span>! 👋</p>
           </div>
           <div className="flex items-center gap-2">
             {/* Chỉ hiển thị nút Admin Panel nếu người dùng có vai trò 'admin' */}
             {user.role === 'admin' && (
               <Link href="/admin">
                 <Button variant="secondary" className="font-bold shadow-sm">Admin Panel</Button>
               </Link>
             )}
             <Link href="/favorites">
               <Button variant="outline" className="font-bold shadow-sm">
                 <Heart className="w-4 h-4 mr-2 text-red-500" /> My Favorites
               </Button>
             </Link>
             <Link href="/create">
               <Button className="bg-black text-white hover:bg-gray-800 font-bold shadow-lg shadow-gray-200">
                 <Plus className="w-4 h-4 mr-2" /> Create New Gig
               </Button>
             </Link>
           </div>
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

        {/* 
          Phần Tabs và Orders cần được chuyển sang Client Component
          nếu bạn muốn có sự tương tác chuyển tab mà không tải lại trang.
          Để đơn giản, tôi sẽ tạm ẩn đi.
        */}
        <DashboardTabs 
          myGigs={data.myGigs}
          sellingOrders={data.sellingOrders}
          buyingOrders={data.buyingOrders}
        />

      </main>
      <Footer />
    </div>
  )
}