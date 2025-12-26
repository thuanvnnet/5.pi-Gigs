"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

// 1. Định nghĩa kiểu dữ liệu User
interface User {
  username: string
  uid: string
  accessToken?: string
}

// 2. Định nghĩa Context để chia sẻ dữ liệu toàn app
interface PiAuthContextType {
  user: User | null
  loading: boolean
  login: () => void
  logout: () => void
}

const PiAuthContext = createContext<PiAuthContextType>({
  user: null,
  loading: false,
  login: () => {},
  logout: () => {},
})

// 3. Provider: Cung cấp user giả lập cho toàn bộ app
export function PiAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // --- MOCK LOGIN (GIẢ LẬP) ---
    // Tự động đăng nhập sau 0.5s để bạn không phải làm gì cả
    const timer = setTimeout(() => {
      setUser({
        username: "PiBuyer_Test", // Tên người mua (Khác với người bán PiMaster_VN PiBuyer_Test)
        uid: "PiBuyer_Test",
        accessToken: "mock_token"
      })
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const login = () => { console.log("Login...") }
  const logout = () => { setUser(null) }

  return (
    <PiAuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </PiAuthContext.Provider>
  )
}

// 4. Hook để lấy user ở các trang khác
export const usePiAuth = () => useContext(PiAuthContext)