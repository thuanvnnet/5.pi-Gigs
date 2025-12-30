import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

export function CTABanner() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="relative bg-[#052e16] rounded-3xl overflow-hidden px-6 py-16 md:px-16 md:py-20 text-center shadow-2xl">
          
          {/* Họa tiết nền (Glow Effect) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#1dbf73] opacity-20 blur-[120px] rounded-full pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/10 text-[#1dbf73] px-4 py-1.5 rounded-full text-sm font-bold backdrop-blur-sm border border-white/5">
              <Sparkles className="w-4 h-4" />
              <span>Join the Future of Work</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Ready to turn your skills into <span className="text-[#1dbf73]">Pi Coin?</span>
            </h2>
            
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Join thousands of freelancers connecting with the Pi Network community. 
              Zero upfront fees. Secure payments. Global reach.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/create">
                <button className="group relative px-8 py-4 bg-[#1dbf73] hover:bg-[#1dbf73]/90 text-white font-bold text-lg rounded-full shadow-lg shadow-[#1dbf73]/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                  Become a Seller
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              
              <Link href="/search">
                <button className="px-8 py-4 bg-transparent border border-white/20 hover:bg-white/10 text-white font-bold text-lg rounded-full transition-all">
                  Browse Services
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}