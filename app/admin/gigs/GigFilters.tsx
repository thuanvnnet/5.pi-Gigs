"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

type Category = {
  _id: string;
  name: string;
  slug: string;
};

export function GigFilters({ categories }: { categories: Category[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Một hàm xử lý chung, duy nhất cho tất cả các bộ lọc
  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      // Nếu giá trị là rỗng hoặc 'all', xóa tham số khỏi URL
      params.delete(key);
    }
    params.set('page', '1'); // Luôn reset về trang 1 khi bộ lọc thay đổi
    const newUrl = `${pathname}?${params.toString()}`;

    // Cập nhật URL mà không làm mất focus, sau đó gọi refresh để tải lại dữ liệu từ server.
    // Đây là cách đáng tin cậy để xử lý cache của Next.js App Router.
    router.replace(newUrl, { scroll: false }); // Cập nhật URL ngay lập tức
    startTransition(() => {
      router.refresh(); // Bắt đầu làm mới dữ liệu và hiển thị trạng thái loading
    });
  };

  // Hàm xử lý có độ trễ cho ô tìm kiếm văn bản
  const handleSearch = useDebouncedCallback((term: string) => {
    handleFilterChange('seller', term);
  }, 300);

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-xl border shadow-sm">
      <div className="flex-1 min-w-[250px]">
        <Input
          placeholder="Search by seller username..."
          className="max-w-sm"
          defaultValue={searchParams.get("seller")?.toString() ?? ''}
          onChange={(e) => handleSearch(e.target.value)}
          disabled={isPending}
        />
      </div>
      <div className="flex items-center gap-4">
        <Select 
          onValueChange={(value) => handleFilterChange('featured', value)} 
          value={searchParams.get("featured")?.toString() ?? 'all'}
          disabled={isPending}
        >
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by Featured" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All Gigs</SelectItem><SelectItem value="true">Featured</SelectItem><SelectItem value="false">Not Featured</SelectItem></SelectContent>
        </Select>
        <Select 
          onValueChange={(value) => handleFilterChange('status', value)} 
          value={searchParams.get("status")?.toString() ?? 'all'}
          disabled={isPending}
        >
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by Status" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All Statuses</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="approved">Approved</SelectItem><SelectItem value="rejected">Rejected</SelectItem></SelectContent>
        </Select>
        <Select 
          onValueChange={(value) => handleFilterChange('category', value)} 
          value={searchParams.get("category")?.toString() ?? 'all'}
          disabled={isPending}
        >
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by Category" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All Categories</SelectItem>{categories.map(cat => <SelectItem key={cat._id} value={cat.slug}>{cat.name}</SelectItem>)}</SelectContent>
        </Select>
        {isPending && <Loader2 className="h-5 w-5 animate-spin text-gray-500" />}
      </div>
    </div>
  );
}