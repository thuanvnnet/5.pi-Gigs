"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { ImageIcon, Maximize2 } from "lucide-react"

interface GigGalleryProps {
  title: string
  mainImage?: string
  gallery?: string[] // 👇 Nhận thêm mảng gallery
}

export function GigGallery({ title, mainImage, gallery = [] }: GigGalleryProps) {
  // 1. Tính toán danh sách ảnh từ props. `useMemo` giúp tối ưu, chỉ tính toán lại khi props thay đổi.
  const allImages = useMemo(() => {
    // Đảm bảo gallery luôn là một mảng và lọc ra các URL không hợp lệ một cách tường minh
    const images = [mainImage, ...(gallery || [])]
      .filter((img): img is string => typeof img === 'string' && img.trim() !== '');
    return images.length > 0 ? images : ["/placeholder.svg"];
  }, [mainImage, gallery]);

  // 2. Chỉ quản lý `index` của ảnh được chọn, thay vì cả URL.
  const [selectedIndex, setSelectedIndex] = useState(0);

  // 3. Effect này đảm bảo `selectedIndex` luôn hợp lệ, ngay cả khi danh sách ảnh thay đổi (ví dụ: sau khi tải dữ liệu).
  useEffect(() => {
    if (selectedIndex >= allImages.length) {
      setSelectedIndex(0);
    }
  }, [allImages, selectedIndex]);

  // 4. Ảnh được chọn hiện tại được suy ra từ `allImages` và `selectedIndex`.
  const selectedImage = allImages[selectedIndex];

  const [isAnimating, setIsAnimating] = useState(false)

  const handleSelectImage = (index: number) => {
    if (index === selectedIndex) return
    setIsAnimating(true)
    setTimeout(() => {
      setSelectedIndex(index)
      setIsAnimating(false)
    }, 200)
  }

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
          <Image 
            fill
            src={selectedImage} 
            alt={title} 
            className={`object-cover transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer
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
              key={img} // Sử dụng URL của ảnh làm key để đảm bảo tính duy nhất và ổn định
              onClick={() => handleSelectImage(index)}
              className={`
                relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 border
                ${selectedIndex === index 
                  ? "border-[#1dbf73] ring-2 ring-[#1dbf73]/20 opacity-100 scale-105" 
                  : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"}
              `}
            >
               <Image fill src={img} alt={`Thumb ${index}`} className="object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}