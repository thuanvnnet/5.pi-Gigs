import type React from "react"
import type { Metadata } from "next" // ✅ Có ngoặc nhọn
import { GeistSans } from "geist/font/sans" // ✅ Có ngoặc nhọn
import { GeistMono } from "geist/font/mono" // ✅ Có ngoặc nhọn
import "./globals.css"

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
        {/* --- ĐOẠN MÃ MỚI THÊM: PI NETWORK SDK --- */}
        <script src="https://sdk.minepi.com/pi-sdk.js" async />
        {/* ---------------------------------------- */}

        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}