import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Hero } from "@/components/hero"
import { Categories } from "@/components/categories"
import FeaturedGigs from "@/components/featured-gigs"
import { HowItWorks } from "@/components/how-it-works"
import { Testimonials } from "@/components/testimonials" // Mới
import { CTABanner } from "@/components/cta-banner"     // Mới

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#1dbf73]/30">
      <Header />
      
      <main>
        {/* 1. HERO */}
        <Hero />
        
        {/* 2. CATEGORIES */}
        <Categories />

        {/* 3. FEATURED GIGS */}
        <FeaturedGigs />

        {/* 4. HOW IT WORKS */}
        <HowItWorks />
        
        {/* 5. TESTIMONIALS*/}
        <Testimonials />

        {/* 6. CTA BANNER*/}
        <CTABanner />
      </main>

      <Footer />
    </div>
  )
}