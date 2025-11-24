import { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Banknote, AlertCircle } from "lucide-react";

interface CashOnDeliveryProps {
    amount: number;
    onConfirm: () => void;
    onCancel: () => void;
}

export function CashOnDelivery({ amount, onConfirm, onCancel }: CashOnDeliveryProps) {
    const [notes, setNotes] = useState("");
    const [confirmed, setConfirmed] = useState(false);

    const handleConfirm = () => {
        setConfirmed(true);
        onConfirm();
    };

    return (
        <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <Banknote className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">Cash on Delivery</h3>
                        <p className="text-sm text-gray-600 mb-3">
                            You will pay in cash when your order is delivered to your doorstep.
                        </p>
                        <div className="flex items-center justify-between bg-white rounded-md p-3 border border-blue-200">
                            <span className="text-sm font-medium text-gray-700">Amount to Pay on Delivery:</span>
                            <span className="text-lg font-bold text-blue-600">Rs. {amount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-medium text-yellow-900">Important Notes:</h4>
                        <ul className="text-sm text-yellow-800 mt-2 space-y-1 list-disc list-inside">
                            <li>Please keep exact change ready</li>
                            <li>Payment must be made in Nepali Rupees (NPR)</li>
                            <li>Our delivery person will provide you with a receipt</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                    Delivery Instructions (Optional)
                </label>
                <Input
                    placeholder="e.g., Please call before delivery, Ring the doorbell twice"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    disabled={confirmed}
                />
                <p className="text-xs text-gray-500">
                    Add any special instructions for our delivery person
                </p>
            </div>

            <div className="flex gap-3 mt-6">
                <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={onCancel}
                    disabled={confirmed}
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    className="flex-1"
                    onClick={handleConfirm}
                    disabled={confirmed}
                >
                    {confirmed ? "Confirmed" : "Confirm Order"}
                </Button>
            </div>
        </div>
    );
}
