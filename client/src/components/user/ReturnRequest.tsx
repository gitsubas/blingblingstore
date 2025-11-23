import { useState } from "react";
import { useOrders } from "../../context/OrdersContext";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

interface ReturnRequestProps {
    orderId: string;
    onClose: () => void;
}

const returnReasons = [
    "Product damaged or defective",
    "Wrong item received",
    "Item not as described",
    "Changed my mind",
    "Product quality not satisfactory",
    "Other",
];

export function ReturnRequest({ orderId, onClose }: ReturnRequestProps) {
    const [reason, setReason] = useState(returnReasons[0]);
    const [type, setType] = useState<"refund" | "exchange">("refund");
    const [notes, setNotes] = useState("");
    const { requestReturn } = useOrders();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        requestReturn(orderId, reason, type, notes);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Request Return/Refund</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Return Type */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Request Type</label>
                        <div className="flex gap-4">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    value="refund"
                                    checked={type === "refund"}
                                    onChange={(e) => setType(e.target.value as "refund")}
                                    className="mr-2"
                                />
                                <span>Refund</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    value="exchange"
                                    checked={type === "exchange"}
                                    onChange={(e) => setType(e.target.value as "exchange")}
                                    className="mr-2"
                                />
                                <span>Exchange</span>
                            </label>
                        </div>
                    </div>

                    {/* Reason */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Reason</label>
                        <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                            required
                        >
                            {returnReasons.map((r) => (
                                <option key={r} value={r}>
                                    {r}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Additional Notes */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Additional Notes (Optional)
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="flex min-h-[100px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                            placeholder="Please provide any additional details..."
                        />
                    </div>

                    <div className="flex gap-3">
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1">
                            Submit Request
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
