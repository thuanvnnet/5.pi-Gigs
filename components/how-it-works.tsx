import { UserPlus, Search, CreditCard, ShieldCheck } from "lucide-react"

const STEPS = [
  { 
    title: "Create Account", 
    desc: "Join the Pi Network community and setup your profile for free.", 
    icon: UserPlus 
  },
  { 
    title: "Find Services", 
    desc: "Search for gigs or browse categories to find exactly what you need.", 
    icon: Search 
  },
  { 
    title: "Pay with Pi", 
    desc: "Secure payment using Pi Coin. Funds are held in Escrow until you are satisfied.", 
    icon: CreditCard 
  },
  { 
    title: "Get Work Done", 
    desc: "Receive files, approve delivery, and leave a 5-star review for the seller.", 
    icon: ShieldCheck 
  }
]

export function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-4">
        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-gray-500 text-lg">
            Getting work done on 5.pi Gigs is simple, safe, and powered by the Pi Network blockchain.
          </p>
        </div>

        {/* STEPS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((step, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center hover:-translate-y-2 transition-transform duration-300 hover:shadow-md">
              {/* Icon Circle */}
              <div className="w-16 h-16 bg-[#1dbf73]/10 text-[#1dbf73] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <step.icon className="w-8 h-8" />
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-500 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}