import connectDB from "@/lib/db";
import Gig from "@/models/Gig";
import Order from "@/models/Order";
import Review from "@/models/Review";
// import User from "@/models/User"; // Bỏ comment khi bạn có model User
import { Package, Users, ShoppingCart, CircleDollarSign, ShieldAlert } from "lucide-react";

async function getAdminStats() {
    await connectDB();

    // Chạy các truy vấn song song để tăng hiệu suất
    const [
        totalGigs,
        totalReviews,
        // totalUsers, // Dữ liệu giả lập
        orderStats
    ] = await Promise.all([
        Gig.countDocuments(),
        Review.countDocuments(),
        // User.countDocuments(),
        Order.aggregate([
            {
                $facet: {
                    statusCounts: [{ $group: { _id: '$status', count: { $sum: 1 } } }],
                    generalStats: [
                        {
                            $group: {
                                _id: null,
                                totalSales: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$price', 0] } },
                                totalOrders: { $sum: 1 },
                                disputedOrders: { $sum: { $cond: [{ $eq: ['$status', 'disputed'] }, 1, 0] } }
                            }
                        }
                    ]
                }
            }
        ])
    ]);

    const totalUsers = 2; // Dữ liệu giả lập cho Users

    // Xử lý kết quả từ aggregation
    const stats = orderStats[0];
    const statusCounts = stats.statusCounts.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
    }, {});

    const general = stats.generalStats[0] || { totalSales: 0, totalOrders: 0, disputedOrders: 0 };
    const disputeRate = general.totalOrders > 0 ? (general.disputedOrders / general.totalOrders) * 100 : 0;

    return {
        totalGigs,
        totalOrders: general.totalOrders,
        totalReviews,
        totalUsers,
        totalSales: general.totalSales,
        disputeRate,
        statusCounts: {
            created: statusCounts.created || 0,
            in_progress: statusCounts.in_progress || 0,
            delivered: statusCounts.delivered || 0,
            completed: statusCounts.completed || 0,
            disputed: statusCounts.disputed || 0,
        }
    };
}

export default async function AdminDashboardPage() {
    const stats = await getAdminStats();

    const statCards = [
        { title: "Total Sales", value: `${stats.totalSales.toFixed(2)} π`, icon: CircleDollarSign, color: "bg-green-100 text-green-600" },
        { title: "Total Gigs", value: stats.totalGigs, icon: Package, color: "bg-blue-100 text-blue-600" },
        { title: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, color: "bg-indigo-100 text-indigo-600" },
        { title: "Dispute Rate", value: `${stats.disputeRate.toFixed(1)}%`, icon: ShieldAlert, color: "bg-red-100 text-red-600" },
    ];

    const orderStatusCards = [
        { title: "In Progress", value: stats.statusCounts.in_progress, color: "text-blue-600" },
        { title: "Delivered", value: stats.statusCounts.delivered, color: "text-orange-600" },
        { title: "Completed", value: stats.statusCounts.completed, color: "text-green-600" },
        { title: "Disputed", value: stats.statusCounts.disputed, color: "text-red-600" },
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((card) => (
                    <div key={card.title} className="rounded-xl border bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-500">{card.title}</p>
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${card.color}`}>
                                <card.icon className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="mt-2 text-3xl font-bold text-gray-900">{card.value.toString()}</p>
                    </div>
                ))}
            </div>
            {/* Order Status Breakdown */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Status Breakdown</h2>
                <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                    {orderStatusCards.map(status => (
                        <div key={status.title}>
                            <p className="text-sm font-medium text-gray-500">{status.title}</p>
                            <p className={`mt-1 text-3xl font-bold ${status.color}`}>{status.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800">Other Reports</h2>
                    <p className="mt-4 text-gray-500">More detailed reports about Gigs, Users, and Reviews can be added here.</p>
                </div>
                 <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
                    <p className="mt-4 text-gray-500">A feed of recent activities (new orders, new reviews) will be displayed here.</p>
                </div>
            </div>
        </div>
    );
}