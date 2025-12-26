export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
             <img src="/logo5pi.png" alt="Logo" className="h-9 w-auto object-contain" />
            </div>
            <p className="text-pretty text-sm text-muted-foreground">
              The Pi Network marketplace for small tasks and big opportunities.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Categories</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Design
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Writing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Programming
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Marketing
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Trust & Safety
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Seller Guide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Community</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  About Pi Network
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Success Stories
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Invite Friends
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 5.pi Gigs. Built on Pi Network. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
