import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-secondary/30 to-background py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            Live on Pi Network
          </div>

          <h1 className="text-balance mb-4 text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            Small Tasks. Big Network.
          </h1>

          <p className="text-pretty mb-2 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Connect with millions of Pi users. Get work done or earn Pi.
          </p>

          <p className="text-pretty mb-8 text-2xl font-semibold text-primary md:text-3xl">Starts at 5 Pi</p>

          <div className="w-full max-w-xl">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Try 'logo design' or 'data entry'..."
                  className="h-12 w-full pl-11 text-base bg-card border-border"
                />
              </div>
              <Button size="lg" className="h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                Search Gigs
              </Button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
            <span>Popular:</span>
            {["Logo Design", "Writing", "Translation", "Social Media", "Video Editing"].map((tag) => (
              <button
                key={tag}
                className="rounded-full bg-secondary px-3 py-1 text-foreground hover:bg-accent transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
