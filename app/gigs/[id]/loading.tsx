import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { GigDetailSkeleton } from "./GigDetailSkeleton";

export default function Loading() {
    // Bạn có thể trả về bất kỳ UI nào ở đây, bao gồm cả một Skeleton.
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            <Header />
            <GigDetailSkeleton />
            <Footer />
        </div>
    );
}