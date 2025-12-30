"use client"

import { useState, useEffect } from "react"
import { Star, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { usePiAuth } from "@/hooks/use-pi-auth"
import { toast } from "sonner" // Đảm bảo đã cài: npm install sonner

export function ReviewsSection({ gigId, sellerId }: { gigId: string, sellerId: string }) {
  const { user } = usePiAuth()
  const [reviews, setReviews] = useState<any[]>([])
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)

  // 1. Fetch Reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/reviews?gigId=${gigId}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch reviews: ${res.statusText}`);
        }
        const data = await res.json();
        if (data.success) setReviews(data.data);
      } catch (error) {
        console.error("Failed to load reviews:", error);
      }
    }
    fetchReviews()
  }, [gigId])

  // 2. Submit Review
  const handleSubmit = async () => {
    if (!user) return toast.error("Please login to write a review!")
    if (!comment.trim()) return toast.error("Please write something!")

    setLoading(true)
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gigId,
          // Backend sẽ tự động tìm đơn hàng hợp lệ
          star: rating,
          comment
        })
      })

      if (!res.ok) {
        let errorMsg = "Failed to submit review.";
        try {
          const errorData = await res.json();
          errorMsg = errorData.error || errorMsg;
        } catch (e) {
          // Response was not JSON, use the status text if available
          errorMsg = res.statusText || errorMsg;
        }
        throw new Error(errorMsg);
      }

      const data = await res.json()
      if (data.success) {
        toast.success("Review submitted successfully!")
        // Update list immediately
        setReviews([data.data, ...reviews])
        setComment("")
      } else {
        throw new Error(data.error || "Something went wrong");
      }
    } catch (err) {
      toast.error((err as Error).message || "An unknown error occurred.");
    } finally {
      setLoading(false)
    }
  }

  // Người bán không thể tự đánh giá sản phẩm của mình
  const isSeller = user?.uid === sellerId;

  return (
    <div className="mt-12 border-t border-gray-100 pt-10">
      <h3 className="text-2xl font-bold mb-6 text-gray-900">Reviews ({reviews.length})</h3>

      {/* --- WRITE REVIEW FORM --- */}
      {!isSeller && (
        <div className="bg-gray-50 p-6 rounded-xl mb-10 border border-gray-200">
          <h4 className="font-semibold mb-4 text-gray-800">Write a Review</h4>
          
          {/* Star Selection */}
          <div className="flex gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star}
                className={`w-6 h-6 cursor-pointer transition-colors ${star <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <Textarea 
            placeholder="Share your experience with this seller..."
            className="bg-white mb-4 resize-none h-24"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button onClick={handleSubmit} disabled={loading} className="bg-[#1dbf73] hover:bg-[#1dbf73]/90 text-white font-bold">
            {loading ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      )}

      {/* --- REVIEWS LIST --- */}
      <div className="space-y-8">
        {reviews.length === 0 ? (
          <p className="text-gray-500 italic text-center py-4">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((rev, index) => (
            <div key={index} className="flex gap-4 border-b border-gray-100 pb-6 last:border-0 last:pb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-900">{rev.buyerId}</span>
                  <div className="flex items-center text-amber-400">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-sm ml-1 font-medium text-gray-700">{rev.star}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{rev.comment}</p>
                <span className="text-xs text-gray-400 mt-2 block">
                  {new Date(rev.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}