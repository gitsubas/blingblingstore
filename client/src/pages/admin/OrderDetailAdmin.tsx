import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { useOrders } from "../../context/OrdersContext";
import { useAuth } from "../../context/AuthContext";

export function OrderDetailAdmin() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { getOrderById } = useOrders();
    const { getAllUsers } = useAuth();

    const order = orderId ? getOrderById(orderId) : null;
    const customer = order ? getAllUsers().find((u) => u.id === order.userId) : null;

    if (!order) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">Order not found</p>
                <Button onClick={() => navigate("/admin/orders")} className="mt-4">
                    Back to Orders
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={() => navigate("/admin/orders")}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-3xl font-bold text-gray-900">Order Details: {order.id}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order Information */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h2>
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm text-gray-600">Order ID</p>
                            <p className="font-medium">{order.id}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Date</p>
                            <p className="font-medium">{new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Status</p>
                            <span
                                className={`inline-block px-2 py-1 text-xs rounded-full ${order.status === "delivered"
                                        ? "bg-green-100 text-green-800"
                                        : order.status === "pending"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-blue-100 text-blue-800"
                                    }`}
                            >
                                {order.status}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total</p>
                            <p className="font-medium text-lg">Rs. {order.total.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                {/* Customer Information */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm text-gray-600">Name</p>
                            <p className="font-medium">{customer?.username || "Unknown"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="font-medium">{customer?.email || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Phone</p>
                            <p className="font-medium">{order.shippingAddress.phone}</p>
                        </div>
                    </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
                    <div className="space-y-2">
                        <p className="font-medium">{order.shippingAddress.fullName}</p>
                        <p className="text-gray-600">{order.shippingAddress.address}</p>
                        <p className="text-gray-600">
                            {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                        </p>
                    </div>
                </div>

                {/* Payment Information */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h2>
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm text-gray-600">Payment Method</p>
                            <p className="font-medium uppercase">{order.paymentMethod}</p>
                        </div>
                        {order.paymentDetails?.transactionId && (
                            <div>
                                <p className="text-sm text-gray-600">Transaction ID</p>
                                <p className="font-medium font-mono text-sm">{order.paymentDetails.transactionId}</p>
                            </div>
                        )}
                        <div>
                            <p className="text-sm text-gray-600">Amount Paid</p>
                            <p className="font-medium">Rs. {order.paymentDetails?.paidAmount.toFixed(2) || order.total.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
                <div className="space-y-4">
                    {order.items.map((item) => (
                        <div key={item.productId} className="flex items-center space-x-4 pb-4 border-b border-gray-100 last:border-0">
                            <img
                                src={item.image}
                                alt={item.productName}
                                className="h-16 w-16 rounded object-cover"
                            />
                            <div className="flex-1">
                                <p className="font-medium">{item.productName}</p>
                                <p className="text-sm text-gray-600">
                                    Quantity: {item.quantity} × Rs. {item.price.toFixed(2)}
                                </p>
                            </div>
                            <p className="font-semibold">Rs. {(item.quantity * item.price).toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
