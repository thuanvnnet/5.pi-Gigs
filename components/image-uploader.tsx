"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import { ImagePlus, Trash, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ImageUploaderProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  disabled?: boolean;
  multiple?: boolean;
  maxFiles?: number;
  className?: string;
}

export function ImageUploader({
  value,
  onChange,
  disabled,
  multiple = false,
  maxFiles = 4,
  className,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // Lọc ra các URL rỗng hoặc không hợp lệ để tránh lỗi
  const validImages = (Array.isArray(value) ? value : (value ? [value] : []))
    .filter(url => typeof url === 'string' && url.length > 0);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const filesToUpload = Array.from(files);
    if (multiple && (validImages.length + filesToUpload.length > maxFiles)) {
      toast.error(`You can only upload a maximum of ${maxFiles} images.`);
      return;
    }

    setIsUploading(true);
    try {
      const uploadPromises = filesToUpload.map(file =>
        fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
          method: 'POST',
          body: file,
        }).then(async (res) => {
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || `Failed to upload ${file.name}`);
          }
          return res.json();
        })
      );

      const settledResults = await Promise.allSettled(uploadPromises);
      
      const successfulUploads = settledResults
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as PromiseFulfilledResult<any>).value.url);

      const failedUploads = settledResults.filter(result => result.status === 'rejected');

      if (successfulUploads.length > 0) {
        onChange(multiple ? [...validImages, ...successfulUploads] : successfulUploads[0]);
        toast.success(`${successfulUploads.length} image(s) uploaded successfully!`);
      }

      failedUploads.forEach(result => {
        const reason = (result as PromiseRejectedResult).reason;
        toast.error(reason.message || "An upload failed.");
      });

    } catch (error) {
      toast.error("An unexpected error occurred during upload.");
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const onRemove = (urlToRemove: string) => {
    if (multiple && Array.isArray(value)) {
      onChange(value.filter(url => url !== urlToRemove));
    } else {
      onChange("");
    }
  };

  return (
    <div className={className}>
      {validImages.map((url) => (
        <div key={url} className="relative aspect-video rounded-md overflow-hidden">
          <Image fill className="object-cover" alt="Uploaded image" src={url} />
          <div className="absolute top-2 right-2 z-10">
            <Button type="button" onClick={() => onRemove(url)} variant="destructive" size="icon" disabled={disabled || isUploading}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      {(multiple ? validImages.length < maxFiles : validImages.length < 1) && (
        <div
          onClick={() => !isUploading && inputRef.current?.click()}
          className="relative aspect-video cursor-pointer hover:opacity-70 transition border-dashed border-2 p-4 border-gray-300 flex flex-col justify-center items-center gap-2 text-gray-500 rounded-md"
        >
          <input
            type="file"
            ref={inputRef}
            onChange={(e) => handleUpload(e.target.files)}
            accept="image/*"
            multiple={multiple}
            className="hidden"
            disabled={disabled || isUploading}
          />
          {isUploading ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : (
            <>
              <ImagePlus className="h-8 w-8" />
              <p className="text-xs font-semibold text-center">
                {multiple ? `Add Image (${validImages.length}/${maxFiles})` : 'Upload Image'}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}