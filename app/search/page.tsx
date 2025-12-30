import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import connectDB from "@/lib/db"
import Gig from "@/models/Gig"
import Category from "@/models/Category"
import { processGigsForClient, LeanGig } from "@/lib/gig-utils"
import { GigCard } from "@/components/gig/GigCard"
import { SearchFilters } from "./SearchFilters"

// This is a server component, so we can fetch data directly.
export const dynamic = 'force-dynamic'; // Ensure it's always fresh

// Mock session to get the current user's ID
async function getSession() {
    return { user: { id: 'mock-user-id-string' } };
}

async function getData(searchParams: { [key: string]: string | string[] | undefined }) {
    await connectDB();
    const session = await getSession();
    const userId = session.user?.id;

    // Build query based on searchParams
    const query: any = { status: 'approved' };
    if (searchParams.q) {
        query.title = { $regex: searchParams.q, $options: 'i' };
    }
    if (searchParams.category && searchParams.category !== 'all') {
        query.category = searchParams.category;
    }
    if (searchParams.min) {
        query.price = { ...query.price, $gte: Number(searchParams.min) };
    }
    if (searchParams.max) {
        query.price = { ...query.price, $lte: Number(searchParams.max) };
    }

    // Build sort options
    const sort: any = {};
    switch (searchParams.sort) {
        case 'price_asc':
            sort.price = 1;
            break;
        case 'price_desc':
            sort.price = -1;
            break;
        default: // newest
            sort.createdAt = -1;
            break;
    }

    // Fetch gigs and categories in parallel
    const [gigs, categories] = await Promise.all([
        Gig.find(query).sort(sort).lean() as Promise<LeanGig[]>,
        Category.find({}).sort({ name: 1 }).lean()
    ]);

    const processedGigs = processGigsForClient(gigs, userId);

    return {
        gigs: processedGigs,
        categories: JSON.parse(JSON.stringify(categories))
    };
}

export default async function SearchPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const { gigs, categories } = await getData(searchParams);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 flex-grow">
        {/* --- LEFT COLUMN: FILTERS --- */}
        <SearchFilters categories={categories} />

        {/* --- RIGHT COLUMN: RESULTS --- */}
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {searchParams.q
                ? `Results for "${searchParams.q}"`
                : "All Gigs"}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {gigs.length} services available
            </p>
          </div>
          
          {gigs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No services found</h3>
              <p className="text-gray-500 text-sm mt-2 max-w-sm mx-auto">
                Try adjusting your search or filters to find what you are looking for.
              </p>
              <Link href="/search">
                <Button variant="outline" className="mt-6">
                  Clear Search & Filters
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gigs.map((gig) => (
                <GigCard key={gig._id} gig={gig} isFavorited={gig.isFavorited} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}