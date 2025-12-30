const SkeletonBox = ({ className }: { className?: string }) => (
    <div className={`bg-gray-200 rounded-md animate-pulse ${className}`} />
);

export function GigDetailSkeleton() {
    return (
        <main className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Breadcrumb Skeleton */}
            <div className="flex items-center gap-2 mb-8">
                <SkeletonBox className="h-4 w-16" />
                <SkeletonBox className="h-4 w-24" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Column Skeleton */}
                <div className="lg:col-span-8 space-y-10">
                    <div>
                        {/* Title Skeleton */}
                        <div className="space-y-3 mb-6">
                            <SkeletonBox className="h-8 w-full" />
                            <SkeletonBox className="h-8 w-3/4" />
                        </div>

                        {/* Seller Info Skeleton */}
                        <div className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                                <div className="space-y-2">
                                    <SkeletonBox className="h-4 w-24" />
                                    <SkeletonBox className="h-3 w-32" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <SkeletonBox className="h-10 w-10 rounded-full" />
                                <SkeletonBox className="h-10 w-10 rounded-full" />
                            </div>
                        </div>
                    </div>

                    {/* Gallery Skeleton */}
                    <div className="space-y-4">
                        <SkeletonBox className="aspect-[16/10] w-full" />
                        <div className="flex gap-3">
                            <SkeletonBox className="w-24 h-16" />
                            <SkeletonBox className="w-24 h-16" />
                            <SkeletonBox className="w-24 h-16" />
                        </div>
                    </div>

                    {/* About Gig Skeleton */}
                    <div className="space-y-4">
                        <SkeletonBox className="h-6 w-48" />
                        <div className="space-y-2">
                            <SkeletonBox className="h-4 w-full" />
                            <SkeletonBox className="h-4 w-full" />
                            <SkeletonBox className="h-4 w-5/6" />
                            <SkeletonBox className="h-4 w-full" />
                            <SkeletonBox className="h-4 w-1/2" />
                        </div>
                    </div>

                    {/* About Seller Skeleton */}
                    <div className="space-y-4">
                        <SkeletonBox className="h-6 w-56" />
                        <div className="space-y-2">
                            <SkeletonBox className="h-4 w-full" />
                            <SkeletonBox className="h-4 w-3/4" />
                        </div>
                    </div>
                </div>

                {/* Right Column Skeleton */}
                <div className="lg:col-span-4 relative hidden lg:block">
                    <div className="sticky top-28 space-y-6">
                        <div className="border border-gray-200 rounded-3xl p-6 space-y-6">
                            <div className="flex justify-between items-start">
                                <SkeletonBox className="h-6 w-24" />
                                <SkeletonBox className="h-8 w-20" />
                            </div>
                            <SkeletonBox className="h-4 w-full" />
                            <SkeletonBox className="h-4 w-4/5" />
                            <SkeletonBox className="h-16 w-full mt-4" />
                        </div>
                        <SkeletonBox className="h-20 w-full" />
                    </div>
                </div>
            </div>
        </main>
    );
}