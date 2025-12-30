"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useDebounce } from "use-debounce"
import { Search, Star, History } from "lucide-react"
import { Button } from "@/components/ui/button"

// --- UTILITY FUNCTIONS FOR RECENT SEARCHES ---
const MAX_RECENT_SEARCHES = 5;

const getRecentSearches = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const items = window.localStorage.getItem('recentSearches');
    return items ? JSON.parse(items) : [];
  } catch (error) {
    console.error("Failed to parse recent searches:", error);
    return [];
  }
};

const addRecentSearch = (term: string) => {
  const cleanedTerm = term.trim().toLowerCase();
  if (!cleanedTerm) return;
  const recent = getRecentSearches();
  const updated = [cleanedTerm, ...recent.filter(t => t.toLowerCase() !== cleanedTerm)];
  window.localStorage.setItem('recentSearches', JSON.stringify(updated.slice(0, MAX_RECENT_SEARCHES)));
};

// Define a type for suggestions for better type safety
interface Suggestion {
  _id: string;
  title: string;
  price: number;
  category: string;
  rating?: number;
  reviewCount?: number;
}

// Helper function to escape special regex characters
const escapeRegExp = (string: string) => {
  // $& means the whole matched string
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Helper component to highlight the search term within a suggestion
const HighlightedText = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }
  const safeHighlight = escapeRegExp(highlight.trim());
  const parts = text.split(new RegExp(`(${safeHighlight})`, 'gi'));
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <strong key={i} className="font-bold">{part}</strong>
        ) : (
          part
        )
      )}
    </span>
  );
};

export function Hero() {
  const router = useRouter()
  
  // --- SEARCH LOGIC ---
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300)
  const [activeIndex, setActiveIndex] = useState(-1); // For keyboard navigation
  const [isFetching, setIsFetching] = useState(false); // Loading state for suggestions
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Fetch suggestions API
  useEffect(() => {
    // Create a controller for each new fetch operation
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchSuggestions = async () => {
      if (debouncedSearchTerm.length < 2) {
        setSuggestions([])
        return
      }
      setIsFetching(true);
      try {
        const res = await fetch(`/api/gigs/suggestions?q=${encodeURIComponent(debouncedSearchTerm)}`, { signal })
        const data = await res.json()
        if (data.success) {
          setSuggestions(data.data)
        } else {
          setSuggestions([])
        }
      } catch (error) {
        // Ignore abort errors, as they are expected when a new request is made
        if ((error as Error).name !== 'AbortError') {
          console.error("Failed to fetch suggestions:", error)
          setSuggestions([])
        }
      } finally {
        // Only set fetching to false if this request was not aborted
        if (!signal.aborted) {
          setIsFetching(false);
        }
      }
    }
    fetchSuggestions()
    // Cleanup function: abort the fetch if the component unmounts or the dependency changes
    return () => controller.abort();
  }, [debouncedSearchTerm])

  // Load recent searches on component mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [wrapperRef])

  // Handle Search Action
  const handleSearch = (term: string) => {
    if (!term.trim()) return;
    const cleanedTerm = term.trim();
    addRecentSearch(cleanedTerm);
    setRecentSearches(getRecentSearches()); // Refresh recent searches state
    setSearchTerm(cleanedTerm); // Update input field to match what's being searched
    setShowSuggestions(false)
    setActiveIndex(-1); // Reset active index
    router.push(`/search?q=${encodeURIComponent(cleanedTerm)}`)
  }

  // Auto-scroll to active suggestion
  useEffect(() => {
    if (activeIndex < 0) return;
    const activeElement = document.getElementById(`suggestion-${activeIndex}`);
    if (activeElement) {
      activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeIndex]);

  // Handle keyboard navigation for suggestions
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const currentSuggestions = debouncedSearchTerm.length < 2 ? recentSearches : suggestions;
    if (showSuggestions && (currentSuggestions.length > 0 || isFetching)) {
      if (e.key === "ArrowDown") {
        e.preventDefault(); // Prevent cursor from moving
        setActiveIndex(prev => (prev + 1) % currentSuggestions.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault(); // Prevent cursor from moving
        setActiveIndex(prev => (prev - 1 + currentSuggestions.length) % currentSuggestions.length);
      } else if (e.key === "Enter") {
        if (activeIndex > -1) {
          e.preventDefault(); // Prevent form submission if it was a form
          const selectedTerm = debouncedSearchTerm.length < 2 ? currentSuggestions[activeIndex] : suggestions[activeIndex].title;
          handleSearch(selectedTerm);
        }
      } else if (e.key === "Escape") {
        setShowSuggestions(false);
      }
    }
  }

  return (
    // FIX: Changed overflow-hidden to overflow-visible so the dropdown isn't cut off
    <section className="relative bg-white pt-16 pb-24 sm:pt-20 sm:pb-32 overflow-visible">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5 pointer-events-none" />

      <div className="container mx-auto px-4 relative text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1 text-sm font-medium text-neutral-900 shadow-sm mb-6 sm:mb-8 animate-in fade-in slide-in-from-bottom-3">
          <span className="flex h-2 w-2 rounded-full bg-[#1dbf73] mr-2"></span>
          Live on Pi Network
        </div>

        {/* Main Title (English) */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-4 sm:mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          Small Tasks. <span className="text-[#1dbf73]">Big Network.</span>
        </h1>
        
        {/* Subtitle (English) */}
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-8 sm:mb-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
          Connect with millions of Pi users. Get work done or earn Pi today.
          <span className="font-bold text-slate-900 block mt-1">Starting at just 5 Pi.</span>
        </p>

        {/* --- SEARCH BOX CONTAINER --- */}
        {/* FIX: Added z-50 to make sure this container sits ON TOP of everything below it */}
        <div 
          className="max-w-xl mx-auto relative z-50 animate-in fade-in slide-in-from-bottom-6 duration-1000" 
          ref={wrapperRef}
          onKeyDown={handleKeyDown}
        >
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
                setShowSuggestions(true);
                setActiveIndex(-1); // Reset selection when typing
              }}
              onKeyDown={(e) => {
                // Only handle Enter if suggestions are not shown or none is selected
                if (e.key === "Enter" && activeIndex === -1) {
                  handleSearch(searchTerm)
                }
              }}
              onFocus={() => {
                if (recentSearches.length > 0 || searchTerm.length > 1)
                  setShowSuggestions(true)
              }}
              role="combobox"
              aria-expanded={showSuggestions && (suggestions.length > 0 || isFetching)}
              aria-controls="suggestions-list"
              aria-activedescendant={activeIndex > -1 ? `suggestion-${activeIndex}` : undefined}
            />

            <Button 
              className="rounded-full h-12 w-12 sm:w-auto sm:px-8 bg-[#1dbf73] hover:bg-[#1dbf73]/90 text-white font-bold text-base shadow-md flex items-center justify-center flex-shrink-0"
              onClick={() => handleSearch(searchTerm)}
            >
              {/* Icon for mobile, text for desktop */}
              <span className="sm:hidden"><Search className="h-5 w-5" /></span>
              <span className="hidden sm:block">Search</span>
            </Button>
          </div>

          {/* --- DROPDOWN SUGGESTIONS --- */}
          {showSuggestions && (
            <div 
              id="suggestions-list"
              role="listbox"
              className="absolute top-full left-0 w-full bg-white border border-gray-100 rounded-2xl shadow-2xl mt-3 py-2 z-[100] text-left overflow-hidden animate-in zoom-in-95 duration-200"
            >
              {/* Show Recent Searches when input is empty */}
              {debouncedSearchTerm.length < 2 && recentSearches.length > 0 && (
                <>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Recent Searches
                  </div>
                  {recentSearches.map((term, index) => (
                     <div
                       key={term + index}
                       id={`suggestion-${index}`}
                       role="option"
                       aria-selected={activeIndex === index}
                       className={`px-4 py-2.5 cursor-pointer text-gray-700 flex items-center justify-between gap-4 transition-colors ${
                         activeIndex === index ? 'bg-gray-100' : 'hover:bg-gray-50'
                       }`}
                       onClick={() => handleSearch(term)}
                       onMouseEnter={() => setActiveIndex(index)}
                     >
                       <div className="flex items-center gap-3">
                         <History className="w-4 h-4 text-gray-400 flex-shrink-0" />
                         <span className="font-medium text-sm">{term}</span>
                       </div>
                     </div>
                  ))}
                </>
              )}

              {/* Show API suggestions when user is typing */}
              {debouncedSearchTerm.length >= 2 && (isFetching ? (
                <div className="px-6 py-3 text-gray-500">Searching...</div>
              ) : suggestions.length > 0 ? (
                <>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Suggestions
                  </div>
                  {suggestions.map((item, index) => (
                    <div
                      key={item._id}
                      id={`suggestion-${index}`}
                      role="option"
                      aria-selected={activeIndex === index}
                      className={`px-4 py-2.5 cursor-pointer text-gray-700 flex items-center justify-between gap-4 transition-colors ${
                        activeIndex === index ? 'bg-gray-100' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleSearch(item.title)}
                      onMouseEnter={() => setActiveIndex(index)}
                    >
                      {/* Left side: Title and Category */}
                      <div className="flex-grow overflow-hidden">
                        <div className="font-medium truncate text-sm">
                          <HighlightedText text={item.title} highlight={debouncedSearchTerm} />
                        </div>
                        <div className="text-xs text-gray-500">{item.category}</div>
                      </div>
                      {/* Right side: Price and Rating */}
                      <div className="flex-shrink-0 flex items-center gap-4 text-sm">
                        {item.rating && item.reviewCount && item.reviewCount > 0 && (
                          <div className="hidden sm:flex items-center gap-1 text-amber-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="font-bold text-gray-800">{item.rating.toFixed(1)}</span>
                            <span className="text-xs text-gray-400">({item.reviewCount})</span>
                          </div>
                        )}
                        <div className="font-bold text-[#1dbf73] whitespace-nowrap">
                          {item.price} π
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="px-6 py-3 text-gray-500">No results for "{debouncedSearchTerm}"</div>
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