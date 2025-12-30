"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { 
  ShoppingBag, Briefcase, Package, ArrowRight, ExternalLink
} from "lucide-react";
import { GigActions } from "./GigActions";

// Định nghĩa kiểu dữ liệu để tăng tính an toàn
interface Gig {
  _id: string;
  title: string;
  image: string;
  price: number;
  sales?: number;
}

interface Order {
  _id: string;
  gigTitle: string;
  status: string;
  createdAt: Date;
  buyerId?: string;
  sellerId?: string;
  price: number;
}

interface DashboardTabsProps {
  myGigs: Gig[];
  sellingOrders: Order[];
  buyingOrders: Order[];
}

// Helper Badge function
const getStatusBadge = (status: string) => {
  switch (status) {
    case "created": return <span className="px-2 py-1 rounded text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">WAITING PAY</span>
    case "in_progress": return <span className="px-2 py-1 rounded text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">IN PROGRESS</span>
    case "delivered": return <span className="px-2 py-1 rounded text-xs font-bold bg-orange-50 text-orange-600 border border-orange-100">DELIVERED</span>
    case "completed": return <span className="px-2 py-1 rounded text-xs font-bold bg-green-50 text-green-600 border border-green-100">COMPLETED</span>
    case "disputed": return <span className="px-2 py-1 rounded text-xs font-bold bg-red-50 text-red-600 border border-red-100">DISPUTED</span>
    default: return <span className="px-2 py-1 rounded text-xs font-bold bg-gray-100 text-gray-500">{status.toUpperCase()}</span>
  }
}

export function DashboardTabs({ myGigs, sellingOrders, buyingOrders }: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState<"selling" | "buying">("selling");

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[500px]">
      <div className="flex border-b border-gray-200">
        <button 
          onClick={() => setActiveTab("selling")}
          className={`flex-1 py-4 text-center font-bold text-sm transition-colors border-b-2 
          ${activeTab === 'selling' ? 'border-[#1dbf73] text-[#1dbf73] bg-green-50/30' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          Selling (Freelancer Mode)
        </button>
        <button 
          onClick={() => setActiveTab("buying")}
          className={`flex-1 py-4 text-center font-bold text-sm transition-colors border-b-2 
          ${activeTab === 'buying' ? 'border-blue-500 text-blue-600 bg-blue-50/30' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          Buying (Client Mode)
        </button>
      </div>

      <div className="p-6">
        {/* --- TAB SELLING --- */}
        {activeTab === "selling" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
            {/* Selling Orders */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-400" /> Manage Orders ({sellingOrders.length})
              </h3>
              <div className="space-y-3">
                {sellingOrders.length > 0 ? (
                  sellingOrders.map((order) => (
                    <div key={order._id} className="group bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:shadow-md hover:border-[#1dbf73] transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-12 rounded-full ${order.status === 'in_progress' ? 'bg-blue-500' : order.status === 'delivered' ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {getStatusBadge(order.status)}
                            <span className="text-xs text-gray-400">#{order._id.slice(0,6)} • {format(new Date(order.createdAt), "MM/dd/yyyy")}</span>
                          </div>
                          <h4 className="font-bold text-gray-900">{order.gigTitle}</h4>
                          <p className="text-xs text-gray-500">Buyer: <span className="font-medium text-gray-700">@{order.buyerId}</span></p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-extrabold text-[#1dbf73] text-lg mb-1">{order.price} π</div>
                        <Link href={`/orders/${order._id}`}>
                          <Button size="sm" variant="outline" className="border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs h-8">
                            Manage <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400 italic">No orders yet. Share your gigs to get hired!</div>
                )}
              </div>
            </div>

            {/* My Gigs Section */}
            <MyGigsSection gigs={myGigs} />
          </div>
        )}

        {/* --- TAB BUYING --- */}
        {activeTab === "buying" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-gray-400" /> My Purchases
            </h3>
            
            {buyingOrders.length > 0 ? (
              <div className="space-y-3">
                {buyingOrders.map((order) => (
                  <div key={order._id} className="group bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:shadow-md hover:border-blue-300 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusBadge(order.status)}
                          <span className="text-xs text-gray-400">#{order._id.slice(0,6)} • {format(new Date(order.createdAt), "MM/dd/yyyy")}</span>
                        </div>
                        <h4 className="font-bold text-gray-900">{order.gigTitle}</h4>
                        <p className="text-xs text-gray-500">Seller: <span className="font-medium text-gray-700">@{order.sellerId}</span></p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900 text-lg mb-1">{order.price} π</div>
                      <Link href={`/orders/${order._id}`}>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-8">
                          View Order
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-400">
                <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p>You haven't bought anything yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Component con để hiển thị danh sách Gigs
function MyGigsSection({ gigs }: { gigs: Gig[] }) {
  return (
    <div>
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Briefcase className="w-5 h-5 text-gray-400" /> My Active Gigs ({gigs.length})
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gigs.length > 0 ? (
          gigs.map((gig) => (
            <div key={gig._id} className="border border-gray-200 rounded-xl p-4 flex gap-4 hover:border-gray-300 bg-gray-50/50 items-center transition-all hover:shadow-sm">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                <Image src={gig.image || "/placeholder.svg"} alt={gig.title} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/gigs/${gig._id}`} className="group/link">
                  <h4 className="font-bold text-gray-900 truncate text-sm mb-1 group-hover/link:text-[#1dbf73] group-hover/link:underline transition-colors flex items-center gap-1">
                      {gig.title}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                  </h4>
                </Link>
                <div className="flex gap-4 text-xs text-gray-500 mb-2">
                  <span>📦 {gig.sales || 0} Sales</span>
                </div>
                <div className="font-bold text-[#1dbf73]">{gig.price} π</div>
              </div>
              <GigActions gigId={gig._id} />
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-8 text-gray-400 border border-dashed rounded-xl">
            <p>You haven't posted any Gigs yet.</p>
            <Link href="/create" className="text-[#1dbf73] font-bold text-sm">Post a Gig now</Link>
          </div>
        )}
      </div>
    </div>
  );
}