"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CreateGigPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // 1. Khai báo biến formData để lưu dữ liệu nhập vào
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: "",
    description: "",
  })

  // Hàm xử lý khi người dùng nhập liệu
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Hàm xử lý khi chọn danh mục (Select)
  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  // Hàm xử lý khi bấm nút Đăng (Submit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Chuẩn bị dữ liệu gửi đi
    const gigData = {
      title: formData.title,
      category: formData.category,
      description: formData.description,
      price: Number(formData.price),
      seller: {
        username: "PiMaster_VN" // Tạm thời để cứng, sau này lấy từ usePiAuth
      }
    }

    try {
      // Gọi API lưu vào Database
      const res = await fetch("/api/gigs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gigData),
      })

      if (res.ok) {
        alert("🎉 Đăng bài thành công! Đã lưu vào MongoDB.")
        router.push("/dashboard")
      } else {
        alert("Có lỗi xảy ra, vui lòng thử lại.")
      }
    } catch (error) {
      console.error("Lỗi:", error)
      alert("Không thể kết nối đến Server.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">Đăng Dịch Vụ Mới</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Tiêu đề */}
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề dịch vụ</Label>
              <Input 
                id="title" 
                name="title" 
                placeholder="VD: Tôi sẽ thiết kế logo cho bạn..." 
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Danh mục & Giá */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Danh mục</Label>
                <Select onValueChange={handleCategoryChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="design">Thiết kế đồ họa</SelectItem>
                    <SelectItem value="programming">Lập trình & Tech</SelectItem>
                    <SelectItem value="marketing">Digital Marketing</SelectItem>
                    <SelectItem value="writing">Viết lách & Dịch thuật</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Giá (Pi)</Label>
                <Input 
                  id="price" 
                  name="price" 
                  type="number" 
                  placeholder="VD: 5" 
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Mô tả */}
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả chi tiết</Label>
              <Textarea 
                id="description" 
                name="description" 
                placeholder="Mô tả chi tiết những gì bạn sẽ làm..." 
                className="h-32"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            {/* Nút Submit */}
            <Button 
              type="submit" 
              className="w-full bg-[#1dbf73] hover:bg-[#1dbf73]/90 text-white font-bold py-6 text-lg"
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Đăng Ngay"}
            </Button>

          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}