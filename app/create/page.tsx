"use client"

import { useState, useEffect, Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ImagePlus, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react"
import { usePiAuth } from "@/hooks/use-pi-auth"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"

function GigForm() {
  const { user } = usePiAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get("edit") // Lấy ID nếu đang sửa

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false) // Loading khi tải dữ liệu cũ

  // Các trường dữ liệu
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState("")
  const [deliveryTime, setDeliveryTime] = useState("3")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")

  // 1. Tự động điền dữ liệu nếu đang Edit
  useEffect(() => {
    if (editId) {
      setFetching(true)
      fetch(`/api/gigs/${editId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            const g = data.data
            setTitle(g.title)
            setCategory(g.category)
            setPrice(g.price)
            setDeliveryTime(g.deliveryTime)
            setDescription(g.description)
            setImage(g.image)
          } else {
            toast.error("Gig not found!")
            router.push("/dashboard")
          }
        })
        .catch(() => toast.error("Error loading gig"))
        .finally(() => setFetching(false))
    }
  }, [editId, router])

  // 2. Xử lý Submit (Tạo mới hoặc Cập nhật)
  const handleSubmit = async () => {
    if (!user) return toast.error("Please login")
    if (!title || !category || !price || !description) return toast.error("Missing fields")

    setLoading(true)
    try {
      const payload = {
        title, category, price: Number(price), deliveryTime: Number(deliveryTime), description, image,
        seller: { username: user.username, uid: user.uid, level: "Level 1" }
      }

      // Nếu có editId -> PUT (Sửa), Không có -> POST (Tạo)
      const url = editId ? `/api/gigs/${editId}` : "/api/gigs"
      const method = editId ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (data.success) {
        toast.success(editId ? "Gig Updated!" : "Gig Created!")
        router.push("/dashboard")
      } else {
        toast.error(data.error || "Failed")
      }
    } catch (err) {
      toast.error("Error connecting server")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-[#1dbf73]" /></div>

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header Form */}
      <div className="flex items-center gap-4 mb-8">
         <Button variant="ghost" onClick={() => router.back()} className="p-0 h-auto hover:bg-transparent text-gray-400 hover:text-gray-800">
            <ArrowLeft className="w-6 h-6" />
         </Button>
         <div>
            <h1 className="text-3xl font-bold text-gray-900">{editId ? "Edit Your Gig" : "Create New Gig"}</h1>
            <p className="text-gray-500 mt-1">{editId ? "Update your service details" : "Start selling your skills today"}</p>
         </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-8">
        
        {/* Title */}
        <div className="space-y-3">
          <Label className="text-base font-bold">Gig Title</Label>
          <Input placeholder="I will do..." className="text-lg py-6" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        {/* Category & Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label className="text-base font-bold">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="py-6"><SelectValue placeholder="Select Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Design">Graphics & Design</SelectItem>
                <SelectItem value="Programming">Programming & Tech</SelectItem>
                <SelectItem value="Writing">Writing & Translation</SelectItem>
                <SelectItem value="Marketing">Digital Marketing</SelectItem>
                <SelectItem value="Video">Video & Animation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-bold">Price (Pi)</Label>
            <div className="relative">
              <Input type="number" placeholder="5" className="py-6 pl-10" value={price} onChange={(e) => setPrice(e.target.value)} />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[#1dbf73]">π</span>
            </div>
          </div>
        </div>
        
        {/* Delivery Time & Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
                <Label className="text-base font-bold">Delivery (Days)</Label>
                <Input type="number" className="py-6" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} />
            </div>
            <div className="space-y-3">
                <Label className="text-base font-bold">Image URL</Label>
                <Input placeholder="https://..." className="py-6" value={image} onChange={(e) => setImage(e.target.value)} />
            </div>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <Label className="text-base font-bold">Description</Label>
          <Textarea placeholder="Describe your service..." className="min-h-[150px]" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex justify-end gap-4 border-t border-gray-100">
           <Button variant="ghost" onClick={() => router.back()}>Cancel</Button>
           <Button onClick={handleSubmit} disabled={loading} className="bg-[#1dbf73] hover:bg-[#1dbf73]/90 text-white font-bold py-6 px-8 text-lg shadow-lg">
             {loading ? <Loader2 className="animate-spin" /> : (editId ? "Save Changes" : "Publish Gig")}
           </Button>
        </div>
      </div>
    </div>
  )
}

// Bọc trong Suspense để tránh lỗi Next.js build
export default function CreateGigPage() {
  return (
    <div className="min-h-screen bg-[#F7F9FB] font-sans">
      <Header />
      <main className="container mx-auto px-4 py-10">
         <Suspense fallback={<div>Loading...</div>}>
            <GigForm />
         </Suspense>
      </main>
      <Footer />
    </div>
  )
}