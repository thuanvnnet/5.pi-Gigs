"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Keep router for refresh
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateOrderAction } from "./actions"; // Import Server Action

const ORDER_STATUSES = ["in_progress", "delivered", "completed", "disputed"];

export function OrderAdminActions({ order }: { order: any }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setIsLoading(true);
    try {
      const result = await updateOrderAction(order._id, { status: newStatus });
      if (result.success) {
        toast.success(`Order status updated to "${newStatus}"`);
        router.refresh(); // Force client to re-fetch and re-render
      } else {
        toast.error(result.error || "Failed to update status");
      }
    } catch (error) {
      toast.error("An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select key={order.status} onValueChange={handleStatusChange} defaultValue={order.status} disabled={isLoading}>
        <SelectTrigger className="h-8 w-36 text-xs">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SelectValue placeholder="Change status..." />}
        </SelectTrigger>
        <SelectContent>
          {ORDER_STATUSES.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}