"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, User, Home, LayoutDashboard, PlusCircle } from "lucide-react" // Bỏ import Search
import { Button } from "@/components/ui/button"
import { usePiAuth } from "@/hooks/use-pi-auth"

export function Header() {
  const { user, loading } = usePiAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* 1. LOGO */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
             <img src="/logo5pi.png" alt="Logo" className="h-9 w-auto object-contain" />
          </Link>
        </div>

        {/* 2. MENU BÊN PHẢI (DESKTOP) - Không còn thanh tìm kiếm */}
        <div className="hidden md:flex items-center gap-4">
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

          <Link href="/create">
            <Button size="sm" className="bg-[#1dbf73] hover:bg-[#1dbf73]/90 text-white font-bold">
              Post a Gig
            </Button>
          </Link>
        </div>

        {/* 3. MOBILE MENU BUTTON */}
        <div className="flex items-center gap-2 md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
        </div>
      </div>

      {/* MOBILE MENU CONTENT */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white absolute w-full left-0 shadow-xl z-40">
          <div className="p-4 space-y-4">
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
              <Link href="/create" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">
                  <PlusCircle className="w-5 h-5 mr-3 text-[#1dbf73]" /> Post a Gig
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}