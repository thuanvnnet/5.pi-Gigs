"use client"

import { useState, useEffect } from "react"
import { ImageIcon, Maximize2 } from "lucide-react"

interface GigGalleryProps {
  title: string
  mainImage?: string
  gallery?: string[] // 👇 Nhận thêm mảng gallery
}

export function GigGallery({ title, mainImage, gallery = [] }: GigGalleryProps) {
  // GỘP ẢNH: Ảnh bìa đứng đầu, sau đó đến gallery
  // filter(Boolean) để loại bỏ giá trị null/undefined/rỗng
  const [allImages, setAllImages] = useState<string[]>([])
  const [selectedImage, setSelectedImage] = useState("")

  useEffect(() => {
    const images = [mainImage, ...gallery].filter((img): img is string => !!img);
    if (images.length === 0) {
        setAllImages(["/placeholder.svg"])
        setSelectedImage("/placeholder.svg")
    } else {
        setAllImages(images)
        setSelectedImage(images[0])
    }
  }, [mainImage, gallery])

  const [isAnimating, setIsAnimating] = useState(false)

  const handleSelectImage = (img: string) => {
    if (img === selectedImage) return
    setIsAnimating(true)
    setTimeout(() => {
      setSelectedImage(img)
      setIsAnimating(false)
    }, 200)
  }

  // Nếu chưa có ảnh (đang load), hiện khung trống
  if (!selectedImage) return <div className="aspect-video bg-gray-100 rounded-2xl animate-pulse" />

  return (
    <div className="space-y-4">
      {/* 1. ẢNH LỚN */}
      <div className="group relative w-full aspect-[16/10] bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
        <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white text-gray-700 shadow-lg">
             <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {selectedImage !== "/placeholder.svg" ? (
          <img 
            src={selectedImage} 
            alt={title} 
            className={`w-full h-full object-cover transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer
              ${isAnimating ? "opacity-50 blur-sm scale-95" : "opacity-100 blur-0 scale-100"}
            `}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
            <ImageIcon className="w-16 h-16 mb-2 opacity-50" />
            <span className="text-sm font-medium">No Preview Image</span>
          </div>
        )}
      </div>

      {/* 2. DANH SÁCH ẢNH NHỎ (Chỉ hiện nếu có > 1 ảnh) */}
      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {allImages.map((img, index) => (
            <div 
              key={index}
              onClick={() => handleSelectImage(img)}
              className={`
                relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 border
                ${selectedImage === img 
                  ? "border-[#1dbf73] ring-2 ring-[#1dbf73]/20 opacity-100 scale-105" 
                  : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"}
              `}
            >
               <img src={img} alt={`Thumb ${index}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}