import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import mongoose from "mongoose"
import connectDB from "@/lib/db"
import Gig from "@/models/Gig"
import Category from "@/models/Category"
import { notFound } from "next/navigation"
import { SlidersHorizontal } from "lucide-react"
import { ChevronRight, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GigCard } from "@/components/gig/GigCard"
import { processGigsForClient, LeanGig } from "@/lib/gig-utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Buộc trang phải được render động để luôn lấy dữ liệu mới nhất
export const dynamic = 'force-dynamic';

// Giả lập hàm lấy session phía server
async function getSession() {
    // Trong ứng dụng thực tế, bạn sẽ lấy thông tin này từ session hoặc token
    return { user: { id: 'mock-user-id-string' } };
}

// Hàm lấy dữ liệu cho trang, bao gồm thông tin danh mục và các Gigs đã được duyệt
async function getData(slug: string) {
  await connectDB();
  const session = await getSession();
  const userId = session.user?.id;

  // Lấy thông tin danh mục và các Gigs song song để tối ưu hiệu suất
  const [category, gigs] = await Promise.all([
    Category.findOne({ slug }).lean(),
    Gig.find({ category: slug, status: 'approved' }).sort({ createdAt: -1 }).lean() as Promise<LeanGig[]>
  ]);

  // Nếu không tìm thấy danh mục, hiển thị trang 404
  if (!category) {
    notFound();
  }

  return {
    gigs: processGigsForClient(gigs, userId),
    category: JSON.parse(JSON.stringify(category)),
  };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const { gigs, category } = await getData(params.slug);

  return (
    <div className="min-h-screen bg-[#F7F9FB] font-sans flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gray-100 border-b">
        <div className="container mx-auto px-4 py-8 sm:py-12 text-center">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-sm mb-4">
            <Link href="/" className="text-gray-500 hover:text-[#1dbf73] transition-colors">
              <Home className="h-4 w-4" />
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="font-medium text-gray-900">{category.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">{category.name}</h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">Discover top-rated professionals for your next project.</p>
        </div>
      </section>

      <main className="flex-grow container mx-auto px-4 py-10">
        <div>
            {/* Toolbar */}
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <p className="text-gray-600 font-medium whitespace-nowrap">{gigs.length} results</p>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 hidden sm:inline">Sort by</span>
                    <Select defaultValue="recommended">
                        <SelectTrigger className="w-[150px] sm:w-[180px] bg-white">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="recommended">Recommended</SelectItem>
                            <SelectItem value="newest">Newest</SelectItem>
                            <SelectItem value="price_asc">Price (Low to High)</SelectItem>
                            <SelectItem value="price_desc">Price (High to Low)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {gigs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {gigs.map((gig: any) => <GigCard key={gig._id} gig={gig} isFavorited={gig.isFavorited} categoryName={category.name} />)}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-xl font-bold text-gray-900">No Services Yet</h3>
                <p className="text-gray-500 mb-6">Be the first to post a service in this category!</p>
                <Link href="/create">
                  <Button className="bg-[#1dbf73] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#1dbf73]/90">
                    Post a Service Now
                  </Button>
                </Link>
              </div>
            )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}