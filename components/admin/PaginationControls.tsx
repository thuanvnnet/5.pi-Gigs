'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalGigs: number;
  gigsPerPage: number;
}

export const PaginationControls = ({ hasNextPage, hasPrevPage, totalGigs, gigsPerPage }: PaginationControlsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const page = searchParams.get('page') ?? '1';

  const handlePageChange = (direction: 'prev' | 'next') => {
    const params = new URLSearchParams(searchParams);
    const newPage = direction === 'prev' ? Number(page) - 1 : Number(page) + 1;
    params.set('page', String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  const start = (Number(page) - 1) * gigsPerPage + 1;
  const end = Math.min(Number(page) * gigsPerPage, totalGigs);

  return (
    <div className='flex items-center justify-between gap-2 text-sm'>
      <p className='text-gray-600'>Showing <strong>{start}</strong>-<strong>{end}</strong> of <strong>{totalGigs}</strong> gigs</p>
      <div className='flex items-center gap-2'>
        <Button size="sm" variant="outline" disabled={!hasPrevPage} onClick={() => handlePageChange('prev')}><ChevronLeft className='w-4 h-4 mr-1' /> Previous</Button>
        <Button size="sm" variant="outline" disabled={!hasNextPage} onClick={() => handlePageChange('next')}>Next <ChevronRight className='w-4 h-4 ml-1' /></Button>
      </div>
    </div>
  );
};