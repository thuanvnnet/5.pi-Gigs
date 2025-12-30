"use client";

import { useTransition } from 'react';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toggleFavoriteAction } from '@/app/gigs/actions';

interface GigDetailFavoriteButtonProps {
    gigId: string;
    initialFavorited: boolean;
}

export function GigDetailFavoriteButton({ gigId, initialFavorited }: GigDetailFavoriteButtonProps) {
    const [isPending, startTransition] = useTransition();
    const pathname = usePathname();

    const handleFavoriteToggle = () => {
        startTransition(async () => {
            const result = await toggleFavoriteAction(gigId, pathname);
            if (!result.success) {
                toast.error(result.error || "Failed to update favorite status.");
            }
        });
    };

    return (
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleFavoriteToggle} 
            disabled={isPending} 
            className="text-gray-400 hover:text-pink-500 disabled:text-gray-300"
        >
            <Heart className={`w-6 h-6 transition-all ${initialFavorited ? 'text-pink-500 fill-pink-500' : 'text-gray-400'}`} />
        </Button>
    );
}
