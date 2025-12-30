import mongoose from "mongoose";

// Định nghĩa kiểu dữ liệu cho Gig lấy từ DB với lean()
export interface LeanGig {
  _id: mongoose.Types.ObjectId;
  title: string;
  image?: string;
  price: number;
  deliveryTime: number;
  category: string;
  seller: { username: string; uid: string; };
  status: 'pending' | 'approved' | 'rejected';
  isFeatured: boolean;
  favoritedBy: string[];
  averageRating: number; // Add this
  reviewCount: number;   // Add this
  createdAt: Date;
}

// Hàm tiện ích này tập trung logic xử lý Gigs trước khi gửi về client
export function processGigsForClient(gigs: LeanGig[], userId?: string) {
  return gigs.map((gig: LeanGig) => {
    const sales = (gig as any).sales || Math.floor(Math.random() * 500) + 20; // You can keep mock sales for now
    const sellerLevels: ('New' | 'Level 1' | 'Level 2' | 'Top Rated')[] = ['Level 1', 'Level 2', 'Top Rated'];
    const randomLevel = sellerLevels[Math.floor(Math.random() * sellerLevels.length)];
    const isVerified = Math.random() > 0.5;
    const isNew = new Date(gig.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    return {
      ...gig,
      _id: gig._id.toString(),
      seller: {
        ...gig.seller,
        avatar: `https://avatar.vercel.sh/${gig.seller.username || 'user'}.png`,
        level: randomLevel,
        isVerified: isVerified,
      },
      isFavorited: userId ? gig.favoritedBy?.includes(userId) : false,
      rating: gig.averageRating, // Use real data
      ratingCount: gig.reviewCount, // Use real data
      sales,
      deliveryTime: gig.deliveryTime,
      isNew,
    };
  });
}