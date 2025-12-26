import Link from "next/link"
import { 
  Pencil, 
  Code, 
  Globe, 
  Megaphone, 
  Video, 
  Briefcase, 
  Smartphone, 
  Palette 
} from "lucide-react"

// Định nghĩa Icon và Link cho từng danh mục
const CATEGORIES = [
  { name: "Design", slug: "design", icon: Palette },
  { name: "Writing", slug: "writing", icon: Pencil },
  { name: "Translation", slug: "writing", icon: Globe }, // Gom chung vào writing cho demo
  { name: "Marketing", slug: "marketing", icon: Megaphone },
  { name: "Video", slug: "video", icon: Video },
  { name: "Programming", slug: "programming", icon: Code },
  { name: "Business", slug: "business", icon: Briefcase },
  { name: "Mobile", slug: "programming", icon: Smartphone },
]

export function Categories() {
  return (
    <section className="py-12 border-b border-gray-100 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">Browse by Category</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <Link 
              key={cat.name} 
              href={`/categories/${cat.slug}`} // <-- Link dẫn đến trang danh mục vừa tạo
              className="flex flex-col items-center p-6 bg-white border border-gray-100 rounded-xl hover:shadow-md hover:border-purple-200 transition group cursor-pointer"
            >
              <cat.icon className="w-8 h-8 text-gray-400 mb-3 group-hover:text-[#1dbf73] transition" />
              <span className="font-medium text-gray-700 group-hover:text-purple-700">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}