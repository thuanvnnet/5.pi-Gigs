import Link from "next/link"
import Image from "next/image"

// Định nghĩa kiểu dữ liệu cho bài đăng
interface Gig {
  _id: string
  title: string
  price: number
  image: string
  seller: { username: string }
}

async function getAllGigs() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/gigs`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Failed to fetch all gigs:", error);
    return [];
  }
}

export async function AllGigsList() {
  const gigs: Gig[] = await getAllGigs();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {gigs.length === 0 ? (
        <div className="col-span-4 text-center text-gray-500">Chưa có bài đăng nào. Hãy là người đầu tiên!</div>
      ) : (
        gigs.map((gig) => (
          <div key={gig._id} className="group relative overflow-hidden rounded-lg border bg-white shadow-sm hover:shadow-md transition-all">
            <Link href={`/gigs/${gig._id}`}>
              <div className="relative aspect-[4/3] bg-gray-100">
                <Image src={gig.image || "/placeholder.svg"} alt={gig.title} fill className="object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-[#1dbf73] transition">
                  {gig.title}
                </h3>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-gray-500">{gig.seller.username}</span>
                  <span className="font-bold text-[#1dbf73]">{gig.price} π</span>
                </div>
              </div>
            </Link>
          </div>
        ))
      )}
    </div>
  )
}