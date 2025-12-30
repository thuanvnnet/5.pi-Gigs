const SkeletonBox = ({ className }: { className?: string }) => (
    <div className={`bg-gray-200 rounded-md animate-pulse ${className}`} />
);

export function GigCardSkeleton() {
    return (
        <div className="rounded-xl border bg-white shadow-sm flex flex-col">
            <SkeletonBox className="aspect-[4/3] w-full" />
            <div className="p-4 flex flex-col flex-grow space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
                        <SkeletonBox className="h-4 w-20" />
                    </div>
                    <SkeletonBox className="h-5 w-16" />
                </div>
                <SkeletonBox className="h-5 w-full" />
                <SkeletonBox className="h-5 w-3/4" />
                <div className="flex-grow" />
                <div className="flex items-center justify-between mt-auto">
                    <SkeletonBox className="h-5 w-24" />
                    <SkeletonBox className="h-5 w-16" />
                </div>
                <div className="flex items-center justify-between pt-2 border-t mt-2">
                    <SkeletonBox className="h-8 w-8" />
                    <div className="text-right">
                        <SkeletonBox className="h-3 w-20 mb-1" />
                        <SkeletonBox className="h-6 w-16" />
                    </div>
                </div>
            </div>
        </div>
    );
}