import Link from "next/link"
import { 
  Code2, 
  PenTool, 
  Globe, 
  Megaphone, 
  Video, 
  Music, 
  Briefcase, 
  Smartphone 
} from "lucide-react"

// Danh sách danh mục (Slug phải khớp với value trong thẻ <select> ở trang Search)
const CATEGORIES = [
  { 
    name: "Graphics & Design", 
    icon: PenTool, 
    slug: "design", 
    color: "text-pink-500 bg-pink-50" 
  },
  { 
    name: "Digital Marketing", 
    icon: Megaphone, 
    slug: "marketing", 
    color: "text-orange-500 bg-orange-50" 
  },
  { 
    name: "Writing & Translation", 
    icon: Globe, 
    slug: "writing", 
    color: "text-emerald-500 bg-emerald-50" 
  },
  { 
    name: "Video & Animation", 
    icon: Video, 
    slug: "video", 
    color: "text-purple-500 bg-purple-50" 
  },
  { 
    name: "Music & Audio", 
    icon: Music, 
    slug: "music", 
    color: "text-red-500 bg-red-50" 
  },
  { 
    name: "Programming & Tech", 
    icon: Code2, 
    slug: "programming", 
    color: "text-blue-500 bg-blue-50" 
  },
  { 
    name: "Business", 
    icon: Briefcase, 
    slug: "business", 
    color: "text-cyan-500 bg-cyan-50" 
  },
  { 
    name: "Lifestyle", 
    icon: Smartphone, 
    slug: "mobile", 
    color: "text-indigo-500 bg-indigo-50" 
  },
]

export function Categories() {
  return (
    <section className="py-12 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Browse by Category</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {CATEGORIES.map((cat) => (
            <Link 
              key={cat.slug} 
              href={`/search?category=${cat.slug}`}
              className="flex flex-col items-center justify-center p-4 rounded-xl hover:shadow-lg transition-all border border-transparent hover:border-gray-100 group bg-white hover:-translate-y-1 duration-300"
            >
              {/* Icon Circle */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${cat.color} group-hover:scale-110 transition-transform`}>
                <cat.icon className="w-6 h-6" />
              </div>
              
              {/* Title */}
              <span className="text-sm font-medium text-gray-600 group-hover:text-[#1dbf73] transition-colors text-center">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}