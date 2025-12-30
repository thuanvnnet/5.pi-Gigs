"use client";

import { useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { Star, Heart, ShoppingCart, BadgeCheck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toggleFavoriteAction } from '@/app/gigs/actions';

type Gig = {
    _id: string;
    title: string;
    image?: string;
    price: number;
    seller: {
        username: string;
        avatar: string;
        level?: 'New' | 'Level 1' | 'Level 2' | 'Top Rated'; // Thêm cấp độ người bán
        isVerified?: boolean;
    };
    rating: number;
    ratingCount: number;
    sales: number;
    deliveryTime: number; // Thêm thời gian giao hàng
    isFeatured: boolean;
    createdAt: string;
    isNew?: boolean;
};

type GigCardProps = {
    gig: Gig;
    isFavorited: boolean;
    categoryName?: string; // Thêm prop cho tên danh mục, là tùy chọn
};

const levelStyles = {
    'New': 'bg-gray-100 text-gray-700',
    'Level 1': 'bg-blue-100 text-blue-800',
    'Level 2': 'bg-purple-100 text-purple-800',
    'Top Rated': 'bg-green-100 text-green-800',
};

export function GigCard({ gig, isFavorited, categoryName }: GigCardProps) {
    const [isPending, startTransition] = useTransition();
    const pathname = usePathname();

    const handleFavoriteToggle = () => {
        startTransition(async () => {
            const result = await toggleFavoriteAction(gig._id, pathname);
            if (!result.success) {
                toast.error(result.error || "Failed to update favorite status.");
            }
        });
    };

    return (
        <div className="group relative overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col">
            <Link href={`/gigs/${gig._id}`} className="block overflow-hidden">
                <div className="aspect-[4/3] bg-gray-100 relative">
                    <Image src={gig.image || "/placeholder.svg"} alt={gig.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
            </Link>

            <div className="p-4 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Image src={gig.seller.avatar} alt={gig.seller.username} width={24} height={24} className="rounded-full" />
                        <div className="flex items-center gap-1">
                            <span className="text-sm font-medium text-gray-600 hover:underline">{gig.seller.username}</span>
                            {gig.seller.isVerified && (
                                <BadgeCheck className="w-4 h-4 text-blue-500" />
                            )}
                        </div>
                    </div>
                    {gig.seller.level && (
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${levelStyles[gig.seller.level] || levelStyles['New']}`}>
                            {gig.seller.level}
                        </span>
                    )}
                </div>

                <Link href={`/gigs/${gig._id}`} className="flex-grow">
                    <h3 className="font-semibold text-base leading-snug hover:text-[#1dbf73] transition cursor-pointer line-clamp-2">{gig.title}</h3>
                </Link>

                <div className="flex items-center justify-between mt-2 mb-3 text-sm text-gray-500">
                    {categoryName && (<p>{categoryName}</p>)}
                    <div className="flex items-center gap-2">
                        {gig.isFeatured && (
                            <span className="text-xs font-semibold bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full lowercase">Featured</span>
                        )}
                        {gig.isNew && (
                            <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-0.5 rounded-full lowercase">New</span>
                        )}
                    </div>
                </div>

                {/* Rating & Sales Info */}
                <div className="flex items-center justify-between text-sm text-gray-600 mt-auto">
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-bold">{gig.rating}</span>
                        <span className="text-gray-400 text-xs">({gig.ratingCount})</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                        <ShoppingCart className="w-4 h-4 text-gray-400" />
                        <span>{gig.sales}+ sold</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between px-4 pb-4 pt-2">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={handleFavoriteToggle} disabled={isPending} className="text-gray-400 hover:text-pink-500 disabled:text-gray-300 -ml-2">
                        <Heart className={`w-5 h-5 transition-all ${isFavorited ? 'text-pink-500 fill-pink-500' : 'text-gray-400'}`} />
                    </Button>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{gig.deliveryTime} {gig.deliveryTime > 1 ? 'days' : 'day'}</span>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-xs font-semibold text-gray-500 tracking-wider">STARTING AT</span>
                    <p className="font-bold text-lg sm:text-xl text-[#1dbf73]">{gig.price} π</p>
                </div>
            </div>
        </div>
    );
}
