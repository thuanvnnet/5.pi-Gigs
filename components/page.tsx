import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import connectDB from "@/lib/db";
import mongoose from "mongoose";
import Gig from "@/models/Gig";
import { GigCard } from "@/components/gig/GigCard";
import { Button } from "@/components/ui/button";
import { processGigsForClient, LeanGig } from "@/lib/gig-utils";

// Giả lập hàm lấy session phía server
async function getSession() {
    // Trong ứng dụng thực tế, bạn sẽ lấy thông tin này từ session hoặc token
    return { user: { id: 'mock-user-id-string' } };
}

async function getFavoriteGigs(userId: string) {
    await connectDB();

    // Truy vấn trực tiếp vào Gig model để tìm các Gigs đã được người dùng yêu thích
    const gigs = await Gig.find({ 
        favoritedBy: userId, 
        status: 'approved' // Chỉ hiển thị các Gigs đã được duyệt
    }).sort({ createdAt: -1 }).lean() as LeanGig[];
    
    // Sử dụng hàm tiện ích để xử lý dữ liệu và đánh dấu tất cả là yêu thích
    return processGigsForClient(gigs, userId).map(gig => ({ ...gig, isFavorited: true }));
}


export default async function FavoritesPage() {
    const session = await getSession();
    // Trong ứng dụng thực tế, bạn có thể chuyển hướng nếu không có người dùng
    const userId = session.user.id; 
    const favoriteGigs = await getFavoriteGigs(userId);

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
                    <p className="text-gray-500 mt-1">All the services you've saved.</p>
                </div>

                {favoriteGigs.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {favoriteGigs.map((gig: any) => <GigCard key={gig._id} gig={gig} isFavorited={true} />)}
                    </div>
                ) : (
                    <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-xl">
                        <div className="text-6xl mb-4">🤍</div>
                        <h3 className="text-xl font-bold text-gray-900">No Favorites Yet</h3>
                        <p className="text-gray-500 mb-6">Click the heart icon on any gig to save it here.</p>
                        <Link href="/search">
                            <Button className="bg-[#1dbf73] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#1dbf73]/90">
                                Browse Gigs
                            </Button>
                        </Link>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}