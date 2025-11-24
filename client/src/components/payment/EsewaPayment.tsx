import { useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { CheckCircle } from "lucide-react";

interface EsewaPaymentProps {
    amount: number;
    onSuccess: (transactionId: string) => void;
    onCancel: () => void;
}

export function EsewaPayment({ amount, onSuccess, onCancel }: EsewaPaymentProps) {
    const [loading, setLoading] = useState(false);
    const [esewaId, setEsewaId] = useState("");
    const [pin, setPin] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate eSewa API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Mock transaction ID
        const transactionId = `ESEWA-${Date.now()}`;

        setShowSuccess(true);

        // Wait a moment to show success message
        setTimeout(() => {
            onSuccess(transactionId);
        }, 1500);
    };

    if (showSuccess) {
        return (
            <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Successful!</h3>
                <p className="text-sm text-gray-600">Your payment via eSewa has been processed.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Amount to Pay:</span>
                    <span className="text-lg font-bold text-green-600">Rs. {amount.toFixed(2)}</span>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">eSewa ID / Mobile Number</label>
                <Input
                    required
                    type="text"
                    placeholder="98XXXXXXXX or eSewa ID"
                    value={esewaId}
                    onChange={(e) => setEsewaId(e.target.value)}
                    disabled={loading}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">eSewa PIN</label>
                <Input
                    required
                    type="password"
                    placeholder="Enter your eSewa PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    maxLength={4}
                    disabled={loading}
                />
            </div>

            <div className="flex gap-3 mt-6">
                <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? "Processing..." : "Pay with eSewa"}
                </Button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
                This is a mock payment. In production, you'll be redirected to eSewa's secure payment gateway.
            </p>
        </form>
    );
}
