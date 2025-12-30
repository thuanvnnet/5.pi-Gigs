"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function GigActions({ gigId }: { gigId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const isConfirmed = window.confirm("Are you sure you want to delete this Gig? This action cannot be undone.");
    if (!isConfirmed) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/gigs/${gigId}`, { method: "DELETE" });
      const result = await res.json();

      if (result.success) {
        toast.success("Gig deleted successfully!");
        router.refresh(); // Tải lại dữ liệu của Server Component
      } else {
        toast.error(result.error || "Failed to delete gig");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the gig.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Link href={`/create?edit=${gigId}`}>
        <Button variant="outline" size="icon" className="h-8 w-8 text-blue-600 border-blue-200 hover:bg-blue-50" title="Edit Gig">
          <Pencil className="w-4 h-4" />
        </Button>
      </Link>

      <Button variant="outline" size="icon" className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700" title="Delete Gig" disabled={isDeleting} onClick={handleDelete}>
        {isDeleting 
          ? <Loader2 className="w-4 h-4 animate-spin" /> 
          : <Trash2 className="w-4 h-4" />}
      </Button>
    </div>
  );
}