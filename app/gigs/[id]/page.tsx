"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner" 
import { ArrowRight } from "lucide-react" 

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ReviewsSection } from "@/components/reviews-section"
import { GigGallery } from "@/components/gig-gallery" 
import { usePiAuth } from "@/hooks/use-pi-auth"

// Import đầy đủ icon, không dùng "..."
import { 
  ShieldCheck, Clock, RefreshCw, ChevronRight, Home, 
  MessageCircle, MapPin, Calendar, Clock3, Share2 
} from "lucide-react"

export default function GigDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = usePiAuth()
  
  const [gig, setGig] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // 1. Fetch Data
  useEffect(() => {
    const fetchGig = async () => {
      try {
        // @ts-ignore
        const resolvedParams = await params;
        const id = resolvedParams?.id;
        
        if (!id) return;

        const res = await fetch(`/api/gigs`)
        const data = await res.json()
        
        if (data.success) {
           const foundGig = data.data.find((g: any) => g._id === id)
           setGig(foundGig)
        }
      } catch (error) {
        console.error("Failed to load gig", error)
      } finally {
        setLoading(false)
      }
    }
    fetchGig()
  }, [params])

  // 2. Handle Buy
  const handleBuy = async () => {
    if (!user) return toast.error("Please login to purchase!")
    if (gig?.seller?.username && user.username === gig.seller.username) return toast.error("You cannot buy your own gig!")

    try {
      const loadingToast = toast.loading("Creating order...")
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gigId: gig._id,
          buyerId: user.username,
          sellerId: gig.seller.username, 
          price: gig.price,
          gigTitle: gig.title 
        })
      })
      const data = await res.json()
      toast.dismiss(loadingToast)

      if (data.success) {
        toast.success("Order created! Redirecting...")
        router.push(`/orders/${data.orderId}`)
      } else {
        toast.error(data.error || "Failed to create order")
      }
    } catch (error) {
      toast.dismiss()
      toast.error("Connection error")
    }
  }

  // 3. Handle Share (Chia sẻ Link)
  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard! Ready to share.")
    }
  }

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#1dbf73] border-t-transparent rounded-full animate-spin"></div></div>
  if (!gig) return <div className="min-h-screen flex items-center justify-center">Gig not found</div>

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 pb-20 lg:pb-0"> 
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* 1. BREADCRUMB */}
        <nav className="flex items-center text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-[#1dbf73] transition-colors flex items-center gap-1">
            <Home className="w-4 h-4" />
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-gray-300" />
          <Link href="/search" className="hover:text-[#1dbf73] transition-colors">Services</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-gray-300" />
          <span className="text-gray-900 font-medium truncate">{gig.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* === CỘT TRÁI (Nội dung chính) - Chiếm 8 phần === */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* HEADER: Title, Share & Seller Link */}
            <div>
              {/* Tiêu đề + Nút Share */}
              <div className="flex justify-between items-start gap-4 mb-4">
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight flex-1">
                  {gig.title}
                </h1>
                <button 
                  onClick={handleShare}
                  className="p-2.5 rounded-full bg-gray-50 hover:bg-[#1dbf73]/10 text-gray-500 hover:text-[#1dbf73] transition-all border border-gray-100 flex-shrink-0"
                  title="Share this gig"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Seller Mini Profile */}
              <div className="flex items-center gap-4">
                <Link href={`/seller/${gig.seller?.username}`}>
                  <div className="relative cursor-pointer">
                    <div className="w-12 h-12 bg-gradient-to-tr from-[#1dbf73] to-emerald-500 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-md shadow-emerald-200">
                      {(gig.seller?.username || "S").charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                </Link>
                <div>
                  <div className="flex items-center gap-2">
                    <Link href={`/seller/${gig.seller?.username}`} className="font-bold text-lg text-slate-900 hover:underline">
                      {gig.seller?.username || "Seller"}
                    </Link>
                    <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Level 1</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 gap-3 mt-0.5">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      {gig.rating || "5.0"}
                    </div>
                    <span className="text-gray-300">|</span>
                    <span>{gig.reviewsCount || 0} reviews</span>
                  </div>
                </div>
              </div>
            </div>

            {/* GALLERY ẢNH */}
            <GigGallery title={gig.title} mainImage={gig.image} gallery={gig.gallery} />

            {/* MÔ TẢ CHI TIẾT */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-900">About This Gig</h3>
              <div className="prose prose-slate max-w-none text-gray-600 leading-relaxed text-base whitespace-pre-line bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                {gig.description}
              </div>
            </div>

            {/* ABOUT THE SELLER SECTION */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6">About The Seller</h3>
              
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0 text-center">
                  <Link href={`/seller/${gig.seller?.username}`}>
                    <div className="w-24 h-24 bg-gradient-to-tr from-[#1dbf73] to-emerald-500 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg mx-auto mb-3 cursor-pointer hover:scale-105 transition-transform">
                      {(gig.seller?.username || "S").charAt(0).toUpperCase()}
                    </div>
                  </Link>
                  <Link href={`/seller/${gig.seller?.username}`} className="text-sm font-bold text-gray-900 hover:text-[#1dbf73] underline">
                    View Profile
                  </Link>
                </div>

                <div className="space-y-4 flex-1">
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">{gig.seller?.username || "Seller"}</h4>
                    <p className="text-gray-500 text-sm">Professional Freelancer on 5.pi Gigs</p>
                  </div>

                  <div className="grid grid-cols-2 gap-y-4 gap-x-8 border-t border-b border-gray-100 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 font-bold">From</span>
                        <span className="font-medium text-gray-900">Vietnam 🇻🇳</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 font-bold">Member since</span>
                        <span className="font-medium text-gray-900">Dec 2024</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock3 className="w-4 h-4 text-gray-400" />
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 font-bold">Avg. Response</span>
                        <span className="font-medium text-gray-900">~1 Hour</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MessageCircle className="w-4 h-4 text-gray-400" />
                      <div className="flex flex-col">
                          <span className="text-xs text-gray-400 font-bold">Language</span>
                          <span className="font-medium text-gray-900">English, Vietnamese</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 leading-relaxed text-sm">
                    Hi! I am dedicated to providing the best service for the Pi Network community. 
                    I focus on quality and customer satisfaction. Feel free to contact me before placing an order!
                  </p>

                  <button className="text-[#1dbf73] font-bold text-sm border border-[#1dbf73] px-6 py-2.5 rounded-full hover:bg-[#1dbf73] hover:text-white transition-all">
                    Contact Me
                  </button>
                </div>
              </div>
            </div>

            {/* FAQ SECTION */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-900">FAQ</h3>
              <div className="space-y-3">
                {[
                  { q: "Do you accept Pi Payment?", a: "Yes, 100% of the payment is done securely via Pi Network blockchain." },
                  { q: "How do I receive my delivery?", a: "I will upload the final files directly here in the Order page once finished. You can download and review them." },
                  { q: "What if I am not satisfied?", a: "We offer unlimited revisions. Your Pi is held in Escrow and only released to me when you are happy with the work." }
                ].map((item, i) => (
                  <details key={i} className="group bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer open:ring-2 open:ring-[#1dbf73]/20 transition-all">
                    <summary className="flex justify-between items-center font-medium p-4 list-none text-gray-800 hover:bg-gray-50 transition-colors">
                      <span>{item.q}</span>
                      <span className="transition-transform duration-300 group-open:rotate-180">
                        <svg fill="none" height="24" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                      </span>
                    </summary>
                    <p className="text-gray-600 px-4 pb-4 text-sm leading-relaxed border-t border-gray-100 pt-3 bg-gray-50/50">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>

            {/* REVIEWS */}
            <ReviewsSection gigId={gig._id} sellerId={gig.sellerId} />

            {/* MORE FROM THIS SELLER */}
            <div className="mt-16 pt-10 border-t border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">More from {gig.seller?.username}</h3>
                <Link href={`/seller/${gig.seller?.username}`} className="text-[#1dbf73] font-bold text-sm hover:underline">
                  View All
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((item) => (
                  <Link href="#" key={item} className="group flex gap-4 p-4 rounded-xl border border-gray-100 hover:border-[#1dbf73]/30 hover:shadow-md transition-all bg-white">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                      <img src={`https://source.unsplash.com/random/200x200?sig=${item}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 line-clamp-2 group-hover:text-[#1dbf73] transition-colors mb-2">
                        I will create another amazing service for you
                      </h4>
                      <div className="text-sm text-gray-500 mb-2">Starting at</div>
                      <div className="font-extrabold text-[#1dbf73]">15 π</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* === CỘT PHẢI (Bảng giá Desktop) === */}
          <div className="lg:col-span-4 relative hidden lg:block">
            <div className="sticky top-28 space-y-6">
              
              <div className="bg-white border border-gray-200 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-shadow hover:shadow-lg">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-bold text-gray-900 text-lg">Standard</span>
                    <span className="text-3xl font-extrabold text-[#1dbf73] tracking-tight">{gig.price} <span className="text-lg align-top">π</span></span>
                  </div>
                  <p className="text-sm text-gray-500 leading-snug">
                    Complete package including source files and commercial usage rights.
                  </p>
                </div>

                <div className="p-6 space-y-5">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600 font-medium">
                      <Clock className="w-5 h-5 text-[#1dbf73] mr-3" />
                      <span>{gig.deliveryTime || 3} Days Delivery</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 font-medium">
                      <RefreshCw className="w-5 h-5 text-[#1dbf73] mr-3" />
                      <span>Unlimited Revisions</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 font-medium">
                      <ShieldCheck className="w-5 h-5 text-[#1dbf73] mr-3" />
                      <span>Escrow Protection</span>
                    </div>
                  </div>

                  <Button 
                    onClick={handleBuy}
                    className="w-full bg-[#1dbf73] hover:bg-[#1dbf73]/90 text-white font-bold py-7 text-lg rounded-xl shadow-lg shadow-[#1dbf73]/20 transition-all hover:scale-[1.02] active:scale-95"
                  >
                    Continue ({gig.price} π)
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-2xl flex items-start gap-3 border border-blue-100">
                <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-blue-900 text-sm">100% Secure</h4>
                  <p className="text-blue-700 text-xs mt-1">Your Pi is held safely in Escrow until you approve the work.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* STICKY MOBILE CTA BAR */}
      <div className="fixed bottom-0 left-0 w-full z-[999] lg:hidden">
        <div className="h-6 w-full bg-gradient-to-t from-white/10 to-transparent pointer-events-none absolute -top-6"></div>
        <div className="bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] shadow-[0_-5px_20px_rgba(0,0,0,0.08)] flex items-center justify-between gap-4 transition-transform duration-300">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Total Price</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900">{gig.price}</span>
              <span className="text-sm font-bold text-[#1dbf73]">π</span>
            </div>
          </div>
          <Button 
            onClick={handleBuy}
            className="flex-1 bg-[#1dbf73] hover:bg-[#1dbf73]/90 text-white font-bold text-base h-12 rounded-xl shadow-lg shadow-[#1dbf73]/20 active:scale-95 transition-all group"
          >
            Continue
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}