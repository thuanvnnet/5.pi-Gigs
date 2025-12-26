"use client"

import { useState, useEffect } from "react"

// Định nghĩa kiểu dữ liệu cho User Pi
type PiUser = {
  username: string
  uid: string
  accessToken: string
}

export function usePiAuth() {
  const [user, setUser] = useState<PiUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initPi = async () => {
      try {
        // @ts-ignore
        if (!window.Pi) {
          console.log("Pi SDK không tìm thấy (Đang chạy trên Chrome?)")
          setLoading(false)
          return
        }

        // @ts-ignore
        await window.Pi.init({ version: "2.0", sandbox: true })
        
        // @ts-ignore
        const scopes = ["username", "payments"]
        const onIncompletePaymentFound = (payment: any) => {
          console.log("Giao dịch chưa hoàn thành:", payment)
        }

        // @ts-ignore
        const authResult = await window.Pi.authenticate(scopes, onIncompletePaymentFound)
        setUser(authResult.user)
      } catch (error) {
        console.error("Lỗi Pi Auth:", error)
      } finally {
        setLoading(false)
      }
    }

    initPi()
  }, [])

  return { user, loading }
}