"use client"

import { use, useEffect, useState } from "react" // 👈 Import 'use' để sửa lỗi params
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { MapPin, Star, Calendar, MessageCircle, CheckCircle2 } from "lucide-react"

// Định nghĩa kiểu dữ liệu cho props
interface PageProps {
  params: Promise<{ username: string }>
}

export default function SellerProfile({ params }: PageProps) {
  // 🛠 SỬA LỖI: Dùng use() để lấy username từ Promise params
  const { username } = use(params) 

  const [gigs, setGigs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Giả lập thông tin User (Sau này lấy từ API User)
  const sellerInfo = {
    username: decodeURIComponent(username), // Giải mã %20 nếu có
    level: "Level 1 Seller",
    avatar: username.charAt(0).toUpperCase(),
    bio: "Professional Developer & Pi Network Enthusiast. I have 5 years of experience in Web3 and Blockchain integration.",
    from: "Vietnam",
    memberSince: "Dec 2024",
    avgResponse: "1 Hour",
    languages: ["English", "Vietnamese"]
  }

  useEffect(() => {
    const fetchSellerGigs = async () => {
      try {
        // Gọi API lấy toàn bộ Gigs, sau đó lọc theo username
        // (Tốt nhất là backend nên hỗ trợ lọc: /api/gigs?seller=username)
        const res = await fetch("/api/gigs?sort=newest")
        const data = await res.json()
        
        if (data.success) {
          // Lọc ra các bài của người này
          const userGigs = data.data.filter((g: any) => g.seller?.username === sellerInfo.username)
          setGigs(userGigs)
        }
      } catch (error) {
        console.error("Error fetching gigs", error)
      } finally {
        setLoading(false)
      }
    }

    if (username) {
      fetchSellerGigs()
    }
  }, [username])

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* === CỘT TRÁI: THÔNG TIN SELLER (Profile Card) === */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-24">
              
              {/* Avatar & Status */}
              <div className="flex flex-col items-center text-center mb-6">
                <div className="relative mb-4">
                  <div className="w-32 h-32 bg-gradient-to-tr from-[#1dbf73] to-emerald-500 rounded-full flex items-center justify-center text-5xl font-bold text-white shadow-lg">
                    {sellerInfo.avatar}
                  </div>
                  <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900">{sellerInfo.username}</h1>
                <p className="text-gray-500 text-sm font-medium mb-2">{sellerInfo.level}</p>
                
                <div className="flex gap-1 mb-4">
                   {[1, 2, 3, 4, 5].map((s) => (
                     <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                   ))}
                   <span className="text-gray-400 text-xs font-bold ml-1">(5.0)</span>
                </div>

                <Button className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold">
                  Contact Me
                </Button>
              </div>

              <div className="border-t border-gray-100 py-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <MapPin className="w-4 h-4" /> From
                  </div>
                  <span className="font-bold text-gray-700">{sellerInfo.from}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar className="w-4 h-4" /> Member since
                  </div>
                  <span className="font-bold text-gray-700">{sellerInfo.memberSince}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <MessageCircle className="w-4 h-4" /> Avg. Response
                  </div>
                  <span className="font-bold text-gray-700">{sellerInfo.avgResponse}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {sellerInfo.bio}
                </p>
              </div>

            </div>
          </div>

          {/* === CỘT PHẢI: DANH SÁCH GIGS === */}
          <div className="lg:col-span-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {sellerInfo.username}'s Gigs
            </h2>

            {loading ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {[1, 2].map((i) => <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>)}
               </div>
            ) : gigs.length === 0 ? (
               <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                 <p className="text-gray-400">No active gigs found.</p>
               </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {gigs.map((gig) => (
                  <Link href={`/gigs/${gig._id}`} key={gig._id} className="group block h-full">
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                      {/* Ảnh bìa */}
                      <div className="aspect-[16/10] bg-gray-100 relative overflow-hidden">
                        {gig.image ? (
                          <img 
                            src={gig.image} 
                            alt={gig.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">NO IMAGE</div>
                        )}
                      </div>

                      {/* Nội dung */}
                      <div className="p-4 flex flex-col flex-grow">
                        <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-[#1dbf73] transition-colors mb-2">
                          {gig.title}
                        </h3>
                        
                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-bold text-gray-700">{gig.rating || "New"}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-gray-400 uppercase font-bold block">Starting at</span>
                            <span className="text-lg font-extrabold text-[#1dbf73]">{gig.price} π</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}