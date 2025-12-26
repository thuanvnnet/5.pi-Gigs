import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

// 👇 QUAN TRỌNG: Import Provider ở đây
import { PiAuthProvider } from "@/hooks/use-pi-auth"

export const metadata: Metadata = {
  title: "5.pi Gigs - Freelance Market",
  description: "Small Tasks. Big network. Starts at 5 Pi",
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* --- PI NETWORK SDK --- */}
        <script src="https://sdk.minepi.com/pi-sdk.js" async />
        
        <style>{`
          html {
            font-family: ${GeistSans.style.fontFamily};
            --font-sans: ${GeistSans.variable};
            --font-mono: ${GeistMono.variable};
          }
        `}</style>
      </head>
      
      {/* Thêm class font để áp dụng font Geist */}
      <body className={`${GeistSans.className} ${GeistMono.variable}`}>
        
        {/* 👇 Bọc Provider quanh children */}
        <PiAuthProvider>
          {children}
        </PiAuthProvider>
        
        {/* Toaster nằm cùng cấp với Provider, trong body */}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}