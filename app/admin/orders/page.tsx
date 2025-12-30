import connectDB from "@/lib/db";
import Order, { IOrder } from "@/models/Order";
import { format } from "date-fns";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { OrderAdminActions } from "./OrderAdminActions";

// Buộc trang này phải được render động, không sử dụng cache
export const dynamic = 'force-dynamic';

const ORDERS_PER_PAGE = 10;

async function getOrders(page = 1) {
    await connectDB();
    const skip = (page - 1) * ORDERS_PER_PAGE;

    const [orders, totalOrders] = await Promise.all([
        Order.find({})
             .sort({ createdAt: -1 })
             .skip(skip)
             .limit(ORDERS_PER_PAGE),
        Order.countDocuments({})
    ]);

    const totalPages = Math.ceil(totalOrders / ORDERS_PER_PAGE);

    return { orders: JSON.parse(JSON.stringify(orders)), totalPages, currentPage: page };
}

// Helper Badge function (copied from DashboardTabs)
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

export default async function AdminOrdersPage({ searchParams }: { searchParams: { page?: string } }) {
    const page = Number(searchParams.page) || 1;
    const { orders, totalPages, currentPage } = await getOrders(page);

    return (
        <div className="rounded-xl border bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-600">Order ID</th>
                            <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-600">Gig</th>
                            <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-600">Buyer</th>
                            <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-600">Seller</th>
                            <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-600">Price</th>
                            <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                            <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-600">Date</th>
                            <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {orders.map((order: IOrder) => (
                            <tr key={order._id.toString()}>
                                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-gray-500">#{order._id.toString().slice(-6)}</td>
                                <td className="px-4 py-3 font-medium text-gray-900 max-w-xs">
                                    <Link 
                                        href={`/orders/${order._id}`} 
                                        className="inline-flex items-center gap-1.5 group"
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        <span className="truncate group-hover:underline group-hover:text-blue-600 transition-colors">{order.gigTitle}</span>
                                        <ExternalLink className="h-3.5 w-3.5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                                    </Link>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-gray-700">@{order.buyerId}</td>
                                <td className="whitespace-nowrap px-4 py-3 text-gray-700">@{order.sellerId}</td>
                                <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">{order.price} π</td>
                                <td className="whitespace-nowrap px-4 py-3">
                                    {getStatusBadge(order.status)}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-gray-700">{format(new Date(order.createdAt), "MMM dd, yyyy")}</td>
                                <td className="whitespace-nowrap px-4 py-3">
                                    <OrderAdminActions order={order} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                    <div className="flex flex-1 justify-between sm:hidden">
                        <Link href={`?page=${currentPage > 1 ? currentPage - 1 : 1}`} className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Previous</Link>
                        <Link href={`?page=${currentPage < totalPages ? currentPage + 1 : totalPages}`} className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Next</Link>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div><p className="text-sm text-gray-700">Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span></p></div>
                        <div>
                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                <Link href={`?page=${currentPage > 1 ? currentPage - 1 : 1}`} className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">Previous</Link>
                                <Link href={`?page=${currentPage < totalPages ? currentPage + 1 : totalPages}`} className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">Next</Link>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}