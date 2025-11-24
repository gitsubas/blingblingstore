import { Wallet, CreditCard, Banknote } from "lucide-react";

export type PaymentMethod = "esewa" | "khalti" | "cod";

interface PaymentMethodSelectorProps {
    selectedMethod: PaymentMethod;
    onMethodChange: (method: PaymentMethod) => void;
}

export function PaymentMethodSelector({ selectedMethod, onMethodChange }: PaymentMethodSelectorProps) {
    const paymentMethods = [
        {
            id: "esewa" as const,
            name: "eSewa",
            description: "Pay securely with your eSewa wallet",
            icon: Wallet,
            color: "text-green-600",
            bgColor: "bg-green-50",
            borderColor: "border-green-200",
        },
        {
            id: "khalti" as const,
            name: "Khalti",
            description: "Pay using Khalti digital wallet",
            icon: CreditCard,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            borderColor: "border-purple-200",
        },
        {
            id: "cod" as const,
            name: "Cash on Delivery",
            description: "Pay when you receive your order",
            icon: Banknote,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200",
        },
    ];

    return (
        <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 block mb-3">
                Select Payment Method
            </label>
            {paymentMethods.map((method) => {
                const Icon = method.icon;
                const isSelected = selectedMethod === method.id;

                return (
                    <div
                        key={method.id}
                        onClick={() => onMethodChange(method.id)}
                        className={`
                            relative border-2 rounded-lg p-4 cursor-pointer transition-all
                            ${isSelected
                                ? `${method.borderColor} ${method.bgColor} ring-2 ring-offset-2 ring-${method.color.split('-')[1]}-500`
                                : "border-gray-200 bg-white hover:border-gray-300"
                            }
                        `}
                    >
                        <div className="flex items-start gap-3">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value={method.id}
                                checked={isSelected}
                                onChange={() => onMethodChange(method.id)}
                                className="mt-1"
                            />
                            <div className={`p-2 rounded-lg ${isSelected ? method.bgColor : "bg-gray-50"}`}>
                                <Icon className={`h-5 w-5 ${isSelected ? method.color : "text-gray-500"}`} />
                            </div>
                            <div className="flex-1">
                                <h3 className={`font-semibold ${isSelected ? "text-gray-900" : "text-gray-700"}`}>
                                    {method.name}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">{method.description}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
