"use client"

import { Quote, Star } from "lucide-react"

const REVIEWS = [
  {
    name: "David Nguyen",
    role: "Pi Node Operator",
    content: "I was struggling with my Node setup for weeks. Found a seller here who fixed it in 30 minutes via TeamViewer. Worth every Pi!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    rating: 5
  },
  {
    name: "Sarah Jenkins",
    role: "Digital Marketer",
    content: "The quality of freelancers on 5.pi Gigs is surprisingly good. I paid 50 Pi for a full branding kit and it looks professional.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "App Developer",
    content: "Great platform to earn extra Pi. The Escrow system makes me feel safe when working with new clients. Highly recommended!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    rating: 5
  }
]

export function Testimonials() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Decor (Chấm bi mờ) */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[#1dbf73] font-bold tracking-wider text-sm uppercase mb-2 block">Community Love</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Trusted by Pi Pioneers</h2>
          <p className="text-gray-500 text-lg">
            See what our community has to say about their experience on 5.pi Gigs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((review, index) => (
            <div 
              key={index} 
              className="group bg-gray-50 hover:bg-white p-8 rounded-2xl border border-gray-100 hover:border-[#1dbf73]/30 hover:shadow-xl transition-all duration-500 ease-out hover:-translate-y-2"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote Icon */}
              <Quote className="w-10 h-10 text-gray-200 group-hover:text-[#1dbf73]/20 transition-colors duration-300 mb-4" />
              
              <p className="text-gray-600 mb-8 leading-relaxed text-lg italic">
                "{review.content}"
              </p>
              
              <div className="flex items-center gap-4 border-t border-gray-100 pt-6 group-hover:border-transparent transition-colors">
                <img 
                  src={review.avatar} 
                  alt={review.name} 
                  className="w-12 h-12 rounded-full bg-white shadow-sm ring-2 ring-white group-hover:ring-[#1dbf73]/20 transition-all" 
                />
                <div>
                  <h4 className="font-bold text-gray-900 group-hover:text-[#1dbf73] transition-colors">{review.name}</h4>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}