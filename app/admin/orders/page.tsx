import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { format } from "date-fns";
import { OrderAdminActions } from "./OrderAdminActions";

// Buộc trang này phải được render động, không sử dụng cache
export const dynamic = 'force-dynamic';

async function getAllOrders() {
    await connectDB();
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(orders));
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

export default async function AdminOrdersPage() {
    const orders = await getAllOrders();

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
                        {orders.map((order: any) => (
                            <tr key={order._id}>
                                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-gray-500">#{order._id.slice(-6)}</td>
                                <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900 max-w-xs truncate">{order.gigTitle}</td>
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
            </div>
        </div>
    );
}