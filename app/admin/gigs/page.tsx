import connectDB from "@/lib/db";
import Gig from "@/models/Gig";
import Category from "@/models/Category";
import Image from "next/image";
import { format } from "date-fns";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { GigAdminActions } from "./GigAdminActions";
import { GigFilters } from "./GigFilters";
import { PaginationControls } from "@/components/admin/PaginationControls";

// Định nghĩa một kiểu an toàn cho Gig sau khi được serialize
type SerializedGig = {
    _id: string;
    title: string;
    image: string;
    seller: { username: string; uid: string; };
    price: number;
    category: string;
    status: 'pending' | 'approved' | 'rejected';
    isFeatured: boolean;
    createdAt: string;
};

// Buộc trang này phải được render động, không sử dụng cache
export const dynamic = 'force-dynamic';

async function getAllGigs(filters: { seller?: string; featured?: string; status?: string; category?: string; page: number; limit: number }) {
    await connectDB();
    const query: any = {};

    if (filters.seller) {
        // Case-insensitive regex search for seller username
        query['seller.username'] = { $regex: filters.seller, $options: 'i' };
    }

    if (filters.featured && ['true', 'false'].includes(filters.featured)) {
        query.isFeatured = filters.featured === 'true';
    }

    if (filters.status && ['pending', 'approved', 'rejected'].includes(filters.status)) {
        query.status = filters.status;
    }

    if (filters.category) {
        query.category = filters.category;
    }

    const skip = (filters.page - 1) * filters.limit;

    // Sử dụng Aggregation Pipeline để join Gigs với Categories một cách hiệu quả
    const aggregationPipeline: any[] = [
        { $match: query },
        { $sort: { createdAt: -1 } },
        {
            $lookup: {
                from: 'categories', // Tên collection 'categories' trong DB
                localField: 'category', // Trường 'category' (slug) trong collection 'gigs'
                foreignField: 'slug',   // Trường 'slug' trong collection 'categories' để join
                as: 'categoryDetails' // Tên mảng tạm chứa kết quả join
            }
        },
        // Chuyển mảng categoryDetails thành một object, giữ lại Gig ngay cả khi không tìm thấy category
        { $unwind: { path: '$categoryDetails', preserveNullAndEmptyArrays: true } }, 
        // Thay thế trường 'category' (slug) bằng tên danh mục, hoặc giữ lại slug nếu không có tên
        { $addFields: { category: { $ifNull: ['$categoryDetails.name', '$category'] } } }, 
        { $project: { categoryDetails: 0 } } // Dọn dẹp trường tạm
    ];

    const [gigs, totalGigs] = await Promise.all([
        Gig.aggregate(aggregationPipeline).skip(skip).limit(filters.limit),
        Gig.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalGigs / filters.limit);

    return { gigs: JSON.parse(JSON.stringify(gigs)) as SerializedGig[], totalGigs, totalPages };
}

async function getCategories() {
    await connectDB();
    const categories = await Category.find({}).sort({ name: 1 });
    return JSON.parse(JSON.stringify(categories));
}

const getGigStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>
      case "approved": return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Approved</span>
      case "rejected": return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Rejected</span>
      default: return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status || 'Pending'}</span>
    }
}

export default async function AdminGigsPage({ 
    searchParams 
}: { 
    searchParams?: { 
        seller?: string; 
        featured?: string; 
        status?: string;
        category?: string;
        page?: string;
    } 
}) {
    const page = Number(searchParams?.page ?? '1');
    const limit = 10; // Số lượng Gigs mỗi trang

    const [categories, { gigs, totalGigs, totalPages }] = await Promise.all([
        getCategories(),
        getAllGigs({
            seller: searchParams?.seller,
            featured: searchParams?.featured,
            status: searchParams?.status,
            category: searchParams?.category,
            page,
            limit
        })
    ]);

    return (
        <div className="space-y-6">
            <GigFilters categories={categories} />
            <div className="rounded-xl border bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-600">Gig</th>
                            <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-600">Seller</th>
                            <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-600">Price</th>
                            <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-600">Category</th>
                            <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                            <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-600">Featured</th>
                            <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-600">Created At</th>
                            <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {gigs.length > 0 ? gigs.map((gig) => (
                            <tr key={gig._id}>
                                <td className="whitespace-nowrap px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <Image src={gig.image || "/placeholder.svg"} alt={gig.title} width={40} height={30} className="h-10 w-12 rounded-md object-cover" />
                                        <Link href={`/gigs/${gig._id}`} target="_blank" className="group font-medium text-gray-900 hover:text-blue-600 hover:underline flex items-center gap-1">
                                            {gig.title}
                                            <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-blue-600" />
                                        </Link>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-gray-700">{gig.seller.username}</td>
                                <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">{gig.price} π</td>
                                <td className="whitespace-nowrap px-4 py-3 text-gray-700">{gig.category}</td>
                                <td className="whitespace-nowrap px-4 py-3">{getGigStatusBadge(gig.status)}</td>
                                <td className="whitespace-nowrap px-4 py-3 font-medium">
                                    <span className={gig.isFeatured ? 'text-yellow-600' : 'text-gray-400'}>{gig.isFeatured ? 'Yes' : 'No'}</span>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-gray-700">{format(new Date(gig.createdAt), "MMM dd, yyyy")}</td>
                                <td className="whitespace-nowrap px-4 py-3">
                                    <GigAdminActions gig={gig} />
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={8} className="text-center py-12 text-gray-500 italic">
                                    No gigs found for the current filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {totalGigs > 0 && (
                <div className="p-4 border-t">
                    <PaginationControls 
                        hasNextPage={page < totalPages}
                        hasPrevPage={page > 1}
                        totalGigs={totalGigs}
                        gigsPerPage={limit}
                    />
                </div>
            )}
            </div>
        </div>
    );
}
