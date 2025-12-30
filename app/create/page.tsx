"use client"

import { useState, useEffect, Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2, ArrowLeft } from "lucide-react"
import { usePiAuth } from "@/hooks/use-pi-auth" 
import { ImageUploader } from "@/components/image-uploader"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

// 1. Định nghĩa Schema xác thực dữ liệu với Zod
const gigFormSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters.").max(100, "Title is too long."),
  category: z.string({ required_error: "Please select a category." }),
  price: z.coerce.number().min(1, "Price must be at least 1 Pi."),
  deliveryTime: z.coerce.number().min(1, "Delivery time must be at least 1 day."),
  description: z.string().min(50, "Description must be at least 50 characters."),
  coverImage: z.string().min(1, "Cover image is required."),
  galleryImages: z.array(z.string()).max(3, "You can upload up to 3 gallery images."),
})

type GigFormValues = z.infer<typeof gigFormSchema>

type Category = {
  _id: string;
  name: string;
  slug: string;
};

function GigForm() {
  const { user } = usePiAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get("edit") // Lấy ID nếu đang sửa
  const [isLoadingData, setIsLoadingData] = useState(!!editId);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // 2. Thiết lập react-hook-form
  const form = useForm<GigFormValues>({
    resolver: zodResolver(gigFormSchema),
    defaultValues: {
      title: "",
      category: undefined,
      price: 5,
      deliveryTime: 3,
      description: "",
      coverImage: "",
      galleryImages: [],
    },
  })
  const { isSubmitting } = form.formState

  // Lấy danh sách danh mục khi component được mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (error) {
        toast.error("Failed to load categories.");
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // 1. Tự động điền dữ liệu nếu đang Edit
  useEffect(() => {
    if (editId) {
      const fetchGigData = async () => {
        // Không cần setIsLoadingData(true) vì đã khởi tạo ở trên
        try {
          const res = await fetch(`/api/gigs/${editId}`)
          const data = await res.json()
          if (data.success) {
            const g = data.data
            // Reset form với dữ liệu đã fetch
            form.reset({
              title: g.title,
              category: g.category,
              price: g.price,
              deliveryTime: g.deliveryTime,
              description: g.description,
              coverImage: g.image || "",
              galleryImages: g.gallery || [],
            })
          } else {
            toast.error(data.error || "Gig not found!")
            router.push("/dashboard")
          }
        } catch (error) {
          toast.error("Error loading gig data.")
        } finally {
          setIsLoadingData(false);
        }
      }
      fetchGigData()
    }
  }, [editId, router, form.reset]) // Chỉ phụ thuộc vào `form.reset`

  // 2. Xử lý Submit (Tạo mới hoặc Cập nhật)
  const onSubmit = async (values: GigFormValues) => {
    if (!user) return toast.error("Please login")
    try {
      const payload = {
        title: values.title,
        category: values.category,
        price: values.price,
        deliveryTime: values.deliveryTime,
        description: values.description,
        image: values.coverImage,
        gallery: values.galleryImages,
        // Lưu ý: Thông tin seller nên được xử lý ở backend dựa trên session
        // không nên gửi từ client để đảm bảo bảo mật.
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
    }
  }

  if (isLoadingData || isLoadingCategories) return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-[#1dbf73]" /></div>

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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-8">
          <FormField control={form.control} name="title" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-bold">Gig Title</FormLabel>
              <FormControl><Input placeholder="I will do..." className="text-lg py-6" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="category" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-bold">Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <FormControl><SelectTrigger className="py-6"><SelectValue placeholder="Select Category" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat.slug}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="price" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-bold">Price (Pi)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input type="number" placeholder="5" className="py-6 pl-10" {...field} />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[#1dbf73]">π</span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <FormField control={form.control} name="deliveryTime" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-bold">Delivery Time (Days)</FormLabel>
              <FormControl><Input type="number" className="py-6" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-bold">Description</FormLabel>
              <FormControl><Textarea placeholder="Describe your service..." className="min-h-[150px]" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="coverImage" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-bold">Cover Image</FormLabel>
              <FormControl>
                <ImageUploader 
                  value={field.value} 
                  onChange={field.onChange}
                  className="w-full"
                />
              </FormControl>
              <p className="text-xs text-gray-500">This is the cover image that will be displayed on the listing page.</p>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="galleryImages" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-bold">Gallery Images (up to 3)</FormLabel>
              <FormControl>
                <ImageUploader 
                  value={field.value} 
                  onChange={field.onChange} 
                  maxFiles={3}
                  multiple
                  className="grid grid-cols-2 sm:grid-cols-3 gap-4"
                />
              </FormControl>
              <p className="text-xs text-gray-500">Add more detailed images of your service.</p>
              <FormMessage />
            </FormItem>
          )} />

          <div className="pt-4 flex justify-end gap-4 border-t border-gray-100">
            <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-[#1dbf73] hover:bg-[#1dbf73]/90 text-white font-bold py-6 px-8 text-lg shadow-lg">
              {isSubmitting ? <Loader2 className="animate-spin" /> : (editId ? "Save Changes" : "Publish Gig")}
            </Button>
          </div>
        </form>
      </Form>
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