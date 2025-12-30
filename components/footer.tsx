import Link from "next/link";

const FOOTER_LINKS = {
  Categories: [
    { title: "Design", href: "/search?category=design" },
    { title: "Writing", href: "/search?category=writing" },
    { title: "Programming", href: "/search?category=programming" },
    { title: "Marketing", href: "/search?category=marketing" },
  ],
  Support: [
    { title: "Help Center", href: "/help" },
    { title: "Trust & Safety", href: "/trust" },
    { title: "Seller Guide", href: "/selling" },
    { title: "Contact Us", href: "/contact" },
  ],
  Community: [
    { title: "About Pi Network", href: "https://minepi.com/about" },
    { title: "Blog", href: "/blog" },
    { title: "Success Stories", href: "/stories" },
    { title: "Invite Friends", href: "/invite" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
             <img src="/logo.svg" alt="Logo" className="h-9 w-auto object-contain" />
            </div>
            <p className="text-pretty text-sm text-muted-foreground">
              The Pi Network marketplace for small tasks and big opportunities.
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-4 font-semibold text-foreground">{title}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {links.map((link) => (
                  <li key={link.title}>
                    <Link href={link.href} className="hover:text-foreground transition-colors">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 5.pi Gigs. Built on Pi Network. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
