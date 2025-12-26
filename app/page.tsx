// File: app/page.tsx

// 1. Các Component có sẵn của mẫu (Thường dùng export function -> Cần ngoặc nhọn)
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Categories } from "@/components/categories"
import { HowItWorks } from "@/components/how-it-works"
import { Footer } from "@/components/footer"

// 2. Component mình mới viết (Dùng export default -> KHÔNG ngoặc nhọn)
import FeaturedGigs from "@/components/featured-gigs"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Categories />
        {/* Component 5.pi Gigs nằm ở đây */}
        <FeaturedGigs />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  )
}