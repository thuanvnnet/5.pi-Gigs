"use client"

import { CldUploadWidget } from "next-cloudinary"
import { ImagePlus, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageUploadProps {
  value: string      // URL ảnh hiện tại
  onChange: (src: string) => void // Hàm gọi lại khi upload xong
  disabled?: boolean
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  
  // Xử lý khi upload thành công
  const onUpload = (result: any) => {
    // Cloudinary trả về object result, URL nằm trong result.info.secure_url
    onChange(result.info.secure_url)
  }

  return (
    <div className="flex items-center gap-4">
      {/* 1. HIỂN THỊ ẢNH ĐÃ UPLOAD (PREVIEW) */}
      {value && (
        <div className="relative w-40 h-24 rounded-lg overflow-hidden border border-gray-200 group">
          <img src={value} alt="Upload" className="object-cover w-full h-full" />
          
          {/* Nút xóa ảnh */}
          <button
            onClick={() => onChange("")}
            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            type="button"
          >
            <Trash className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* 2. NÚT UPLOAD (WIDGET) */}
      <CldUploadWidget 
        uploadPreset="5pi-gigs" // ⚠️ THAY ĐÚNG TÊN PRESET BẠN TẠO Ở BƯỚC 1
        onSuccess={onUpload}
        options={{
          maxFiles: 1,
          resourceType: "image",
          clientAllowedFormats: ["image"], // Chỉ cho up ảnh
        }}
      >
        {({ open }) => {
          return (
            <Button 
              type="button" 
              variant="outline" 
              disabled={disabled} 
              onClick={() => open()}
              className="flex items-center gap-2 bg-gray-50 border-dashed border-2 border-gray-300 hover:border-[#1dbf73] hover:bg-[#1dbf73]/5 h-24 w-40"
            >
              <ImagePlus className="w-6 h-6 text-gray-400" />
              <span className="text-gray-500 text-xs">Upload Image</span>
            </Button>
          )
        }}
      </CldUploadWidget>
    </div>
  )
}