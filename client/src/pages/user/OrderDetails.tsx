import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useOrders } from "../../context/OrdersContext";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { ArrowLeft, Package, MapPin, Star, RotateCcw } from "lucide-react";
import { ReviewForm } from "../../components/user/ReviewForm";
import { ReturnRequest } from "../../components/user/ReturnRequest";

export function OrderDetails() {
    const { orderId } = useParams<{ orderId: string }>();
    const { getOrderById } = useOrders();
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<string>("");
    const [showReturnRequest, setShowReturnRequest] = useState(false);

    const order = orderId ? getOrderById(orderId) : undefined;

    if (!order) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h2>
                <Link to="/dashboard/orders">
                    <Button>Back to Orders</Button>
                </Link>
            </div>
        );
    }

    const handleReview = (productId: string) => {
        setSelectedProductId(productId);
        setShowReviewForm(true);
    };

    const canRequestReturn = order.status === "delivered" && !order.returnRequest;

    return (
        <div className="space-y-6">
            <Link to="/dashboard/orders">
                <Button variant="ghost" className="pl-0">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Orders
                </Button>
            </Link>

            {/* Order Header */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order {order.id}</h1>
                        <p className="text-gray-500">
                            Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>
                    </div>
                    <Badge>{order.status.toUpperCase()}</Badge>
                </div>

                {order.returnRequest && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                        <div className="flex items-start gap-2">
                            <RotateCcw className="h-5 w-5 text-yellow-600 mt-0.5" />
                            <div>
                                <p className="font-medium text-yellow-900">Return Request Submitted</p>
                                <p className="text-sm text-yellow-700 mt-1">
                                    {order.returnRequest.type === "refund" ? "Refund" : "Exchange"} - {order.returnRequest.reason}
                                </p>
                                <p className="text-xs text-yellow-600 mt-1">
                                    Status: {order.returnRequest.status.toUpperCase()}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Shipping Address */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">Shipping Address</h3>
                        <div className="text-gray-600 space-y-1">
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
                <div className="flex items-start gap-3 mb-6">
                    <Package className="h-5 w-5 text-primary mt-0.5" />
                    <h3 className="font-semibold text-lg text-gray-900">Order Items</h3>
                </div>

                <div className="space-y-4">
                    {order.items.map((item) => {
                        const hasReview = order.reviews?.some((r) => r.productId === item.productId);

                        return (
                            <div key={item.productId} className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-0">
                                <img
                                    src={item.image}
                                    alt={item.productName}
                                    className="h-24 w-24 rounded object-cover"
                                />
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900">{item.productName}</h4>
                                    <p className="text-sm text-gray-500 mt-1">Quantity: {item.quantity}</p>
                                    <p className="font-medium text-gray-900 mt-2">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>

                                    {order.status === "delivered" && !hasReview && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mt-2"
                                            onClick={() => handleReview(item.productId)}
                                        >
                                            <Star className="mr-1 h-4 w-4" />
                                            Write a Review
                                        </Button>
                                    )}

                                    {hasReview && (
                                        <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
                                            <Star className="h-4 w-4 fill-current" />
                                            <span>Review submitted</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Total */}
                <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-primary">${order.total.toFixed(2)}</span>
                </div>
            </div>

            {/* Return Request Button */}
            {canRequestReturn && (
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowReturnRequest(true)}
                >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Request Return/Refund
                </Button>
            )}

            {/* Review Form Modal */}
            {showReviewForm && (
                <ReviewForm
                    orderId={order.id}
                    productId={selectedProductId}
                    onClose={() => setShowReviewForm(false)}
                />
            )}

            {/* Return Request Modal */}
            {showReturnRequest && (
                <ReturnRequest
                    orderId={order.id}
                    onClose={() => setShowReturnRequest(false)}
                />
            )}
        </div>
    );
}
