import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useOrders, OrderItem } from "../../context/OrdersContext";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { ArrowLeft } from "lucide-react";
import { PaymentMethodSelector, PaymentMethod } from "../../components/payment/PaymentMethodSelector";
import { EsewaPayment } from "../../components/payment/EsewaPayment";
import { KhaltiPayment } from "../../components/payment/KhaltiPayment";
import { CashOnDelivery } from "../../components/payment/CashOnDelivery";

export function Checkout() {
    const navigate = useNavigate();
    const { items, total, clearCart } = useCart();
    const { createOrder } = useOrders();
    const { user } = useAuth();
    const [step, setStep] = useState<"shipping" | "payment">("shipping");
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("esewa");
    const [shippingData, setShippingData] = useState({
        firstName: "",
        lastName: "",
        email: user?.email || "",
        address: "",
        city: "",
        postalCode: "",
        phone: "",
    });

    // Redirect to login if not authenticated
    if (!user) {
        navigate("/login");
        return null;
    }

    if (items.length === 0) {
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

    const handlePaymentSuccess = (transactionId?: string) => {
        // Create order
        const orderItems: OrderItem[] = items.map((item) => ({
            productId: item.id,
            productName: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
        }));

        const order = createOrder(
            orderItems,
            total,
            {
                fullName: `${shippingData.firstName} ${shippingData.lastName}`,
                address: shippingData.address,
                city: shippingData.city,
                postalCode: shippingData.postalCode,
                phone: shippingData.phone,
            },
            paymentMethod,
            transactionId
        );

        clearCart();
        navigate(`/order-confirmation/${order.id}`);
    };

    const handleCODConfirm = () => {
        handlePaymentSuccess(); // COD doesn't have a transaction ID
    };

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
                                    <Input
                                        required
                                        placeholder="John"
                                        value={shippingData.firstName}
                                        onChange={(e) => setShippingData({ ...shippingData, firstName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Last Name</label>
                                    <Input
                                        required
                                        placeholder="Doe"
                                        value={shippingData.lastName}
                                        onChange={(e) => setShippingData({ ...shippingData, lastName: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Phone</label>
                                <Input
                                    required
                                    type="tel"
                                    placeholder="+977 98XXXXXXXX"
                                    value={shippingData.phone}
                                    onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Address</label>
                                <Input
                                    required
                                    placeholder="123 Main St"
                                    value={shippingData.address}
                                    onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">City</label>
                                    <Input
                                        required
                                        placeholder="Kathmandu"
                                        value={shippingData.city}
                                        onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">ZIP Code</label>
                                    <Input
                                        required
                                        placeholder="44600"
                                        value={shippingData.postalCode}
                                        onChange={(e) => setShippingData({ ...shippingData, postalCode: e.target.value })}
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full mt-6" size="lg">
                                Continue to Payment
                            </Button>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <PaymentMethodSelector
                                selectedMethod={paymentMethod}
                                onMethodChange={setPaymentMethod}
                            />

                            <div className="mt-6">
                                {paymentMethod === "esewa" && (
                                    <EsewaPayment
                                        amount={total}
                                        onSuccess={handlePaymentSuccess}
                                        onCancel={() => setStep("shipping")}
                                    />
                                )}
                                {paymentMethod === "khalti" && (
                                    <KhaltiPayment
                                        amount={total}
                                        onSuccess={handlePaymentSuccess}
                                        onCancel={() => setStep("shipping")}
                                    />
                                )}
                                {paymentMethod === "cod" && (
                                    <CashOnDelivery
                                        amount={total}
                                        onConfirm={handleCODConfirm}
                                        onCancel={() => setStep("shipping")}
                                    />
                                )}
                            </div>
                        </div>
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
