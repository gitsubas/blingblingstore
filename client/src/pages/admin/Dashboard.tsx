import { Link } from "react-router-dom";
import { ShoppingCart, Package, DollarSign } from "lucide-react";
import { StatsCard } from "../../components/ui/StatsCard";
import { useOrders } from "../../context/OrdersContext";
import { useProducts } from "../../context/ProductsContext";

export function Dashboard() {
    const { orders } = useOrders();
    const { products } = useProducts();

    // Use empty array as fallback if orders is undefined
    const allOrders = orders || [];

    // Calculate stats from orders
    const stats = {
        totalOrders: allOrders.length,
        totalRevenue: allOrders.reduce((sum, order) => sum + order.total, 0),
        pendingOrders: allOrders.filter(order => order.status === 'PENDING').length,
        deliveredOrders: allOrders.filter(order => order.status === 'DELIVERED').length,
    };

    const recentOrders = allOrders.slice(0, 5);

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon={ShoppingCart}
                    variant="green"
                />
                <StatsCard
                    title="Total Products"
                    value={products.length}
                    icon={Package}
                    variant="purple"
                />
                <StatsCard
                    title="Total Revenue"
                    value={`Rs. ${stats.totalRevenue.toFixed(2)}`}
                    icon={DollarSign}
                    variant="orange"
                />
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Pending</span>
                            <span className="font-semibold text-yellow-600">{stats.pendingOrders}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Delivered</span>
                            <span className="font-semibold text-green-600">{stats.deliveredOrders}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                        <Link
                            to="/admin/users"
                            className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                            Manage Users
                        </Link>
                        <Link
                            to="/admin/orders"
                            className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                            View Orders
                        </Link>
                        <Link
                            to="/admin/products/new"
                            className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                            Add New Product
                        </Link>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                    <Link to="/admin/orders" className="text-sm text-blue-600 hover:text-blue-700">
                        View All
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left">Order ID</th>
                                <th className="px-4 py-3 text-left">Date</th>
                                <th className="px-4 py-3 text-left">Total</th>
                                <th className="px-4 py-3 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="border-b border-gray-100">
                                    <td className="px-4 py-3 font-medium">{order.id}</td>
                                    <td className="px-4 py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">Rs. {order.total.toFixed(2)}</td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full ${order.status === "delivered"
                                                ? "bg-green-100 text-green-800"
                                                : order.status === "pending"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-blue-100 text-blue-800"
                                                }`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {recentOrders.length === 0 && (
                        <div className="text-center py-8 text-gray-500">No orders yet</div>
                    )}
                </div>
            </div>
        </div>
    );
}
