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
  createdAt: Date;
}

// Hàm tiện ích này tập trung logic xử lý Gigs trước khi gửi về client
export function processGigsForClient(gigs: LeanGig[], userId?: string) {
  return gigs.map((gig: LeanGig) => {
    const rating = (gig as any).rating || (Math.random() * (5 - 4.2) + 4.2).toFixed(1);
    const ratingCount = (gig as any).ratingCount || Math.floor(Math.random() * 200) + 10;
    const sales = (gig as any).sales || Math.floor(Math.random() * 500) + 20;
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
      rating,
      ratingCount,
      sales,
      deliveryTime: gig.deliveryTime,
      isNew,
    };
  });
}