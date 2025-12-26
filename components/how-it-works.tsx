import { Search, MessageSquare, Wallet } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Find the Perfect Gig",
    description: "Browse thousands of gigs from talented Pi users. Filter by category, price, and ratings.",
  },
  {
    icon: MessageSquare,
    title: "Connect & Collaborate",
    description: "Message sellers directly. Discuss requirements, timelines, and custom requests.",
  },
  {
    icon: Wallet,
    title: "Pay with Pi",
    description: "Secure transactions with Pi cryptocurrency. Funds held in escrow until delivery.",
  },
]

export function HowItWorks() {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-balance mb-4 text-2xl font-bold text-foreground md:text-3xl">How It Works</h2>
          <p className="text-pretty mx-auto max-w-2xl text-muted-foreground">
            Get started in minutes. Join thousands of Pi users already using 5.pi Gigs.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="relative flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Icon className="h-8 w-8" />
                </div>
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {index + 1}
                </div>
                <h3 className="text-balance mb-2 text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="text-pretty text-muted-foreground">{step.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
