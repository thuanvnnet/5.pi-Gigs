"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Star, Heart } from "lucide-react"

export default function FeaturedGigs() {
  const [gigs, setGigs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        // Gọi API lấy bài mới nhất (sort=newest)
        const res = await fetch("/api/gigs?sort=newest")
        const data = await res.json()
        
        if (data.success) {
          // Chỉ lấy 8 bài đầu tiên
          setGigs(data.data.slice(0, 8))
        }
      } catch (error) {
        console.error("Failed to fetch featured gigs")
      } finally {
        setLoading(false)
      }
    }
    fetchGigs()
  }, [])

  return (
    <section className="container mx-auto px-4 py-16">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end mb-8">
        <div>
           <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Gigs</h2>
           <p className="text-gray-500">Most popular services on 5.pi Gigs this week.</p>
        </div>
        <Link href="/search" className="text-[#1dbf73] font-bold hover:underline hidden md:block">
          View All Gigs →
        </Link>
      </div>

      {/* LOADING SKELETON */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-80 bg-gray-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && gigs.length === 0 && (
        <div className="text-center py-10 border border-dashed border-gray-200 rounded-xl">
          <p className="text-gray-500">No gigs found. Be the first to post!</p>
          <Link href="/create-gig">
            <button className="mt-4 px-4 py-2 bg-[#1dbf73] text-white rounded-md font-bold text-sm">
              Post a Gig
            </button>
          </Link>
        </div>
      )}

      {/* GIGS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {gigs.map((gig) => (
          <Link href={`/gigs/${gig._id}`} key={gig._id} className="group block h-full">
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
              
              {/* IMAGE */}
              <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                {gig.image ? (
                  <img 
                    src={gig.image} 
                    alt={gig.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                     <span className="text-xs font-medium">NO IMAGE</span>
                  </div>
                )}
              </div>

              {/* CONTENT */}
              <div className="p-4 flex flex-col flex-grow">
                {/* Seller Info */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#1dbf73] to-emerald-400 flex items-center justify-center text-[10px] text-white font-bold uppercase">
                    {(gig.seller?.username || "S").charAt(0)}
                  </div>
                  <span className="text-xs font-bold text-gray-700 truncate max-w-[100px]">
                    {gig.seller?.username || "Seller"}
                  </span>
                  <div className="ml-auto text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                    Level 1
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-[#1dbf73] transition-colors mb-2 flex-grow min-h-[48px]">
                  {gig.title}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-gray-700">{gig.rating || "New"}</span>
                  <span className="text-sm text-gray-400">({gig.reviewsCount || 0})</span>
                </div>

                {/* Footer Price */}
                <div className="border-t border-gray-100 pt-3 flex items-center justify-between mt-auto">
                  <Heart className="w-4 h-4 text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block">Starting at</span>
                    <span className="text-lg font-extrabold text-[#1dbf73]">{gig.price} π</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* MOBILE BUTTON */}
      <div className="mt-8 text-center md:hidden">
         <Link href="/search" className="text-[#1dbf73] font-bold hover:underline">
            View All Gigs →
         </Link>
      </div>
    </section>
  )
}