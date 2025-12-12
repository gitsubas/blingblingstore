import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useOrders, Order, OrderItem } from "../../context/OrdersContext";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { ShoppingBag } from "lucide-react";
import { ErrorAlert } from "../../components/ui/ErrorAlert";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

const statusColors = {
    pending: "default",
    processing: "secondary",
    shipped: "outline",
    delivered: "default",
    returned: "destructive",
} as const;

export function OrderHistory() {
    const { user } = useAuth();
    const { orders, loading, error, refreshOrders } = useOrders();
    const [filter, setFilter] = useState<"all" | "pending" | "delivered" | "returned">("all");

    const userOrders = user ? orders.filter(order => order.userId === user.id) : [];

    const filteredOrders = userOrders.filter((order: Order) => {
        if (filter === "all") return true;
        return order.status === filter;
    });

    // Show loading state
    if (loading) {
        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold">My Orders</h2>
                <LoadingSpinner message="Loading your orders..." className="min-h-[300px]" />
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold">My Orders</h2>
                <ErrorAlert error={error} onRetry={refreshOrders} />
            </div>
        );
    }

    // Show empty state
    if (userOrders.length === 0) {
        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold">My Orders</h2>
                <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
                    <ShoppingBag className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-500 mb-6">Start shopping to see your orders here!</p>
                    <Link to="/shop">
                        <Button>Browse Products</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filter Tabs */}
            <div className="flex gap-2">
                {["all", "pending", "delivered", "returned"].map((status) => (
                    <Button
                        key={status}
                        variant={filter === status ? "primary" : "outline"}
                        size="sm"
                        onClick={() => setFilter(status as any)}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                ))}
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No {filter !== "all" && filter} orders found
                    </div>
                ) : (
                    filteredOrders.map((order: Order) => (
                        <div
                            key={order.id}
                            className="bg-white border border-gray-200 rounded-lg p-6 hover:border-primary transition-colors"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-semibold text-gray-900">{order.id}</h3>
                                        <Badge variant={statusColors[order.status as keyof typeof statusColors] || "default"}>
                                            {order.status.toUpperCase()}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Total</p>
                                    <p className="text-xl font-bold text-primary">${order.total.toFixed(2)}</p>
                                </div>
                            </div>

                            {/* Order Items Preview */}
                            <div className="flex gap-2 mb-4 overflow-x-auto">
                                {order.items?.slice(0, 4).map((item: OrderItem) => (
                                    <img
                                        key={item.productId}
                                        src={item.product?.image}
                                        alt={item.product?.name}
                                        className="h-16 w-16 rounded object-cover"
                                    />
                                ))}
                                {(order.items?.length || 0) > 4 && (
                                    <div className="h-16 w-16 rounded bg-gray-100 flex items-center justify-center text-sm text-gray-600">
                                        +{(order.items?.length || 0) - 4}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <Link to={`/dashboard/orders/${order.id}`} className="flex-1">
                                    <Button variant="outline" className="w-full">
                                        View Details
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
