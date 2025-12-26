"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useDebounce } from "use-debounce"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  const router = useRouter()
  
  // --- SEARCH LOGIC ---
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Fetch suggestions API
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearchTerm.length < 2) {
        setSuggestions([])
        return
      }
      try {
        const res = await fetch(`/api/gigs/suggestions?q=${encodeURIComponent(debouncedSearchTerm)}`)
        const data = await res.json()
        if (data.success) setSuggestions(data.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchSuggestions()
  }, [debouncedSearchTerm])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [wrapperRef])

  // Handle Search Action
  const handleSearch = (term: string) => {
    if (!term.trim()) return
    setShowSuggestions(false)
    router.push(`/search?q=${encodeURIComponent(term)}`)
  }

  return (
    // FIX: Changed overflow-hidden to overflow-visible so the dropdown isn't cut off
    <section className="relative bg-white pt-20 pb-32 overflow-visible">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5 pointer-events-none" />

      <div className="container mx-auto px-4 relative text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1 text-sm font-medium text-neutral-900 shadow-sm mb-8 animate-in fade-in slide-in-from-bottom-3">
          <span className="flex h-2 w-2 rounded-full bg-[#1dbf73] mr-2"></span>
          Live on Pi Network
        </div>

        {/* Main Title (English) */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          Small Tasks. <span className="text-[#1dbf73]">Big Network.</span>
        </h1>
        
        {/* Subtitle (English) */}
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
          Connect with millions of Pi users. Get work done or earn Pi today.
          <span className="font-bold text-slate-900 block mt-1">Starting at just 5 Pi.</span>
        </p>

        {/* --- SEARCH BOX CONTAINER --- */}
        {/* FIX: Added z-50 to make sure this container sits ON TOP of everything below it */}
        <div className="max-w-xl mx-auto relative z-50 animate-in fade-in slide-in-from-bottom-6 duration-1000" ref={wrapperRef}>
          <div className="relative flex items-center w-full shadow-xl rounded-full bg-white border border-gray-200 p-1.5 focus-within:ring-2 focus-within:ring-[#1dbf73]/20 transition-all">
            <div className="pl-4 text-gray-400">
              <Search className="w-5 h-5" />
            </div>
            
            <input 
              className="flex-1 h-12 px-4 outline-none text-gray-700 bg-transparent placeholder:text-gray-400"
              placeholder="What are you looking for today?" 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setShowSuggestions(true)
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(searchTerm)}
              onFocus={() => setShowSuggestions(true)}
            />

            <Button 
              className="rounded-full px-8 h-12 bg-[#1dbf73] hover:bg-[#1dbf73]/90 text-white font-bold text-base shadow-md"
              onClick={() => handleSearch(searchTerm)}
            >
              Search
            </Button>
          </div>

          {/* --- DROPDOWN SUGGESTIONS --- */}
          {/* FIX: High z-index and absolute positioning */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white border border-gray-100 rounded-2xl shadow-2xl mt-3 py-2 z-[100] text-left overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Suggestions
              </div>
              {suggestions.map((item) => (
                <div
                  key={item._id}
                  className="px-6 py-3 hover:bg-gray-50 cursor-pointer text-gray-700 flex items-center gap-3 transition-colors"
                  onClick={() => handleSearch(item.title)}
                >
                  <Search className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">{item.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Popular Tags (English) */}
        {/* FIX: Lower z-index (relative z-0) so it doesn't cover the dropdown */}
        <div className="mt-8 flex flex-wrap justify-center gap-2 relative z-0 animate-in fade-in slide-in-from-bottom-7 duration-1000">
           <span className="text-sm text-gray-500 py-1">Popular:</span>
           {["Logo Design", "Writing", "Translation", "Pi App", "Video Editing", "Marketing"].map((tag) => (
             <button
               key={tag}
               onClick={() => handleSearch(tag)}
               className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
             >
               {tag}
             </button>
           ))}
        </div>

      </div>
    </section>
  )
}