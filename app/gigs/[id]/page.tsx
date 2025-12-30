import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import connectDB from "@/lib/db";
import Gig from "@/models/Gig";
import Category from "@/models/Category";
import { notFound } from "next/navigation";
import { processGigsForClient, LeanGig } from "@/lib/gig-utils";
import { GigDetailClientWrapper } from "./GigDetailClientWrapper";

// Mock session to get the current user's ID
async function getSession() {
    return { user: { id: 'mock-user-id-string' } };
}

// This function runs on the server to fetch all necessary data in parallel
async function getData(gigId: string) {
    await connectDB();
    const session = await getSession();
    const userId = session?.user?.id;

    const gig = await Gig.findById(gigId).lean() as LeanGig;

    if (!gig) {
        notFound();
    }

    // Lấy dữ liệu "more gigs" và thông tin danh mục song song để tối ưu
    const [moreGigs, category] = await Promise.all([
        Gig.find({
            'seller.uid': gig.seller.uid,
            _id: { $ne: gig._id }, // Exclude the current gig
            status: 'approved'
        }).limit(2).lean() as Promise<LeanGig[]>,
        Category.findOne({ slug: gig.category }).lean()
    ]);

    // Use the centralized utility function to process the data
    // Thêm thông tin danh mục vào gig đã xử lý
    const processedGig = {
        ...processGigsForClient([gig], userId)[0],
        categoryDetails: category ? { name: category.name, slug: category.slug } : null
    };
    const processedMoreGigs = processGigsForClient(moreGigs, userId);

    return { gig: processedGig, moreGigs: processedMoreGigs };
}

export default async function GigDetailPage({ params }: { params: { id: string } }) {
    // The page is now a Server Component. It fetches data and passes it to the client wrapper.
    const { gig, moreGigs } = await getData(params.id);

    if (!gig) {
        return <div className="min-h-screen flex items-center justify-center">Gig not found</div>;
    }

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 pb-20 lg:pb-0">
            <Header />
            <GigDetailClientWrapper gig={gig} moreGigs={moreGigs} />
            <Footer />
        </div>
    );
}