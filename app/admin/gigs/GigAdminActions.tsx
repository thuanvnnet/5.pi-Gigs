"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateGigAction, deleteGigAction } from "./actions";

export function GigAdminActions({ gig }: { gig: any }) {
  const [isPending, startTransition] = useTransition();

  const handleUpdate = async (updateData: { status?: string; isFeatured?: boolean }) => {
    startTransition(async () => {
      const result = await updateGigAction(gig._id, updateData);
      if (result.success) {
        toast.success("Gig updated successfully!");
      } else {
        toast.error(result.error || "Failed to update gig");
      }
    });
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this Gig permanently?")) return;
    startTransition(async () => {
      const result = await deleteGigAction(gig._id);
      if (result.success) {
        toast.success("Gig deleted successfully!");
      } else {
        toast.error(result.error || "Failed to delete gig");
      }
    });
  };

  return (
    <div className="flex items-center gap-2" style={{ minWidth: '250px' }}>
      {isPending ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : (
        <>
          <Select 
            key={gig.status} 
            onValueChange={(status) => handleUpdate({ status })} 
            defaultValue={gig.status || 'pending'}
          >
            <SelectTrigger className="h-8 w-32 text-xs">
              <SelectValue placeholder="Set status..." />
            </SelectTrigger>
            <SelectContent><SelectItem value="pending">Pending</SelectItem><SelectItem value="approved">Approved</SelectItem><SelectItem value="rejected">Rejected</SelectItem></SelectContent>
          </Select>
          <Button variant="outline" size="icon" className={`h-8 w-8 ${gig.isFeatured ? 'text-yellow-500 border-yellow-400 bg-yellow-50' : ''}`} title={gig.isFeatured ? "Unfeature Gig" : "Feature Gig"} onClick={() => handleUpdate({ isFeatured: !gig.isFeatured })}><Star className={`h-4 w-4 ${gig.isFeatured ? 'fill-current' : ''}`} /></Button>
          <Button variant="outline" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700" title="Delete Gig" onClick={handleDelete}><Trash2 className="h-4 w-4" /></Button>
        </>
      )}
    </div>
  );
}