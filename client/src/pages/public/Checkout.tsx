import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { ArrowLeft, CheckCircle } from "lucide-react";

export function Checkout() {
    const navigate = useNavigate();
    const { items, total, clearCart } = useCart();
    const [step, setStep] = useState<"shipping" | "payment" | "success">("shipping");
    const [loading, setLoading] = useState(false);

    if (items.length === 0 && step !== "success") {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                <Button onClick={() => navigate("/shop")}>Start Shopping</Button>
            </div>
        );
    }

    const handleShippingSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep("payment");
    };

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        clearCart();
        setLoading(false);
        setStep("success");
    };

    if (step === "success") {
        return (
            <div className="max-w-md mx-auto text-center py-12">
                <div className="mb-6 flex justify-center">
                    <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
                <p className="text-gray-600 mb-8">
                    Thank you for your purchase. Your order has been received and is being processed.
                </p>
                <Button onClick={() => navigate("/shop")} size="lg">
                    Continue Shopping
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <Button
                variant="ghost"
                className="mb-8 pl-0 hover:bg-transparent hover:text-primary"
                onClick={() => step === "payment" ? setStep("shipping") : navigate("/cart")}
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">
                        {step === "shipping" ? "Shipping Information" : "Payment Details"}
                    </h1>

                    {step === "shipping" ? (
                        <form onSubmit={handleShippingSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">First Name</label>
                                    <Input required placeholder="John" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Last Name</label>
                                    <Input required placeholder="Doe" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Email</label>
                                <Input required type="email" placeholder="john@example.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Address</label>
                                <Input required placeholder="123 Main St" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">City</label>
                                    <Input required placeholder="New York" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">ZIP Code</label>
                                    <Input required placeholder="10001" />
                                </div>
                            </div>
                            <Button type="submit" className="w-full mt-6" size="lg">
                                Continue to Payment
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handlePaymentSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Card Number</label>
                                <Input required placeholder="0000 0000 0000 0000" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Expiry Date</label>
                                    <Input required placeholder="MM/YY" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">CVC</label>
                                    <Input required placeholder="123" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Cardholder Name</label>
                                <Input required placeholder="John Doe" />
                            </div>
                            <Button type="submit" className="w-full mt-6" size="lg" disabled={loading}>
                                {loading ? "Processing..." : `Pay Rs. ${total.toFixed(2)}`}
                            </Button>
                        </form>
                    )}
                </div>

                <div className="bg-gray-50 rounded-lg p-6 h-fit border border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                    <div className="space-y-4 mb-6">
                        {items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                    {item.quantity}x {item.name}
                                </span>
                                <span className="font-medium text-gray-900">
                                    Rs. {(item.price * item.quantity).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-gray-200 pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium text-gray-900">Rs. {total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Shipping</span>
                            <span className="font-medium text-gray-900">Free</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold pt-2">
                            <span>Total</span>
                            <span className="text-primary">Rs. {total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
