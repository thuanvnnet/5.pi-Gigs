"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Menu, X, User, Home, LayoutDashboard, PlusCircle } from "lucide-react" 
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { usePiAuth } from "@/hooks/use-pi-auth"

export function Header() {
  const { user, loading } = usePiAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* 1. LOGO SECTION */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
             <img src="/logo5pi.png" alt="Logo" className="h-9 w-auto object-contain" />
          </Link>
        </div>

        {/* 2. SEARCH BAR (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search for gigs..." className="w-full pl-10 bg-secondary border-border" />
          </div>
        </div>

        {/* 3. DESKTOP BUTTONS */}
        <div className="hidden md:flex items-center gap-2">
          {loading ? (
             <Button variant="ghost" size="sm" disabled>Loading...</Button>
          ) : user ? (
             <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="font-medium hover:bg-[#1dbf73]/10 text-[#1dbf73]">
                  <User className="w-4 h-4 mr-2" />
                  {user.username}
                </Button>
             </Link>
          ) : (
             <Button variant="ghost" size="sm" onClick={() => alert("Mở trên Pi Browser!")}>
               Login
             </Button>
          )}

          <Link href="/create-gig">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Post a Gig
            </Button>
          </Link>
        </div>

        {/* 4. MOBILE MENU BUTTON (Nút 3 gạch) */}
        <div className="flex items-center gap-2 md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
        </div>
      </div>

      {/* 5. MOBILE MENU CONTENT (Phần xổ xuống) */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white absolute w-full left-0 shadow-xl animate-in slide-in-from-top-5">
          <div className="p-4 space-y-4">
            {/* Search Mobile */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input placeholder="Search..." className="w-full pl-10" />
            </div>

            {/* Links Mobile */}
            <div className="space-y-2">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">
                  <Home className="w-5 h-5 mr-3 text-[#1dbf73]" /> Trang chủ
                </div>
              </Link>
              <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">
                  <LayoutDashboard className="w-5 h-5 mr-3 text-[#1dbf73]" /> Dashboard
                </div>
              </Link>
              <Link href="/create-gig" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">
                  <PlusCircle className="w-5 h-5 mr-3 text-[#1dbf73]" /> Post a Gig
                </div>
              </Link>
            </div>

            {/* User Info Mobile */}
            <div className="pt-4 border-t border-gray-100">
              {user ? (
                <div className="flex items-center gap-3 p-2 bg-[#1dbf73]/10 rounded-lg">
                   <div className="w-8 h-8 bg-[#1dbf73] rounded-full flex items-center justify-center text-white font-bold">
                      {user.username.charAt(0).toUpperCase()}
                   </div>
                   <p className="font-bold text-[#1dbf73]">{user.username}</p>
                </div>
              ) : (
                <Button className="w-full bg-[#1dbf73] text-white">Login</Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}