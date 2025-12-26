"use client"

import { useState, useEffect, Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ImagePlus, Loader2, ArrowLeft, Trash2, UploadCloud, X } from "lucide-react"
import { usePiAuth } from "@/hooks/use-pi-auth"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"

// --- CẤU HÌNH CLOUDINARY ---
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dreujbtxs"; 
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "5pi-gigs"; 

function GigForm() {
  const { user } = usePiAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get("edit")

  const [loading, setLoading] = useState(false)     // Loading khi Submit
  const [fetching, setFetching] = useState(false)   // Loading khi lấy dữ liệu cũ
  const [uploading, setUploading] = useState(false) // Loading khi Upload ảnh

  // Form Data
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState("")
  const [deliveryTime, setDeliveryTime] = useState("3")
  const [description, setDescription] = useState("")
  
  // 🖼️ QUẢN LÝ ẢNH
  const [coverImage, setCoverImage] = useState("")      // 1 Ảnh bìa
  const [gallery, setGallery] = useState<string[]>([])  // Mảng ảnh phụ

  // 1. EDIT MODE: Tải dữ liệu cũ
  useEffect(() => {
    if (editId) {
      setFetching(true)
      fetch(`/api/gigs/${editId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            const g = data.data
            setTitle(g.title)
            setCategory(g.category)
            setPrice(g.price)
            setDeliveryTime(g.deliveryTime)
            setDescription(g.description)
            
            // Load ảnh
            setCoverImage(g.image) 
            setGallery(g.images || []) // Nếu DB có trường images
          } else {
            toast.error("Gig not found")
            router.push("/dashboard")
          }
        })
        .finally(() => setFetching(false))
    }
  }, [editId, router])

  // 2. HÀM UPLOAD CLOUDINARY
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, isCover: boolean) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    
    // Nếu là gallery thì upload từng file, demo này lấy file đầu tiên để đơn giản hóa
    // Bạn có thể loop để upload nhiều file cùng lúc
    const file = files[0];
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.secure_url) {
        if (isCover) {
          setCoverImage(data.secure_url); // Set ảnh bìa
        } else {
          setGallery(prev => [...prev, data.secure_url]); // Thêm vào gallery
        }
        toast.success("Image uploaded!");
      } else {
        toast.error("Upload failed. Check Cloudinary config.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  // 3. XÓA ẢNH KHỎI GALLERY
  const removeGalleryImage = (indexToRemove: number) => {
    setGallery(prev => prev.filter((_, index) => index !== indexToRemove));
  }

  // 4. SUBMIT FORM
  const handleSubmit = async () => {
    if (!user) return toast.error("Please login")
    if (!title || !category || !price || !coverImage) return toast.error("Please fill required fields")

    setLoading(true)
    try {
      const payload = {
        title, category, price: Number(price), deliveryTime: Number(deliveryTime), description,
        image: coverImage,   // Ảnh bìa
        images: gallery,     // Mảng ảnh phụ
        seller: { username: user.username, uid: user.uid, level: "Level 1" }
      }

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
      toast.error("Connection Error")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-[#1dbf73]" /></div>

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
         <Button variant="ghost" onClick={() => router.back()} className="p-0 h-auto hover:bg-transparent text-gray-400 hover:text-gray-800">
            <ArrowLeft className="w-6 h-6" />
         </Button>
         <div>
            <h1 className="text-3xl font-bold text-gray-900">{editId ? "Edit Your Gig" : "Create New Gig"}</h1>
            <p className="text-gray-500 mt-1">{editId ? "Update service details & gallery" : "Showcase your work with images"}</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CỘT TRÁI: THÔNG TIN CƠ BẢN */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div className="space-y-3">
              <Label className="text-base font-bold">Gig Title</Label>
              <Input placeholder="I will do..." className="text-lg py-6" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

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

            <div className="space-y-3">
              <Label className="text-base font-bold">Delivery Time (Days)</Label>
              <Input type="number" className="py-6" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-bold">Description</Label>
              <Textarea placeholder="Describe your service..." className="min-h-[200px]" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: QUẢN LÝ ẢNH (MEDIA) */}
        <div className="lg:col-span-1 space-y-6">
           
           {/* 1. COVER IMAGE */}
           <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <Label className="text-base font-bold mb-4 block">Cover Image (Required)</Label>
              
              {!coverImage ? (
                // Nút Upload Cover
                <label className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors h-48">
                    {uploading ? <Loader2 className="animate-spin w-8 h-8 text-gray-400" /> : <ImagePlus className="w-10 h-10 text-[#1dbf73] mb-2" />}
                    <span className="text-sm font-bold text-gray-600">Upload Cover</span>
                    <span className="text-xs text-gray-400 mt-1">JPG, PNG max 5MB</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, true)} disabled={uploading} />
                </label>
              ) : (
                // Preview Cover
                <div className="relative h-48 rounded-xl overflow-hidden border border-gray-200 group">
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                   <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="icon" variant="destructive" onClick={() => setCoverImage("")}><Trash2 className="w-4 h-4" /></Button>
                   </div>
                   <div className="absolute top-2 left-2 bg-[#1dbf73] text-white text-[10px] font-bold px-2 py-0.5 rounded">MAIN COVER</div>
                </div>
              )}
           </div>

           {/* 2. GALLERY IMAGES */}
           <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <Label className="text-base font-bold mb-4 block">Gallery ({gallery.length}/4)</Label>
              
              <div className="grid grid-cols-2 gap-3">
                 {/* Danh sách ảnh Gallery */}
                 {gallery.map((img, idx) => (
                    <div key={idx} className="relative h-24 rounded-lg overflow-hidden border border-gray-200 group">
                       {/* eslint-disable-next-line @next/next/no-img-element */}
                       <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                       <button 
                         onClick={() => removeGalleryImage(idx)}
                         className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                       >
                         <X className="w-3 h-3" />
                       </button>
                    </div>
                 ))}

                 {/* Nút Upload Gallery (Nếu chưa đủ 4 ảnh) */}
                 {gallery.length < 4 && (
                    <label className="border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 h-24 transition-colors">
                       {uploading ? <Loader2 className="animate-spin w-5 h-5 text-gray-400" /> : <UploadCloud className="w-6 h-6 text-gray-400" />}
                       <span className="text-[10px] font-bold text-gray-500 mt-1">Add More</span>
                       <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, false)} disabled={uploading} />
                    </label>
                 )}
              </div>
           </div>

           {/* ACTIONS */}
           <div className="flex flex-col gap-3 pt-4">
              <Button onClick={handleSubmit} disabled={loading || uploading} className="w-full bg-[#1dbf73] hover:bg-[#1dbf73]/90 text-white font-bold py-6 text-lg shadow-lg">
                 {loading ? <Loader2 className="animate-spin" /> : (editId ? "Save Changes" : "Publish Gig")}
              </Button>
              <Button variant="ghost" onClick={() => router.back()} className="w-full">Cancel</Button>
           </div>

        </div>
      </div>
    </div>
  )
}

export default function CreateGigPage() {
  return (
    <div className="min-h-screen bg-[#F7F9FB] font-sans">
      <Header />
      <main className="container mx-auto px-4 py-10">
         <Suspense fallback={<div className="text-center pt-20">Loading...</div>}>
            <GigForm />
         </Suspense>
      </main>
      <Footer />
    </div>
  )
}