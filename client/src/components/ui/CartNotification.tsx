import { useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { X, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "./Button";
import { useNavigate } from "react-router-dom";

export function CartNotification() {
    const { lastAddedItem, clearLastAddedItem, removeFromCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        if (lastAddedItem) {
            // Auto-hide after 5 seconds
            const timer = setTimeout(() => {
                clearLastAddedItem();
            }, 10000);

            return () => clearTimeout(timer);
        }
    }, [lastAddedItem, clearLastAddedItem]);

    if (!lastAddedItem) return null;

    const handleRemove = () => {
        removeFromCart(lastAddedItem.id);
        clearLastAddedItem();
    };

    const handleCheckout = () => {
        clearLastAddedItem();
        navigate("/checkout");
    };

    const handleViewCart = () => {
        clearLastAddedItem();
        navigate("/cart");
    };

    return (
        <div className="fixed top-20 right-4 z-50 animate-slide-in">
            <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-80 overflow-hidden">
                {/* Header */}
                <div className="bg-primary text-white px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        <span className="font-semibold">Added to Cart</span>
                    </div>
                    <button
                        onClick={clearLastAddedItem}
                        className="hover:bg-white/20 rounded-full p-1 transition-colors"
                        aria-label="Close notification"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4">
                    <div className="flex gap-3">
                        <img
                            src={lastAddedItem.image}
                            alt={lastAddedItem.name}
                            className="w-20 h-20 object-cover rounded-md"
                        />
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 line-clamp-2">
                                {lastAddedItem.name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Quantity: {lastAddedItem.quantity}
                            </p>
                            <p className="text-primary font-bold mt-1">
                                Rs. {lastAddedItem.price.toFixed(2)}
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 space-y-2">
                        <div className="flex gap-2">
                            <Button
                                onClick={handleViewCart}
                                variant="outline"
                                size="sm"
                                className="flex-1"
                            >
                                View Cart
                            </Button>
                            <Button
                                onClick={handleCheckout}
                                size="sm"
                                className="flex-1"
                            >
                                Checkout
                            </Button>
                        </div>
                        <Button
                            onClick={handleRemove}
                            variant="ghost"
                            size="sm"
                            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove Item
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
