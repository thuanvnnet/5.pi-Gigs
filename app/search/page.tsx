"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, SlidersHorizontal } from "lucide-react"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [gigs, setGigs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Filter States
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "all",
    minPrice: searchParams.get("min") || "",
    maxPrice: searchParams.get("max") || "",
    sort: searchParams.get("sort") || "newest"
  })

  // 1. Fetch Data when URL changes
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true)
      const query = searchParams.toString() 
      try {
        const res = await fetch(`/api/gigs?${query}`)
        const data = await res.json()
        if (data.success) setGigs(data.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [searchParams])

  // 2. Apply Filters Function
  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (filters.category !== "all") params.set("category", filters.category)
    else params.delete("category")

    if (filters.minPrice) params.set("min", filters.minPrice)
    else params.delete("min")

    if (filters.maxPrice) params.set("max", filters.maxPrice)
    else params.delete("max")

    params.set("sort", filters.sort)

    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 flex-grow">
        
        {/* --- LEFT COLUMN: FILTERS --- */}
        <div className="w-full md:w-64 space-y-6 h-fit bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-gray-900">
            <SlidersHorizontal className="w-5 h-5" />
            <h3 className="font-bold text-lg">Filters</h3>
          </div>
          
          {/* Category Filter */}
          <div className="space-y-2">
            <Label className="text-gray-600">Category</Label>
            <select 
              className="w-full border border-gray-300 rounded-md p-2.5 text-sm bg-white focus:ring-2 focus:ring-[#1dbf73]/50 outline-none"
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
            >
              <option value="all">All Categories</option>
              <option value="programming">Programming & Tech</option>
              <option value="design">Graphics & Design</option>
              <option value="marketing">Digital Marketing</option>
              <option value="writing">Writing & Translation</option>
              <option value="video">Video & Animation</option>
              <option value="business">Business</option>
            </select>
          </div>

          {/* Price Filter */}
          <div className="space-y-2">
            <Label className="text-gray-600">Price Range (Pi)</Label>
            <div className="flex gap-2">
              <Input 
                type="number" placeholder="Min" 
                className="bg-white"
                value={filters.minPrice}
                onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
              />
              <Input 
                type="number" placeholder="Max" 
                className="bg-white"
                value={filters.maxPrice}
                onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
              />
            </div>
          </div>

          {/* Sort Filter */}
          <div className="space-y-2">
             <Label className="text-gray-600">Sort By</Label>
             <select 
               className="w-full border border-gray-300 rounded-md p-2.5 text-sm bg-white focus:ring-2 focus:ring-[#1dbf73]/50 outline-none"
               value={filters.sort}
               onChange={(e) => setFilters({...filters, sort: e.target.value})}
             >
               <option value="newest">Newest Arrivals</option>
               <option value="price_asc">Price: Low to High</option>
               <option value="price_desc">Price: High to Low</option>
             </select>
          </div>

          <Button onClick={applyFilters} className="w-full bg-[#1dbf73] hover:bg-[#1dbf73]/90 font-bold text-white mt-4">
            Apply Filters
          </Button>
        </div>

        {/* --- RIGHT COLUMN: RESULTS --- */}
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {searchParams.get("q") 
                ? `Results for "${searchParams.get("q")}"` 
                : "All Gigs"}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {gigs.length} services available
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-20">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1dbf73] mx-auto mb-4"></div>
               <p className="text-gray-500">Searching for the best gigs...</p>
            </div>
          ) : gigs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
              <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No services found</h3>
              <p className="text-gray-500 text-sm mt-2 max-w-sm mx-auto">
                Try adjusting your search or filters to find what you are looking for.
              </p>
              <Button variant="outline" className="mt-6" onClick={() => router.push("/")}>
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               {gigs.map((gig) => (
                 <div key={gig._id} className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
                    <Link href={`/gigs/${gig._id}`}>
                      {/* Placeholder Image Logic */}
                      <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                        {gig.image ? (
                           <img src={gig.image} alt={gig.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                           <div className="flex items-center justify-center h-full text-gray-400 text-sm font-medium">NO IMAGE</div>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                           {/* Avatar Placeholder */}
                           <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#1dbf73] to-emerald-400 flex items-center justify-center text-[10px] text-white font-bold">
                             {(gig.seller?.username || "S").charAt(0).toUpperCase()}
                           </div>
                           <span className="text-xs font-medium text-gray-500">
                             {gig.seller?.username || "Seller"}
                           </span>
                        </div>

                        <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-[#1dbf73] transition-colors mb-4 h-12">
                             {gig.title}
                        </h3>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          {/* Rating Placeholder */}
                          <div className="flex items-center text-yellow-500 text-xs font-bold gap-1">
                             <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                             {gig.rating || "New"} 
                             <span className="text-gray-400 font-normal">({gig.reviewsCount || 0})</span>
                          </div>

                          <div className="text-right">
                             <p className="text-[10px] text-gray-400 font-semibold uppercase">Starting at</p>
                             <span className="text-[#1dbf73] font-extrabold text-lg">
                               {gig.price} π
                             </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                 </div>
               ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}