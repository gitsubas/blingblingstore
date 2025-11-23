import { useParams, useNavigate, Link } from "react-router-dom";
import { useOrders } from "../../context/OrdersContext";
import { Button } from "../../components/ui/Button";
import { CheckCircle, Package, MapPin } from "lucide-react";

export function OrderConfirmation() {
    const { orderId } = useParams<{ orderId: string }>();
    const { getOrderById } = useOrders();
    const navigate = useNavigate();

    const order = orderId ? getOrderById(orderId) : undefined;

    if (!order) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h2>
                <Button onClick={() => navigate("/shop")}>Continue Shopping</Button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            {/* Success Header */}
            <div className="text-center py-8 mb-8 border-b border-gray-200">
                <div className="mb-6 flex justify-center">
                    <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
                <p className="text-gray-600 mb-4">
                    Thank you for your purchase. Your order is being processed.
                </p>
                <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                    <span>Order ID:</span>
                    <span className="font-mono font-medium text-primary">{order.id}</span>
                </div>
            </div>

            {/* Order Details */}
            <div className="space-y-6">
                {/* Shipping Address */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start gap-3 mb-4">
                        <MapPin className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-lg text-gray-900">Shipping Address</h3>
                            <div className="mt-2 text-gray-600 space-y-1">
                                <p>{order.shippingAddress.fullName}</p>
                                <p>{order.shippingAddress.address}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                                <p>{order.shippingAddress.phone}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start gap-3 mb-4">
                        <Package className="h-5 w-5 text-primary mt-0.5" />
                        <h3 className="font-semibold text-lg text-gray-900">Order Items</h3>
                    </div>
                    <div className="space-y-4">
                        {order.items.map((item) => (
                            <div key={item.productId} className="flex items-center gap-4">
                                <img
                                    src={item.image}
                                    alt={item.productName}
                                    className="h-20 w-20 rounded object-cover"
                                />
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900">{item.productName}</h4>
                                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-gray-900">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Total */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-gray-900">Total</span>
                            <span className="text-2xl font-bold text-primary">${order.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/dashboard/orders">
                    <Button variant="outline" size="lg">
                        View Order Details
                    </Button>
                </Link>
                <Link to="/shop">
                    <Button size="lg">
                        Continue Shopping
                    </Button>
                </Link>
            </div>
        </div>
    );
}
