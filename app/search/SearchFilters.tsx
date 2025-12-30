"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SlidersHorizontal } from "lucide-react";

// Assuming categories are passed as props
type Category = {
  _id: string;
  name: string;
  slug: string;
};

export function SearchFilters({ categories }: { categories: Category[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "all",
    minPrice: searchParams.get("min") || "",
    maxPrice: searchParams.get("max") || "",
    sort: searchParams.get("sort") || "newest",
  });

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (filters.category !== "all") params.set("category", filters.category);
    else params.delete("category");

    if (filters.minPrice) params.set("min", filters.minPrice);
    else params.delete("min");

    if (filters.maxPrice) params.set("max", filters.maxPrice);
    else params.delete("max");

    params.set("sort", filters.sort);

    // We only need to update the search part of the URL
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="w-full md:w-64 lg:w-72 flex-shrink-0 space-y-6 h-fit bg-white p-6 rounded-xl border">
      <div className="flex items-center gap-2 mb-4 text-gray-900">
        <SlidersHorizontal className="w-5 h-5" />
        <h3 className="font-bold text-lg">Filters</h3>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-600">Category</Label>
        <select className="w-full border border-gray-300 rounded-md p-2.5 text-sm bg-white focus:ring-2 focus:ring-[#1dbf73]/50 outline-none" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.slug}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-600">Price Range (Pi)</Label>
        <div className="flex gap-2">
          <Input type="number" placeholder="Min" className="bg-white" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} />
          <Input type="number" placeholder="Max" className="bg-white" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-600">Sort By</Label>
        <select className="w-full border border-gray-300 rounded-md p-2.5 text-sm bg-white focus:ring-2 focus:ring-[#1dbf73]/50 outline-none" value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
          <option value="newest">Newest Arrivals</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      <Button onClick={applyFilters} className="w-full bg-[#1dbf73] hover:bg-[#1dbf73]/90 font-bold text-white mt-4">
        Apply Filters
      </Button>
    </div>
  );
}
