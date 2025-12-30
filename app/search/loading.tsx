import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SlidersHorizontal } from "lucide-react";
import { GigCardSkeleton } from "@/components/gig/GigCardSkeleton";

const SkeletonBox = ({ className }: { className?: string }) => (
    <div className={`bg-gray-200 rounded-md animate-pulse ${className}`} />
);

export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Header />
            <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 flex-grow">
                {/* --- LEFT COLUMN: FILTERS SKELETON --- */}
                <div className="w-full md:w-64 lg:w-72 flex-shrink-0 space-y-6 h-fit bg-white p-6 rounded-xl border">
                    <div className="flex items-center gap-2 mb-4">
                        <SlidersHorizontal className="w-5 h-5 text-gray-300" />
                        <h3 className="font-bold text-lg text-gray-300">Filters</h3>
                    </div>
                    <div className="space-y-2">
                        <SkeletonBox className="h-4 w-20" />
                        <SkeletonBox className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <SkeletonBox className="h-4 w-24" />
                        <div className="flex gap-2">
                            <SkeletonBox className="h-10 w-full" />
                            <SkeletonBox className="h-10 w-full" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <SkeletonBox className="h-4 w-16" />
                        <SkeletonBox className="h-10 w-full" />
                    </div>
                    <SkeletonBox className="h-10 w-full mt-4" />
                </div>

                {/* --- RIGHT COLUMN: RESULTS SKELETON --- */}
                <div className="flex-1">
                    <div className="mb-6">
                        <SkeletonBox className="h-8 w-1/2 mb-2" />
                        <SkeletonBox className="h-4 w-1/4" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <GigCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}